import { Component, inject, signal } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { COUNTRIES } from '../../core/data/countries';
import { UserService } from '../../core/services/user';
import { UserProfile } from '../../core/schemas/user';
import { ToastService } from '../../core/services/toast';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-editor',
  imports: [ReactiveFormsModule],
  templateUrl: './profile-editor.html',
  styleUrl: './profile-editor.css',
})
export class ProfileEditor {
  profileForm = new FormGroup({
    profilePicture: new FormControl<File | null>(null),
    firstName: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(32),
      Validators.pattern('^[a-zA-Z-]+$'),
    ]),
    lastName: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(32),
      Validators.pattern('^[a-zA-Z-]+$'),
    ]),
    age: new FormControl('', [
      Validators.required,
      Validators.pattern('^[0-9]+$'),
      Validators.min(18),
      Validators.max(120),
    ]),
    gender: new FormControl('', [Validators.required, Validators.pattern('^(male|female|other)$')]),
    countryOfOrigin: new FormControl('', [Validators.required]),
    placeOfResidence: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(100),
    ]),
    description: new FormControl('', [Validators.maxLength(500)]),
  });

  userService = inject(UserService);
  toastService = inject(ToastService);
  router = inject(Router);

  constructor() {
    if (this.userService.userProfile()) {
      const profile = this.userService.userProfile()!;
      this.profileForm.patchValue({
        firstName: profile.first_name,
        lastName: profile.last_name,
        age: profile.age.toString(),
        gender: profile.gender,
        countryOfOrigin: profile.country_of_origin,
        placeOfResidence: profile.place_of_residence,
        description: profile.description,
      });
    }
    if (this.userService.userProfile()?.profile_picture_filename) {
      this.selectedFileUrl.set(
        this.userService.fetchProfilePictureUrl(
          this.userService.userProfile()!.profile_picture_filename!,
        ),
      );
    }
  }

  readonly countries = COUNTRIES;

  selectedFile: File | null = null;
  selectedFileUrl = signal<string | null>(null);

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedFile = input.files[0];
      if (this.selectedFileUrl()) {
        URL.revokeObjectURL(this.selectedFileUrl()!);
      }
      this.selectedFileUrl.set(URL.createObjectURL(this.selectedFile));
      this.profileForm.controls.profilePicture.setValue(this.selectedFile);
    }
  }

  async onSubmit() {
    if (this.profileForm.valid) {
      // Handle form submission, e.g., send data to the server
      const profileData: UserProfile = {
        first_name: this.profileForm.value.firstName!,
        last_name: this.profileForm.value.lastName!,
        age: Number(this.profileForm.value.age),
        gender: this.profileForm.value.gender as 'male' | 'female' | 'other',
        country_of_origin: this.profileForm.value.countryOfOrigin!,
        place_of_residence: this.profileForm.value.placeOfResidence!,
        description: this.profileForm.value.description ?? undefined,
      };
      const errorMessage = await this.userService.updateUserProfile(profileData, this.selectedFile);
      if (errorMessage) {
        this.toastService.show('An error occurred while saving your profile.', 'error');
      } else {
        this.toastService.show('Profile updated successfully.', 'success');
        // Navigate back to home
        this.router.navigate(['']);
      }
    }
  }
}
