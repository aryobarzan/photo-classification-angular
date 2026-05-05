import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { UserProfile } from '../../core/schemas/user';
import { AdminService } from '../../core/services/admin';
import { Profile } from '../profile/profile';

@Component({
  selector: 'app-profile-admin-view',
  imports: [Profile, RouterLink],
  templateUrl: './profile-admin-view.html',
  styleUrl: './profile-admin-view.css',
})
export class ProfileAdminView implements OnInit {
  adminService = inject(AdminService);
  route = inject(ActivatedRoute);

  userProfile: UserProfile | null = null;

  ngOnInit() {
    // Use cached profile if available
    const cached = this.adminService.selectedProfile();
    if (cached) {
      this.userProfile = cached;
    } else {
      // Otherwise, look up from fetched user profiles list
      const id = Number(this.route.snapshot.paramMap.get('id'));
      this.userProfile = this.adminService.userProfiles()?.find((p) => p.user_id === id) ?? null;
    }
  }
}
