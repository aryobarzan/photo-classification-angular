import { Component, inject, input } from '@angular/core';
import { UserService } from '../../core/services/user';

@Component({
  selector: 'app-profile-picture',
  imports: [],
  templateUrl: './profile-picture.html',
  styleUrl: './profile-picture.css',
})
export class ProfilePicture {
  private userService = inject(UserService);

  filename = input<string | undefined>(undefined);
  isNsfw = input<boolean | undefined>(undefined);
  /** Pass the value of UserService.profilePictureStatus() */
  processingStatus = input<'processing' | 'rejected' | 'done' | null>(null);
  size = input(128);

  get pictureUrl(): string | null {
    const f = this.filename();
    return f ? this.userService.fetchProfilePictureUrl(f) : null;
  }

  get state(): 'empty' | 'processing' | 'nsfw' | 'ready' {
    const f = this.filename();
    if (!f) return 'empty';
    const status = this.processingStatus();
    if (status === 'processing') return 'processing';
    if (this.isNsfw() === true || status === 'rejected') return 'nsfw';
    return 'ready';
  }
}
