import { Component, OnInit } from '@angular/core';

import {
  trigger,
  state,
  style,
  transition,
  animate,
  group,
  animateChild,
  query
} from '@angular/animations';

import { faWindows } from '@fortawesome/free-brands-svg-icons';
import { faCloud, faUserAlt, faUserCircle, faUnlockAlt } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  animations: [
    trigger('flyIn', [
      state(
        'in',
        style({
          opacity: 1,
          transform: 'translateY(0)'
        })
      ),
      state(
        'out',
        style({
          opacity: 0,
          transform: 'translateY(-100%)'
        })
      ),
      transition('out => in', animate(200))
    ]),
    trigger('classicLogin', [
      state(
        'collapsed',
        style({
          height: '180px'
        })
      ),
      state(
        'expanded',
        style({
          height: '360px'
        })
      ),
      transition('collapsed => expanded', [
        style({ height: '180px' }),
        group([animate(200, style({ height: '360px' })), query('@loginForm', [animateChild()])])
      ]),
      transition('expanded => collapsed', animate(200))
    ]),
    trigger('loginForm', [
      transition(':enter', [style({ opacity: 0 }), animate('500ms 100ms', style({ opacity: 1 }))])
    ])
  ]
})
export class LoginComponent implements OnInit {
  flyIn = 'out';
  classicLogin = 'collapsed';
  loginForm = 'hide';

  faWindows = faWindows;
  faCloud = faCloud;
  faUserAlt = faUserAlt;
  faUserCircle = faUserCircle;
  faLock = faUnlockAlt;

  userName: string;
  password: string;

  constructor() {}

  ngOnInit() {
    setTimeout(() => {
      this.flyIn = 'in';
    }, 800);
  }

  onClassicLogin() {
    this.classicLogin = this.classicLogin === 'collapsed' ? 'expanded' : 'collapsed';
    this.loginForm = this.loginForm === 'hide' ? 'show' : 'hide';
  }
}
