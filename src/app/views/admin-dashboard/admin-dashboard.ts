import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from '../../core/services/admin';
import { UserProfile } from '../../core/schemas/user';
import { COUNTRIES } from '../../core/data/countries';

type SortKey = keyof Pick<
  UserProfile,
  'first_name' | 'last_name' | 'age' | 'gender' | 'country_of_origin' | 'place_of_residence'
>;

@Component({
  selector: 'app-admin-dashboard',
  imports: [],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard {
  adminService = inject(AdminService);
  router = inject(Router);

  readonly pageSize = 10;
  page = signal(0);
  sortKey = signal<SortKey>('last_name');
  sortAsc = signal(true);

  sorted = computed(() => {
    const profiles = this.adminService.userProfiles() ?? [];
    const key = this.sortKey();
    const asc = this.sortAsc() ? 1 : -1;
    return [...profiles].sort((a, b) => {
      const av = a[key] ?? '';
      const bv = b[key] ?? '';
      return av < bv ? -asc : av > bv ? asc : 0;
    });
  });

  paged = computed(() => {
    const start = this.page() * this.pageSize;
    return this.sorted().slice(start, start + this.pageSize);
  });

  totalPages = computed(() =>
    Math.max(1, Math.ceil((this.adminService.userProfiles()?.length ?? 0) / this.pageSize)),
  );

  sortBy(key: SortKey) {
    if (this.sortKey() === key) {
      this.sortAsc.update((v) => !v);
    } else {
      this.sortKey.set(key);
      this.sortAsc.set(true);
    }
    this.page.set(0);
  }

  prevPage() {
    if (this.page() > 0) this.page.update((p) => p - 1);
  }
  // Select a user profile and navigate to the admin view of that profile
  viewProfile(user: UserProfile) {
    this.adminService.selectedProfile.set(user);
    this.router.navigate(['admin-profile-view', user.user_id]);
  }
  // Helper function to retrieve the full country name by country code
  countryName(code: string): string {
    return COUNTRIES.find((c) => c.code === code)?.name ?? code;
  }

  nextPage() {
    if (this.page() < this.totalPages() - 1) this.page.update((p) => p + 1);
  }
}
