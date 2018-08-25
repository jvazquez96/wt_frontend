import { Component, OnInit } from '@angular/core';
import { SubmitProblemParentComponent } from '../submit-problem-parent/submit-problem-parent.component';
import { Route, ActivatedRoute } from '@angular/router';
 
@Component({
  selector: 'app-contest-submit',
  templateUrl: './contest-submit.component.html',
  styleUrls: ['./contest-submit.component.css']
})
export class ContestSubmitComponent implements OnInit {

  private contestID: number;
  private mainProblemID: number
  private socket; // socket object
  private socketURL: string = 'http://localhost:5000/contest';

  constructor(private _activeRoute:ActivatedRoute) { }

  ngOnInit() {
    this.socket = io(this.socketURL);

    this.contestID = +this._activeRoute.snapshot.params['contest'];
    this.mainProblemID = +this._activeRoute.snapshot.params['id'];

    let data = {
      'username': '',
      'room': this.contestID
    };
    this.socket.on('connect', () => {
      this.socket.emit('join', JSON.stringify(data))
    });

    // send disconnection message to all clients involved
    this.socket.on('disconnect', () => {
      this.socket.emit('leave', JSON.stringify(data))
    });

    // join and leave room, server sends this event with the msg
    this.socket.on('join_response', (msg) => {
      console.log(msg);
    });
    this.socket.on('leave_response', (msg) => {
      console.log(msg);
    });
  }

  sendUpdateEvent($event) {
    let msgInfo = {
      'room': $event
    }
    this.socket.emit('update_contest', JSON.stringify(msgInfo), $event);
  }

}
