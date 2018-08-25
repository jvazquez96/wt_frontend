import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sortProblem'
})
export class SortProblemPipe implements PipeTransform {

  transform(value: any, id:string): any {
    return value.sort((a, b) => {
      switch(id){
          case "":
            if (a.topic > b.topic) {
              return 1;
            }
            if (a.topic < b.topic) {
              return -1;
            }
            if (a.name > b.name) {
              return 1;
            }
            if (a.name < b.name) {
              return -1;
            }
            return 0;
          case "TitleDes":
            if (a.name > b.name) {
              return 1;
            }
            if (a.name < b.name) {
              return -1;
            }
            return 0;
          case "TitleAscen":
            if (a.name > b.name) {
              return -1;
            }
            if (a.name < b.name) {
              return 1;
            }
            return 0;
          case "TopicDes":
            if (a.topic > b.topic) {
              return 1;
            }
            if (a.topic < b.topic) {
              return -1;
            }
            return 0;
          case "TopicAscen":
            if (a.topic > b.topic) {
              return -1;
            }
            if (a.topic < b.topic) {
              return 1;
            }
            return 0;
          case "StatusDes":
            if (a.active > b.active) {
              return 1;
            }
            if (a.active < b.active) {
              return -1;
            }
            return 0;
          case "StatusAscen":
            if (a.active > b.active) {
              return -1;
            }
            if (a.active < b.active) {
              return 1;
            }
            return 0;
          case "DifficultyDes":
            if (a.difficulty > b.difficulty) {
              return 1;
            }
            if (a.difficulty < b.difficulty) {
              return -1;
            }
            return 0;
          case "DifficultyAscen":
            if (a.difficulty > b.difficulty) {
              return -1;
            }
            if (a.difficulty < b.difficulty) {
              return 1;
            }
            return 0; 
        }  
    });
  }

}
