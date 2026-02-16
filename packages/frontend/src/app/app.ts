import { Component, inject, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiResponse, User } from '@rs-tandem/shared';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  private http = inject(HttpClient);

  protected users = signal<User[]>([]);
  protected loading = signal(true);
  protected error = signal<string | null>(null);

  ngOnInit() {
    this.http.get<ApiResponse<User[]>>('/api/users').subscribe({
      next: (response) => {
        if (response.success) {
          this.users.set(response.data);
        } else {
          this.error.set(response.message ?? 'Failed to load users');
        }
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to connect to the API');
        this.loading.set(false);
      },
    });
  }
}
