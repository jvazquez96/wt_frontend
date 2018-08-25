import { Component, Output, OnInit, ViewChild, ElementRef } from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import { GroupsService } from '../../services/groups.service';
import { StatisticsService } from '../../services/statistics.service';

@Component({
    selector: 'admin',
    templateUrl: './admin-home.component.html',
    styleUrls: ['../../../styles/general-styles.css', './admin-home.component.css']
})

export class AdminHomeComponent implements OnInit {

    @Output() selectedTab : string;
    userRole: string;

    constructor(private _route : ActivatedRoute) {
    }

    ngOnInit() {
        this.userRole = JSON.parse(localStorage['userJson'])['role'];
        this._route.params.subscribe(event => {
            // Get tab parameter
            let tab = event['tab'];

            // console.log("tab nueva: " + tab);
            
            this.selectedTab = tab;
        });
    }


}
