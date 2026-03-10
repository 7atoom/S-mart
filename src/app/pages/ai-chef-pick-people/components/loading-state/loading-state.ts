import {Component, computed, effect, Input, signal} from '@angular/core';
import {AnimationOptions, LottieComponent} from 'ngx-lottie';
import {rxResource} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-loading-state',
  imports: [
    LottieComponent,
  ],
  templateUrl: './loading-state.html',
  styleUrls: ['./../../ai-chef-pick-people.css'],
})
export class LoadingState {
  @Input({required: true}) recipeResource!: ReturnType<typeof rxResource>;
  private readonly MESSAGES = [
    'Analyzing ingredients...',
    'Consulting the chef...',
    'Plating your recipe...',
  ];

  private storytellingIndex = signal(0);
  storytellingText = computed(() => this.MESSAGES[this.storytellingIndex()]);

  lottieOptions: AnimationOptions = {
    path: '/loader/loader.json',
  };

  constructor() {
    let timer: ReturnType<typeof setInterval> | null = null;

    effect(() => {
      if (this.recipeResource.isLoading()) {
        // Reset index and start the cycling interval
        this.storytellingIndex.set(0);
        timer = setInterval(() => {
          this.storytellingIndex.update((i) =>
            Math.min(i + 1, this.MESSAGES.length - 1)
          );
        }, 2000);
      } else {
        if (timer) {
          clearInterval(timer);
          timer = null;
        }
      }
    });
  }

}
