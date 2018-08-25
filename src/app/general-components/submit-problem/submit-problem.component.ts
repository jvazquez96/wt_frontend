import { environment } from './../../../environments/environment.prod';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { EventEmitter } from '@angular/core';
import {Component, OnInit, ViewChild, ElementRef, Input, Output} from '@angular/core';
import {EvaluatorService} from "../../services/evaluator.service";
import {SubmitProblemService} from "../../services/submit-problem.service";
import {ActivatedRoute, Params}   from '@angular/router';
import {SupportedLanguages, ProgLanguage} from "../../services/supported-languages.service";
import {Tabs} from "../tabs/tabs.component";
import { HighlightJsService } from 'angular2-highlight-js';
import { ContestService } from '../../services/contest.service'
import * as io from 'socket.io-client';

@Component({
    selector: 'submit-problem',
    templateUrl: './submit-problem.component.html',
    styleUrls: ['./submit-problem.component.css'],
    providers: [SupportedLanguages, EvaluatorService, SubmitProblemService]
})
export class SubmitProblem implements OnInit {

    constructor(private _httpProblemsService:EvaluatorService,
                private _httpSubmitProblemService:SubmitProblemService,
                private route:ActivatedRoute,
                private _supportedLanguages:SupportedLanguages,
                private highlightService : HighlightJsService,
                private _httpContestService: ContestService,
                private el: ElementRef) {

    }

    /*Main Variables Declaration*/
    private progLangToSubmit;
    @ViewChild('descriptionEnglish') descriptionEnglish;
    @ViewChild('descriptionSpanish') descriptionSpanish;
    private descriptionTitle;
    private languageName;
    private languageCode;

    private testCases;
    private successMessage:string = "Your code has been submitted!";
    private errorMessage:string = "There has been a problem with your submission";
    private template:string;

    // private codeAttempts:Array<any> = [1, 2, 3];
    private codeAttempts:Array<any> = [];
    private posTabActive:number = 0;
    private signaturePresent:string = "";
    @ViewChild('tabsVariable') tabsVariable;
    @ViewChild('codeEditor') codeEditor;
    @ViewChild('feedbackCard') feedbackCard;
    codeFromAttempt:string;

    supportedLanguages:ProgLanguage[]; // filled from service
    problemProgLang:string; // The selected language of the problem
    public attempts;

    @Input() problemId: number; // id of problem
    @Input() type: number; // parent or child problem. 0 = parent/main/first. >0 = child.
    @Input() submitParent: boolean; // can submit parent or not
    @Input() members: number[];

    @Output() childSubmitted = new EventEmitter<any>();
    @Output() submittedProblem = new EventEmitter<any>();

    private userInfo: any;
    private chosenBy: any;
    private chosen: boolean;

    ngOnInit() {
        this.chosenBy = {};
        this.chosen = false;
        this.chosenBy.first_name = "No one";
        this.chosenBy.last_name = "";
        this.chosenBy.enrollment = "";
        this.attempts = [];
        this.codeAttempts = [];
        this.getContentDescription(this.problemId);
        this.userInfo = JSON.parse(localStorage.getItem("userJson"));
        
        // get attempts of the problem from all the team members
        for(let j = 0; j < this.members.length; j++) {
            this.getContentAttempt(this.members[j], this.problemId)
        }

        this.progLangToSubmit = "none";

        this._supportedLanguages.getLanguages().subscribe(
            response => {
                this.supportedLanguages = response;
                this.problemProgLang = "cpp";

            },
            error => {
                console.log("Error loading the supported languages!");
            }
        );
        this.codeFromAttempt = this.codeAttempts[0];

        this.getChosenInfo(this.problemId);

    }

    reloadAttemptCode(data) {

        // Set all attempt tabs as inactive
        for (var i = 0; i < data.length; i++) {
            data[i].active = null;
        }

        // Activate tab (in case it is an attempt tab)
        if (this.tabsVariable.tabSelected > 0)
            data[this.tabsVariable.tabSelected - 1].active = true;

        for(let j = 0; j < this.members.length; j++) {
            this.getContentAttempt(this.members[j], this.problemId)
        }

    }

    codeToSubmitReceived() {

        var progLanguage;
        if(this.signaturePresent != ''){

            progLanguage = this.languageCode;

        }else{

            progLanguage = (<HTMLInputElement>document.getElementById("selectorLanguages")).value;
        }
        var codeFromEditor = this.codeEditor.getSourceCode();

        // Prevent students from sending empty code
        if (codeFromEditor.trim() == "") {
            return;
        }

        let userInfo = JSON.parse(localStorage.getItem("userJson"));

        let codeObject = {
            "code": codeFromEditor,
            "language": progLanguage,
            "problem_id": this.problemId,
            "request_type": "submission",
            "user_id": userInfo.id
        };

        this._httpProblemsService.submitProblem(codeObject).subscribe(
            data => {
                console.log(data);
                if (data["status"] == "ok") {
                    // Set all attempt tabs as inactive
                    for (var i = 0; i < data["attempts"].length; i++) {
                        data["attempts"][i].active = null;
                    }

                    // Activate last attempt tab
                    data["attempts"][0].active = true;

                    // Update attempts
                    let newAttempt = data["attempts"].slice()[0];
                    let first = this.attempts[0];
                    this.attempts.push(first);
                    this.attempts[0] = newAttempt;

                    // Set attempts' code
                    for (var i = 0; i < this.attempts.length; i++) {
                        this.codeAttempts[i] = this.attempts[i].code;
                    }

                    // Select second tab (which is last attempt's tab)
                    this.tabsVariable.tabSelected = 1;

                    // Inactivate 'New attempt tab' and hide it
                    this.tabsVariable.tabs.toArray()[0].active = false;
                    //document.getElementById('btn-modal').style.visibility = 'visible';
                    
                    this.checkAndSend(this.userInfo.id, this.problemId);
                } else {
                    // TODO: display proper error notification
                    //this.feedbackCard.hideFeedbackCard("error", this.errorMessage);

                }
            }
        );


    }

    loadCode() {
        // Manually inserting code in modal so that it is properly displayed (http://stackoverflow.com/questions/40693556/using-highlight-js-in-angular-2)
        var codeElement = this.el.nativeElement.querySelector('.code-attempt');

        // Insert dummy appropriate content so that real content will be appropriately displayed/highlighted
        // (even if real content is malformed)
        codeElement.textContent = "int function(string a, string b) { return a[8]; }";

        // Insert real content
        this.codeFromAttempt = this.codeAttempts[this.tabsVariable.tabSelected - 1];
        codeElement.textContent = this.codeAttempts[this.tabsVariable.tabSelected - 1];
        this.highlightService.highlight(codeElement);
    }

    getContentDescription(id) {

        this._httpSubmitProblemService.getDescriptions(id).subscribe(
            content => {
                this.descriptionEnglish.nativeElement.innerHTML = content.english;
                this.descriptionSpanish.nativeElement.innerHTML = content.spanish;
                this.descriptionTitle = content.title;
                this.testCases = content.test_cases;
                if (content.signature) {
                    this.codeEditor.setNewSourceCode(content.signature);
                    this.signaturePresent = content.language;
                    this.languageCode = content.language_code;
                    this.languageName = content.language_name;
                }

            }
        );
    }
    // s_id = student id
    // id = problem id
    getContentAttempt(s_id, id) {

        this._httpSubmitProblemService.getAttempts(s_id, id).subscribe(
            content => {
                this.attempts = this.attempts.concat(content); 
                let newArr = [];

                for (var i = 0; i < content.length; i++) {
                    newArr.push(content[i].code);
                }
                this.codeAttempts = this.codeAttempts.concat(newArr);
                // console.log(this.attempts, this.codeAttempts);
            }
        );
    }

    // s_id = student id
    // id = problem id
    getContentAttemptAsObservable(s_id, id) {

        return this._httpSubmitProblemService.getAttempts(s_id, id)
    }

    assignActiveTab(pos:number) {
        this.posTabActive = pos;
    }

    onNotify(index:number):void {
        if (index == 0) {
            //document.getElementById('btn-modal').style.visibility = 'hidden';
        } else {
            //document.getElementById('btn-modal').style.visibility = 'visible';
        }
    }

    reload(tabNo) {

        // Retrieve reload buttons and disable all of them
        var reloadButtons = document.getElementsByClassName("reload");
        var button;
        for (var i = 0; i < reloadButtons.length; i ++) {
            button = <HTMLButtonElement>reloadButtons[i];
            button.disabled = true; 
        }

        this.attempts = [];
        this.codeAttempts = [];
        // get attempts of the problem from all the team members
        for(let j = 0; j < this.members.length; j++) {
            this.getContentAttempt(this.members[j], this.problemId)
        }

        for (var i = 0; i < reloadButtons.length; i ++) {
            button = <HTMLButtonElement>reloadButtons[i];
            button.disabled = false; 
        }
    }

    // childSubmitted: this is just to tell the parent to problem to check if all child
    // problems have been submitted
    // submittedProblem: event to tell a problem was submitted
    sendMessage() {
        this.childSubmitted.emit();
    }

    problemSubmitted() {
        this.submittedProblem.emit(this.problemId);
    }

    // send message to all contests of the problem
    checkAndSend(student, problem) {
        this._httpContestService.getContestsOfProblem(this.problemId).subscribe(
            contests => {
                for(let i = 0; i < contests.length; i++) {
                    // send an update_contest message to all clients connected to the contest
                    let socketURL = 'http://localhost:5000/contest';
                    let socket = io(socketURL);
                    console.log(contests[i]);
                    let data = {
                        'room': contests[i].contest_id
                    };
                    console.log(data.room)
                    socket.emit('join', JSON.stringify(data));
                    socket.emit('update_contest', JSON.stringify(data));
                    socket.emit('leave', JSON.stringify(data))
                }
            }, 
            error => {
                console.log("Could not get contests of the problem");
            }
        )
    }

    getChosenInfo(problemID: number) {
        let teamID = JSON.parse(localStorage.getItem("team"))['id'];
        this._httpSubmitProblemService.getChosenBy(teamID,problemID).subscribe(
            response => {
                if(response != null) {
                    this.chosenBy = response;   
                    this.chosen = true; 
                } else {
                    this.chosenBy.first_name = "No one";
                    this.chosenBy.last_name = "";
                    this.chosenBy.enrollment = "";
                    this.chosen = false;
                }       
            }, 
            error => {
                console.log(error);
            }
        );
    }

    chooseProblem() {
        let teamID = JSON.parse(localStorage.getItem("team"))['id'];
        let userID = JSON.parse(localStorage.getItem("userJson"))['id'];
        this._httpSubmitProblemService.choseProblem(userID, teamID, this.problemId).subscribe(
            response => {
                this.chosen = true;
                // not sure why this needed to bet parsed into a JSON while other dont
                this.chosenBy =  JSON.parse(response["_body"]);
            },
            error => {
                console.log("Error - could not choose problem")
            }
        )
    }

    eraseChoosing() {
        let teamID = JSON.parse(localStorage.getItem("team"))['id'];
        let userID = JSON.parse(localStorage.getItem("userJson"))['id'];
        console.log(userID);
        this._httpSubmitProblemService.unchooseProblem(userID, teamID, this.problemId).subscribe(
            response => {
                this.chosen = false;
                this.chosenBy.first_name = "No one";
                this.chosenBy.last_name = "";
                this.chosenBy.enrollment = "";
                this.chosenBy.id = -1;
            },
            error => {
                console.log("Could not remove choosing from problem");
            }
        )
    }
}
