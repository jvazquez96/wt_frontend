import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'dateFilter'
})
export class DateFilterPipe implements PipeTransform {

  transform(value: string): any {
    if (!value) return value;
    // d = new Date(value).toISOString() ---- 2018-04-25T19:13:26.085Z
    // value ---- 2018-04-25T14:13:26.085975
    let day = value.slice(8,10);
    let month = value.slice(5,7);
    let year = value.slice(0,4);
    let hour = value.slice(11,13);
    let minutes = value.slice(14,16);
    let d = year + '/' + day + '/' + month + ' ' + hour + ':' + minutes;
    return d;
  }

}
