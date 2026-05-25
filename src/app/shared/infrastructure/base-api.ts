import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export abstract class BaseApi {
  protected http: HttpClient = inject(HttpClient);
  protected readonly baseUrl: string = environment.apiBaseUrl;

  protected get<T>(url: string): Observable<T> {
    return this.http.get<T>(url);
  }

  protected post<T>(url: string, body: unknown): Observable<T> {
    return this.http.post<T>(url, body);
  }

  protected put<T>(url: string, body: unknown): Observable<T> {
    return this.http.put<T>(url, body);
  }

  protected delete<T>(url: string): Observable<T> {
    return this.http.delete<T>(url);
  }
}
