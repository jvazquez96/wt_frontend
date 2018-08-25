import { Component, OnInit, Input, Output, 
        EventEmitter, ViewChild, ElementRef, SimpleChanges } from '@angular/core';
import { StatisticsService } from '../../services/statistics.service';
import { GroupsService } from '../../services/groups.service';
import { ProblemsService } from '../../services/problems.service';
import { BaseChartDirective } from 'ng2-charts';
// import { Chart } from 'chart.js';

@Component({
  selector: 'app-generic-graph',
  templateUrl: './generic-graph.component.html',
  styleUrls: ['./generic-graph.component.css']
})
export class GenericGraphComponent implements OnInit {

  public chartData:Array<any>;
  public chartDataSet:any[]; // contains object {data: [], label: ""}
  public chartLabels:Array<any>
  public chartOptions:any;
  public chartLegend;
  public chartType: string; // selected chart type
  public chartColors:Array<any>;

  private userRole; // loggen in user
  private groups; // Array of all groups
  public groupSelected;
  public problems;
  public problemSelected;

  public isStudent: boolean = false;
  public isProfessor: boolean = false;
  public isAdmin: boolean = false;

  @ViewChild('group') group: ElementRef;
  @ViewChild('problem') problem: ElementRef;
  @ViewChild('topic') topic: ElementRef;
  @ViewChild('feedbackCard') feedbackCard;

  public displayChart;

  @ViewChild(BaseChartDirective) myChart: BaseChartDirective;

    constructor(private _httpStatsService: StatisticsService,
                private _httpGroupSerivce: GroupsService,
                private _httpProblemService: ProblemsService) { 
                    
                }

    ngOnInit() {

        // get users role
        this.userRole = JSON.parse(localStorage['userJson'])['role'];

        this._httpGroupSerivce.getGroups().subscribe(
            data => {
                this.groups = data;
                if(this.groups.length > 0) {
                    this.groupSelected = this.groups[0].id;
                } else {
                    this.groupSelected = -1
                }  
                // console.log(this.groups);
            }, 
            error => {
                console.log("Could not get groups");
            }
        )

        this._httpProblemService.getProblems().subscribe(
            data => {
                this.problems = data;
                if(this.problems.length > 0) {
                    this.problemSelected = this.problems[0].id;
                } else {
                    this.problemSelected = -1
                }  
            },
            error => {
                console.log("Could not ge problems");
            }
        )

        if(this.userRole == 'admin') {
        this.isAdmin = true;
        this.isProfessor = true;
        this.isStudent = true;
        } else if(this.userRole == 'professor') {
        this.isAdmin = false;
        this.isProfessor = true;
        this.isStudent = true;
        } else {
        this.isAdmin = false;
        this.isProfessor = false;
        this.isStudent = true;
        }

        this.chartDataSet = [];
        this.displayChart = false;
        this.chartType = 'line' // set default value of selected chart type
    }

    // DONE
    getAllGroups() {
        // get stats for all groups groups
        this.displayChart = false;
        this._httpStatsService.getStatsAllGroups().subscribe(
            response => {
                console.log(response);
                this.chartType = 'line';
                let newData = [];
                let key;
                let keysArr = [];
                for(let i = 0; i < response.length; i++) {
                    // get percents for each group
                    // groupID is the key. Objects.keys returns array of an objects keys
                    key = Object.keys(response[i]);
                    // console.log(key);
                    newData.push(response[i][key[0]]);
                    keysArr.push(key[0]);
                }
                // clear data content and assign it the new data
                this.chartData = [];
                this.chartLabels = [];
                this.chartData = newData.slice();
                this.chartDataSet = [];
                this.chartDataSet.push({data: this.chartData, label: "General % of Accepted Answers"});
                this.chartLabels = keysArr.slice();
                this.displayChart = true;

            },
            error => {
                document.getElementById('error-feedback').style.display = "block";
                this.feedbackCard.hideFeedbackCard("error", "Could not get stats for all groups");
            }
        )
    }

    // DONE
    getGroupStats() {
        let group = this.groupSelected;
        this.displayChart = false;
        if (group != -1) {
            // get stats for group
            this._httpStatsService.getGroupStats(group).subscribe(
                response => {
                    // console.log("This RESpose", response);
                    this.chartType = 'pie';
                    var options = {
                        scales: {
                            yAxes: [{display: false}],
                            xAxes: [{display: false}]
                        }
                    };
                    this.chartOptions = options;
                    this.chartLabels = [];
                    this.chartLabels = ["% Accepted", "% Failed"];
                    this.chartData = [];
                    this.chartData = [response, 100.00 - response];
                    this.chartDataSet = [];
                    this.chartDataSet.push({data: this.chartData, label: "% of Accepted Answers"});
                    this.displayChart = true;
                },
                error => {
                    document.getElementById('error-feedback').style.display = "block";
                    this.feedbackCard.hideFeedbackCard("error", "Could not get group stats");
                }
            )
        }
    }

    // DONE
    getTopicStats() {      
        // clear all fields
        this.displayChart = false;
        this._httpStatsService.getTopicsStats().subscribe(
            response => {
                // console.log("This response", response);
                // response is a dictionary with {topicName: percent}
                this.chartType = 'bar';
                let keys = Object.keys(response);
                let newData = []; 
                let oppositeData = []
                for(let i = 0; i < keys.length; i++) {
                    newData.push(response[keys[i]]);
                    oppositeData.push(100 - response[keys[i]]);
                }
                var options = {
                    scales: {
                        yAxes: [{
                            display: true,
                            ticks: {
                                suggestedMin: 0,    // minimum will be 0, unless there is a lower value.
                                // OR //
                                beginAtZero: true   // minimum value will be 0.
                            }
                        }]
                    }
                };
                this.chartOptions = options;
                this.chartData = [];
                this.chartLabels = [];
                this.chartData = newData.slice(); // copy newDAt to chartData
                this.chartLabels = keys.slice();
                this.chartDataSet = [];
                this.chartDataSet.push({data: this.chartData, label: "% of Accepted Answers"});
                this.chartDataSet.push({data: oppositeData, label: "% of Failed Answers"});
                this.displayChart = true;
            }, 
            erro => {
                document.getElementById('error-feedback').style.display = "block";
                this.feedbackCard.hideFeedbackCard("error", "Could not get topics stats");
            }
        )   
    }

    // DONE
    // Accepted vs Wrong answers of a problem
    // chartType = 'pie';
    getProblemStats() {
        this.displayChart = false;
        let problemID = this.problemSelected;
        if (problemID != -1) {
            // get stats
            this._httpStatsService.getProblemStats(problemID).subscribe(
                response => {
                    // response is the percetnage of accepted
                    var options = {
                        scales: {
                            yAxes: [{display: false}],
                            xAxes: [{display: false}]
                        }
                    };
                    this.chartOptions = options;
                    this.chartType = 'pie';
                    this.chartLabels = ["Accepted", "Incorrect"];
                    this.chartDataSet = [];
                    this.chartDataSet.push({data: [response, 100 - response], label: "Problem"});
                    this.displayChart = true;
                }, 
                error => {
                    console.log("Could not get problems stats", error);
                    document.getElementById('error-feedback').style.display = "block";
                    this.feedbackCard.hideFeedbackCard("error", "Could not get stats of problem");
                }
            )
        }
    }

    // DONE
    // Problems per topic
    // chartType = 'line' or 'bar';
    getProblemsPerTopic() {
        this.displayChart = false;
        this._httpStatsService.getProblemsPerTopic().subscribe(
            data => {
                console.log(data);
                var options = {
                    scales: {
                        yAxes: [{
                            display: true,
                            ticks: {
                                suggestedMin: 0,    // minimum will be 0, unless there is a lower value.
                                // OR //
                                beginAtZero: true   // minimum value will be 0.
                            }
                        }]
                    }
                };
                this.chartOptions = options;
                this.chartDataSet = [];
                this.chartLabels = [];
                this.chartType = 'bar';
                Object.keys(data).forEach(key => {
                    this.chartDataSet.push({data: [data[key]], label: key});
                    this.chartLabels.push(key);
                });
                this.displayChart = true;
            }, 
            error => {
                console.log("Could not get amount of problems per topic", error);
                document.getElementById('error-feedback').style.display = "block";
                this.feedbackCard.hideFeedbackCard("error", "Could not get amount of problems per topic");
            }
        )
    }

    // DONE
    // Users per category
    // chartType = 'bar';
    getUsersPerCategory() {
        this.displayChart = false;
        this._httpStatsService.getUsersPerCategory().subscribe(
            data => {
                // Admin: amount, Professor: amount, Student: amount
                // this.chartDataSet.push({data: this.chartData, label: "% of Accepted Answers"});
                var results = data;

                var options = {
                    scales: {
                        yAxes: [{
                            display: true,
                            ticks: {
                                suggestedMin: 0,    // minimum will be 0, unless there is a lower value.
                                // OR //
                                beginAtZero: true   // minimum value will be 0.
                            }
                        }]
                    }
                };
                this.chartOptions = options;
                let _newChartData:Array<any> = new Array(results.length);
                this.chartLabels = [];
                this.chartType = 'bar';
                _newChartData[0] = {data: [results.Admin], label: "# of Admins"};
                _newChartData[1] = {data: [results.Professor], label: "# of Professor"};
                _newChartData[2] = {data: [results.Student], label: "# of Students"};
                this.chartDataSet = _newChartData;
                this.displayChart = true;
            },
            error => {
                console.log("Could not get amount of users per type");
                document.getElementById('error-feedback').style.display = "block";
                this.feedbackCard.hideFeedbackCard("error", "Could not get stats");
            }
        )
    }
}

// let clone = JSON.parse(JSON.stringify(this.chartDataSet));
// clone[0].data = data;
// this.barChartData = clone;

// optionsVariable : { 
//     scales : { 
//         yAxes: [{ 
//             ticks: { beginAtZero: true, stepValue : 10, max : 100, } 
//         }] 
//     } 
// }
