import { NgModule } from '@angular/core';
import { Routes, RouterModule, Router, RouterEvent } from '@angular/router';

import { SplashComponent } from './splash/splash.component';
import { TestComponent } from './test/test.component';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
    children: []
  },
  {
    path: 'splash',
    component: SplashComponent,
    children: []
  },
  // {
  //   path: '',
  //   component: SplashComponent,
  //   children: []
  // },
  {
    path: 'test',
    component: TestComponent,
    children: []
  },
  {
    path: 'app',
    component: HomeComponent,
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        component: DashboardComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
  constructor(private router: Router) {
    this.router.events.subscribe((event: RouterEvent) => {});
  }
}
