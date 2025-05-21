import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { PaginatedResponse } from '../../../shared/types/pagination.types';
import { Partner } from '../models/partner.model';

export interface PartnerFilters {
  alias?: string;
  type?: string;
  direction?: 'INBOUND' | 'OUTBOUND';
  processed_flow_type?: 'MESSAGE' | 'ALERTING' | 'NOTIFICATION';
}

@Injectable({
  providedIn: 'root'
})
export class PartnerService {
  private apiUrl = `${environment.apiUrl}/partners`;

  constructor(private http: HttpClient) {}

  getPartners(
    page: number = 1,
    limit: number = 10,
    sortBy: string = 'alias',
    sortOrder: 'ASC' | 'DESC' = 'ASC',
    filters: PartnerFilters = {}
  ): Observable<PaginatedResponse<Partner>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('sortBy', sortBy)
      .set('sortOrder', sortOrder);

    // Ajouter les filtres
    if (filters.alias) {
      params = params.set('alias', filters.alias);
    }
    if (filters.type) {
      params = params.set('type', filters.type);
    }
    if (filters.direction) {
      params = params.set('direction', filters.direction);
    }
    if (filters.processed_flow_type) {
      params = params.set('processed_flow_type', filters.processed_flow_type);
    }

    return this.http.get<PaginatedResponse<Partner>>(this.apiUrl, { params });
  }

  getPartner(id: number): Observable<{ data: Partner }> {
    return this.http.get<{ data: Partner }>(`${this.apiUrl}/${id}`);
  }

  createPartner(partner: Partial<Partner>): Observable<{ data: Partner }> {
    return this.http.post<{ data: Partner }>(this.apiUrl, partner);
  }

  updatePartner(id: number, partner: Partial<Partner>): Observable<{ data: Partner }> {
    return this.http.put<{ data: Partner }>(`${this.apiUrl}/${id}`, partner);
  }

  deletePartner(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
} 