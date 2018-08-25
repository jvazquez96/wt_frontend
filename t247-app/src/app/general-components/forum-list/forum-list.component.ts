import { FormControl } from '@angular/forms';
import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from "@angular/router";
import { ForumsService } from '../../services/forums.service';

@Component({
  selector: 'app-forum-list',
  templateUrl: './forum-list.component.html',
  styleUrls: ['./forum-list.component.css']
})
export class ForumListComponent implements OnInit {

  @Input() userRole: string;
  private forums;

  // Variables for forum edit modal
  @ViewChild('forumText') forumText: ElementRef;
  @ViewChild('forumTitle') forumTitle: ElementRef;
  @ViewChild('feedbackCard') feedbackCard;
  // button to control de closing of create forum modal when form is submitted
  @ViewChild('closeCreate') closeCreate: ElementRef;
  // button to control de closing of edit forum modal when form is submitted 
  @ViewChild('closeEdit') closeEdit: ElementRef; 
  public selectedForum; // forum object
  public editForumForm: FormGroup;
  public createForumForm: FormGroup;

  constructor(private _httpForumsService: ForumsService,
              private _activeRoute: ActivatedRoute,
              private _router: Router,
              private _formBuilder: FormBuilder) { 

              }

  ngOnInit() {
    this.forums = [];
    this.selectedForum = null;
    this.loadForums();
    
    document.getElementById('success-feedback').style.display = "none";
    document.getElementById('error-feedback').style.display = "none";

    this.createForumForm = this._formBuilder.group({
      'forumTitle': ['', Validators.required],
      'forumDesc': ['', Validators.required]
    })

    this.editForumForm = this._formBuilder.group({
        'forumTitle': ['', Validators.required],
        'forumDesc': ['', Validators.required]
    });
  }

  seeForum(id: number) {
    // navigate to the forum page
    // console.log(JSON.parse(localStorage['userJson'])['role']);
    this._router.navigate(['/forum/' + id]);
  }

  saveForumForEdit(forum) {
    this.selectedForum = forum;
    // load current values
    this.editForumForm.setValue({
      'forumTitle': forum.name,
      'forumDesc': forum.description
    });
    console.log(this.selectedForum);
  }

  // llamar servicio de edit forum
  // obtener datos del modal
  editForum() {
    // get values from modal form
    let title = this.editForumForm.value.forumTitle;
    let description = this.editForumForm.value.forumDesc;
    let id = this.selectedForum.id;
    // encapsulate inside json like object
    let request = {
      "id": id,
      "name": title,
      "description": description,
      "author_id": this.selectedForum.author.id,
      "author_name": this.selectedForum.author.first_name + ' ' + this.selectedForum.author.last_name
    }
    // call service
    this._httpForumsService.editForum(request).subscribe(
      response => {
        document.getElementById('success-feedback').style.display = "block";
        this.feedbackCard.hideFeedbackCard("success", "Forum succesfully edited");
        // close modal
        this.closeEdit.nativeElement.click();
        // clean form
        this.editForumForm.setValue({
          'forumTitle': "",
          'forumDesc': ""
        });
        // get forums again
        this.loadForums();
      }, 
      error => {
        console.log("Could not edit forum", title);
        document.getElementById('error-feedback').style.display = "block";
        this.feedbackCard.hideFeedbackCard("error", error);
      }
    );
  }

  // data comes from a modal
  createForum() {
    let author = JSON.parse(localStorage['userJson']);
    let title = this.createForumForm.value.forumTitle;
    let description = this.createForumForm.value.forumDesc;;

    let request = {
      'author_name': author.first_name + " " + author.last_name,
      'author_id': author.id,
      'name': title,
      'description': description 
    }

    this._httpForumsService.createForum(request).subscribe(
      response => {
        document.getElementById('success-feedback').style.display = "block";
        this.feedbackCard.hideFeedbackCard("success", "Forum succesfully created");
        // close modal
        this.closeCreate.nativeElement.click();
        // clean form
        this.createForumForm.setValue({
          'forumTitle': "",
          'forumDesc': ""
        });
        // load updated forums
        this.loadForums();
      },
      error => {
        console.log("Could not create forum", title);
        document.getElementById('error-feedback').style.display = "block";
        this.feedbackCard.hideFeedbackCard("error", error);
      }
    )
  }

  // delete one of the forums
  deleteForum(id: number, index: number) {
    this._httpForumsService.deleteForum(id).subscribe(
      response => {
        document.getElementById('success-feedback').style.display = "block";
        this.feedbackCard.hideFeedbackCard("success", "Forum succesfully deleted");
        this.forums.splice(index, 1);
      }, 
      error => {
        console.log("Could not get delete forum service");
      }
    )
  }

  loadForums() {
    // get forums again
    this._httpForumsService.getForums().subscribe(
      response => {
        this.forums = response;
        this.forums.reverse();
      },
      error => {
        console.log("Could not get forums");
      });
  }
}
