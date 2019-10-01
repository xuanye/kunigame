import Game from "../core";
import { Sprite } from "pixi.js";
import KnGraphics from "../gameobjects/kn_graphics";

class KnTransition {
	public game: Game;
	public mask: KnGraphics;
	public overlay: Sprite;
	constructor(game: Game) {
		this.game = game;
		this.generateOverlay();
		this.addMask();
	}

	addMask() {
		this.mask = this.game.add.graphics();
		this.game.world.addChild(this.mask);
		this.maskReset();
	}

	renderMask(size?: number) {
		this.mask.clear();
		this.mask.beginFill(0x000000, 1);
		this.mask.drawStar(this.game.config.half_w, this.game.config.half_h, 5, size);
		this.mask.endFill();
	}

	generateOverlay() {
		const blackRect = this.game.add.graphics().generateRect(0x000000, [0, 0, 1, 1]);
		this.overlay = this.game.add.image(this.game.app.renderer.generateTexture(blackRect, 1, window.devicePixelRatio), this.game.world);
		this.overlay.width = this.game.config.width;
		this.overlay.height = this.game.config.height;
		this.overlayReset();
	}

	overlayReset() {
		this.overlay.visible = !1;
		this.overlay.alpha = 0;
	}

	maskReset() {
		this.mask.visible = !1;
		this.game.world.mask = null;
	}

	leaveScene(leaveCb: Function) {
		const leaveTween: any = this.game.add.tweenline({
			onComplete: () => {
				leaveCb();
				console.log('step1');
			}
		});
		this.overlay.visible = !0;
		leaveTween.to(this.overlay, 0.64, {
			alpha: 1,
			ease: leaveTween.cubic.easeOut
		});
	}

	entryScene() {
		const entryTween: any = this.game.add.tweenline({
			onComplete: () => {
				this.maskReset();
			}
		});
		this.overlayReset();
		this.mask.visible = !0;
		this.game.world.mask = this.mask;

		// 重置mask尺寸
		this.renderMask(0);
		const progress = {x: 0};
		entryTween.to(progress, 0.64, {
			x: this.game.config.width,
			ease: entryTween.cubic.easeIn,
			onUpdate: () => {
				this.renderMask(progress.x);
			}
		});
	}
}

export default KnTransition;