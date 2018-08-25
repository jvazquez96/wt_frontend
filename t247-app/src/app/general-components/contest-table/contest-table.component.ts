import { Component, OnInit } from '@angular/core';
import { ContestService } from '../../services/contest.service';
import { Router, ActivatedRoute } from '@angular/router'

@Component({
  selector: 'app-contest-table',
  templateUrl: './contest-table.component.html',
  styleUrls: ['./contest-table.component.css']
})
export class ContestTableComponent implements OnInit {

  public problems; // problems of the contest
  private user;
  private userRole; 
  private contest; // contest object
  private groupID;
  private teams; // teams participating
  private results // list of list -> results for each problem for all team
  private rawResults;
  private problemKeys;
  private socket; // socket object
  private socketURL: string = 'http://localhost:5000/contest';
  private room; // room id for socket

  constructor(private _httpContestService: ContestService,
              private _activeRoute: ActivatedRoute,
              private _router: Router) { 
              }

  ngOnInit() {
    this.user = JSON.parse(localStorage['userJson']);
    this.userRole = this.user['role'];

    // get contest
    this.groupID = this._activeRoute.snapshot.params['group']; // from url params
    this.contest = this._activeRoute.snapshot.data['contest']; // from resolver
    this.problems = this.contest.problems;
    this.teams = this.contest.teams;

    // connect to contest socket - roomID = contest ID
    // connect to chat server
    this.socket = io(this.socketURL);
    // send connection message to all clients involved
    // room information
    this.room = this.contest.id;
    let data = {
      'room': this.room
    }

    // this.loadTable(this.contest.id);

    // inform user connected to the room
    this.socket.on('connect', () => {
      this.socket.emit('join', JSON.stringify(data))
    });
    // send disconnection message to all clients involved
    this.socket.on('disconnect', () => {
      this.socket.emit('leave', JSON.stringify(data))
    });

    // join and leave room, server sends this event with the msg
    this.socket.on('join_response', (msg) => {
      console.log("joined", msg);
      if(msg == this.contest.id) {
        this.loadTable(this.contest.id);
      }
    });
    this.socket.on('leave_response', (msg) => {
      console.log("left", msg);
    });

  }

  loadTable(contest_id) {
    this._httpContestService.getTable(contest_id).subscribe(
      data => {
        this.results = []
        this.rawResults = data;
        let keys = Object.keys(data);
        this.problemKeys = Object.keys(data[keys[0]]);
        console.log(this.problemKeys);
        for(let i = 0; i < keys.length; i++) {
          let el = data[keys[i]];
          console.log(el)
          this.results.push(el);
        }
        console.log(this.results);
      }, error => {
        console.log("Could not get contest data results");
      }
    )
  }

}
