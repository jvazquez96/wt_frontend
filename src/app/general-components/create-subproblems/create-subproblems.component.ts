import {Component, OnInit, AfterViewInit, ViewChild} from "@angular/core";
import {FormGroup, Validators, FormBuilder} from "@angular/forms";
import {SupportedLanguages, ProgLanguage} from "../../services/supported-languages.service";
import {ProblemDifficulties} from "../../services/problem-difficulties.service";
import {EvaluatorService} from "../../services/evaluator.service";
import {TestCase} from "../create-problem/TestCase";
import {TopicsService} from "../../services/topics.service";
import {Router, ActivatedRoute} from "@angular/router";
import { ShareDataService } from "../../services/share-data.service";

@Component({
  selector: 'app-create-subproblems',
  providers: [SupportedLanguages, ProblemDifficulties, EvaluatorService, ShareDataService],
  templateUrl: './create-subproblems.component.html',
  styleUrls: ['./create-subproblems.component.css']
})
export class CreateSubproblemsComponent implements OnInit {

  // Name of main/parent problem
  parentName: string;

  // Total amount of subproblems;
  total: number;

  posTabActive:number = 0;
  subproblems = [0, 0];

  parentInfo = { 
    "language": "",
    "difficulty": "",
    "topic": ""
   }

  constructor(private _httpProblemsService: EvaluatorService,
              private _supportedLanguages: SupportedLanguages,
              private _problemDifficulties: ProblemDifficulties,
              private _topicsService: TopicsService,
              private _formBuilder: FormBuilder,
              private _router: Router,
              private _activeRoute: ActivatedRoute,
              private _shareData: ShareDataService) {
  }

  /**
   * 
   */
  ngOnInit() {

    console.log(this.parentInfo);
    this._activeRoute.params.subscribe(params => {
      this.total = +params['amount']; // (+) converts string 'id' to a number
      this.parentName = params["parentName"];
   });

   // incremenet the amount of problems if there are more than 2.
   for(let i = 0; i < this.total - this.subproblems.length; i++) {
    this.subproblems.push(0);
   }

  //  used to send some data to the subproblems component later
  //  this._shareData.currentMessage.subscribe(message => this.parentInfo = message);
  //  this.parentInfo["language"] = this._shareData.getLanguage();
  //  this.parentInfo["topic"] = this._shareData.getTopic();
  //  this.parentInfo["difficulty"] = this._shareData.getDifficulty();
  //  console.log(this.parentInfo);

  }

  assignActiveTab(pos:number) {
    this.posTabActive = pos;
  }

}
