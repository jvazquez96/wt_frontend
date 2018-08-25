import { ContestSubmitComponent } from './general-components/contest-submit/contest-submit.component';
import { ContestTableComponent } from './general-components/contest-table/contest-table.component';
import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent }      from './principal-components/login-component/login.component';
import {AppComponent} from "./app.component";
import {ProfileComponent} from "./general-components/profile/profile.component";
import {GroupComponent} from "./professor-components/group/group.component";
import { GroupResolve }   from "./services/group-resolve.service";
import { ForumResolve } from "./services/forum-resolve.service"
import {SubmitProblem} from "./general-components/submit-problem/submit-problem.component";
import {ProblemDetailsComponent} from "./general-components/problem-details/problem-details.component";
import {CreateProblem} from "./general-components/create-problem/create-problem.component";
import {EditProblem} from "./general-components/edit-problem/edit-problem.component";


import {AdminHomeComponent} from "./admin-components/admin-home/admin-home.component";
import {AdminGuard} from "./services/admin.guard";

//import {ProfessorHomeComponent} from "./professor-components-2/professor-home/professor-home.component";
import {ProfessorHomeComponent} from "./professor-components/professor-home/professor-home.component";
import {ProfessorGuard} from "./services/professor.guard";

import {StudentHomeComponent} from "./student-components/student-home/student-home.component";
import {StudentGuard} from "./services/student.guard";

import {LoginGuard} from "./services/login.guard";
import {RootGuard} from "./services/root.guard";


import {SubmissionsOfAssignmentComponent} from "./professor-components/submissions/submissions.component";

import {SubmitProblemGuard} from "./services/submit-problem.guard";
import {TopicGuard} from "./services/topic.guard";
import {ProblemDetailsGuard} from "./services/problem-details.guard";
import {GroupsGuard} from "./services/groups.guard";
import {AssignmentGuard} from "./services/assignment.guard";
import { CreateMainProblemComponent } from './general-components/create-main-problem/create-main-problem.component';
import { CreateSubProblemComponent } from './general-components/create-sub-problem/create-sub-problem.component';
import { CreateSubproblemsComponent } from './general-components/create-subproblems/create-subproblems.component';
import { SubmitProblemParentComponent } from './general-components/submit-problem-parent/submit-problem-parent.component'
import { GenericGraphComponent } from './general-components/generic-graph/generic-graph.component'
import { ForumComponent } from './general-components/forum/forum.component'
import { ForumListComponent } from './general-components/forum-list/forum-list.component'
import { ContestListResolve } from './services/contest-list-resolve.service'
import { ContestTableResolve } from './services/contest-table-resolve.service'


const appRoutes: Routes = [
    {
        path: '',
        component: AppComponent,
        canActivate: [RootGuard]
    },
    {
        path: 'admin',
        component: AdminHomeComponent,
        canActivate: [AdminGuard]
    },
    {
        path: 'admin/tab/:tab',
        component: AdminHomeComponent,
        canActivate: [AdminGuard]
    },
    {
        path: 'professor',
        component: ProfessorHomeComponent,
        canActivate: [ProfessorGuard]
    },
    {
        path: 'professor/tab/:tab',
        component: ProfessorHomeComponent,
        canActivate: [ProfessorGuard],
        resolve: {
            listProblems: ContestListResolve
        }
    },
    {
        path: 'student',
        component: StudentHomeComponent,
        canActivate: [StudentGuard]
    },
    {
        path: 'student/tab/:tab/:topic',
        component: StudentHomeComponent,
        canActivate: [TopicGuard]
    },
    {
        path: 'student/tab/:tab',
        component: StudentHomeComponent,
        canActivate: [StudentGuard]
    },
    {
        path: 'login',
        component: LoginComponent,
        canActivate: [LoginGuard]
    },
    {
      path: 'profile',
      component: ProfileComponent,
      canActivate: [StudentGuard]
    },
    {
        path: 'problem/:id',
        component: ProblemDetailsComponent,
        canActivate: [ProblemDetailsGuard]
    },
    {
        path: 'createProblem',
        component: CreateProblem,
        canActivate: [ProfessorGuard]
    },
    {
        path: 'createTeamProblem',
        component: CreateMainProblemComponent,
        canActivate: [ProfessorGuard]
    },
    {
        path: 'createSubProblems/:parentName/:amount',
        component: CreateSubproblemsComponent,
        canActivate: [ProfessorGuard]
    },
    {
        path: 'editProblem/:id',
        component: EditProblem,
        //canActivate: [ProfessorGuard]
    },
    {
      path: 'professor/groups/:id',
      component: GroupComponent,
      resolve : {
        any: GroupResolve
      },
      canActivate: [GroupsGuard]
    },
    {
        path: 'forum/:id',
        component: ForumComponent,
        resolve: {
            forum: ForumResolve
        }
    },
    {
      path: 'professor/groups/group/:id',
      component: GroupComponent,
      resolve : {
        any: GroupResolve
      },
      canActivate: [GroupsGuard]
    },
    {
        path: 'student/submitProblem/:id',
        component: SubmitProblemParentComponent,
        canActivate: [SubmitProblemGuard]
    },
    {
        path:'contest/:group/:id',
        component: ContestTableComponent,
        canActivate: [],
        resolve: {
            contest: ContestTableResolve
        }
    },
    {
        path: 'professor/student-attempts/:assig_id/:student_id',
        component: SubmissionsOfAssignmentComponent,
        canActivate: [AssignmentGuard]

    },
    {
        path: 'student/contest/:contest/submitProblem/:id',
        component: ContestSubmitComponent
    },
    {
        path: '**',
        component: AppComponent,
        canActivate: [RootGuard]
    }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
