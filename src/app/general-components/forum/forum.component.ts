import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ForumsService } from '../../services/forums.service';

@Component({
  selector: 'app-forum',
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.css']
})
export class ForumComponent implements OnInit {

  public role: string;
  public comments; // comments of forum
  public forum: any // object containing info of forum
  public forumID: string;
  public newComment: FormGroup;
  public user;

  constructor(private _httpForumsService: ForumsService,
              private _activeRoute: ActivatedRoute,
              private _router: Router,
              private _formBuilder: FormBuilder) {
    this.role = JSON.parse(localStorage['userJson'])['role'];
  }

  ngOnInit() {
    
    this.comments = [];
    this.user = JSON.parse(localStorage['userJson']);
    // form for new comment
    this.newComment = this._formBuilder.group({
      'commentText': ['', Validators.required]
    })

    // get forum info (title, description, author)
    this.forumID = this._activeRoute.snapshot.params["id"];
    this._activeRoute.data.subscribe(
      data => {
        // console.log(data.forum);
        this.forum = data.forum;
      });

      // get the comment of the forum
    this.getComments(this.forumID);
  }

  newCommentSubmit() {
    let text = this.newComment.value.commentText;
    // encapsulate inside json like object
    var visible = false;
    if (this.user['id'] == this.forum.author_id) {
      visible = true;
    }
    let request = {
      "forum_id": this.forumID,
      "isVisible": visible,
      "author_id": JSON.parse(localStorage['userJson'])['id'],
      "text": text
    }
    // call service
    this._httpForumsService.addComment(request).subscribe(
      response => {
        this.getComments(this.forumID);
      }, 
      error => {
        console.log("Error, could not submit comment");
      }
    )
  }

  div

  getComments(forumID: string) {
    this._httpForumsService.retrieveComments(forumID).subscribe(
      response => {
        this.comments = response;
        this.comments = this.comments.filter(comment => comment.isVisible == true);
        console.log(this.comments)
      },
      error => {
        console.log("Error, could not retrieve forum's comments");
      }
    )
  }

  likeComment(id, index) {
    let data = {
      'commentID': id
    }
    this._httpForumsService.like(data).subscribe(
      response => {
        // console.log("Comment Liked");
        this.comments[index].likes = this.comments[index].likes + 1;
      }, error => {
        console.log("Like could not be completed");
      }
    )
  }

  dislikeComment(id, index){
    let data = {
      'commentID': id
    }
    this._httpForumsService.dislike(data).subscribe(
      response => {
        // console.log("Comment Disliked");
        this.comments[index].dislikes = this.comments[index].dislikes + 1;
      }, error => {
        console.log("Dislike could not be completed");
      }
    )
  }

}
