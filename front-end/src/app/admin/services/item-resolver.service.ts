import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { ItemService } from './item.service';

/**
 * Service for item resolver service.
 */
@Injectable({
  providedIn: 'root'
})
export class ItemResolverService implements Resolve<Observable<any>> {
  /**@ignore */
  constructor(private itemService: ItemService) { }
  /**
   * Function for router resolver.
   * @returns {Observable}
   */
  resolve() {
    return this.itemService.getAllItems();
  }
}
