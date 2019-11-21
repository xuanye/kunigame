import Game from "../core";
import { Sprite } from "pixi.js";
import { TransformImage } from 'ts@/lib/utils/common';
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
		this.overlay = TransformImage.transformToSprite(this.game, blackRect, this.game.world);
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
		const leaveTween: any = this.game.add.tween();
		this.overlay.visible = !0;
		setTimeout(() => {
			leaveTween.instance.to(this.overlay, 0.34, {
				alpha: 1,
				ease: leaveTween.cubic.easeOut,
				onComplete: () => {
					leaveCb();
				}
				}
			);
		}, 0);
	}

	entryScene() {
		const entryTween: any = this.game.add.tween();
		this.overlayReset();
		this.mask.visible = !0;
		this.game.world.mask = this.mask;

		// 重置mask尺寸
		this.renderMask(0);
		const progress = {x: 0};
		setTimeout(() => {
			entryTween.instance.to(progress, 0.34, {
				x: this.game.config.width,
				ease: entryTween.cubic.easeIn,
				onUpdate: () => {
					this.renderMask(progress.x);
				},
				onComplete: () => {
					this.maskReset();
				}
			});
		}, 0);
	}
}

export default KnTransition;