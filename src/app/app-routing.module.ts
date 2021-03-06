import { NgModule } from '@angular/core';
import { Routes, RouterModule, Router, RouterEvent } from '@angular/router';

import { SplashComponent } from './splash/splash.component';
import { TestComponent } from './test/test.component';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { UserComponent } from './user/user.component';
import { AdalGuard } from 'adal-angular4';

const routes: Routes = [
  {
    path: 'login',
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
      },
      {
        path: 'user/:id',
        component: UserComponent
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
