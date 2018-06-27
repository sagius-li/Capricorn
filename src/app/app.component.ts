import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private http: HttpClient) {
    this.http
      .get('//localhost:6867/api/generic/version')
      .subscribe(
        data => {
          const i = 0;
        },
        err => {
          const j = 0;
        }
      );
  }
  title = 'app';
}
