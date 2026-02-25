import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private base = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  get<T>(path: string): Observable<T> {
    return this.http.get<T>(`${this.base}${path}`);
  }

  post<T>(path: string, body: any): Observable<T> {
    return this.http.post<T>(`${this.base}${path}`, body);
  }

  put<T>(path: string, body: any): Observable<T> {
    return this.http.put<T>(`${this.base}${path}`, body);
  }

  delete<T>(path: string): Observable<T> {
    return this.http.delete<T>(`${this.base}${path}`);
  }

  // Convenience methods for auth
  login(body: { email: string; password: string }) {
    return this.post('/auth/login', body);
  }

  register(body: { name?: string; email: string; password: string }) {
    return this.post('/auth/register', body);
  }

  // Todos API
  getTodos(userId?: number) {
    return this.get<any[]>(`/todos?userId=${userId}`);
  }

  createTodo(title: string, description?: string, due_date?: string, userId?: number) {
    return this.post('/todos', { title, description, due_date, userId });
  }

  deleteTodo(id: number, userId?: number) {
    // Send userId in body for DELETE
    return this.http.request('delete', `${this.base}/todos/${id}`, { body: { userId } });
  }

  // toggle completed and incomplete
  updateTodo(id: number, completed: boolean, title: string, userId?: number) {
    return this.put(`/todos/${id}`, { completed, userId, title });
  }

  // Edit todo with all fields
  editTodo(id: number, title: string, description?: string, due_date?: string, userId?: number) {
    return this.put(`/todos/${id}`, { title, description, due_date, userId });
  }
}