import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable, combineLatest, take } from "rxjs";
import { RootReducerState } from "src/app/store/reducers";
import { BaseModel, IGetApi, IPayloadApi } from "../models/general";
import { GenericActions } from "../ngrx-store/action";
import { createGenericSelectors } from "../ngrx-store/selector";

@Injectable()
export class StoreRepoService<T extends BaseModel> {
  constructor(private store: Store<RootReducerState>) {}

  getAll(param: IGetApi<T>): Observable<T[]> {
    const selector = createGenericSelectors<T>(param.featureName);
    const hasData$ = this.store.select(selector.selectHasData);
    combineLatest([hasData$]).pipe(take(1)).subscribe((data) => {
      if (!data[0] || param.force) {
        this.store.dispatch(param.actionName.load());
      }
    });
    return this.store.select(selector.selectAll);
  }

  getRecordById(param: IGetApi<T>, id: string): Observable<T> {
    const selector = createGenericSelectors<T>(param.featureName);
    const entity$ = this.store.select(selector.selectById(id));
    entity$.pipe(take(1)).subscribe(res => {
      if (param.force || !res) {
        this.store.dispatch(param.actionName.loadById({ id }));
      }
    });
    return entity$;
  }

  add(param: IPayloadApi<T>): void {
    this.store.dispatch(param.actionName.create({ item: param.payload }));
  }

  update(param: IPayloadApi<T>, id?: string): void {
    this.store.dispatch(param.actionName.update({ item: param.payload }));
  }

  delete(id: string, action: GenericActions<T>): void {
    this.store.dispatch(action.delete({ id }));
  }
}
