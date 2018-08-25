import { Injectable } from '@angular/core';
import {Http, Response, Headers, RequestOptions} from "@angular/http";
import {environment} from '../../environments/environment';
// import { environment } from './../../environments/environment.prod';
import {CacheService} from 'ng2-cache/src/services/cache.service';

@Injectable()
export class StatisticsService {

  private baseURL: string = environment.apiURL + '/statistics/';
  
  constructor(private http: Http, private _cacheService: CacheService) { }

  getStatsAllGroups() {
    const headers = new Headers({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': 'localhost:4200', 'Authorization': localStorage.getItem('auth_token')});
    const options = new RequestOptions({headers: headers});

    let all = 'GroupsStats';

    return this.http.get(this.baseURL + all, options).map((response: Response) => response.json());
  }

  getGroupStats(id) {
    const headers = new Headers({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': 'localhost:4200', 'Authorization': localStorage.getItem('auth_token')});
    const options = new RequestOptions({headers: headers});

    return this.http.get(this.baseURL + id, options).map((response: Response) => response.json());
  }

  getTopicsStats() {
    const headers = new Headers({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': 'localhost:4200', 'Authorization': localStorage.getItem('auth_token')});
    const options = new RequestOptions({headers: headers});

    let addURL = 'AC-Ratio-Topic';

    return this.http.get(this.baseURL + addURL, options).map((response: Response) => response.json());
  }

  getProblemStats(problemID) {
    const headers = new Headers({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': 'localhost:4200', 'Authorization': localStorage.getItem('auth_token')});
    const options = new RequestOptions({headers: headers});

    let addURL = 'AC-Ratio/' + problemID;

    return this.http.get(this.baseURL + addURL, options).map((response: Response) => response.json());
  }

  getProblemsPerTopic() {
    const headers = new Headers({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': 'localhost:4200', 'Authorization': localStorage.getItem('auth_token')});
    const options = new RequestOptions({headers: headers});

    let addURL = 'Amount-Problem-Topic'; 

    return this.http.get(this.baseURL + addURL, options).map((response: Response) => response.json());
  }

  getUsersPerCategory() {
    const headers = new Headers({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': 'localhost:4200', 'Authorization': localStorage.getItem('auth_token')});
    const options = new RequestOptions({headers: headers});

    let addURL = 'Amount-Users';

    return this.http.get(this.baseURL + addURL, options).map((response: Response) => response.json());
  }

}

