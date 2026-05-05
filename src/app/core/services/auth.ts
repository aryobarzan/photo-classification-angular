import { inject, Injectable, Injector, signal } from '@angular/core';
import { z } from 'zod';
import { environment } from '../../../environments/environment';
import { UserService } from './user';

// Expected response format for login and registration endpoints
const LoginResponseSchema = z.object({
  access_token: z.string(),
  user: z.object({
    id: z.number(),
    username: z.string(),
    role: z.string(),
  }),
});

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  token: string | null = null;
  userId: number | null = null;
  username: string | null = null;
  userRole: string | null = null;

  isLoggedIn = signal(false);
  isAdmin = signal(false);

  private injector = inject(Injector);

  constructor() {
    // Load token and user info from local storage if available
    const storedToken = localStorage.getItem('token');
    const storedUserId = localStorage.getItem('userId');
    const storedUsername = localStorage.getItem('username');
    const storedUserRole = localStorage.getItem('userRole');

    if (storedToken) {
      this.token = storedToken;
      this.isLoggedIn.set(true);
    }
    if (storedUserId) {
      this.userId = parseInt(storedUserId, 10);
    }
    if (storedUsername) {
      this.username = storedUsername;
    }
    if (storedToken && storedUserRole) {
      this.userRole = storedUserRole;
      this.isAdmin.set(this.userRole === 'admin');
    }
  }

  async register(username: string, password: string): Promise<boolean> {
    return this.loginRegister(username, password, true);
  }

  async login(username: string, password: string): Promise<boolean> {
    return this.loginRegister(username, password, false);
  }
  // Endpoint used for both login and registration.

  private async loginRegister(
    username: string,
    password: string,
    isRegistering: boolean,
  ): Promise<boolean> {
    // form data
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    // send request to /users/login or /users/register based on isRegistering flag
    const response = await fetch(
      `${environment.apiUrl}users/${isRegistering ? 'register' : 'login'}`,
      {
        method: 'POST',
        body: formData,
      },
    );

    if (response.ok) {
      const data = await response.json();
      // check if response body matches expected format
      const parsedData = LoginResponseSchema.safeParse(data);
      if (!parsedData.success) {
        return false;
      }

      this.token = parsedData.data.access_token;
      this.userId = parsedData.data.user.id;
      this.username = parsedData.data.user.username;
      this.userRole = parsedData.data.user.role;
      // Save token and user info to local storage
      localStorage.setItem('token', this.token);
      localStorage.setItem('userId', this.userId.toString());
      localStorage.setItem('username', this.username);
      localStorage.setItem('userRole', this.userRole);

      this.isLoggedIn.set(true);
      this.isAdmin.set(this.userRole === 'admin');
      if (!isRegistering) {
        // Fetch user profile
        this.injector.get(UserService).fetchUserProfile();
      }
      return true;
    } else {
      return false;
    }
  }

  logout(): void {
    this.token = null;
    this.userId = null;
    this.username = null;
    this.userRole = null;
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    localStorage.removeItem('userRole');
    this.isLoggedIn.set(false);
    this.isAdmin.set(false);
  }
}
