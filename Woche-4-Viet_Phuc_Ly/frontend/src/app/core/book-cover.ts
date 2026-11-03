import { Component, computed, input } from '@angular/core';

const PALETTES = [
  ['#1e3a5f', '#3d6a99'],
  ['#5b2333', '#a23e48'],
  ['#2d4a3e', '#4f7f6b'],
  ['#4a3b6b', '#7a64a8'],
  ['#6b4423', '#b07a45'],
  ['#263238', '#546e7a'],
  ['#7a2e0e', '#c75a28'],
  ['#1f4e5f', '#3b8ea5'],
];

/**
 * Zeigt das Cover (coverUrl) oder ein generiertes Platzhalter-Cover
 * mit Titel und Autor. Die Farbe ergibt sich stabil aus dem Titel.
 */
@Component({
  selector: 'app-book-cover',
  template: `
    @if (url()) {
      <img [src]="url()" [alt]="'Cover: ' + title()" />
    } @else {
      <div class="cover" [style.background]="background()">
        <span class="title">{{ title() }}</span>
        <span class="author">{{ author() }}</span>
      </div>
    }
  `,
  styles: `
    :host {
      display: block;
      aspect-ratio: 2 / 3;
      border-radius: 6px;
      overflow: hidden;
      box-shadow: 0 2px 6px rgb(0 0 0 / 0.25);
    }
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
    .cover {
      height: 100%;
      padding: 12% 10%;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      color: #fff;
      border-left: 6px solid rgb(0 0 0 / 0.25);
    }
    .title {
      font:
        600 1.05em/1.2 Georgia,
        'Times New Roman',
        serif;
      overflow-wrap: anywhere;
    }
    .author {
      font-size: 0.8em;
      opacity: 0.85;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
  `,
})
export class BookCover {
  title = input.required<string>();
  author = input<string>('');
  url = input<string | null>(null);

  background = computed(() => {
    let hash = 0;
    for (const ch of this.title()) {
      hash = (hash * 31 + ch.charCodeAt(0)) | 0;
    }
    const [a, b] = PALETTES[Math.abs(hash) % PALETTES.length];
    return `linear-gradient(160deg, ${a}, ${b})`;
  });
}
