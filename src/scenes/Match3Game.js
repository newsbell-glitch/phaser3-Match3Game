// You can write more code here

/* START OF COMPILED CODE */

class Match3Game extends Phaser.Scene {

	constructor() {
		super("Match3Game");

		/* START-USER-CTR-CODE */

		/* END-USER-CTR-CODE */
	}

	/** @returns {void} */
	editorCreate() {
		// 이 부분은 나중에 구현
		this.events.emit("scene-awake");
	}

	/* START-USER-CODE */
	preload() {
		this.load.plugin('rexmodalplugin', 'src/js/rexmodalplugin.min.js', true);
		
		// 게임 화면 이미지들 로드
		this.load.image('game_bg', 'images/game_background.png');
		this.load.image('menu_img', 'images/menu.png');
		this.load.image('pin_img', 'images/pin.png');
		this.load.image('blue_icon_img', 'images/blue_icon.png');
		this.load.image('question_img', 'images/question_mark.png');
		
		// 동물 이미지들 로드
		this.load.image('bear_img', 'images/bear.png');
		this.load.image('cat_img', 'images/cat.png');
		this.load.image('dog_img', 'images/dog.png');
		this.load.image('rabbit_img', 'images/rabbit.png');
		this.load.image('raccoon_img', 'images/raccoon.png');
		this.load.image('quokka_img', 'images/quokka.png');
		
		// 옵션 버튼은 기존 tutorial_button 사용
		this.load.image('option_img', 'assets/tutorial_button.png');
	}
	
	init(data) {
		this.levelData = data || { level: 1, targets: [] };
		if (!this.levelData.level) {
			this.levelData.level = 1;
		}
	}
	
	startGame() {
		// Match3 게임을 시작
		const match3 = new Match3(this);
		this.match3 = match3;
		this.core = match3.core;
		match3.makeMatch(this);
		//match3Game.setScoreText(this.scoreText);
	}
	
	startLevel() {
		// 레벨 가이드에서 호출됨
		this.input.enabled = true;
	}

	create() {
		this.editorCreate();
		
		const centerX = this.cameras.main.width / 2;
		const centerY = this.cameras.main.height / 2;
		
		// 배경 이미지
		const bg = this.add.image(centerX, centerY, 'game_bg');
		bg.setOrigin(0.5, 0.5);
		bg.setDisplaySize(1920, 1080);
		
		// 메인 게임 영역 컨테이너
		const mainGameContainer = this.add.container(0, 0);
		
		// 상단 UI 영역
		const topUIContainer = this.add.container(0, 0);
		
		// 메뉴 버튼 영역 (Figma 좌표: x=40, y=79, width=320, height=814)
		const menuContainer = this.add.container(40 + 160, 79 + 407);
		const menuBg = this.add.image(0, 0, 'menu_img');
		menuBg.setDisplaySize(320, 814);
		
		// 핀 아이콘 (Figma 좌표: x=142.93, y=0 상대위치)
		const pinIcon = this.add.image(2.93, -407, 'pin_img');
		pinIcon.setDisplaySize(35, 47);
		menuContainer.add([menuBg, pinIcon]);
		topUIContainer.add(menuContainer);
		
		// 레벨 표시 영역 (메뉴 내부)
		const levelContainer = this.add.container(200, 170);
		
		// 레벨 배경 (흰색 둥근 사각형)
		const levelBg = this.add.graphics();
		levelBg.fillStyle(0xFFFFFF, 0.95);
		levelBg.fillRoundedRect(-90, -30, 180, 60, 20);
		levelContainer.add(levelBg);
		
		// 레벨 텍스트
		const levelLabel = this.add.text(-30, 0, 'Lv', {
			fontFamily: 'Arial Black',
			fontSize: '36px',
			color: '#3E91C1',
			stroke: '#FFFFFF',
			strokeThickness: 2,
			shadow: {
				offsetY: 3,
				color: '#185870',
				blur: 1,
				fill: true
			}
		});
		levelLabel.setOrigin(0.5, 0.5);
		
		this.lv_txt = this.add.text(30, 0, this.levelData.level.toString().padStart(2, '0'), {
			fontFamily: 'Arial Black',
			fontSize: '64px',
			color: '#1D6B97',
			stroke: '#FFFFFF',
			strokeThickness: 2,
			letterSpacing: -4,
			shadow: {
				offsetY: 4,
				color: '#16556e',
				blur: 1,
				fill: true
			}
		});
		this.lv_txt.setOrigin(0.5, 0.5);
		
		levelContainer.add([levelLabel, this.lv_txt]);
		topUIContainer.add(levelContainer);
		
		// 프로그레스바
		const progressContainer = this.add.container(200, 250);
		
		// 프로그레스바 배경
		const progressBg = this.add.graphics();
		progressBg.fillStyle(0x53524E, 1);
		progressBg.fillRoundedRect(-81, -13, 162, 26, 13);
		progressBg.lineStyle(2, 0x275D81, 1);
		progressBg.strokeRoundedRect(-81, -13, 162, 26, 13);
		
		// 그림자 효과
		const progressShadow = this.add.graphics();
		progressShadow.fillStyle(0x444444, 1);
		progressShadow.fillRoundedRect(-81, -10, 162, 9, 4);
		
		// 프로그레스바 채우기
		this.progressFill = this.add.graphics();
		this.progressFill.fillStyle(0xFFD202, 1);
		this.progressFill.fillRoundedRect(-81, -13, 75, 26, 13);
		
		// 하이라이트 효과
		const progressHighlight = this.add.graphics();
		progressHighlight.fillStyle(0xFFEF03, 1);
		progressHighlight.fillRoundedRect(-60, -1, 61, 3, 1.5);
		
		progressContainer.add([progressBg, progressShadow, this.progressFill, progressHighlight]);
		topUIContainer.add(progressContainer);
		
		// 미션 패널 (Figma 좌표: y=297 부터 시작, height=454)
		const missionPanel = this.add.container(200, 524);
		
		// 패널 배경
		const panelBg = this.add.graphics();
		panelBg.fillStyle(0xD9D9D9, 1);
		panelBg.fillRoundedRect(-81, -227, 162, 454, 16);
		panelBg.lineStyle(2, 0xBCBCBC, 1);
		panelBg.strokeRoundedRect(-81, -227, 162, 454, 16);
		
		// MISSION 텍스트
		const missionText = this.add.text(0, -180, 'MISSION', {
			fontFamily: 'Arial Black',
			fontSize: '24px',
			color: '#8A999F'
		});
		missionText.setOrigin(0.5, 0.5);
		
		missionPanel.add([panelBg, missionText]);
		
		// 미션 아이템들 - 레벨에 맞게 수정
		this.missionTargets = [];
		const missionItems = this.levelData.level === 1 ? 
			[
				{ type: 'bear_img', count: 6, y: -90 },
				{ type: 'cat_img', count: 9, y: 0 }
			] : this.levelData.level === 2 ?
			[
				{ type: 'bear_img', count: 3, y: -90 },
				{ type: 'cat_img', count: 6, y: 0 },
				{ type: 'dog_img', count: 9, y: 90 }
			] :
			[
				{ type: 'bear_img', count: 6, y: -90 },
				{ type: 'cat_img', count: 9, y: 0 },
				{ type: 'dog_img', count: 9, y: 90 }
			];
		
		missionItems.forEach((item, index) => {
			const itemContainer = this.add.container(0, item.y);
			
			// 타겟 배경 원
			const targetBg = this.add.graphics();
			targetBg.fillStyle(0xB7BBBD, 1);
			targetBg.fillCircle(-30, 0, 24);
			
			// 타겟 이미지 - 수정
			if(this.textures.exists(item.type)) {
				const animalImg = this.add.image(-30, 0, item.type);
				animalImg.setDisplaySize(84, 85);
				itemContainer.add([targetBg, animalImg]);
			} else {
				itemContainer.add(targetBg);
			}
			
			// 카운트 텍스트 (오른쪽)
			const countText = this.add.text(30, 0, `${item.count}`, {
				fontFamily: 'Arial Black',
				fontSize: '28px',
				color: '#FFFFFF',
				stroke: '#000000',
				strokeThickness: 1.5,
				shadow: {
					offsetY: 2,
					color: '#000000',
					blur: 0,
					fill: true
				}
			});
			countText.setOrigin(0.5, 0.5);
			
			itemContainer.add(countText);
			missionPanel.add(itemContainer);
			
			// 이미지 참조 저장 - 수정
			let imageRef = null;
			if (this.textures.exists(item.type)) {
				imageRef = itemContainer.getAt(itemContainer.length - 2);
			}
			
			this.missionTargets.push({ 
				container: itemContainer, 
				text: countText, 
				type: item.type,
				image: imageRef
			});
		});
		
		topUIContainer.add(missionPanel);
		
		// 하단 버튼들 (위치 조정 - 올림)
		const bottomButtons = this.add.container(85, 820);
		
		// 파란 아이콘 버튼 - 튜토리얼 기능
		const blueIconBtn = this.add.image(0, 0, 'blue_icon_img');
		blueIconBtn.setDisplaySize(70, 77);
		blueIconBtn.setInteractive({ useHandCursor: true });
		
		// 물음표 버튼 - 파란 버튼 안으로 이동, 튜토리얼 기능 추가
		const questionBtn = this.add.image(0, 0, 'question_img');
		questionBtn.setDisplaySize(28, 46);
		questionBtn.setInteractive({ useHandCursor: true });
		
		// 튜토리얼 기능 추가
		questionBtn.on('pointerup', () => {
			if (this.tutorialWin) {
				if (this.tutorialWin.visible) {
					this.tutorialWin.visible = false;
					this.input.setGlobalTopOnly(false);
					// 타일 드래그 가능하게 복원
					if (this.tileGrp) {
						this.tileGrp.getAll().forEach(tile => {
							tile.setInteractive({ draggable: true });
						});
					}
				} else {
					this.tutorialWin.visible = true;
					this.input.setGlobalTopOnly(true);
					// 타일 드래그 불가능하게 설정
					if (this.tileGrp) {
						this.tileGrp.getAll().forEach(tile => {
							tile.disableInteractive();
						});
					}
					this.tutorialWin.alpha = 0;
					this.tweens.add({
						targets: this.tutorialWin,
						alpha: 1,
						duration: 500,
						ease: 'Linear'
					});
				}
			}
		});
		
		bottomButtons.add([blueIconBtn, questionBtn]);
		topUIContainer.add(bottomButtons);
		
		// 튜토리얼 노란색 이미지 제거 (주석 처리)
		/*
		const optionButton = this.add.image(1720, 990, 'option_img');
		optionButton.setDisplaySize(148, 70);
		optionButton.setInteractive();
		*/
		
		// 게임 보드 영역 - 위치 조정 (왼쪽으로 이동)
		const boardContainer = this.add.container(400 + 520, 135);
		
		// 보드 프레임 배경 - 세로 늘림
		const frameBg = this.add.graphics();
		frameBg.fillStyle(0x000000, 0.5);
		frameBg.fillRoundedRect(-580, -70, 1160, 950, 20);
		
		// 그리드 배경 (뒤쪽 레이어) - 세로 늘림
		const gridOuterBg = this.add.graphics();
		gridOuterBg.fillStyle(0xD9D9D9, 1);
		gridOuterBg.fillRoundedRect(-570, -60, 1140, 930, 18);
		gridOuterBg.lineStyle(4, 0xCCCCCC, 1);
		gridOuterBg.strokeRoundedRect(-570, -60, 1140, 930, 18);
		
		// 그리드 내부 배경 - 세로 늘림
		const gridInnerBg = this.add.graphics();
		gridInnerBg.fillStyle(0xFFFFFF, 0.3);
		gridInnerBg.fillRoundedRect(-560, -50, 1120, 910, 12);
		
		boardContainer.add([frameBg, gridOuterBg, gridInnerBg]);
		
		// 그리드 셀들 제거 (회색 배경 제거)
		/*
		const gridCells = this.add.graphics();
		gridCells.fillStyle(0xCCCCCC, 0.8);
		
		const cellSize = 94;
		const cellGap = 42; // 간격 줄임 (46 -> 42)
		const startX = -370;
		const startY = 30; // 조금 아래로 (20 -> 30)
		
		for (let row = 0; row < 6; row++) {
			for (let col = 0; col < 8; col++) {
				const x = startX + col * (cellSize + cellGap);
				const y = startY + row * (cellSize + cellGap);
				gridCells.fillRoundedRect(x - cellSize/2, y - cellSize/2, cellSize, cellSize, 8);
			}
		}
		
		boardContainer.add(gridCells);
		*/
		
		// 모든 컨테이너 추가 - optionButton 제거
		this.add.existing(mainGameContainer);
		mainGameContainer.add([topUIContainer, boardContainer]);
		
		// 그리드 컨테이너를 위치 조정
		this.tileGrp = this.add.group();
		
		// 그리드 시작 위치를 보드 컨테이너 기준으로 설정 (왼쪽으로 이동)
		this.gridStartX = 840 + (-370); // 920 -> 840으로 변경, startX 참조
		this.gridStartY = 135 + 30; // startY 참조
		
		// 튜토리얼과 모달 설정
		this.setupModalAndTutorial();
		
		// 마스크 설정 (프로그레스바용)
		this.maskShape = this.add.graphics();
		this.maskShape.visible = false;
		this.updateMaskShape = (percentage) => {
			// 프로그레스바 업데이트 로직
			const newWidth = 162 * (percentage / 100);
			this.progressFill.clear();
			this.progressFill.fillStyle(0xFFD202, 1);
			this.progressFill.fillRoundedRect(-81, -13, newWidth, 26, 13);
		};
		
		// 게임 시작
		this.startGame();
		
		// 게임 시작 후 미션 아이템 업데이트
		this.updateMissionItems();
		
		// 레벨 가이드 씬을 띄움 (게임 화면은 pause하지 않음)
		this.time.delayedCall(100, () => {
			this.scene.launch('LevelGuideScene', { level: this.levelData.level });
			// pause 대신 입력만 비활성화
			this.input.enabled = false;
		});
	}
	
	setupModalAndTutorial() {
		// 모달창 설정
		this.modalWin = this.add.container(0, 0);
		this.modalWin.name = "modalWin";
		this.modalWin.visible = false;
		this.modalWin.setDepth(10);
		
		// 모달 배경
		const modalBg = this.add.rectangle(960, 540, 1920, 1080, 0x000000, 0.5);
		modalBg.setInteractive();
		this.modalWin.add(modalBg);
		
		// 모달 창
		const modalWindow = this.add.graphics();
		modalWindow.fillStyle(0xFFFFFF, 1);
		modalWindow.fillRoundedRect(460, 240, 1000, 600, 30);
		modalWindow.lineStyle(4, 0xCCCCCC, 1);
		modalWindow.strokeRoundedRect(460, 240, 1000, 600, 30);
		this.modalWin.add(modalWindow);
		
		// 닫기 버튼
		this.modalCloseBtn = this.add.graphics();
		this.modalCloseBtn.name = "close_btn";
		this.modalCloseBtn.fillStyle(0xFF0000, 0.01);
		this.modalCloseBtn.fillCircle(1400, 300, 30);
		this.modalCloseBtn.setInteractive(new Phaser.Geom.Circle(1400, 300, 30), Phaser.Geom.Circle.Contains);
		this.modalWin.add(this.modalCloseBtn);
		
		// X 표시
		const closeX = this.add.graphics();
		closeX.lineStyle(4, 0x666666, 1);
		closeX.moveTo(1380, 280);
		closeX.lineTo(1420, 320);
		closeX.moveTo(1420, 280);
		closeX.lineTo(1380, 320);
		closeX.strokePath();
		this.modalWin.add(closeX);
		
		// 확인 버튼
		this.modalOkBtn = this.add.graphics();
		this.modalOkBtn.name = "ok_btn";
		this.modalOkBtn.fillStyle(0x2196F3, 1);
		this.modalOkBtn.fillRoundedRect(830, 700, 260, 80, 20);
		this.modalOkBtn.setInteractive(new Phaser.Geom.Rectangle(830, 700, 260, 80), Phaser.Geom.Rectangle.Contains);
		this.modalWin.add(this.modalOkBtn);
		
		// 확인 버튼 텍스트
		const okText = this.add.text(960, 740, '확인', {
			fontFamily: 'Arial',
			fontSize: '32px',
			color: '#FFFFFF'
		});
		okText.setOrigin(0.5, 0.5);
		this.modalWin.add(okText);
		
		// 모달 텍스트
		this.modalTxt = this.add.text(960, 450, '안내글입니다.', {
			fontFamily: 'Arial',
			fontSize: '42px',
			color: '#090909',
			align: 'center'
		});
		this.modalTxt.name = "modal_txt";
		this.modalTxt.setOrigin(0.5, 0.5);
		this.modalWin.add(this.modalTxt);
		
		// 튜토리얼 창
		this.tutorialWin = this.add.container(0, 0);
		this.tutorialWin.name = "tutorialWin";
		this.tutorialWin.visible = false;
		this.tutorialWin.setDepth(11);
		
		// 튜토리얼 배경
		const tutorialBg = this.add.rectangle(960, 540, 1920, 1080, 0x000000, 0.5);
		tutorialBg.setInteractive();
		this.tutorialWin.add(tutorialBg);
		
		// 튜토리얼 버튼 제거 (주석 처리)
		/*
		this.tutorial_button = this.add.graphics();
		this.tutorial_button.name = "tutorial_button";
		this.tutorial_button.fillStyle(0x4CAF50, 1);
		this.tutorial_button.fillRoundedRect(100, 800, 200, 60, 20);
		this.tutorial_button.setInteractive(new Phaser.Geom.Rectangle(100, 800, 200, 60), Phaser.Geom.Rectangle.Contains);
		
		const tutorialBtnText = this.add.text(200, 830, '튜토리얼', {
			fontFamily: 'Arial',
			fontSize: '24px',
			color: '#FFFFFF'
		});
		tutorialBtnText.setOrigin(0.5, 0.5);
		*/
		
		// 이벤트 핸들러 설정
		this.modalCloseBtn.on("pointerdown", () => {
			this.modalWin.visible = false;
		});
		
		this.modalOkBtn.on("pointerdown", () => {
			this.modalWin.visible = false;
			if (this.modalWin.nxt_fn) {
				setTimeout(() => {
					this.modalWin.nxt_fn();
				}, 300);
			}
		});
		
		this.tutorial_button.on("pointerdown", () => {
			if(this.modalWin.visible) return;
			if(this.tutorialWin.visible){
				this.tutorialWin.visible = false;
				this.input.setGlobalTopOnly(false);
				// 타일 드래그 가능하게 복원
				if(this.tileGrp) {
					this.tileGrp.getAll().forEach(tile => {
						tile.setInteractive({ draggable: true });
					});
				}
				return;
			}
			this.tutorialWin.visible = true;
			this.input.setGlobalTopOnly(true);
			// 타일 드래그 불가능하게 설정
			if(this.tileGrp) {
				this.tileGrp.getAll().forEach(tile => {
					tile.disableInteractive();
				});
			}
			this.tutorialWin.alpha = 0;
			this.tweens.add({
				targets: this.tutorialWin,
				alpha: 1,
				duration: 500,
				ease: 'Linear'
			});
		});
		
		this.tutorialWin.on("pointerdown", () => {
			if(this.tutorialWin.visible){
				this.tutorialWin.visible = false;
				this.input.setGlobalTopOnly(false);
				// 타일 드래그 가능하게 복원
				if(this.tileGrp) {
					this.tileGrp.getAll().forEach(tile => {
						tile.setInteractive({ draggable: true });
					});
				}
				return;
			}
		});
		
		// 커서 효과 설정
		if(window.setPointerCursor) {
			window.setPointerCursor(this.modalCloseBtn);
			window.setPointerCursor(this.modalOkBtn);
			window.setPointerCursor(this.tutorial_button);
		}
	}
	
	//모달창을 띄우는 함수- 매개변수로 텍스트와 다음 함수를 받습니다. - 다음함수가 넘어오면 모달창의 변수 nxt_fn에 저장합니다. nxt_fn 디폴트 값은 null입니다.
	showModal(text, nxt_fn = null) {
		this.modalTxt.text = text;
		this.modalWin.alpha = 0;
		this.modalWin.visible = true;
		this.tweens.add({
			targets: this.modalWin,
			alpha: 1,
			duration: 500,
			ease: 'Linear'
		});
		this.modalWin.nxt_fn = nxt_fn;
	}
	
	updateMissionItems() {
		if (!this.core || !this.missionTargets) return;
		
		const level = this.levelData.level - 1;
		const aimTypes = this.core.aimType_array[level];
		const aimCounts = this.core.aimCnt_array[level];
		
		// 각 미션 타겟 업데이트
		aimTypes.forEach((type, index) => {
			if (index < this.missionTargets.length) {
				const target = this.missionTargets[index];
				target.type = type;
				target.text.setText(aimCounts[index].toString());
				
				// 이미지 업데이트
				if (type !== 'special' && target.image) {
					target.image.setTexture(type);
				}
			}
		});
		
		// 필요한 미션 타겟만 표시
		for (let i = 0; i < this.missionTargets.length; i++) {
			this.missionTargets[i].container.setVisible(i < aimTypes.length);
		}
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
import Match3 from "./match.js";
export default Match3Game;