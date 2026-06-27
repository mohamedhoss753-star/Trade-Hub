import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class BaseApiService {

  protected http = inject(HttpClient);
  protected baseUrl = environment.baseUrl;

  // ================= AUTH HEADER =================
  private getHeaders(): HttpHeaders {
    const token = typeof window !== 'undefined'
      ? localStorage.getItem('token')
      : null;

    return new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : ''
    });
  }

  // ================= URL BUILDER =================
  private buildUrl(endpoint: string): string {
    return `${this.baseUrl}/${endpoint}`;
  }

  // ================= GET =================
  get<T>(endpoint: string, params?: any) {

    let httpParams = new HttpParams();

    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
          httpParams = httpParams.set(key, params[key]);
        }
      });
    }

    return this.http.get<T>(this.buildUrl(endpoint), {
      params: httpParams,
      headers: this.getHeaders()
    });
  }

  // ================= POST =================
  post<T>(endpoint: string, body: any) {
    return this.http.post<T>(this.buildUrl(endpoint), body, {
      headers: this.getHeaders()
    });
  }

  // ================= PUT =================
  put<T>(endpoint: string, body: any) {
    return this.http.put<T>(this.buildUrl(endpoint), body, {
      headers: this.getHeaders()
    });
  }

  // ================= DELETE =================
  delete<T>(endpoint: string) {
    return this.http.delete<T>(this.buildUrl(endpoint), {
      headers: this.getHeaders()
    });
  }
}