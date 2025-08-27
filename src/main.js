import Level from './scenes/Level.js';  // Level 클래스를 import
import Match3Game from './scenes/Match3Game.js';  // Match3Game 클래스를 import
import IntroScene from './scenes/IntroScene.js';  // IntroScene 클래스를 import
import LevelGuideScene from './scenes/LevelGuideScene.js';  // LevelGuideScene 클래스를 import
import Preload from './scenes/Preload.js';  // Preload 클래스를 import

window.addEventListener('load', function () {

	var game = new Phaser.Game({
		width: 1920,
		height: 1080,
		type: Phaser.AUTO,
		backgroundColor: "#242424",
		scale: {
			mode: Phaser.Scale.FIT,
			autoCenter: Phaser.Scale.CENTER_BOTH,
			orientation: Phaser.Scale.LANDSCAPE // 가로모드로 설정
		}
	});

	game.scene.add("Preload", Preload);
	game.scene.add("Level", Level);
	game.scene.add("Match3Game", Match3Game);
	game.scene.add("IntroScene", IntroScene);
	game.scene.add("LevelGuideScene", LevelGuideScene);
	game.scene.add("Boot", Boot, true);
});

class Boot extends Phaser.Scene {

	preload() {
		
		this.load.pack("pack", "assets/preload-asset-pack.json");
	}

	create() {

		this.scene.start("Preload");
	}
}