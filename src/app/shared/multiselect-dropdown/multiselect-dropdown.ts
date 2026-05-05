import { Component, input, model, signal } from '@angular/core';

export interface DropdownOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-multiselect-dropdown',
  templateUrl: './multiselect-dropdown.html',
  styleUrl: './multiselect-dropdown.css',
})
export class MultiselectDropdown {
  options = input.required<DropdownOption[]>();
  placeholder = input('Select...');
  // If true, only one option can be selected at a time. Selecting a new option will deselect the previous one.
  singleSelect = input(false);
  selected = model<Set<string>>(new Set());

  isOpen = signal(false);

  toggle() {
    this.isOpen.set(!this.isOpen());
  }

  isSelected(value: string): boolean {
    return this.selected().has(value);
  }

  toggleOption(value: string) {
    if (this.singleSelect()) {
      this.selected.set(new Set(this.selected().has(value) ? [] : [value]));
      this.isOpen.set(false);
    } else {
      this.selected.update((set) => {
        const next = new Set(set);
        next.has(value) ? next.delete(value) : next.add(value);
        return next;
      });
    }
  }

  label(): string {
    const sel = this.selected();
    if (sel.size === 0) return this.placeholder();
    const selectedLabels = this.options()
      .filter((o) => sel.has(o.value))
      .map((o) => o.label);
    return selectedLabels.join(', ');
  }
}
