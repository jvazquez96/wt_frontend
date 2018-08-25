import { EventEmitter } from '@angular/core';
import {Component, OnInit, ViewChild, ElementRef, Input, Output} from '@angular/core';
import {EvaluatorService} from "../../services/evaluator.service";
import {GroupsService} from "../../services/groups.service";
import {SubmitProblemService} from "../../services/submit-problem.service";
import { ContestService } from '../../services/contest.service'
import {ActivatedRoute, Params}   from '@angular/router';
import {SupportedLanguages, ProgLanguage} from "../../services/supported-languages.service";
import {Tabs} from "../tabs/tabs.component";
import { HighlightJsService } from 'angular2-highlight-js';

@Component({
  selector: 'app-submit-problem-parent',
  templateUrl: './submit-problem-parent.component.html',
  styleUrls: ['./submit-problem-parent.component.css'],
  providers: [SupportedLanguages, EvaluatorService, SubmitProblemService]
})
export class SubmitProblemParentComponent implements OnInit {

  problems:Array<number>; // contains the ids of the problems

  public parentReady: boolean;
  private mainID;

  submissionsByStudent: Array<any>;
  studentsID: Array<number>;

  // this is used in case this component is inside the component ContestSubmitComponent
  @Input() alternateID: string; 
  @Output() updateContest = new EventEmitter<any>();

  constructor(private _httpProblemsService:EvaluatorService,
    private _httpSubmitProblemService:SubmitProblemService,
    private route:ActivatedRoute,
    private _supportedLanguages:SupportedLanguages,
    private highlightService : HighlightJsService,
    private _httpGroupsService: GroupsService,
    private _httpContestService: ContestService,
    private el: ElementRef) {

  }

  ngOnInit() {

    this.problems = [];
    this.submissionsByStudent = [];
    this.studentsID = [];
    this.parentReady = false;
    this.mainID = "0";
    if(this.alternateID == undefined) {
      this.mainID = this.route.snapshot.params['id']; // this component is not inside ContestSubmitComponent
    } else {
      this.mainID = this.alternateID; // this component is inside ContestSubmitComponent
    }
    
    let user = JSON.parse(localStorage.getItem('userJson'));

    // turn mainId into type number just to push it to problems
    this.problems.push(+this.mainID);

    // Get subproblems id's to display them in the page
    this._httpProblemsService.getSubproblems(this.mainID, user.id).subscribe(
      response => {
        // console.log(response);
        for (let i = 0; i < response.length - 1; i ++) {
          this.problems.push(response[i].problem_id);
        }
        // console.log(this.problems);
      },
      error => {
        console.log("Couldn't get subproblems")
      }
    );

    // get ids of team memebers 
    let t = JSON.parse(localStorage.getItem('team'));
    if(t.name == "No team") {
      let user = JSON.parse(localStorage.getItem('userJson'));
      this.studentsID.push(user.id);
    } else {
      for(let i = 0; i < t.students.length; i++) {
        this.studentsID.push(t.students[i].id);
      }
    }
    // console.log(this.studentsID);
    
    this.isParentReady();
  }

  receiveMessage($event) {
    this.isParentReady();
  }

  // event has a problem ID
  checkIfParent($event) {
    console.log("Submitted problem", $event);
    // send message, telling a main problem was submmitted
    if($event == this.mainID) {
      // check if you are on a route of a contest
      // otherwise is not necessary to send a message
      if(this.route.snapshot.params['contest']) {
        // tell parent component to update the specified contest
        let contestID = this.route.snapshot.params['contest'];
        this.updateContest.emit(contestID);
      }

    // get contests to which the problem is and emit event for each contest - this.updateContest.emit(contestID);
    // this._httpContestService.getContestsOfProblem(this.problemId).subscribe(
    //   list => {
    //       for (let i = 0; i < list.length; i++) {this.updateContest.emit(list[i])};
    //   }, error => {
    //       console.log("Could not get contests of the problem")
    //   }
    // )
    }
  }

  isParentReady() {
    // TODO: repeat for all members of the team (make array(each student) of arrays(his submissions))
    // check if childs have been solved- send parent ID to to do
    let user = JSON.parse(localStorage.getItem('userJson'));
    let t = JSON.parse(localStorage.getItem('team'));
    // check just for the current user
    if(t.name == "No team") {
      this._httpSubmitProblemService.checkParent(this.problems[0], user.id).subscribe(
        response => {
          // all_accepted = "ok" tells if parent can be submitted, "no" if it can't.
          if(response[response.length - 1].all_accepted == "ok") {
            this.parentReady = true;
          } else {
            this.parentReady = false;
          }
          // console.log("PARENT READY", this.parentReady);
        },
        error => {
          console.log("Could not check if all subproblems where accepted");
        }
      );
    } else {
      // check for all the members of the team
      this._httpSubmitProblemService.checkParentOfTeam(this.problems[0], t.id).subscribe(
        response => {
          if(response[response.length - 1].all_accepted == "ok") {
            this.parentReady = true;
          } else {
            this.parentReady = false;
          }
          // console.log("PARENT READY", this.parentReady);
        }, error => {
          console.log("Could not check if all subproblems where accepted");
        }
      )
    }
  }

}
