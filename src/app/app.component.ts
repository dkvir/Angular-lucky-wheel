import { Component, AfterViewInit, Renderer2, ViewChild } from '@angular/core';
import { Sprite, Assets } from 'pixi.js';
import * as PIXI from 'pixi.js';
import { gsap } from 'gsap';
import PixiPlugin from 'gsap/PixiPlugin';
import { WheelSectors } from './wheelSectorsInterface';
import helpers from './helpers';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  @ViewChild('canvas') canvas: any;

  //global variables
  textures: any;
  app: any;
  background: PIXI.Sprite;
  wheelSectors: WheelSectors[] = [];
  radius: number = 400;
  sectorCount: number;
  oneSector: number;
  boxWidth: number = 150;
  boxHeight: number = 71;
  animating: boolean = false;
  fullCircle: number = 5;

  //containers
  wheelContainer: PIXI.Container = new PIXI.Container();
  sectorContainer: PIXI.Container = new PIXI.Container();
  boxesContainer: PIXI.Container = new PIXI.Container();

  constructor(private renderer: Renderer2) {}

  ngAfterViewInit(): void {
    this.app = new PIXI.Application({
      width: window.innerWidth,
      height: window.innerHeight,
      resizeTo: window,
      background: 0x000000,
      backgroundAlpha: 0,
      view: this.canvas.nativeElement,
      antialias: true,
    });
    this.app.renderer.resize(window.innerWidth, window.innerHeight);

    gsap.registerPlugin(PixiPlugin);
    PixiPlugin.registerPIXI(PIXI);

    this.loadAssets();
    // this.addEventListeners();
    window.addEventListener('resize', () => this.resize());
  }

  async loadAssets() {
    Assets.addBundle('textures', {
      backgroundGreen: '/assets/images/background-1.avif',
      backgroundBlue: '/assets/images/background-2.avif',
      backgroundRed: '/assets/images/background-3.avif',
      iron: '/assets/images/icons/iron.png',
      home: '/assets/images/icons/home.png',
      bike: '/assets/images/icons/bike.png',
      car: '/assets/images/icons/car.png',
    });

    const { textures } = await Assets.loadBundle(['textures']);
    this.textures = textures;
    this.changeBg();
    this.addWheelSector();
    this.createButton();
  }

  changeBg() {
    const bgBoxes = document.querySelectorAll('.change-bg .box');
    let activeBackgroundIndex = 0;
    const bgTextures = [
      this.textures.backgroundGreen,
      this.textures.backgroundBlue,
      this.textures.backgroundRed,
    ];
    this.background = new Sprite(bgTextures[0]);
    this.background.width = window.innerWidth;
    this.background.height = window.innerHeight;

    bgBoxes.forEach((box, index) => {
      box.addEventListener('click', () => {
        bgBoxes[activeBackgroundIndex].classList.remove('is-active');
        activeBackgroundIndex = index;
        this.background.texture = bgTextures[index];
        bgBoxes[activeBackgroundIndex].classList.add('is-active');
      });
    });

    this.app.stage.addChild(this.background);
  }

  addWheelSector() {
    const circleDeg = Math.PI * 2;

    this.wheelSectors = [
      {
        text: '2M',
        prize: '2M',
        color: 0xf9b807,
      },
      {
        icon: this.textures.iron,
        prize: 'Iron',
        color: 0x25d22,
      },
      {
        text: '3M',
        prize: '3M',
        color: 0xe54746,
      },
      {
        icon: this.textures.car,
        prize: 'Car',
        color: 0x269271,
      },
      {
        text: '1M',
        prize: '1M',
        color: 0x376fa3,
      },
      {
        icon: this.textures.home,
        prize: 'Home',
        color: 0x9a1c4b,
      },
      {
        text: '5M',
        prize: '5M',
        color: 0xd6d4c6,
      },
      {
        icon: this.textures.bike,
        prize: 'Bike',
        color: 0x676854,
      },
    ];
    this.sectorCount = this.wheelSectors.length;
    this.oneSector = circleDeg / this.sectorCount;

    //wheel container
    this.wheelContainer.position.set(
      window.innerWidth / 2,
      window.innerHeight / 2
    );
    this.app.stage.addChild(this.wheelContainer);

    // wheel graphics
    const wheelGraphicsBg = new PIXI.Graphics();
    wheelGraphicsBg.beginFill(0x1f2f32).arc(0, 0, this.radius, 0, 360);
    this.wheelContainer.addChild(wheelGraphicsBg);

    this.wheelContainer.addChild(this.sectorContainer);

    this.boxesContainer.position.set(
      window.innerWidth - this.boxWidth - 20,
      window.innerHeight / 2 - (this.sectorCount * this.boxHeight) / 2
    );
    this.app.stage.addChild(this.boxesContainer);

    this.wheelSectors.forEach((item, i) => {
      const startAngle =
        (i * circleDeg) / this.sectorCount - 5 * (this.oneSector / 2);
      const endAngle =
        ((i + 1) * circleDeg) / this.sectorCount - 5 * (this.oneSector / 2);

      // Create sector
      this.createSector(startAngle, endAngle, item);

      this.createBoxes(i, item);
    });
  }

  createSector(startAngle: number, endAngle: number, item: WheelSectors) {
    const graphics = new PIXI.Graphics();
    graphics.beginFill(item.color);
    graphics.moveTo(0, 0);
    graphics.arc(0, 0, this.radius - 20, startAngle, endAngle);
    graphics.lineTo(0, 0);
    graphics.endFill();
    graphics.name = item.prize;
    this.sectorContainer.addChild(graphics);

    // Calculate center coordinates
    const centerCoordinates = helpers.calculateCenterCoordinates(
      startAngle,
      endAngle,
      this.radius
    );
    const rotationAngle = (startAngle + endAngle) / 2;

    if (item.text) {
      const text = new PIXI.Text(item.prize, { fill: 0x000, fontSize: 35 });
      text.anchor.set(0.5, 0.5);
      text.rotation = rotationAngle;
      text.position.set(centerCoordinates.x, centerCoordinates.y);
      this.sectorContainer.addChild(text);
    } else {
      const sprite = new PIXI.Sprite(item.icon);
      sprite.anchor.set(0.5, 0.5);
      sprite.rotation = rotationAngle;
      sprite.position.set(centerCoordinates.x, centerCoordinates.y);
      sprite.scale.set(0.15);
      this.sectorContainer.addChild(sprite);
    }
  }

  createBoxes(i: number, item: WheelSectors) {
    const box = new PIXI.Graphics();
    box.beginFill(item.color);
    box.drawRect(0, 0, this.boxWidth, this.boxHeight);
    box.endFill();
    box.position.set(0, i * this.boxHeight);
    box.alpha = 0.5;
    box.name = item.prize;
    this.boxesContainer.addChild(box);

    if (item.text) {
      const text = new PIXI.Text(item.prize, { fill: 0x000, fontSize: 35 });
      text.anchor.set(0.5);
      text.position.set(
        this.boxWidth / 2,
        this.boxHeight / 2 + this.boxHeight * i
      );
      this.boxesContainer.addChild(text);
    } else {
      const sprite = new PIXI.Sprite(item.icon);
      sprite.anchor.set(0.5, 0.5);
      sprite.position.set(
        this.boxWidth / 2,
        this.boxHeight / 2 + this.boxHeight * i
      );
      sprite.scale.set(0.1);
      this.boxesContainer.addChild(sprite);
    }
  }

  createButton() {
    const buttonRadius = 70;

    const button: any = new PIXI.Graphics();
    button.beginFill(0xcf0300).drawCircle(0, 0, buttonRadius).endFill();
    button.interactive = true;
    button.buttonMode = true;
    button.cursor = 'pointer';
    this.wheelContainer.addChild(button);

    const triangleGraphics = new PIXI.Graphics();
    triangleGraphics.beginFill(0xcf0300);
    triangleGraphics.moveTo(-15, -buttonRadius - 5);
    triangleGraphics.lineTo(20, -buttonRadius - 5);
    triangleGraphics.lineTo(0, -buttonRadius - 30);
    triangleGraphics.lineTo(-20, -buttonRadius - 5);
    triangleGraphics.endFill();
    button.addChild(triangleGraphics);

    const buttonText = new PIXI.Text('SPIN', { fill: 0xf3f6f4, fontSize: 35 });
    buttonText.anchor.set(0.5, 0.5);
    button.addChild(buttonText);

    //event listeners
    button.on('pointerover', () => {
      if (!this.animating) {
        gsap.to(button, {
          pixi: {
            tint: 0x1f2f32,
          },
          duration: 0.25,
        });

        gsap.to(triangleGraphics, {
          pixi: {
            tint: 0x1f2f32,
          },
          duration: 0.25,
        });
      }
    });

    button.on('pointerout', () => {
      gsap.to(button, {
        pixi: {
          tint: 0xcf0300,
        },
        duration: 0.25,
      });

      gsap.to(triangleGraphics, {
        pixi: {
          tint: 0xcf0300,
        },
        duration: 0.25,
      });
    });

    button.on('pointerdown', () => this.onButtonClick(buttonText));
  }

  onButtonClick(buttonText: any) {
    const circleDeg = Math.PI * 2;

    if (!this.animating) {
      this.animating = true;
      let stopIndex = helpers.getRandomInt(0, this.sectorCount - 1);
      let stopDegrees =
        this.fullCircle * circleDeg - stopIndex * this.oneSector;

      gsap.to(this.sectorContainer, {
        rotation: stopDegrees,
        duration: 4,
        ease: 'back.out(1.2)',
        onStart: () => {
          if (this.wheelSectors[stopIndex].text) {
            buttonText.text = this.wheelSectors[stopIndex].text;
          } else {
            buttonText.text = this.wheelSectors[stopIndex].prize;
          }
        },
        onComplete: () => {
          this.animateWinned(this.wheelSectors[stopIndex], buttonText);
          this.animateWinned(this.wheelSectors[stopIndex], false);
          this.fullCircle += 5;
        },
      });
    }
  }

  animateWinned(item: WheelSectors, box: any) {
    const graphics: any = box
      ? this.boxesContainer.getChildByName(item.prize)
      : this.sectorContainer.getChildByName(item.prize);

    const tl = gsap.timeline({
      repeat: 3,
      onStart: () => {
        if (box) {
          graphics.alpha = 1;
        }
      },
      onComplete: () => {
        if (box) {
          box.text = 'SPIN';
          setTimeout(() => {
            graphics.alpha = 0.3;
          }, 1500);
        } else {
          this.animating = false;
        }
      },
    });

    tl.to(
      graphics,
      {
        pixi: {
          tint: 0x39b6ff,
        },
        duration: 0.1,
        ease: 'power1.in',
      },
      '>'
    )
      .to(
        graphics,
        {
          pixi: {
            tint: 0xfce9d5,
          },
          duration: 0.1,
          ease: 'power1.in',
        },
        '>'
      )
      .to(
        graphics,
        {
          pixi: {
            tint: 0xe86343,
          },
          duration: 0.1,
          ease: 'power1.in',
        },
        '>'
      )
      .to(
        graphics,
        {
          pixi: {
            tint: item.color,
          },
          duration: 0.1,
          ease: 'power1.in',
        },
        '>'
      );
  }

  resize() {
    if (window.innerWidth > 820) {
      this.boxesContainer.scale.set(1);
      this.wheelContainer.scale.set(window.innerWidth / 1920);
      this.wheelContainer.position.set(
        window.innerWidth / 2,
        window.innerHeight / 2
      );
    } else if (window.innerWidth <= 820 && window.innerWidth > 540) {
      this.boxesContainer.scale.set(0.7);
      this.wheelContainer.scale.set(0.6);
      this.wheelContainer.position.set(
        window.innerWidth / 2 - this.wheelContainer.width / 8,
        window.innerHeight / 2
      );
    } else if (window.innerWidth <= 540) {
      this.boxesContainer.scale.set(0.5);
      this.wheelContainer.scale.set(0.3);
      this.wheelContainer.position.set(
        window.innerWidth / 2 - this.wheelContainer.width / 6,
        window.innerHeight / 2
      );
    }

    this.background.width = window.innerWidth;
    this.background.height = window.innerHeight;

    this.boxesContainer.position.set(
      window.innerWidth - this.boxesContainer.width - 20,
      window.innerHeight / 2 - this.boxesContainer.height / 2
    );
  }
}
