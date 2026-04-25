import { Injectable, InjectionToken, Inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {  of } from 'rxjs';
import { map, catchError, exhaustMap, concatMap, tap } from 'rxjs/operators';
import { GenericActions } from 'src/app/core/ngrx-store/action';
import { ApiService } from '../_services/api.service';
import { BaseModel } from '../models/general';

export const FEATURE_ENDPOINTS = new InjectionToken<{ [feature: string]: string }>('FEATURE_ENDPOINTS');

export function createGenericEffects<T extends BaseModel>(actions: GenericActions<T>, featureName: string) {
  @Injectable()
  class GenericEffects {
    load$ = createEffect(() =>
      this.actions$.pipe(
        ofType(actions.load),
         tap(() => console.log('Effect triggered: Load categories', featureName,this.endpoints)),
        exhaustMap(() => {
          const endpoint = this.endpoints[featureName]; 
          if (!endpoint) {
            return of(actions.loadFailure({ error: 'Endpoint not configured for ' + featureName }));
          }
          return this.api.getAll(endpoint).pipe(
            map((res: any) => actions.loadSuccess({ items: res.data })),
            catchError((err: any) => of(actions.loadFailure({ error: err?.message || String(err) })))
          );
        })
      )
    );

    loadById$ = createEffect(() =>
      this.actions$.pipe(
        ofType(actions.loadById),
        exhaustMap((action: any) => {
          const endpoint = this.endpoints[featureName];
          if (!endpoint) {
            return of(actions.loadByIdFailure({ error: 'Endpoint not configured for ' + featureName }));
          }
          const url = endpoint.endsWith('/') ? endpoint + action.id : `${endpoint}/${action.id}`;
          return this.api.getById(action.id, url).pipe(
            map((res: any) => actions.loadByIdSuccess({ item: res.data })),
            catchError((err: any) => of(actions.loadByIdFailure({ error: err?.message || String(err) })))
          );
        })
      )
    );

    create$ = createEffect(() =>
      this.actions$.pipe(
        ofType(actions.create),
        concatMap((action: any) => {
          const endpoint = this.endpoints[featureName];
          if (!endpoint) {
            return of(actions.createFailure({ error: 'Endpoint not configured for ' + featureName }));
          }
          return this.api.createRecord(endpoint, action.item).pipe(
            map((res: any) => actions.createSuccess({ item: res.data })),
            catchError((err: any) => of(actions.createFailure({ error: err?.message || String(err) })))
          );
        })
      )
    );

    update$ = createEffect(() =>
      this.actions$.pipe(
        ofType(actions.update),
        concatMap((action: any) => {
          const endpoint = this.endpoints[featureName];
          if (!endpoint) {
            return of(actions.updateFailure({ error: 'Endpoint not configured for ' + featureName }));
          }
          const url = endpoint.endsWith('/') ? endpoint + action.item.id : `${endpoint}/${action.item.id}`;
          return this.api.updateRecord(url, action.item).pipe(
            map((res: any) => actions.updateSuccess({ item: res.data })),
            catchError((err: any) => of(actions.updateFailure({ error: err?.message || String(err) })))
          );
        })
      )
    );

    delete$ = createEffect(() =>
      this.actions$.pipe(
        ofType(actions.delete),
        concatMap((action: any) => {
          const endpoint = this.endpoints[featureName];
          if (!endpoint) {
            return of(actions.deleteFailure({ error: 'Endpoint not configured for ' + featureName }));
          }
          const url = endpoint.endsWith('/') ? endpoint + action.id : `${endpoint}/${action.id}`;
          return this.api.deleteRecord(url).pipe(
            map((res: any) => actions.deleteSuccess({ id: action.id })),
            catchError((err: any) => of(actions.deleteFailure({ error: err?.message || String(err) })))
          );
        })
      )
    );

    constructor(private actions$: Actions, private api: ApiService<T>, @Inject(FEATURE_ENDPOINTS) private endpoints: { [k: string]: string }) {}
  }

  return GenericEffects;
}
