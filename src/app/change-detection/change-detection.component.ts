import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CDModelStore } from './change-detection.store';
import { CommonModule, JsonPipe } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-change-detection',
  imports: [JsonPipe, CommonModule, HttpClientModule],
  templateUrl: './change-detection.component.html',
  styleUrl: './change-detection.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CDModelStore, HttpClient]
})
export class ChangeDetectionComponent {
  readonly store = inject(CDModelStore);
  readonly totalCount$ = computed(() => this.store.collectionData().length);

  onDoSomethingClick() {
    this.store.createNewCDModel();
    this.store.loadData();
  }
}
