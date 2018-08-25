import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sort'
})
export class SortPipe implements PipeTransform {

  transform(value: any, id:string): any {
      return value.sort((a, b) => {
        switch(id){
            case "":
              if (a.name) {
                if (a.name > b.name) {
                  return 1;
                }
                if (a.name < b.name) {
                  return -1;
                }
                return 0;
              } else {
                  if (a.id > b.id) {
                    return 1;
                  }
                  if (a.id < b.id) {
                    return -1;
                  }
                  return 0;
              }
            case "EnrollmentDes":
              if (a.enrollment > b.enrollment) {
                return 1;
              }
              if (a.enrollment < b.enrollment) {
                return -1;
              }
              return 0;
            case "EnrollmentAscen":
              if (a.enrollment > b.enrollment) {
                return -1;
              }
              if (a.enrollment < b.enrollment) {
                return 1;
              }
              return 0;
            case "FirstNameDes":
              if (a.first_name > b.first_name) {
                return 1;
              }
              if (a.first_name < b.first_name) {
                return -1;
              }
              return 0;
            case "FirstNameAscen":
              if (a.first_name > b.first_name) {
                return -1;
              }
              if (a.first_name < b.first_name) {
                return 1;
              }
              return 0;
            case "LastNameDes":
              if (a.last_name > b.last_name) {
                return 1;
              }
              if (a.last_name < b.last_name) {
                return -1;
              }
              return 0;
            case "LastNameAscen":
              if (a.last_name > b.last_name) {
                return -1;
              }
              if (a.last_name < b.last_name) {
                return 1;
              }
              return 0;  
        }
          
      });
  }

}
