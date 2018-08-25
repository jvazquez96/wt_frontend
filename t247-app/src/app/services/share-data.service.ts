import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class ShareDataService {

  /**
   * This service is used on the create team problem component. 
   * After creating the parent problem we send this info (parentProblem)
   * to the CreateSubproblems component.
   */
  parentProblem = { 
    "language": "",
    "difficulty": "",
    "topic": ""
   }

   lang: string = "";
   diff: string = "";
   topic:string = "";

  messageSource = new BehaviorSubject<any>(this.parentProblem);
  currentMessage = this.messageSource.asObservable();

  constructor() { }

  changeData(message) {
    this.messageSource.next(message);
  }

  setLanguage(lang: string) {
    this.lang = lang;
  }
  setDifficulty(diff: string) {
    this.diff = diff;
  }
  setTopic(topic: string) {
    this.topic = topic;
  }

  getLanguage() {
    return this.lang;
  }
  getDifficulty() {
    return this.diff;
  }
  getTopic() {
    return this.topic;
  }

}
