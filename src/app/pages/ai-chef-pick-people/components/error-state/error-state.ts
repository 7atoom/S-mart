import {Component, Input} from '@angular/core';
import {rxResource} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-error-state',
  imports: [],
  templateUrl: './error-state.html',
  styles: ``,
})
export class ErrorState {
  @Input({required: true}) recipeResource!: ReturnType<typeof rxResource>;
  retry() {
    this.recipeResource.reload();
  }
}
