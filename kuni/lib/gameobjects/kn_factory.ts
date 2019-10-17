/*
 * @Author: kunnisser 
 * @Date: 2019-08-31 15:01:25 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2019-09-30 15:52:03
 */

/*
	* KnFactory 是一个快速构建大量公用游戏对象的类
	* 其创建的对象会自动添加到对应的Manager, World或者是自定义组中
	* @class KnFactory
	* @constructor
	* @param {Core} game - 当前运行的游戏实例的引用	
*/

import KnGroup from 'ts@/lib/gameobjects/kn_group';
import KnGraphics from 'ts@/lib/gameobjects/kn_graphics';
import KnText from 'ts@/lib/gameobjects/kn_text';
import KnEmitter from 'ts@/lib/gameobjects/kn_emitter';
import Game from 'ts@/lib/core';
import {knTweenLine} from 'ts@/lib/gameobjects/kn_tween';
import { Sprite, Texture, AnimatedSprite, utils, Ticker } from 'pixi.js';

class KnFactory {
	public game: Game;
	constructor(game: Game) {
		this.game = game;
	}

	group(key: string, parent: PIXI.Container) {
		return new KnGroup(this.game, key, parent);
	}

	image = (key: any, parent: PIXI.Container, align?: Array<number>) => {
		const texture = Object.prototype.toString.call(key) === '[object String]' ? utils.TextureCache[key] : key;
		const sprite = new Sprite(texture);
		align && sprite.anchor.set(...align);
		parent || (parent = this.game.world);
		return parent.addChild(sprite), sprite;
	}

	texture(key) {
		return Texture.from(key);
	}

	animation(frames: Array<PIXI.Texture>, speed: number) {
		const anim: AnimatedSprite = new AnimatedSprite(frames);
		anim.animationSpeed = speed || 0.5;
		return anim;
	}

	emitter(game: Game, quality: number, key: string) {
		return new KnEmitter(game, quality, key);
	}
	// 添加graphics实例
	graphics () {
		return new KnGraphics(this.game);
	}

	tweenline (vars?: object) {
		return new knTweenLine(vars);
	}

	ticker = () => {
		const ticker = new Ticker();
		ticker.autoStart = false;
		ticker.stop();
		return ticker;
	}

	text(content: string, style: object, anchor: Array<number>) {
		const text = new KnText(this.game, content, style, anchor);
		return text;
	}

}

export default KnFactory;