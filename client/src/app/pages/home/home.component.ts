import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ApiService } from '../../services/api';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class HomeComponent {
  todos: any[] = [];
  newTitle = '';
  loading = false;
  error = '';
  success = '';

  constructor(public auth: AuthService, private api: ApiService) {
    this.fetchTodos();
  }

  fetchTodos() {
    this.loading = true;
    this.api.getTodos().subscribe({
      next: (todos) => {
        this.todos = todos;
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.error?.message || 'Failed to load todos';
        this.loading = false;
      }
    });
  }

  addTodo() {
    if (!this.newTitle.trim()) return;
    this.api.createTodo(this.newTitle).subscribe({
      next: (todo) => {
        this.todos.unshift(todo);
        this.newTitle = '';
        this.success = 'Todo created!';
        setTimeout(() => (this.success = ''), 1500);
      },
      error: (err) => {
        this.error = err?.error?.message || 'Failed to create todo';
      }
    });
  }

  deleteTodo(todo: any) {
    this.api.deleteTodo(todo.id).subscribe({
      next: () => {
        this.todos = this.todos.filter(t => t.id !== todo.id);
        this.success = 'Todo deleted!';
        setTimeout(() => (this.success = ''), 1500);
      },
      error: (err) => {
        this.error = err?.error?.message || 'Failed to delete todo';
      }
    });
  }

  toggleCompleted(todo: any) {
    this.api.updateTodo(todo.id, !todo.completed).subscribe({
      next: (updated) => {
        todo.completed = updated.completed;
      },
      error: (err) => {
        this.error = err?.error?.message || 'Failed to update todo';
      }
    });
  }

  logout() {
    this.auth.logout();
  }
}
