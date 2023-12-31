import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { gsap } from 'gsap';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
})
export class LoaderComponent implements AfterViewInit {
  @ViewChild('loader') loader: any;
  constructor() {}

  ngAfterViewInit(): void {
    this.initLoader();
  }

  initLoader() {
    const tl = gsap.timeline({
      onComplete: () => {
        this.loader.nativeElement.classList.add('loaded');
      },
    });

    tl.to('.loader .img', {
      rotate: 5 * 360,
      duration: 3,
      ease: 'back.out(1.2)',
    })
      .to(
        '.loader .img',
        {
          scale: 0,
          duration: 0.5,
          ease: 'power1.in',
        },
        '>'
      )
      .to(
        '.loader ',
        {
          '--circle-width': '100%',
          duration: 0.5,
          ease: 'power1.in',
        },
        '-=0.2'
      );
  }
}
