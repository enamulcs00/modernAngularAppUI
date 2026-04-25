import { createReducer, on } from '@ngrx/store';
import { createEntityAdapter } from '@ngrx/entity';
import { BaseModel } from '../models/general';
import { GenericActions } from './action';
import {  createInitialState } from './generic.state';

export const createGenericReducer = <T extends BaseModel>(actions: GenericActions<T>) => {
  const adapter = createEntityAdapter<T>();
  const initialState = createInitialState<T>();

  return createReducer(
    initialState,
    on(actions.load, state => ({ ...state, loading: true, error: null })),
    on(actions.loadSuccess, (state, { items }) => adapter.setAll(items, { ...state, loading: false, loaded: true })),
    on(actions.loadFailure, (state, { error }) => ({ ...state, loading: false, error })),

    on(actions.loadById, state => ({ ...state, loading: true, error: null })),
    on(actions.loadByIdSuccess, (state, { item }) => adapter.upsertOne(item, { ...state, loading: false })),
    on(actions.loadByIdFailure, (state, { error }) => ({ ...state, loading: false, error })),

    on(actions.create, state => ({ ...state, loading: true, error: null })),
    on(actions.createSuccess, (state, { item }) => adapter.addOne(item, { ...state, loading: false })),
    on(actions.createFailure, (state, { error }) => ({ ...state, loading: false, error })),

    on(actions.update, state => ({ ...state, loading: true, error: null })),
    on(actions.updateSuccess, (state, { item }) => adapter.updateOne({ id: item.id, changes: item }, { ...state, loading: false })),
    on(actions.updateFailure, (state, { error }) => ({ ...state, loading: false, error })),

    on(actions.delete, state => ({ ...state, loading: true, error: null })),
    on(actions.deleteSuccess, (state, { id }) => adapter.removeOne(id, { ...state, loading: false })),
    on(actions.deleteFailure, (state, { error }) => ({ ...state, loading: false, error })),

    on(actions.select, (state, { id }) => ({ ...state, selectedId: id })),
    on(actions.setSearchTerm, (state, { searchTerm }) => ({ ...state, searchTerm }))
  );
};
