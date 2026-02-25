import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-completed-todos',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="w-full max-w-2xl">
      <h2 class="text-2xl font-bold mb-4 text-green-400">Completed Tasks</h2>
      
      <div *ngIf="todos.length === 0" class="text-center text-gray-400 py-8">
        No completed tasks
      </div>

      <ul *ngIf="todos.length" class="space-y-3">
        <li *ngFor="let todo of todos" class="bg-gray-800 rounded-lg px-4 py-3 opacity-75">
          <div class="flex items-start justify-between mb-2">
            <div class="flex items-start gap-3 flex-1">
              <input type="checkbox" [checked]="todo.completed" (change)="onToggleCompleted(todo)"
                     class="accent-green-500 w-5 h-5 mt-1">
              <div class="flex-1">
                <div class="flex items-center gap-2">
                  <span [class.line-through]="todo.completed" class="text-lg font-semibold text-gray-400">{{ todo.title }}</span>
                  <span class="text-xs bg-green-600 text-white px-2 py-1 rounded">Completed</span>
                </div>
                <p *ngIf="todo.description" class="text-sm text-gray-500 mt-1">{{ todo.description }}</p>
                <p *ngIf="todo.due_date" class="text-sm text-gray-500 mt-1">📅 Due: {{ todo.due_date }}</p>
              </div>
            </div>
          </div>
          <div class="flex gap-2 justify-end">
            <button (click)="onEdit(todo)" class="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm">Edit</button>
            <button (click)="onDelete(todo)" class="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm">Delete</button>
          </div>
        </li>
      </ul>
    </div>
  `,
  styles: []
})
export class CompletedTodosComponent {
  @Input() todos: any[] = [];
  @Output() toggleCompleted = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();
  @Output() edit = new EventEmitter<any>();

  onToggleCompleted(todo: any) {
    this.toggleCompleted.emit(todo);
  }

  onEdit(todo: any) {
    this.edit.emit(todo);
  }

  onDelete(todo: any) {
    this.delete.emit(todo);
  }
}
