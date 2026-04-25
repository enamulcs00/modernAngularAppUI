import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, isDevMode } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { MarkdownModule } from 'ngx-markdown';
import { ToastrModule } from 'ngx-toastr';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { categoryActions, productActions, studentActions, userActions, blogPostActions, reducers } from 'src/app/core/ngrx-store';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpService, ApiService, StoreRepoService, AuthInterceptor, ErrorHandlerInterceptor } from './core';
import { NavbarComponent } from './core/components/navbar/navbar.component';
import { RefreshTokenInterceptor } from './core/interceptors/refresh-token.interceptor';
import { createGenericEffects, FEATURE_ENDPOINTS } from './core/ngrx-store/effect';
import { BlogpostListComponent } from './features/blog-post/blogpost-list/blogpost-list.component';
import { CategoryListComponent } from './features/category/category-list/category-list.component';

const CategoriesEffects = createGenericEffects(categoryActions, 'categories');
const ProductsEffects = createGenericEffects(productActions, 'products');
const StudentsEffects = createGenericEffects(studentActions, 'students');
const UsersEffects = createGenericEffects(userActions, 'users');
const BlogPostsEffects = createGenericEffects(blogPostActions, 'blogPost');

@NgModule({
  declarations: [AppComponent, NavbarComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MarkdownModule.forRoot(),
    NgxUiLoaderModule,
    ToastrModule.forRoot({
      timeOut: 5000,
      preventDuplicates: true,
    }),
    StoreModule.forRoot(reducers),
    EffectsModule.forRoot([CategoriesEffects, ProductsEffects, StudentsEffects, UsersEffects, BlogPostsEffects]),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: !isDevMode() }),
    BlogpostListComponent,
    CategoryListComponent
  ],
  providers: [
    HttpService,
    ApiService,
    StoreRepoService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorHandlerInterceptor,
      multi: true
    },
    { provide: HTTP_INTERCEPTORS, useClass: RefreshTokenInterceptor, multi: true },
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimations(),
    {
      provide: FEATURE_ENDPOINTS,
      useValue: {
        categories: '/api/categories',
        products: '/api/products',
        students: '/api/students',
        users: '/api/users',
        blogPost: '/api/blogposts'
      }
    }
  ]
})
export class AppModule {}
