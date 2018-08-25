import { DateFilterPipe } from './../../pipes/date-filter.pipe';
import { Component, OnInit } from '@angular/core';
import { ForumsService } from '../../services/forums.service';

@Component({
  selector: 'app-approve-comments',
  templateUrl: './approve-comments.component.html',
  styleUrls: ['./approve-comments.component.css']
})
export class ApproveCommentsComponent implements OnInit {

  private forums; // array of forums created by the user
  private user; // logged in user
  private forumSelectedIndex: number; // index of the selected forum in the array forums
  private forumSelected; // object forum that is selected, based on forumSelectedIndex
  private comments; // array with the comments of the selected forum
  private loadedForums = false; // bool to tell if the service was called to retrieve the forums

  constructor(private _httpForumService: ForumsService) { }

  ngOnInit() {
    this.user = JSON.parse(localStorage['userJson']);
    this.forumSelected = null;
    this.forums = [];
    this.loadedForums = false;
    this.forumSelectedIndex = -1;
    this._httpForumService.getForumsOf(this.user['id']).subscribe(
      forums => {
        // a forum contains its comments
        this.forums = forums;
        if(this.forums.length >= 1) {
          this.forumSelectedIndex = 0;
          this.forumSelected = this.forums[this.forumSelectedIndex];
          this.comments = this.forumSelected.comments;
          this.comments = this.comments.filter(comment => comment.isVisible == false);
        }
        this.loadedForums = true;
      }, error => {
        console.log("Could not get forums of the user");
      }
    )
  }

  // load the comments of the selected forum
  loadComments($event) {
    this.forumSelectedIndex = $event.target.value;
    this.forumSelected = this.forums[this.forumSelectedIndex];
    this.comments = this.forumSelected.comments;
    this.comments = this.comments.filter(comment => comment.isVisible == false);
  }

  approveComment(comment, commentsIndex) {
    let data = {
      'commentID': comment.id,
      'approve': 1
    };
    // call service to change visibility value in database
    this._httpForumService.makeVisible(data).subscribe(
      response => {
        // update the arrays forums and comments if the call to service was succesful
        // this will help to not call the service load the forms with comments that
        // are not marked as approved/visible
        this.comments.splice(commentsIndex, 1);
        this.forums[this.forumSelectedIndex].comments[commentsIndex].isVisible = true;
      }, error => {
        console.log("Could not update the visibility of the comment");
      }
    )
  }

  deleteComment(comment, commentsIndex) {
    let data = {
      'commentID': comment.id
    };
    this._httpForumService.deleteComment(data).subscribe(
      response => {
        // erase the comment from forums and comments arrays if call 
        // was succesful
        this.comments.splice(commentsIndex, 1);
        this.forums[this.forumSelectedIndex].comments.splice(commentsIndex, 1);
      }, error => {
        console.log("Could not delete the comment");
      }
    )
  }

}
