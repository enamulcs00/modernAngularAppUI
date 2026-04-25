import { ActionReducerMap } from '@ngrx/store';
import { createGenericActions, GenericActions } from './action';
import { GenericState } from './generic.state';
import { createGenericReducer } from './reducer';
import { BlogPost } from 'src/app/features/blog-post/models/blog-post.model';
import { BaseModel, Category, Product, Student, User } from '..';
import { ENTITY_REGISTRY } from './registry';

// Strongly typed AppState for known entities
export interface AppState {
  categories: GenericState<Category>;
  products: GenericState<Product>;
  students: GenericState<Student>;
  users: GenericState<User>;
  blogPost: GenericState<BlogPost>;
}

// Explicit actions for each entity (strict typing)
export const categoryActions = createGenericActions<Category>('categories');
export const productActions = createGenericActions<Product>('products');
export const studentActions = createGenericActions<Student>('students');
export const userActions = createGenericActions<User>('users');
export const blogPostActions = createGenericActions<BlogPost>('blogPost');

// Explicit reducers for each entity
export const reducers: ActionReducerMap<AppState> = {
  categories: createGenericReducer<Category>(categoryActions),
  products: createGenericReducer<Product>(productActions),
  students: createGenericReducer<Student>(studentActions),
  users: createGenericReducer<User>(userActions),
  blogPost: createGenericReducer<BlogPost>(blogPostActions),
};

// Generic dynamic map for future entities via ENTITY_REGISTRY
export const actionsMap: Record<string, GenericActions<BaseModel>> = {};
export const dynamicReducers: ActionReducerMap<{ [key: string]: GenericState<BaseModel> }> = {};

(Object.keys(ENTITY_REGISTRY) as (keyof typeof ENTITY_REGISTRY)[]).forEach(key => {
  const actions = createGenericActions<BaseModel>(key);
  actionsMap[key] = actions;
  dynamicReducers[key] = createGenericReducer<BaseModel>(actions);
});
