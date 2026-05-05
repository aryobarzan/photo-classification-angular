import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiselectDropdown } from './multiselect-dropdown';

describe('MultiselectDropdown', () => {
  let component: MultiselectDropdown;
  let fixture: ComponentFixture<MultiselectDropdown>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MultiselectDropdown],
    }).compileComponents();

    fixture = TestBed.createComponent(MultiselectDropdown);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
