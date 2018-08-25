import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { UsersService } from '../../../services/users.service';
import { GroupsService } from '../../../services/groups.service';

@Component({
  selector: 'app-team-form',
  templateUrl: './team-form.component.html',
  styleUrls: ['./team-form.component.css']
})
export class TeamFormComponent implements OnInit {

  private createTeamForm : FormGroup;

  @Input() studentsArr;
  @Input() groupId;
  @Output() refreshParent = new EventEmitter();

  constructor(private _formBuilder: FormBuilder,
              private groupsService:GroupsService,
              private _authService: UsersService) {

               }

  ngOnInit() {
    this._authService.checkCredentials();
    this.createTeamForm = this._formBuilder.group({
      'team': this._formBuilder.group({
        'name': ['', Validators.required],
        'enrollmentText': ['', Validators.required]
      })
    });
    console.log("TEAM CREATE FORM");
    
  }

  // create a team
  onSubmitTeam() {
    let enrollmentText = this.createTeamForm.value.team.enrollmentText.replace(/\s/g, '');
    let enrollments = enrollmentText.split(",");
    let userID = JSON.parse(localStorage.getItem("userJson"))["id"];
    let request = {
      "students": enrollments,
      "name": this.createTeamForm.value.team.name,
      "group_id": this.groupId,
      "professor_id": userID
    };

    // call service to create team
    this.groupsService.createTeam(request).subscribe(
      response => {
          console.log("TEAM CREATE RESPONSE", response);
          this.refreshParent.emit();

      },
      error => {
          console.log("Could not create team");
      }
  );
  }

  clear() {
    this.createTeamForm.reset();
  }


}
