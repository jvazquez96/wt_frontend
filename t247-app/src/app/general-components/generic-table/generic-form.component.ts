import {Component, Input, Output, OnInit, EventEmitter} from '@angular/core';
import {FormGroup, Validators, FormBuilder} from "@angular/forms";
import {CoursesService} from '../../services/courses.service';
import {TopicsService} from '../../services/topics.service';
import {UsersService} from '../../services/users.service';
import {GroupsService} from '../../services/groups.service';
import {CacheService, CacheStoragesEnum} from 'ng2-cache/ng2-cache';
import {environment} from '../../../environments/environment';


@Component({
    selector: 'generic-form',
    templateUrl: "./generic-form.component.html",
    styleUrls: ["./generic-form.component.css"]
})
export class GenericFormComponent implements OnInit {
    finished:string = "";
    courses:Array<any>;
    user:any = {enrollment: "", first_name: "", last_name: "", role: "", email: "", password: ""};
    topicName:string = "";
    courseName:string = "";
    //group:any = {course: {id: "", name: ""}, enrollmentText: "", period: ""};
    private form : FormGroup;
    private groupSubmit = 'Create Group';

    @Input('typeForm') typeOfForm:string;
    @Output() formChange = new EventEmitter();
    @Input('group') group:any = {course: {id: "", name: ""}, enrollmentText: "", period: ""};
    @Input('action') action;
    @Input('team') team: any;

    @Output() refresh = new EventEmitter();

    constructor(private topicsService:TopicsService,
                private coursesService:CoursesService,
                private usersService:UsersService,
                private groupsService:GroupsService,
                private _cacheService:CacheService,
                private _formBuilder: FormBuilder) {
    }

    ngOnInit() {
        // console.log(this.typeOfForm);
        this.coursesService.getCourses().subscribe(
            courses => {
                if (!this._cacheService.exists('courses')) {
                    const myArray = [];
                    for (let key in courses) {
                        myArray.push(courses[key]);
                        // console.log(courses[key]);
                    }
                    this._cacheService.set('courses', myArray, {maxAge: environment.lifeTimeCache});
                    this.courses = this._cacheService.get('courses');
                    //console.log("Se hizo get de courses");
                }
                else {
                    this.courses = this._cacheService.get('courses');
                }
            }
        );
        switch (this.typeOfForm) {
          case 'users':
            this.form = this._formBuilder.group({
              'user': this._formBuilder.group({
                'enrollment': ['', Validators.required],
                'first_name': ['', Validators.required],
                'last_name': ['', Validators.required],
                'role': ['', Validators.required],
                'email': ['', Validators.required],
                'password': ['', Validators.required]
              })
            });
            break;
          case 'groups':
            this.form = this._formBuilder.group({
              'group': this._formBuilder.group({
                'course_id': [this.group.course.id, Validators.required],
                'enrollmentText': [this.group.enrollmentText, Validators.required],
                'period': [this.group.period, Validators.required],
                'id': this.group.id
              })
            });
            if (this.action == 'edit') {
              this.groupSubmit = 'Update Group';
            }
            break;
          case 'topics':
            this.form = this._formBuilder.group({
              'topic': this._formBuilder.group({
                'name': ['', Validators.required]
              })
            });
            break;
          case 'courses':
            this.form = this._formBuilder.group({
              'course': this._formBuilder.group({
                'name': ['', Validators.required]
              })
            });
            break;
          case 'teams':
            // console.log("TEAMS EDIT FORM")
            this.form = this._formBuilder.group({
              'team': this._formBuilder.group({
                'enrollmentText': [this.team.students, Validators.required],
                'name': ['', Validators.required]
              })
            });
            break;
          default:
            break;
        }
    }


    onSubmitCourse() {
        let request = {
            "name": this.form.value.course.name
        };
        // console.log(request);
        this.coursesService.createCourse(request.name).subscribe((result) => {
            if (!result) {
                console.log("Fallo");
            } else {
                console.log(result);
                this.courseName = '';
                this.formChange.emit();
            }
        });
    }


    onSubmitUser(roleSelected) {
        let request = {
            "enrollment": this.form.value.user.enrollment,
            "first_name": this.form.value.user.first_name,
            "last_name": this.form.value.user.last_name,
            "role": this.form.value.user.role,
            "email": this.form.value.user.email,
            "password": this.form.value.user.password
        };
        this.usersService.createUser(request).subscribe((result) => {
            if (!result) {
                console.log("Fallo");
            }
            else {
                console.log(result);
                this.user = {enrollment: "", first_name: "", last_name: "", role: "", email: "", password: ""};
                this.formChange.emit();
            }
        });
    }

    onSubmitTopic() {
        let request = {
            "name": this.form.value.topic.name
        };
        // console.log(request);
        this.topicsService.createTopic(request.name).subscribe((result) => {
            if (!result) {
                console.log("Fallo");
            } else {
                console.log(result);
                this.topicName = '';
                this.formChange.emit();
            }
        });
    }

    onSubmitGroup() {
        let enrollmentText = this.form.value.group.enrollmentText.replace(/\s/g, '');
        let enrollments = enrollmentText.split(",");
        let request = {
            "course_id": this.form.value.group.course_id,
            "enrollments": enrollments,
            "professor": JSON.parse(localStorage.getItem('userJson')).id,
            "period": this.form.value.group.period,
            "id": this.form.value.group.id
        };
        // console.log(request);
        if (this.action != 'edit') {
          this.groupsService.createGroup(request).subscribe((result) => {
            if (!result) {
              console.log("Fallo");
            } else {
              console.log(result);
              //this.renderTable();
              this.group = {course: {id: "", name: ""}, enrollmentText: "", period: ""};
              this.formChange.emit();
            }
          });
        } else {
          this.groupsService.editGroup(request).subscribe((result) => {
            if (!result) {
              console.log("Fallo");
            }
            else {
              console.log(result);
            }
          });
        }
    }

    // edit a team
    onSubmitTeam() {
        let enrollmentText = this.form.value.team.enrollmentText.replace(/\s/g, '');
        let enrollments = enrollmentText.split(",").filter(enroll => enroll != "");

        // console.log(enrollments);

        let userID = JSON.parse(localStorage.getItem("userJson"))["id"];

        let request = {
            "enrollments": enrollments,
            "name": this.form.value.team.name,
            "id": this.team.id
            // "group_id": this.team.group_id,
            // "professor_id": userID
        };
        if(this.action == 'edit') {
            // service to edit team
            this.groupsService.editTeam(request).subscribe(
                response => {
                    // console.log("TEAM EDIT RESPONSE", response);
                    this.refresh.emit();
    
                },
                error => {
                    // console.log("Could not edit team");
                }
            );
        }
    }

}
