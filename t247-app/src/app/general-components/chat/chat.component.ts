import { ViewChild, ElementRef } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { GroupsService } from '../../services/groups.service'
import * as io from 'socket.io-client';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  public buttonText: string;
  public show: boolean; // Determines the text to display on buttonText
  public messages: string[]; // Array of messages
  private user: any; // logged in user
  @ViewChild('msgVal') msgVal: ElementRef; // Input for message text
  private socket; // socket object
  private socketURL: string = 'http://localhost:5000/chat';
  private room: string; // room ID
  public team; // team object on local storage
  
  constructor(private _httpGroupService: GroupsService) { }

  ngOnInit() {
    this.buttonText = "Show messages";
    this.show = false;
    this.user = JSON.parse(localStorage.getItem('userJson'));
    this.messages = [];

    // connect to chat server
    this.socket = io(this.socketURL);
    
    // send connection message to all clients involved

    // room information
    // this._httpGroupService.getTeam(this.user.id).subscribe(
    //   response => {
    //     // assign Team ID as the room number
    //     this.room = response.id
    //     let data = {
    //       'username': this.user['enrollment'],
    //       'senderID': this.user['id'],
    //       'room': this.room,
    //       'userRole': this.user['role']
    //     }
    //     // inform user connected to the room
    //     this.socket.on('connect', () => {
    //       this.socket.emit('join', JSON.stringify(data))
    //     });
    //     // send disconnection message to all clients involved
    //     this.socket.on('disconnect', () => {
    //       this.socket.emit('leave', JSON.stringify(data))
    //     });
    //   },
    //   error => {
    //     console.log("Could not get team")
    //   }
    // ) 
    let t = JSON.parse(localStorage.getItem('team'));
    if(t.name != "No team") {
      this.team = JSON.parse(localStorage.getItem('team'));
      this.room = this.team['id'];
      
      let data = {
        'username': this.user['enrollment'],
        'senderID': this.user['id'],
        'room': this.room,
        'userRole': this.user['role']
      }
      // connect to room on connect
      this.socket.on('connect', () => {
        this.socket.emit('join', JSON.stringify(data))
      });
      // send disconnection message to all clients involved
      this.socket.on('disconnect', () => {
        this.socket.emit('leave', JSON.stringify(data))
      });
    }
    // receive messages
    this.socket.on('message', (msg) => {
      // console.log("This chat message", msg);
      this.messages.push(msg);
    });
    // join and leave room, server sends this event with the msg
    this.socket.on('join_response', (msg) => {
      this.messages.push(msg)
    });
    this.socket.on('leave_response', (msg) => {
      this.messages.push(msg)
    });

    
  }

  changeButtonText() {
    this.show = !this.show;
    if(this.show) {
      this.buttonText = "Hide messages";
    } else {
      this.buttonText = "Show messages";
    }
  }

  sendMessage(text: string) {
    if(text != '') {
      let msgInfo = {
        'msg': text,
        'room': this.room,
        'userRole': this.user['role'],
        'senderID': this.user['id'],
        'first_name': this.user['first_name']
      }
      this.socket.emit('chat_message', JSON.stringify(msgInfo));
      // Erase message that was just sent.
      this.msgVal.nativeElement.value = '';
    } 
  }

}
