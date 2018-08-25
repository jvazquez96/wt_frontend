import { Injectable }             from '@angular/core';
import { Router, Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { ForumsService } from './forums.service';

@Injectable()
export class ForumResolve implements Resolve<any> {

  constructor(private fs : ForumsService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot) {
    let id = +route.params['id'];
    return this.fs.getForum(id).map(forum => {
      if (forum) {
        return forum;
      } else { // id not found
        this.router.navigate(['/']);
        return false;
      }
    });
  }
}