import { Component, OnInit } from '@angular/core';

import { trigger, state, style, transition, animate } from '@angular/animations';

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
      transition('collapsed <=> expanded', animate(200))
    ])
  ]
})
export class LoginComponent implements OnInit {
  flyIn = 'out';
  classicLogin = 'collapsed';

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
  }
}
