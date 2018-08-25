import { Injectable } from '@angular/core';
import {Http, Response, Headers, RequestOptions} from "@angular/http";
import {environment} from '../../environments/environment';
import {CacheService} from 'ng2-cache/src/services/cache.service';

@Injectable()
export class ForumsService {

  // edit -> put
  // create -> post
  // delete -> delete
  // get -> get
  private baseURL: string = environment.apiURL + '/forum/';
  private commentURL: string = environment.apiURL + '/comment/'

  constructor(private http: Http, private _cacheService: CacheService) { }

  getForums() {
    const headers = new Headers({
      'Content-Type': 'application/json', 
      'Access-Control-Allow-Origin': 'localhost:4200', 
      'Authorization': localStorage.getItem('auth_token')
    });
    const options = new RequestOptions({headers: headers});

    return this.http.get(this.baseURL, options).map((response: Response) => response.json());
  }

  getForum(id) {
    const headers = new Headers({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': 'localhost:4200', 'Authorization': localStorage.getItem('auth_token')});
    const options = new RequestOptions({headers: headers});

    return this.http.get(this.baseURL + id, options)
    .map((response: Response) => response.json());
  }

  deleteForum(id) {
    const headers = new Headers({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': 'localhost:4200', 'Authorization': localStorage.getItem('auth_token')});
    const options = new RequestOptions({headers: headers}); 

    return this.http.delete(this.baseURL + id, options)
    .map(res => { 
      return res; 
    });
  }

  createForum(data) {
    const headers = new Headers({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': 'localhost:4200', 'Authorization': localStorage.getItem('auth_token')});
    const options = new RequestOptions({headers: headers});

    let createURL = 'create';

    return this.http.post(this.baseURL + createURL, data, options)
    .map(res => {
      return res;
    });
  }

  editForum(data) {
    const headers = new Headers({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': 'localhost:4200', 'Authorization': localStorage.getItem('auth_token')});
    const options = new RequestOptions({headers: headers});

    let id = data.id;
    
    return this.http.put(this.baseURL + id, data, options)
    .map(res => { 
      return res 
    });
  }

  getForumsOf(ownerID) {
    // /owner/<int:author_id>
    const headers = new Headers({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': 'localhost:4200', 'Authorization': localStorage.getItem('auth_token')});
    const options = new RequestOptions({headers: headers});
    let getURL = this.baseURL + 'owner/' + ownerID;
    return this.http.get(getURL, options).map((response: Response) => response.json());
  }

  // Comments services --------------------------------------------------------------------------------
  addComment(data) {
    const headers = new Headers({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': 'localhost:4200', 'Authorization': localStorage.getItem('auth_token')});
    const options = new RequestOptions({headers: headers});

    let createURL = this.commentURL + 'create/' + data.forum_id;
    return this.http.post(createURL, data, options).map((response: Response) => {return response});
  }

  retrieveComments(forumID) {
    const headers = new Headers({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': 'localhost:4200', 'Authorization': localStorage.getItem('auth_token')});
    const options = new RequestOptions({headers: headers});

    let addURL = this.commentURL + forumID;
    return this.http.get(addURL, options).map((response: Response) => response.json());
  }

  like(data) {
    const headers = new Headers({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': 'localhost:4200', 'Authorization': localStorage.getItem('auth_token')});
    const options = new RequestOptions({headers: headers});
    
    let likeURL = this.commentURL + 'like/' + data.commentID;
    return this.http.put(likeURL, data, options)
    .map(res => { 
      return res 
    });
  }

  dislike(data) {
    const headers = new Headers({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': 'localhost:4200', 'Authorization': localStorage.getItem('auth_token')});
    const options = new RequestOptions({headers: headers});
    
    let dislikeURL = this.commentURL + 'dislike/' + data.commentID;
    return this.http.put(dislikeURL, data, options)
    .map(res => { 
      return res 
    });
  }

  makeVisible(data) {
    const headers = new Headers({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': 'localhost:4200', 'Authorization': localStorage.getItem('auth_token')});
    const options = new RequestOptions({headers: headers});

    // data.approve
    // sending >0 = comment is approved;
    // sending 0 = comment is dissapproved;
    let approveURL = this.commentURL + data.commentID + '/' + data.approve;
    console.log(approveURL);
    return this.http.put(approveURL, data, options).map((response: Response) => response.json());
  }put

  deleteComment(data) {
    const headers = new Headers({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': 'localhost:4200', 'Authorization': localStorage.getItem('auth_token')});
    const options = new RequestOptions({headers: headers}); 

    return this.http.delete(this.commentURL + data.commentID, options)
    .map(res => { 
      return res; 
    });
  }
}
