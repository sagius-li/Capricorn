import { Component, OnInit } from '@angular/core';

import { faWindows } from '@fortawesome/free-brands-svg-icons';
import { faCloud, faUserAlt } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  faWindows = faWindows;
  faCloud = faCloud;
  faUserAlt = faUserAlt;

  constructor() {}

  ngOnInit() {}
}
