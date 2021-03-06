import {NgModule, CUSTOM_ELEMENTS_SCHEMA}      from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {routing} from "./app.routing";
import {HttpModule}    from '@angular/http';
import {AppComponent}   from './app.component';
import {LoginComponent} from "./principal-components/login-component/login.component";
import {HomeComponent} from "./principal-components/home-component/home.component";
import {TopicsDashboardComponent} from "./student-components/topics-dashboard/topics-dashboard.component";
import {ProfileComponent} from "./general-components/profile/profile.component";
import {ViewUsersComponent} from "./admin-components/view-users/view-users.component";
import {CreateProblem} from "./general-components/create-problem/create-problem.component";
import {EditProblem} from "./general-components/edit-problem/edit-problem.component";
import {StudentComponentsComponent} from './student-components/student-components.component';
import {GenericTableComponent} from './general-components/generic-table/generic-table.component';
import {GenericFormComponent} from './general-components/generic-table/generic-form.component';
import {Tab} from './general-components/tab/tab.component';
import {Tabs} from './general-components/tabs/tabs.component';
import {TabStatic} from './general-components/tab-static/tab-static.component';
import {TabsStatic} from './general-components/tabs-static/tabs-static.component';
import {TestCasesCreatorComponent} from './general-components/create-problem/test-cases-creator.component';
// import {TestCasesEditorComponent} from './general-components/edit-problem/test-cases-editor.component';
import {SubmitProblem}  from './general-components/submit-problem/submit-problem.component';
import {KeysPipe} from './pipes/keys.pipe';
import {DateFilterPipe} from './pipes/date-filter.pipe';
import {FilterPipe} from './pipes/filter.pipe';
import {FilterUsersPipe} from './pipes/filter-users.pipe';
import {FilterProblemsPipe} from './pipes/filter-problems.pipe';
import {CapitalizePipe} from "./pipes/capitalize.pipe";
import {FilterAssignmentsPipe} from './pipes/filter-assignments.pipe';
import {FilterSubmissionsPipe} from './pipes/filter-submissions.pipe';
import {FilterAssignmentSubmissionsPipe} from './pipes/filter-assignment-submissions.pipe';
import {FilterGroupsPipe} from './pipes/filter-groups.pipe';
import {FilterCoursesPipe} from './pipes/filter-courses.pipe';
import {FilterTopicsPipe} from './pipes/filter-topics.pipe';
import {SortPipe} from './pipes/sort.pipe';
import {SortProblemPipe} from './pipes/sort-problem.pipe';
import {SortAssignmentPipe} from './pipes/sort-assignment.pipe';
import {FirstLoginComponent} from './student-components/first-login.component';

import {SubmissionsOfAssignmentComponent} from './professor-components/submissions/submissions.component';

import {UsersService} from "./services/users.service";
import {CoursesService} from "./services/courses.service";
import {GroupsService} from "./services/groups.service";
import {TopicsService} from "./services/topics.service";
import {SubmitProblemService} from "./services/submit-problem.service";
import {AssignmentsService} from "./services/assignments.service";
import {ProblemsService} from "./services/problems.service";
import {CacheService} from "ng2-cache/src/services/cache.service";


import {CoursesEditComponent} from "./admin-components/courses-edit/courses-edit.component";
import {TopicsEditComponent} from "./admin-components/topics-edit/topics-edit.component";
import {UserEditComponent} from "./admin-components/users-edit/users-edit.component";

import {CodemirrorModule} from 'ng2-codemirror';
import {EditorComponent} from './general-components/code-editor/editor.component';
import {GroupComponent} from "./professor-components/group/group.component";
import {AssignmentComponent} from "./professor-components/assignment/assignment.component";
import {GroupResolve} from "./services/group-resolve.service";
import {ForumResolve} from "./services/forum-resolve.service";
import {ContestListResolve} from "./services/contest-list-resolve.service";
import {ContestTableResolve} from "./services/contest-table-resolve.service"
import {SiteNavbarComponent} from "./principal-components/site-navbar-component/site-navbar.component";

import {AssignmentFormComponent} from "./professor-components/group/assignment-form/assignment-form.component";
import {ProblemDetailsComponent} from "./general-components/problem-details/problem-details.component";
import {GroupFormComponent} from "./professor-components/group/group-form/group-form.component";
import {FeedbackCardComponent} from "./general-components/feedback-card/feedback-card.component";

import {RoleChangeService} from './services/role-change.service';
import {AuthService} from "./services/auth.service";

import { DatePickerModule } from 'ng2-datepicker';


//import {AdminHomeComponent} from "./admin-components2/admin-home/admin-home.component";
import {AdminHomeComponent} from "./admin-components/admin-home/admin-home.component";

import {AdminGuard} from "./services/admin.guard";

import {ProfessorHomeComponent} from "./professor-components/professor-home/professor-home.component";
import {ProfessorGuard} from "./services/professor.guard";

import {StudentHomeComponent} from "./student-components/student-home/student-home.component";
import {StudentGuard} from "./services/student.guard";

import {LoginGuard} from "./services/login.guard";
import {RootGuard} from "./services/root.guard";

import {AdminProfileWrapperComponent} from "./general-components/admin-profile-wrapper/admin-profile-wrapper.component";
import {ProfessorProfileWrapperComponent} from "./general-components/professor-profile-wrapper/professor-profile-wrapper.component";
import {StudentProfileWrapperComponent} from "./general-components/student-profile-wrapper/student-profile-wrapper.component";

import {SubmitProblemGuard} from "./services/submit-problem.guard";
import {TopicGuard} from "./services/topic.guard";
import {ProblemDetailsGuard} from "./services/problem-details.guard";
import {GroupsGuard} from "./services/groups.guard";
import {AssignmentGuard} from "./services/assignment.guard";
import { StatisticsService } from './services/statistics.service';

import { HighlightJsService } from '../../node_modules/angular2-highlight-js';
import { CKEditorModule } from 'ng2-ckeditor';
import { CreateMainProblemComponent } from './general-components/create-main-problem/create-main-problem.component';
import { CreateSubProblemComponent } from './general-components/create-sub-problem/create-sub-problem.component';
import { FeedbackCardNumberedComponent } from './general-components/feedback-card-numbered/feedback-card-numbered.component';
import { CreateSubproblemsComponent } from './general-components/create-subproblems/create-subproblems.component';
import { SubmitProblemParentComponent } from './general-components/submit-problem-parent/submit-problem-parent.component';
import { TeamFormComponent } from './professor-components/group/team-form/team-form.component';
import { GenericGraphComponent } from './general-components/generic-graph/generic-graph.component';
import { ChartsModule } from 'ng2-charts';
// import { Chart } from 'chart.js';
import { ForumListComponent } from './general-components/forum-list/forum-list.component';
import { ForumsService } from './services/forums.service';
import { ForumComponent } from './general-components/forum/forum.component';
import { OcticonDirective } from './general-components/forum/octicon.directive';
import { ChatComponent } from './general-components/chat/chat.component';
import { ContestListComponent } from './general-components/contest-list/contest-list.component';
import { ContestService } from './services/contest.service';
import { ContestTableComponent } from './general-components/contest-table/contest-table.component';
import { ContestSubmitComponent } from './general-components/contest-submit/contest-submit.component';
import { ApproveCommentsComponent } from './general-components/approve-comments/approve-comments.component';
import { TeamsMessagesComponent } from './general-components/teams-messages/teams-messages.component';
 

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        ReactiveFormsModule,
        routing,
        CodemirrorModule,
        CKEditorModule,
        DatePickerModule,
        ChartsModule
    ],
    declarations: [
        AppComponent,
        LoginComponent,
        HomeComponent,
        TopicsDashboardComponent,
        CreateProblem,
        EditProblem,
        SubmitProblem,
        EditorComponent,
        ProfileComponent,
        ViewUsersComponent,
        StudentComponentsComponent,
        GenericTableComponent,
        GenericFormComponent,
        Tab,
        Tabs,
        TabStatic,
        TabsStatic,
        CapitalizePipe,
        FilterPipe,
        TestCasesCreatorComponent,
        KeysPipe,
        DateFilterPipe,
        FilterUsersPipe,
        FilterProblemsPipe,
        FilterAssignmentsPipe,
        FilterAssignmentSubmissionsPipe,
        FilterSubmissionsPipe,
        FilterGroupsPipe,
        FilterCoursesPipe,
        FilterTopicsPipe,
        SortPipe,
        SortProblemPipe,
        SortAssignmentPipe,
        FirstLoginComponent,
        TopicsEditComponent,
        CoursesEditComponent,
        GroupComponent,
        AssignmentComponent,
        ProblemDetailsComponent,
        UserEditComponent,
        SiteNavbarComponent,
        AssignmentFormComponent,
        GroupFormComponent,
        FeedbackCardComponent,
        AdminHomeComponent,
        ProfessorHomeComponent,
        StudentHomeComponent,
        AdminProfileWrapperComponent,
        ProfessorProfileWrapperComponent,
        StudentProfileWrapperComponent,
        SubmissionsOfAssignmentComponent,
        CreateMainProblemComponent,
        CreateSubProblemComponent,
        FeedbackCardNumberedComponent,
        CreateSubproblemsComponent,
        SubmitProblemParentComponent,
        TeamFormComponent,
        GenericGraphComponent,
        ForumListComponent,
        ForumComponent,
        OcticonDirective,
        ChatComponent,
        ContestListComponent,
        ContestTableComponent,
        ContestSubmitComponent,
        ApproveCommentsComponent,
        TeamsMessagesComponent,
    ],
    bootstrap: [AppComponent],
    providers: [
      CoursesService,
      GroupsService,
      TopicsService,
      UsersService,
      CacheService,
      SubmitProblemService,
      GroupResolve,
      ForumResolve,
      ContestListResolve,
      ContestTableResolve,
      AssignmentsService,
      ProblemsService,
      RoleChangeService,
      AuthService,
      AdminGuard,
      ProfessorGuard,
      StudentGuard,
      LoginGuard,
      RootGuard,
      SubmitProblemGuard,
      TopicGuard,
      ProblemDetailsGuard,
      GroupsGuard,
      AssignmentGuard,
      HighlightJsService,
      StatisticsService,
      ForumsService,
      ContestService
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class AppModule {
}
