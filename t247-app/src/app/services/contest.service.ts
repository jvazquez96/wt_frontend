import { Injectable } from '@angular/core';
import {Http, Response, Headers, RequestOptions} from "@angular/http";
import {environment} from '../../environments/environment';
import {CacheService} from 'ng2-cache/src/services/cache.service';

@Injectable()
export class ContestService {

  private baseURL: string = environment.apiURL + '/contests/';
  private baseURLGroup: string = environment.apiURL + '/groups/';
  private baseURLProblems: string = environment.apiURL + '/problems/';
  constructor(private http: Http, private _cacheService: CacheService) { }

  // returns al contests
  getContests() {
    const headers = new Headers({
      'Content-Type': 'application/json', 
      'Access-Control-Allow-Origin': 'localhost:4200', 
      'Authorization': localStorage.getItem('auth_token')
    });
    const options = new RequestOptions({headers: headers});

    return this.http.get(this.baseURL, options)
    .map((response: Response) => response.json());
  }

  // get a specific contest
  getContest(contest_id) {
    const headers = new Headers({
      'Content-Type': 'application/json', 
      'Access-Control-Allow-Origin': 'localhost:4200', 
      'Authorization': localStorage.getItem('auth_token')
    });
    const options = new RequestOptions({headers: headers});

    return this.http.get(this.baseURL + contest_id, options)
    .map((response: Response) => response.json());
  }

  // get contests a student is involved in (therefore the teams)
  getStudentContests(student_id) {
    const headers = new Headers({
      'Content-Type': 'application/json', 
      'Access-Control-Allow-Origin': 'localhost:4200', 
      'Authorization': localStorage.getItem('auth_token')
    });
    const options = new RequestOptions({headers: headers});

    return this.http.get(this.baseURL + 'student/' + student_id, options)
    .map((response: Response) => response.json());
  }

  // get contests the professor has created
  getProfessorContests(prof_id) {
    const headers = new Headers({
      'Content-Type': 'application/json', 
      'Access-Control-Allow-Origin': 'localhost:4200', 
      'Authorization': localStorage.getItem('auth_token')
    });
    const options = new RequestOptions({headers: headers});

    return this.http.get(this.baseURL + 'professor/' + prof_id, options)
    .map((response: Response) => response.json());
  }

  // create a contest
  createContest(data) {
    const headers = new Headers({
      'Content-Type': 'application/json', 
      'Access-Control-Allow-Origin': 'localhost:4200', 
      'Authorization': localStorage.getItem('auth_token')
    });
    const options = new RequestOptions({headers: headers});

    return this.http.post(this.baseURL + 'create', data, options)
    .map((response: Response) => response.json());
  }

  // update a contest
  updateContest(data) {
    const headers = new Headers({
      'Content-Type': 'application/json', 
      'Access-Control-Allow-Origin': 'localhost:4200', 
      'Authorization': localStorage.getItem('auth_token')
    });
    const options = new RequestOptions({headers: headers});

    return this.http.put(this.baseURL + data.id, data, options)
    .map((res: Response) => res.json());
  }

  // delete a contest
  deleteContest(data) {
    const headers = new Headers({
      'Content-Type': 'application/json', 
      'Access-Control-Allow-Origin': 'localhost:4200', 
      'Authorization': localStorage.getItem('auth_token')
    });
    const options = new RequestOptions({headers: headers});

    return this.http.delete(this.baseURL + data.id, options)
    .map((res: Response) => res.json());
  }

  getTable(id) {
    const headers = new Headers({
      'Content-Type': 'application/json', 
      'Access-Control-Allow-Origin': 'localhost:4200', 
      'Authorization': localStorage.getItem('auth_token')
    });
    const options = new RequestOptions({headers: headers});

    return this.http.get(this.baseURL + "get-table/" + id, options)
    .map((res: Response) => res.json());
  }

  getContestsOfProblem(problem_id) {
    const headers = new Headers({
      'Content-Type': 'application/json', 
      'Access-Control-Allow-Origin': 'localhost:4200', 
      'Authorization': localStorage.getItem('auth_token')
    });
    const options = new RequestOptions({headers: headers});

    return this.http.get(this.baseURL + "contests-problem/" + problem_id, options)
    .map((res: Response) => res.json());
  }
}
