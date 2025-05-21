import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Message } from '../models/message.model';

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    currentPage: number;
    limit: number;
    totalPages: number;
  };
}

@Injectable({ providedIn: 'root' })
export class MessageService {
  private apiUrl = `${environment.apiUrl}/messages`;

  constructor(private http: HttpClient) {}

  getMessages(
    page: number = 1,
    limit: number = 10,
    sortBy?: string,
    sortOrder?: 'asc' | 'desc',
    filters?: any
  ): Observable<PaginatedResponse<Message>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    if (sortBy) params = params.set('sortBy', sortBy);
    if (sortOrder) params = params.set('sortOrder', sortOrder);
    if (filters) {
      if (filters.search) params = params.set('search', filters.search);
      if (filters.partner_id) params = params.set('partner_id', filters.partner_id);
    }
    return this.http.get<PaginatedResponse<Message>>(this.apiUrl, { params });
  }

  getMessage(id: number): Observable<Message> {
    return this.http.get<Message>(`${this.apiUrl}/${id}`);
  }

  createMessage(message: Partial<Message>): Observable<Message> {
    return this.http.post<Message>(this.apiUrl, message);
  }

  updateMessage(id: number, message: Partial<Message>): Observable<Message> {
    return this.http.put<Message>(`${this.apiUrl}/${id}`, message);
  }

  deleteMessage(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
} 