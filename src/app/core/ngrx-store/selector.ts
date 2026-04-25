import { createFeatureSelector, createSelector } from '@ngrx/store';
import { createEntityAdapter } from '@ngrx/entity';
import { BaseModel } from '../models/general';
import { GenericState } from './generic.state';

export const createGenericSelectors = <T extends BaseModel>(featureName: string) => {
  const adapter = createEntityAdapter<T>();
  const getFeatureState = createFeatureSelector<GenericState<T>>(featureName);
  const { selectAll, selectEntities, selectIds } = adapter.getSelectors(getFeatureState);

  const selectLoading = createSelector(getFeatureState, s => s.loading);
  const selectLoaded = createSelector(getFeatureState, s => s.loaded);
  const selectError = createSelector(getFeatureState, s => s.error);
  const selectSearchTerm = createSelector(getFeatureState, s => s.searchTerm);
  const selectSelected = createSelector(getFeatureState, s => (s.selectedId ? s.entities[s.selectedId] : null));
  const selectById = (id: string) => createSelector(selectEntities, entities => entities[id]);
  const selectSearchResults = createSelector(selectAll, selectSearchTerm, (items: T[], searchTerm: string) => {
    if (!searchTerm) return items;
    const lower = searchTerm.toLowerCase();
    return items.filter((item: T) =>
      Object.values(item).some((v: unknown) =>
        typeof v === 'string' ? v.toLowerCase().includes(lower) :
        typeof v === 'number' ? v.toString().includes(lower) : false
      )
    );
  });
  const selectHasData = createSelector(selectIds, ids => ids.length > 0);

  return {
    selectAll,
    selectEntities,
    selectLoading,
    selectLoaded,
    selectById,
    selectError,
    selectSelected,
    selectSearchTerm,
    selectSearchResults,
    selectHasData
  };
};
