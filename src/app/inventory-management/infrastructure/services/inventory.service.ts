import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { InventoryResponse } from '../responses/inventory-response.response';

@Injectable({ providedIn: 'root' })
export class InventoryService {
  private readonly http = inject(HttpClient);
  private resourcePath = `${environment.apiBaseUrl}/inventories`;

  getAll():Observable<InventoryResponse[]>{
    return this.http.get<InventoryResponse[]>(this.resourcePath)
  }
}
