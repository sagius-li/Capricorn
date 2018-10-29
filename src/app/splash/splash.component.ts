import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';
import { map, switchMap, tap, delay } from 'rxjs/operators';

import { StartupService } from '../core/services/startup.service';
import { ConfigService } from '../core/services/config.service';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.component.html',
  styleUrls: ['./splash.component.css']
})
export class SplashComponent implements OnInit, OnDestroy {
  sub: Subscription;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private startup: StartupService,
    private config: ConfigService
  ) {}

  ngOnInit() {
    this.sub = this.route.queryParams
      .pipe(
        delay(2000),
        map(params => params['path']),
        switchMap((path: string) => {
          return this.startup.start().pipe(
            tap(() => {
              if (String(this.config.getEnv('testPageOnly', '')).toLowerCase() === 'true') {
                this.router.navigate(['/test']);
              } else {
                if (!path || path === '/test') {
                  this.router.navigate(['/app']);
                } else {
                  this.router.navigate([path]);
                }
              }
            })
          );
        })
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
