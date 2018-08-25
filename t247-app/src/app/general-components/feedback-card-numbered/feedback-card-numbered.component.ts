import { Component, OnInit, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'feedback-card-numbered',
  templateUrl: './feedback-card-numbered.component.html',
  styleUrls: ['./feedback-card-numbered.component.css']
})
export class FeedbackCardNumberedComponent implements OnInit {

  private content:string;
  @Input() index: number;

    constructor() {
    }

    ngOnInit() {
        // this.index = 0;
        let success: string = "success-feedback" + this.index;
        let error: string = "error-feedback" + this.index;
        document.getElementById(success).style.display = "none";
        document.getElementById(error).style.display = "none";
    }

    fade(element) {
        var op = 1;  // initial opacity
        var timer = setInterval(function () {
            if (op <= 0.1){
                clearInterval(timer);
                element.style.display = 'none';
            }
            element.style.opacity = (op).toString();
            element.style.filter = 'alpha(opacity=' + op * 100 + ")";
            op -= op * 0.1; // control how it disappears
        }, 50); // time showed
    }

    hideFeedbackCard(type:string, message:string) {

        this.content = message;
        let success: string = "success-feedback" + this.index;
        let error: string = "error-feedback" + this.index;

        if (type == "success") {
            document.getElementById(success).style.display = "block";
            var element = document.getElementById(success);
        } else {
            document.getElementById(error).style.display = "block";
            var element = document.getElementById(error);
        }
        window.setTimeout(() =>{
            this.fade(element);
        }, 5000);
        element.style.opacity = "1";
        element.style.filter = 'alpha(opacity=1)';

    }
}
