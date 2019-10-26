import KnScene from "ts@/lib/gameobjects/kn_scene";
import Game from "ts@/lib/core";
import KnEmitter from "ts@/lib/gameobjects/kn_emitter";
import { GodrayFilter } from 'ts@/src/filter/godray/index';

class Environment extends KnScene {
  public game: Game;
  public emitter: KnEmitter;
  public shootType: number;
  public tween: any;
  constructor(game: Game, key: string, boot: boolean) {
    super(game, key, boot);
    this.game = game;
    this.shootType = 1;
    this.resouces = {
      'rain': './assets/images/rain.png',
      'snow': './assets/images/snow.png',
      'envBg': './assets/images/env_bg.png',
      'perlin': './assets/shader/frag/perlin.frag',
      'godray': './assets/shader/frag/godray.frag',
      'vertex': './assets/shader/vertex/default.vert'
    }
  }

  boot() {
    this.tween = this.game.add.tween();
    this.addBackground();
    this.generateRains();
    this.dev();
    this.game.ticker.start();
  }

  dev() {
    if (this.game.gui.__controllers[0] && this.game.gui.__controllers[0].property === '环境效果') {
      return;
    }

    const dat = {
      '环境效果': '下雨'
    },
      datArr = ['下雨', '下雪', '阳光'];
    this.dat = this.game.gui.add(dat, '环境效果', datArr);
    this.dat.onChange((v: string) => {
      this.shootType = datArr.indexOf(v) + 1;
      this.toggleEnv(this.shootType);
    });
  }

  toggleEnv(type: number) {
    this.emitter && this.emitter.destroy();
    this.filters = [];
    switch (type) {
      case 1:
        this.generateRains();
        break;
      case 2:
        this.generateSnows();
        break;
      case 3:
        this.addFilter();
        break;
      default:
        this.generateRains();
        break;
    }
  }

  addFilter() {
    this.emitter = null;
    this.filters = [new GodrayFilter(this.loader)];
  }

  addBackground() {
    const bg = this.game.add.image('envBg', this);
    bg.width = this.game.config.width;
    bg.height = this.game.config.height;
  }

  // 粒子加载
  generateRains() {
    this.emitter = this.game.add.emitter(this.game, 200, 'rain');
    this.emitter.shooting = !0;
    this.addChild(this.emitter);
  }

  generateSnows() {
    this.emitter = this.game.add.emitter(this.game, 200, 'snow');
    this.emitter.shooting = !0;
    this.addChild(this.emitter);
  }

  // 范围连续发射
  rangeShoot() {
    this.emitter.throtting -= 2;
    if (this.emitter.throtting < 0) {
      const particle = this.emitter.shoot();
      particle.x = Math.random() * this.game.config.width;
      particle.y = 0;
      this.tween.instance.to(particle, 1.6, {
        x: particle.x + 100,
        y: this.game.config.height,
        alpha: 0,
        ease: this.tween.linear.easeNone
      });
      this.emitter.throtting = KnEmitter.throtting;
    }
  }

  rangeShoot_snow() {
    this.emitter.throtting -= 2;
    if (this.emitter.throtting < 0) {
      const particle = this.emitter.shoot();
      particle.x = Math.random() * this.game.config.width;
      particle.y = 0;
      this.tween.instance.to(particle, 2.4, {
        x: particle.x + this.game.math.rdirect() * 100,
        y: this.game.config.height,
        angle: this.game.math.rdirect() * 360,
        alpha: 0,
        ease: this.tween.linear.easeNone
      });
      this.emitter.throtting = KnEmitter.throtting;
    }
  }

  update() {
    if (this.emitter && this.emitter.shooting) {
      if (this.shootType === 1) {
        this.rangeShoot();
      } else {
        this.rangeShoot_snow();
      }
    }
    if (this.filters && this.filters[0]) {
      this.filters[0]['time'] += 0.01;
      this.filters[0]['time'] > 10 && (this.filters[0]['time'] = 0);
    }
  }
}

export default Environment;