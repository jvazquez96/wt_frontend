import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterProblems'
})
export class FilterProblemsPipe implements PipeTransform {

    transform(items: any[], args:string, preserveFormat:boolean): any {

        let ans = [];
        for (let k in items ){
            if((items[k].name?items[k].name.match('^.*' + args +'.*$'):null)
            || (items[k].topic?items[k].topic.match('^.*' + args +'.*$'):null)
            || (items[k].difficulty == +args )
            || (items[k].active == true &&args == "true" )
            || (items[k].active == false &&args == "false" )){
               if(preserveFormat ){
                    ans.push(items[k]);
                }else{
                    ans.push({key: k, value: items[k]});
                }
                  
            }
        }
        return ans;
    }

}
