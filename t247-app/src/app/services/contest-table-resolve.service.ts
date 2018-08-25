import { Injectable } from '@angular/core';
import { Router, Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { ContestService } from './contest.service';

@Injectable()
export class ContestTableResolve implements Resolve<any> {

  constructor(private cs : ContestService, private router: Router) {}
  // get the specified contest
  resolve(route: ActivatedRouteSnapshot){
    let contest_id = +route.params['id'];
    // console.log(contest_id);
    return this.cs.getContest(contest_id).map(contest => {
      if (contest) {
        return contest;
      } else { // id not found
        this.router.navigate(['/']);
        return false;
      }
    });;
  }
}