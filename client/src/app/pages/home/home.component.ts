import { AuthService } from '../../services/auth.service';
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { ApiService } from '../../services/api';
import { InProgressTodosComponent } from './in-progress-todos.component';
import { CompletedTodosComponent } from './completed-todos.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, InProgressTodosComponent, CompletedTodosComponent],
  templateUrl: './home.html',
  styleUrl: './home.css',
})

export class HomeComponent implements OnInit, OnDestroy {
  todos: any[] = [];
  filteredTodos: any[] = [];
  inProgressTodos: any[] = [];
  completedTodos: any[] = [];
  searchQuery = '';
  loading = false;
  error = '';
  success = '';
  showModal = false;
  showEditModal = false;
  editingTodo: any = null;

  // Modal form data
  formData = {
    title: '',
    description: '',
    due_date: ''
  };

  // Edit form data
  editFormData = {
    title: '',
    description: '',
    due_date: ''
  };

  private authSub?: Subscription;
  private routerSub?: Subscription;

  constructor(public auth: AuthService, private api: ApiService, private router: Router, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    // Check if already authenticated and fetch todos immediately
    if (this.auth.isAuthenticated()) {
      this.fetchTodos();
    }

    // Subscribe to auth changes for future updates
    this.authSub = this.auth.isAuthenticated$.subscribe(isAuth => {
      if (isAuth) {
        this.fetchTodos();
      } else {
        this.todos = [];
      }
    });

    this.routerSub = this.router.events?.subscribe(() => {
      if (window.history.state.refreshTodos) {
        this.fetchTodos();
        window.history.replaceState({}, '');
      }
    });
  }

  ngOnDestroy() {
    this.authSub?.unsubscribe();
    this.routerSub?.unsubscribe();
  }

  fetchTodos() {
    this.loading = true;
    const userId = this.getUserId();
    if (!userId) {
      this.error = 'User ID not found';
      this.loading = false;
      this.cdr.markForCheck();
      return;
    }
    this.api.getTodos(userId).subscribe({
      next: (todos) => {
        this.todos = todos;
        this.filteredTodos = todos;
        this.loading = false;
        this.error = '';
        this.separateTodos();
        this.cdr.markForCheck();
      },
      error: () => {
        this.error = 'Failed to load todos';
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  openModal() {
    this.showModal = true;
    this.formData = { title: '', description: '', due_date: '' };
    this.cdr.markForCheck();
  }

  closeModal() {
    this.showModal = false;
    this.formData = { title: '', description: '', due_date: '' };
    this.cdr.markForCheck();
  }

  addTodoFromModal() {
    if (!this.formData.title.trim()) {
      this.error = 'Title is required';
      this.cdr.markForCheck();
      return;
    }

    const userId = this.getUserId();
    if (!userId) {
      this.error = 'User ID not found';
      return;
    }

    this.api.createTodo(
      this.formData.title,
      this.formData.description,
      this.formData.due_date,
      userId
    ).subscribe({
      next: (todo) => {
        this.todos.unshift(todo);
        this.filterTodos();
        this.success = 'Todo created!';
        this.error = '';
        this.cdr.markForCheck();
        this.closeModal();
        setTimeout(() => (this.success = ''), 1500);
      },
      error: () => {
        this.error = 'Failed to create todo';
        this.cdr.markForCheck();
      }
    });
  }

  filterTodos() {
    if (!this.searchQuery.trim()) {
      this.filteredTodos = this.todos;
    } else {
      this.filteredTodos = this.todos.filter(todo =>
        todo.title.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
    this.separateTodos();
    this.cdr.markForCheck();
  }

  separateTodos() {
    this.inProgressTodos = this.filteredTodos.filter(todo => !todo.completed);
    this.completedTodos = this.filteredTodos.filter(todo => todo.completed);
  }

  onSearchChange() {
    this.filterTodos();
  }

  deleteTodo(todo: any) {
    const userId = this.getUserId();
    if (!userId) {
      this.error = 'User ID not found';
      return;
    }
    this.api.deleteTodo(todo.id, userId).subscribe({
      next: () => {
        this.todos = this.todos.filter(t => t.id !== todo.id);
        this.filterTodos();
        this.success = 'Todo deleted!';
        this.cdr.markForCheck();
        setTimeout(() => (this.success = ''), 1500);
      },
      error: (err) => {
        this.error = err?.error?.message || 'Failed to delete todo';
        this.cdr.markForCheck();
      }
    });
  }

  toggleCompleted(todo: any) {
    const userId = this.getUserId();
    if (!userId) {
      this.error = 'User ID not found';
      return;
    }
    this.api.updateTodo(todo.id, !todo.completed, todo.title, userId).subscribe({
      next: (updated: any) => {
        todo.completed = updated.completed;
        this.filterTodos();
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.error = err?.error?.message || 'Failed to update todo';
        this.cdr.markForCheck();
      }
    });
  }

  openEditModal(todo: any) {
    this.editingTodo = todo;
    this.editFormData = {
      title: todo.title,
      description: todo.description || '',
      due_date: todo.due_date || ''
    };
    this.showEditModal = true;
    this.cdr.markForCheck();
  }

  closeEditModal() {
    this.showEditModal = false;
    this.editingTodo = null;
    this.editFormData = { title: '', description: '', due_date: '' };
    this.cdr.markForCheck();
  }

  saveEditTodo() {
    if (!this.editFormData.title.trim()) {
      this.error = 'Title is required';
      this.cdr.markForCheck();
      return;
    }

    const userId = this.getUserId();
    if (!userId) {
      this.error = 'User ID not found';
      return;
    }

    this.api.editTodo(
      this.editingTodo.id,
      this.editFormData.title,
      this.editFormData.description,
      this.editFormData.due_date,
      userId
    ).subscribe({
      next: (updated: any) => {
        const index = this.todos.findIndex(t => t.id === this.editingTodo.id);
        if (index !== -1) {
          this.todos[index] = updated;
        }
        this.filterTodos();
        this.success = 'Todo updated!';
        this.error = '';
        this.cdr.markForCheck();
        this.closeEditModal();
        setTimeout(() => (this.success = ''), 1500);
      },
      error: () => {
        this.error = 'Failed to update todo';
        this.cdr.markForCheck();
      }
    });
  }

  // store id from payload
  getUserId(): number | null {
    const token = localStorage.getItem('auth_token');
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.id;
    } catch {
      return null;
    }
  }

  logout() {
    this.auth.logout();
    this.todos = [];
    this.success = '';
    this.error = '';
    this.router.navigate(['/login']);
  }
}
