import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';
import { map, switchMap, tap, subscribeOn } from 'rxjs/operators';

import { StartupService } from '../core/services/startup.service';

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
    private startup: StartupService
  ) {}

  ngOnInit() {
    this.sub = this.route.queryParams
      .pipe(
        map(params => params['path']),
        switchMap((path: string) => {
          return this.startup.start().pipe(
            tap(() => {
              if (path) {
                this.router.navigate([path]);
              } else {
                this.router.navigate(['/app']);
              }
            })
          );
        })
      )
      .subscribe();

    // this.sub = this.route.queryParams.subscribe(params => {
    //   const path = params['path'];
    //   if (path) {
    //     this.startup.start().subscribe(() => {
    //       this.router.navigate([path]);
    //     });
    //   } else {
    //     this.startup.start().subscribe(() => {
    //       this.router.navigate(['/app']);
    //     });
    //   }
    // });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
