import {
  Component,
  ElementRef,
  OnInit,
  AfterViewInit,
  Renderer2,
  ViewChild,
  Inject,
} from '@angular/core';
import { Sprite } from 'pixi.js';
import * as PIXI from 'pixi.js';
import { gsap } from 'gsap';
import PixiPlugin from 'gsap/PixiPlugin';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  @ViewChild('canvas') canvas: any;

  constructor(private renderer: Renderer2) {}

  ngAfterViewInit(): void {
    let app = new PIXI.Application({
      width: window.innerWidth,
      height: window.innerHeight,
      resizeTo: window,
      background: 0x000000,
      backgroundAlpha: 0,
      view: this.canvas.nativeElement,
      antialias: true,
    });
  }
}
