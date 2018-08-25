import { Injectable } from '@angular/core';
import '../rxjs-operators';
import 'rxjs/add/operator/map';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import {environment} from '../../environments/environment';

@Injectable()
export class SubmitProblemService{

    constructor(private http:Http) {
    }


    getDescriptions(id) {
        const headers = new Headers({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': 'localhost:4200', 'Authorization': localStorage.getItem('auth_token')});
        const options = new RequestOptions({headers: headers});

        const serviceURL:string = environment.apiURL + '/problems/description/'+id;
        return this.http.get(serviceURL, options).map((response:Response) => response.json());
    }

    getAttempts(s_id, id) {
        const headers = new Headers({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': 'localhost:4200', 'Authorization': localStorage.getItem('auth_token')});
        const options = new RequestOptions({headers: headers});

        const serviceURL:string = environment.apiURL + '/submissions/last/'+s_id+'/'+id+'/0';
        return this.http.get(serviceURL, options).map((response:Response) => response.json());
    }

    getSubmissions(id) {
        const headers = new Headers({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': 'localhost:4200', 'Authorization': localStorage.getItem('auth_token')});
        const options = new RequestOptions({headers: headers});

        const serviceURL:string = environment.apiURL + '/submissions/attempts/'+id+'/';
        return this.http.get(serviceURL, options).map((response:Response) => response.json());
    }

    checkParent(parentID, userID) {
        const headers = new Headers({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': 'localhost:4200', 'Authorization': localStorage.getItem('auth_token')});
        const options = new RequestOptions({headers: headers});

        const serviceURL:string = environment.apiURL + '/problems/listbysub-problem/' + userID + '/' + parentID;
        return this.http.get(serviceURL, options).map((response:Response) => response.json());
    }

    checkParentOfTeam(parentID, teamID) {
        const headers = new Headers({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': 'localhost:4200', 'Authorization': localStorage.getItem('auth_token')});
        const options = new RequestOptions({headers: headers});

        const serviceURL:string = environment.apiURL + '/problems/check-parent-team/' + teamID + '/' + parentID;
        return this.http.get(serviceURL, options).map((response:Response) => response.json());
    }

    getAccepted(student, problem) {
        const headers = new Headers({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': 'localhost:4200', 'Authorization': localStorage.getItem('auth_token')});
        const options = new RequestOptions({headers: headers});

        const serviceURL:string = environment.apiURL + '/submissions/accepted/' + student + '/' + problem;
        return this.http.get(serviceURL, options).map((response:Response) => response.json());
    }

    getChosenBy(team, problem) {
        const headers = new Headers({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': 'localhost:4200', 'Authorization': localStorage.getItem('auth_token')});
        const options = new RequestOptions({headers: headers});

        const serviceURL:string = environment.apiURL + '/submissions/chosen_by/' + team + '/' + problem;
        return this.http.get(serviceURL, options).map((response:Response) => response.json());
    }

    choseProblem(user, team, problem) {
        const headers = new Headers({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': 'localhost:4200', 'Authorization': localStorage.getItem('auth_token')});
        const options = new RequestOptions({headers: headers});

        const serviceURL:string = environment.apiURL + '/submissions/choose';
        return this.http.post(serviceURL, {
            "user_id": user,
            "team_id": team,
            "problem_id": problem
        }, options).map(res => {return res});        
    }

    unchooseProblem(user, team, problem) {
        const headers = new Headers({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': 'localhost:4200', 'Authorization': localStorage.getItem('auth_token')});
        const options = new RequestOptions({headers: headers});

        const serviceURL:string = environment.apiURL + '/submissions/unchoose/' + user  +  '/' + team + '/' + problem;
        return this.http.delete(serviceURL, options).map(res => {
            return res;
        });
    }
}
