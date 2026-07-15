import { Component } from '@angular/core';

/* HERO — full-screen video section
   - Background video with dark gradient overlay
   - Eyebrow, serif headline, two CTA pills, scroll indicator */

@Component({
  selector: 'app-hero',
  imports: [],
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
})

export class Hero {
  protected readonly videoSrc = 'bg-video.mp4';
}
