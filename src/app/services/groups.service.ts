// import { environment } from './../../environments/environment.prod';
import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from "@angular/http";
import {environment} from '../../environments/environment';

import {CacheService} from 'ng2-cache/src/services/cache.service';

@Injectable()
export class GroupsService {

  private baseURL: string = environment.apiURL + '/groups/';
  private teamsURL: string = environment.apiURL + '/teams/';

  private createUrl = this.baseURL+'create';


  constructor(private http: Http, private _cacheService: CacheService) {
  }

  getGroups() {
    const headers = new Headers({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': 'localhost:4200', 'Authorization': localStorage.getItem('auth_token')});
    const options = new RequestOptions({headers: headers});

    return this.http.get(this.baseURL, options).map((response: Response) => response.json());
  }

  getGroup(id) {
    const headers = new Headers({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': 'localhost:4200', 'Authorization': localStorage.getItem('auth_token')});
    const options = new RequestOptions({headers: headers});

    return this.http
      .get(
        this.baseURL + id, options
      )
      .map((response: Response) => response.json());
  }

  createGroup(group){
    const headers = new Headers({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': 'localhost:4200', 'Authorization': localStorage.getItem('auth_token')});
    const options = new RequestOptions({headers: headers});

    this._cacheService.set('groups', [], {expires: Date.now() - 1});
    this._cacheService.set('users', [], {expires: Date.now() - 1});

    return this.http
    .post(
      this.createUrl,
      {"course_id":group.course_id,"enrollments":group.enrollments,"period":group.period,"professor_id":group.professor},
      options
    )
    .map(res => {
      return res;
    });
  }

  deleteGroup(group){
    const headers = new Headers({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': 'localhost:4200', 'Authorization': localStorage.getItem('auth_token')});
    const options = new RequestOptions({headers: headers});

    this._cacheService.set('groups', [], {expires: Date.now() - 1});

    return this.http
    .delete(
      this.baseURL+group.id,
      options
    )
    .map(res => {
      return res;
    });
  }

  editGroup(group){
    const headers = new Headers({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': 'localhost:4200', 'Authorization': localStorage.getItem('auth_token')});
    const options = new RequestOptions({headers: headers});

    this._cacheService.set('groups', [], {expires: Date.now() - 1});
    this._cacheService.set('users', [], {expires: Date.now() - 1});
    debugger;
    return this.http
    .put(
      this.baseURL+group.id,
      {"course_id":group.course_id,"enrollments":group.enrollments,"period":group.period,"professor_id":group.professor},
      options
    )
    .map(res => {
      return res;
    });
  }

  // TEAM SERVICES --------------------------------------------------------------
  // get teams from a group
  getTeams(groupID) {
    const headers = new Headers({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': 'localhost:4200', 'Authorization': localStorage.getItem('auth_token')});
    const options = new RequestOptions({headers: headers});

    let teamURL = this.teamsURL + groupID;
    this._cacheService.set('teams', [], {expires: Date.now() - 1});

    return this.http.get(teamURL, options).map((response: Response) => response.json());
  }

  createTeam(data) {
    const headers = new Headers({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': 'localhost:4200', 'Authorization': localStorage.getItem('auth_token')});
    const options = new RequestOptions({headers: headers});

    let createURL = this.teamsURL + 'create';
    // console.log("DATA", data);
    return this.http
    .post(
      createURL, {
          "enrollments": data.students, 
          "name": data.name,
          "group_id": data.group_id,
          "professor_id": data.professor_id
      },
      options
    )
    .map(res => {
      return res;
    });

  }

  editTeam(data) {
    const headers = new Headers({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': 'localhost:4200', 'Authorization': localStorage.getItem('auth_token')});
    const options = new RequestOptions({headers: headers});

    let editURL = this.teamsURL + data.id;
    // console.log("DATA", data);
    return this.http.put(editURL, {
      "enrollments": data.enrollments, 
      "name": data.name
    }, options)
    .map(res => {
      return res;
    });
  }

  deleteTeam(id) {
    const headers = new Headers({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': 'localhost:4200', 'Authorization': localStorage.getItem('auth_token')});
    const options = new RequestOptions({headers: headers});

    let deleteURL = this.teamsURL + id;
    return this.http
    .delete(
      deleteURL,
      options
    )
    .map(res => {
      return res;
    });
  }

  // returns a single team of a student(id)
  getTeam(id) {
    const headers = new Headers({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': 'localhost:4200', 'Authorization': localStorage.getItem('auth_token')});
    const options = new RequestOptions({headers: headers});

    let getURL = this.teamsURL + 'get-team/' + id;
    return this.http.get(getURL, options).map((response: Response) => response.json());
  }

  getAllTeams(studentID) {
    const headers = new Headers({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': 'localhost:4200', 'Authorization': localStorage.getItem('auth_token')});
    const options = new RequestOptions({headers: headers});
    
    let allURL = this.teamsURL + 'get-all-teams/' + studentID;
    return this.http.get(allURL, options).map((response: Response) => response.json());
  }

  getMessagesOfTeam(teamID) {
    const headers = new Headers({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': 'localhost:4200', 'Authorization': localStorage.getItem('auth_token')});
    const options = new RequestOptions({headers: headers});

    let messagesURL = environment.apiURL + '/message/' + teamID;
    return this.http.get(messagesURL, options).map((response: Response) => response.json());
  }

}
