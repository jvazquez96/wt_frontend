import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { GroupsService } from '../../services/groups.service'
import { DateFilterPipe } from '../../pipes/date-filter.pipe'

@Component({
  selector: 'app-teams-messages',
  templateUrl: './teams-messages.component.html',
  styleUrls: ['./teams-messages.component.css']
})
export class TeamsMessagesComponent implements OnInit {

  private groups; // array of objects containing groups of the professor/admin
  private teams; // array of objects containing teams of the selected group of the professor/admin
  private messages; // array of messages of a team
  private groupSelected;
  private teamSelected;
  private loadedTeam = false;
  private loadedMessages = false;

  constructor(private _httpGroupService: GroupsService) { }

  ngOnInit() {
    // load groups of the professor
    this.loadedTeam = false;
    this.loadedMessages = false;
    this.groups = [];
    this.teams = [];
    this.messages = [];
    this._httpGroupService.getGroups().subscribe(
      groups => {
        this.groups = groups;
        this.groupSelected = this.groups[0].id;

        // load the teams of the first group
        this._httpGroupService.getTeams(this.groups[0].id).subscribe(
          teams => {
            this.teams = teams;
            this.teamSelected = this.teams[0].id;
            this.loadedTeam = true;
            // load the messages of the first team
            this._httpGroupService.getMessagesOfTeam(this.teamSelected).subscribe(
              messages => {
                this.messages = messages;
                this.loadedMessages = true;
              }, error => {
                console.log("Could not get team's messages");
              }
            ) // ends getMessagesOfTeam ------------------------
          }, error => {
            console.log("Could not get the teams of the group");
          }
        ) // ends getTeams -------------------------------------
      }, error => {
        console.log("Could not get the groups");
      }
    ) // ends getGroups -------------------------------------
  }

  // load new teams when a different group is selected
  loadTeams($event) {
    this.loadedTeam = false;
    this.loadedMessages = false;
    let id = $event.target.value;
    // load teams of a group
    this._httpGroupService.getTeams(id).subscribe(
      teams => {
        this.teams = teams;
        this.teamSelected = this.teams[0].id;
        this.loadedTeam = true;
        // load messages of first team
        this._httpGroupService.getMessagesOfTeam(this.teamSelected).subscribe(
          messages => {
            this.messages = messages;
            this.loadedMessages = true;
          }, error => {
            console.log("Could not get messages");
          }
        )
      }, error => {
        console.log("Could not get the teams of the group");
      }
    )
  }

  loadMessages($event) {
    let id = $event.target.value;
    this.loadedMessages = false;
    // load message of a team
    this._httpGroupService.getMessagesOfTeam(id).subscribe(
      messages => {
        this.messages = messages;
        this.loadedMessages = true;
      }, error => {
        console.log("Could not get messages");
      }
    )
  }

}
