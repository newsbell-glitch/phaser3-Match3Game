
// You can write more code here

/* START OF COMPILED CODE */

class Level extends Phaser.Scene {

	constructor() {
		super("Level");

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	/** @returns {void} */
	editorCreate() {

		// welcome
		const welcome = this.add.text(640, 533, "", {});
		welcome.name = "welcome";
		welcome.setOrigin(0.5, 0.5);
		welcome.text = "*** Match 3 Game ***\n\nClick to start the Game!!!";
		welcome.setStyle({ "align": "center", "fontFamily": "Arial", "fontSize": "30px" });

		// onAwakeScript_1
		const onAwakeScript_1 = new OnAwakeScript(welcome);

		// fadeActionScript
		const fadeActionScript = new FadeActionScript(onAwakeScript_1);

		// imgGroup
		const imgGroup = this.add.container(348, 8);
		imgGroup.name = "imgGroup";

		// pic_0
		const pic_0 = this.add.image(149, 281, "pic6");
		pic_0.name = "pic_0";
		imgGroup.add(pic_0);

		// pic_1
		const pic_1 = this.add.image(296, 281, "pic6");
		pic_1.name = "pic_1";
		imgGroup.add(pic_1);

		// pic_2
		const pic_2 = this.add.image(445, 281, "pic6");
		pic_2.name = "pic_2";
		imgGroup.add(pic_2);

		// removeEff0
		const removeEff0 = this.add.image(590, 280, "removeEff", 0);
		imgGroup.add(removeEff0);

		// removeEff1
		const removeEff1 = this.add.image(0, 279, "removeEff", 1);
		imgGroup.add(removeEff1);

		// fadeActionScript (prefab fields)
		fadeActionScript.fadeDirection = "FadeIn";

		// fadeActionScript (components)
		const fadeActionScriptDurationConfigComp = new DurationConfigComp(fadeActionScript);
		fadeActionScriptDurationConfigComp.duration = 1500;

		this.events.emit("scene-awake");
	}

	/* START-USER-CODE */
	// Write more your code here

	create() {
		this.overlay = this.add.rectangle(640, 360, 1280, 720, 0x000000, 0.7);
        this.overlay.setDepth(0);  // 어두운 레이어의 depth를 0으로 설정

		this.editorCreate();
		//this.dino = this.children.getByName("dino");
		//this.welcome = this.children.getByName("welcome");
		//this.imgGroup = this.children.getByName("imgGroup");
		this.initializeNamedChildren();
		// 화면 아무 곳이나 클릭 시 이벤트 처리
		// 어두운 레이어 추가
		setPointerCursor(this.imgGroup);
        this.input.on('pointerdown', () => {
            // 게임 시작 처리
            //this.pic_0.destroy();
			//this.pic_1.destroy();
			//this.pic_2.destroy();
			this.imgGroup.setVisible(false);
            this.welcome.destroy();
            this.overlay.destroy();
            this.scene.start('Match3Game');
			// 이벤트 리스너 제거 (더 이상 클릭이 발생하지 않도록)
    		this.input.off("pointerdown");
        });
	}
	initializeNamedChildren() {
		// editorCreate에서 이름이 선언된 객체들을 찾아 this에 추가
		this.children.list.forEach(child => {
			if (child.name) {
				this[child.name] = child;
			}
		});
	}
	findIdx_fn(elmName){//레벨에서 그래픽으로 생성한 개체의 인덱스값을 찾아 리턴시킴
		return this.children.list.findIndex(child => child.texture && child.texture.key === elmName);
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
export default Level;