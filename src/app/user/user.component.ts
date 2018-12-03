import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  currentObjectId: string;

  constructor(private route: ActivatedRoute) {
    route.params.subscribe(val => {
      this.currentObjectId = this.route.snapshot.paramMap.get('id');
    });
  }

  ngOnInit() {}
}
