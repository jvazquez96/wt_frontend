import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {UsersService} from "../../services/users.service";
import {Router} from '@angular/router';
import { GroupsService } from '../../services/groups.service';

@Component({
  selector: 'app-site-navbar',
  templateUrl: './site-navbar.component.html',
  styleUrls: ['./site-navbar.component.css']
})
export class SiteNavbarComponent implements OnInit {

  userRoles: string[];
  @Input() showDropdown: boolean;
  @Input() currentRole: string;
  userTeams = [];
  selectedTeam: string; // name of the selected team

  constructor(private _authService: UsersService, 
              private _router: Router,
              private _groupService: GroupsService) {
  }

  ngOnInit() {
    if (localStorage['roles'])    
      this.userRoles = JSON.parse(localStorage['roles']);

    this.userTeams = [];
    this.selectedTeam = "";
    if (localStorage['userJson'] && this.currentRole == '')
      this.currentRole = JSON.parse(localStorage['userJson'])['role'];

    // get teams of user if it is a student
    if(this.currentRole == 'student') {
      this._groupService.getAllTeams(JSON.parse(localStorage['userJson'])['id']).subscribe(
        teams => {
          this.userTeams = teams;
          if(teams.length == 0) {
            // This will serve as an indicator for user to know he has no team
            let noTeam = {'name': 'No team'};
            this.userTeams.push(noTeam);
          } 
          localStorage.setItem('team', JSON.stringify(this.userTeams[0]));
          this.selectedTeam = JSON.parse(localStorage.getItem('team'))['name'];
          // console.log(JSON.parse(localStorage['team']));
        }, error => {
          console.log("Could not get teams");
        }
      )
    }

  }

  /**
   * This function emits an event that triggers the logout function, the function that is called is
   * on the Home Component
   */
  sendLogoutEvent(){
    this._authService.logout();
  }

  testFunc(role) {
    this._router.navigate(['/' + role.toLowerCase()]);
  }

  navigateHome() {
    this._router.navigate(['/']);
  }

  navigateProfile() {
    this._router.navigate(['/profile']);
  }
 
  changeTeam(index) {
    localStorage.setItem('team', JSON.stringify(this.userTeams[index]));
    this.selectedTeam = JSON.parse(localStorage.getItem('team'))['name'];
    // console.log(JSON.parse(localStorage.getItem('team')));
  }

}
