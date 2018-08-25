import { FormControl, FormArray } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Component, OnInit, Input,ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ContestService } from '../../services/contest.service';
import { GroupsService } from '../../services/groups.service';
import { DateModel } from 'ng2-datepicker';

import { ProblemsService } from '../../services/problems.service';

@Component({
  selector: 'app-contest-list',
  templateUrl: './contest-list.component.html',
  styleUrls: ['./contest-list.component.css']
})
export class ContestListComponent implements OnInit {

  @Input() userRole: string;

  //Booleans
  public canAddProblem: boolean

  public GroupSelected;
  private user;

  public contests; // list of contests 
  public groups; // list fo groups of the professor
  public listProblems; // list of problems of the system
  public indexProblems; // index with ids of problems for a contest .

  public createContestForm: FormGroup; // form to create a contest
  public editContestForm: FormGroup // form to edit a contest
  public selectedContest;

  // buttons to close modals
  @ViewChild('closeCreate') closeCreate: ElementRef;
  @ViewChild('closeEdit') closeEdit: ElementRef;

  constructor(private _httpContestService: ContestService,
              private _httpGroupService: GroupsService,
              private _httpProblemService: ProblemsService,
              private _activeRoute: ActivatedRoute,
              private _formBuilder:FormBuilder,
              private _router: Router) { }

  ngOnInit() {

    this.user = JSON.parse(localStorage.getItem('userJson'));

    this.indexProblems = [];
    this.listProblems = [];

    // load list of problems
    if (this.user['role'] == 'professor' || this.user['role'] == 'admin') {
      this.loadListProblems();
    }

    this.GroupSelected = {
      group: null,
      value: null,
      id: null
    };

    this.canAddProblem = true;
    this.contests = [];
    this.loadContests();
    
    this.groups = [];
    if (this.user['role'] == 'professor' || this.user['role'] == 'admin') {
      this.loadGroups();
    }
  }

  loadForms() {
    // form for creation
    this.createContestForm = this._formBuilder.group({
      contestTitle:    ['', Validators.required],
      contestGroup:    [this.groups[0], Validators.required],
      beginDateCreate: ['', Validators.required],
      endDateCreate:   ['', Validators.required],
      beginTimeCreate: ['', Validators.required],
      endTimeCreate:   ['', Validators.required],
      problemsCreate: this._formBuilder.array([this.createProblemFormControl()])
    });
    // form for edition
    this.editContestForm = this._formBuilder.group({
      contestTitleEdit: ['', Validators.required],
      contestGroupEdit: [this.groups[0],Validators.required, ],
      beginDateEdit: ['', Validators.required],
      endDateEdit:   ['', Validators.required],
      beginTimeEdit: ['', Validators.required],
      endTimeEdit:   ['', Validators.required],
      problemsEdit: this._formBuilder.array([])
    });
  }

  createProblemFormControl(){
    return new FormControl(this.listProblems[0] || null, Validators.required);
  }

  addProblemToArray(whichForm: string) {
    if(whichForm == 'create') {
      var problems = <FormArray>this.createContestForm.controls['problemsCreate'];
    } else {
      var problems = <FormArray>this.editContestForm.controls['problemsEdit'];
    }
    if(problems.length < 10) {
      this.canAddProblem = true;
      problems.push(this.createProblemFormControl());
      // get id of the problem added
      let id = problems.controls[problems.controls.length - 1].value.id;
      // add the id to indeXProblems too
      this.indexProblems.push(id);
      // console.log(this.indexProblems);
    } else {
      this.canAddProblem = false;
    }
  }

  removeProblemFromArray(whichForm: string, index: number) {
    if(whichForm == 'create') {
      var controls = <FormArray>this.createContestForm.controls['problemsCreate'];
    } else {
      var controls = <FormArray>this.editContestForm.controls['problemsEdit'];
    }
    controls.removeAt(index);
    this.indexProblems.splice(index, 1);
  }

  // Changed the problem selected at index i inside the array indexProblems
  modifyIndex(whichForm: string, i, $event){
    if(whichForm == 'create') {
      var problems = <FormArray>this.createContestForm.controls['problemsCreate'];
    } else {
      var problems = <FormArray>this.editContestForm.controls['problemsEdit'];
    }
    // get id of problem 
    let id = problems.controls[i].value.id;
    // add it to the indexProblems
    this.indexProblems[i] = id;
  }

  saveContestForEdit(contest){
    this.selectedContest = contest;
    this.GroupSelected = {
      group: this.selectedContest.group,
      value: 'Group ' + this.selectedContest.group.id + ' ' + 
              this.selectedContest.group.course.name  + ' ' + this.selectedContest.group.period,
      id: this.selectedContest.group.id
    };
    
    // set Dates 
    let sDate = this.selectedContest.start_date.slice(0,10);
    let eDate = this.selectedContest.end_date.slice(0,10);
    let startDate = new DatePipe('en-US').transform(contest.start_date, 'yyyy-MM-dd');
    let endDate = new DatePipe('en-US').transform(contest.end_date, 'yyyy-MM-dd');

    // set times
    let startTime = this.selectedContest.start_date.slice(11,16);
    let endTime = this.selectedContest.end_date.slice(11,16);
    
    this.editContestForm.setValue({
      contestTitleEdit: this.selectedContest.name,
      contestGroupEdit: this.selectedContest.group,
      beginDateEdit: startDate,
      endDateEdit: endDate,
      beginTimeEdit: startTime,
      endTimeEdit: endTime,
      problemsEdit: []
    });

    // get index of problems
    this.indexProblems = [];
    // this.editContestForm.controls['problemsEdit'] = this._formBuilder.array([]);
    const problems = <FormArray>this.editContestForm.controls['problemsEdit'];
    for(let i = 0; i < this.selectedContest.problems.length; i++) {
      this.indexProblems.push(this.selectedContest.problems[i].id);
      // find the problem with the id
      for(let j = 0; j < this.listProblems.length; j++){
        // add a new form control to the edit form array with value = problem object
        if(this.listProblems[j].id == this.indexProblems[i]) {
          problems.push(new FormControl(this.listProblems[j], Validators.required))
        }
      }
    }
  }

  // used to create a contest
  createContest(){
    // get data from form
    let contestName = this.createContestForm.value.contestTitle;
    let group = this.createContestForm.value.contestGroup;
    let startDate = this.createContestForm.value.beginDateCreate;
    let endDate = this.createContestForm.value.endDateCreate;
    let beginTime = this.createContestForm.value.beginTimeCreate;
    let endTime = this.createContestForm.value.endTimeCreate;

    // create Date object from data of the form
    let start_date = new Date(startDate.slice(0,4), startDate.slice(5,7), startDate.slice(8,10), beginTime.slice(0,2), beginTime.slice(3));
    start_date = this.fixDate(start_date);
    let end_date = new Date(endDate.slice(0,4), endDate.slice(5,7), endDate.slice(8,10), endTime.slice(0,2), endTime.slice(3), 59);
    end_date = this.fixDate(end_date);
    
    // set data to send to service
    let request = {
      "name": contestName,
      "group_id": group.id,
      "start_date": start_date,
      "end_date": end_date,
      "problems": this.indexProblems
    }
    console.log(start_date, end_date);
    // call service
    this._httpContestService.createContest(request).subscribe(
      response => {
        // add the contest to the list of contests
        this.contests.push(response);
        // close modal
        this.closeCreate.nativeElement.click();
      }, error => {
        console.log("Could not create contest");
      }
    )

    // clean form and indexProblems
    this.createContestForm.reset();
    this.createContestForm.controls['problemsCreate'] = this._formBuilder.array([this.createProblemFormControl()]);
    this.indexProblems = [this.listProblems[0].id];
    
  }

  // used to edit a contest
  editContest(){
    // get data
    let contestName = this.editContestForm.value.contestTitleEdit;
    let group = this.editContestForm.value.contestGroupEdit;
    let startDate = this.editContestForm.value.beginDateEdit;
    let endDate = this.editContestForm.value.endDateEdit;
    let beginTime = this.editContestForm.value.beginTimeEdit;
    let endTime = this.editContestForm.value.endTimeEdit;
    
    // create Date object from data of the form. NOTE: substract 1 from month; JS Date's month starts
    // at 0 index.
    let start_date = new Date(startDate.slice(0,4), startDate.slice(5,7) - 1, startDate.slice(8,10), beginTime.slice(0,2), beginTime.slice(3));
    start_date = this.fixDate(start_date);
    let end_date = new Date(endDate.slice(0,4), endDate.slice(5,7) - 1, endDate.slice(8,10), endTime.slice(0,2), endTime.slice(3), 59);
    end_date = this.fixDate(end_date);

    // set data to send to service
    let request = {
      "id": this.selectedContest.id,
      "name": contestName,
      "group_id": group.id,
      "start_date": start_date,
      "end_date": end_date,
      "problems": this.indexProblems
    }
    // call service to edit
    this._httpContestService.updateContest(request).subscribe(
      response => {
        // console.log(response);
        this.closeEdit.nativeElement.click();
        this.loadContests();
      }, error => {
        console.log("Could not update contest")
      }
    )

    // clean form
    this.editContestForm.reset();
    this.editContestForm.controls['problemsEdit'] = this._formBuilder.array([]);
    this.indexProblems = [this.listProblems[0].id];
  }

  // used to delete a contest
  removeContest(contest, index){
    this._httpContestService.deleteContest(contest).subscribe(
      response => {
        // update array of contests in view
        this.contests.splice(index,1);
      }, error => {
        console.log("Could not erase contest");
      }
    )
  }

  // used to enter a contest
  moveToContest(contest){
    // route to...
    this._router.navigate(['contest/' + contest.group_id + '/' + contest.id]);
  }

  // set default value option for a select
  getSelectedProblem(problem_name) {
    for(let i = 0; i < this.listProblems.length; i++) {
      if(this.listProblems[i].name == problem_name) {
        return this.listProblems[i].id;
      }
    }
  }

  // load all contests of the user in the system
  loadContests(){
    if (this.user['role'] == 'professor' || this.user['role'] == 'admin') {
      this._httpContestService.getProfessorContests(this.user['id']).subscribe(
        response => {
          // console.log(response);
          this.contests = response[0];
        }, error => {
          console.log("Could not get professor contests");
        }
      )
    } else {
      this._httpContestService.getStudentContests(this.user['id']).subscribe(
        response => {
          // console.log(response);
          this.contests = response[0];
        }, error => {
          console.log("Could not get student contests");
        }
      )
    }
  }

  // get the groups of the professor
  loadGroups(){
    this._httpGroupService.getGroups().subscribe(
      response => {
        this.groups = response;
        this.loadForms();
      },
      error => {
        console.log("Could not get groups");
      }
    );
  }

  // get the problems of the system
  loadListProblems(){
    this._httpProblemService.getMainProblems().subscribe(
      response => {
        this.listProblems = response;
        
        this.indexProblems.push(this.listProblems[0].id);

      }, 
      error => {
        console.log("Could not get main problems");
      }
    );
  }

  fixDate(date) {
    let miliseconds = date.getTimezoneOffset() * 60 * 1000;
    date.setTime(date.getTime() - miliseconds);
    return date.toISOString();
  }
}


