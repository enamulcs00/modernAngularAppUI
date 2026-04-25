import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { BaseModel } from '../models/general';

export interface GenericState<T extends BaseModel> extends EntityState<T> {
  loading: boolean;
  loaded: boolean;
  error: string | null;
  selectedId: string | null;
  searchTerm: string;
}

export const createInitialState = <T extends BaseModel>(): GenericState<T> => {
  const adapter = createEntityAdapter<T>();
  return adapter.getInitialState({
    loading: false,
    loaded: false,
    error: null,
    selectedId: null,
    searchTerm: ''
  });
};
