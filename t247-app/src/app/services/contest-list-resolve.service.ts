import { Injectable } from '@angular/core';
import { Router, Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { ProblemsService } from './problems.service';

@Injectable()
export class ContestListResolve implements Resolve<any> {

  constructor(private ps : ProblemsService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot){
    return this.ps.getMainProblems();
  }
}