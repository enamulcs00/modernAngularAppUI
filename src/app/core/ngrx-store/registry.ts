import { Category, Product, Student, User } from '../models/general';
import { BlogPost } from 'src/app/features/blog-post/models/blog-post.model';
import { BaseModel } from '../models/general';

export interface EntityConfig<T extends BaseModel> {
  model: new () => T;   // constructor type
  endpoint: string;
}

export const ENTITY_REGISTRY: Record<string, EntityConfig<BaseModel>> = {
  categories: { model: Category, endpoint: '/api/categories' },
  products: { model: Product, endpoint: '/api/products' },
  students: { model: Student, endpoint: '/api/students' },
  users: { model: User, endpoint: '/api/users' },
  blogPost: { model: BlogPost, endpoint: '/api/blogposts' }
};
