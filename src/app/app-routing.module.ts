import {  NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './features/public/home/home.component';
import { authGuard } from './features/auth/guards/auth.guard';

const accountModule = () => import('./account/account-module/account.module').then(x => x.AccountModule);
const usersModule = () => import('./features/users/users.module').then(x => x.UsersModule);
const routes: Routes = [

  {
    path: '',
    component: HomeComponent
  },

{
  path: 'admin/categories',
  loadComponent: () =>
    import('./features/category/category-list/category-list.component')
      .then(m => m.CategoryListComponent),

},

  {
    path: 'admin/blogposts',
    loadComponent: () =>
      import('./features/blog-post/blogpost-list/blogpost-list.component')
        .then(m => m.BlogpostListComponent)
  },

  {
    path: 'admin/users',
    loadChildren: usersModule,
    canActivate: [authGuard]
  },

  {
    path: 'account',
    loadChildren: accountModule
  },

  {
    path: '**',
    redirectTo: ''
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
