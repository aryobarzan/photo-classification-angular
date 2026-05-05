import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileAdminView } from './profile-admin-view';

describe('ProfileAdminView', () => {
  let component: ProfileAdminView;
  let fixture: ComponentFixture<ProfileAdminView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileAdminView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileAdminView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
