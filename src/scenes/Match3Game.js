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
		this.load.image('settings_img', 'images/settings.png');
		
		// 동물 이미지들 로드
		this.load.image('bear_img', 'images/bear.png');
		this.load.image('cat_img', 'images/cat.png');
		this.load.image('dog_img', 'images/dog.png');
		this.load.image('rabbit_img', 'images/rabbit.png');
		this.load.image('raccoon_img', 'images/raccoon.png');
		this.load.image('quokka_img', 'images/quokka.png');
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
		
		// ===============================================
		// 왼쪽 미션 패널 영역 (이미지 디자인 참조)
		// ===============================================
		const leftPanelContainer = this.add.container(200, 540);
		
		// 메인 패널 배경 (회색 둥근 사각형)
		const panelBg = this.add.graphics();
		panelBg.fillStyle(0xE8E8E8, 1);
		panelBg.fillRoundedRect(-150, -450, 300, 900, 25);
		panelBg.lineStyle(3, 0xD0D0D0, 1);
		panelBg.strokeRoundedRect(-150, -450, 300, 900, 25);
		leftPanelContainer.add(panelBg);
		
		// 상단 핀 아이콘
		const pinIcon = this.add.image(0, -430, 'pin_img');
		pinIcon.setDisplaySize(40, 52);
		leftPanelContainer.add(pinIcon);
		
		// 레벨 표시 영역
		const levelContainer = this.add.container(0, -330);
		
		// Lv 텍스트 (파란색)
		const levelLabel = this.add.text(-35, 0, 'Lv', {
			fontFamily: 'Arial Black',
			fontSize: '42px',
			color: '#4A90E2',
			fontStyle: 'bold'
		});
		levelLabel.setOrigin(0.5, 0.5);
		
		// 레벨 숫자 (큰 사이즈)
		this.lv_txt = this.add.text(25, 0, this.levelData.level.toString().padStart(2, '0'), {
			fontFamily: 'Arial Black',
			fontSize: '56px',
			color: '#333333',
			fontStyle: 'bold'
		});
		this.lv_txt.setOrigin(0.5, 0.5);
		
		levelContainer.add([levelLabel, this.lv_txt]);
		leftPanelContainer.add(levelContainer);
		
		// 프로그레스바 영역
		const progressContainer = this.add.container(0, -250);
		
		// 프로그레스바 외곽
		const progressBg = this.add.graphics();
		progressBg.fillStyle(0x666666, 1);
		progressBg.fillRoundedRect(-100, -15, 200, 30, 15);
		
		// 프로그레스바 내부 배경
		const progressInner = this.add.graphics();
		progressInner.fillStyle(0x333333, 1);
		progressInner.fillRoundedRect(-98, -13, 196, 26, 13);
		
		// 프로그레스바 채우기 (노란색)
		this.progressFill = this.add.graphics();
		this.progressFill.fillStyle(0xFFD700, 1);
		const progressWidth = 196 * 0.4; // 40% 채워진 상태
		this.progressFill.fillRoundedRect(-98, -13, progressWidth, 26, 13);
		
		progressContainer.add([progressBg, progressInner, this.progressFill]);
		leftPanelContainer.add(progressContainer);
		
		// MISSION 텍스트
		const missionText = this.add.text(0, -150, 'MISSION', {
			fontFamily: 'Arial Black',
			fontSize: '28px',
			color: '#666666',
			fontStyle: 'bold'
		});
		missionText.setOrigin(0.5, 0.5);
		leftPanelContainer.add(missionText);
		
		// 미션 아이템들 영역
		const missionItems = this.levelData.level === 1 ? 
			[
				{ type: 'bear_purple_figma', count: 6, y: -50 },
				{ type: 'quokka_img', count: 6, y: 50 },
				{ type: 'cat_img', count: 6, y: 150 }
			] : this.levelData.level === 2 ?
			[
				{ type: 'bear_purple_figma', count: 3, y: -50 },
				{ type: 'cat_img', count: 6, y: 50 },
				{ type: 'dog_img', count: 9, y: 150 }
			] :
			[
				{ type: 'bear_purple_figma', count: 6, y: -50 },
				{ type: 'quokka_img', count: 6, y: 50 },
				{ type: 'raccoon_img', count: 6, y: 150 }
			];
		
		this.missionTargets = [];
		
		missionItems.forEach((item, index) => {
			const itemContainer = this.add.container(0, item.y);
			
			// 미션 아이템 배경 (원형)
			const itemBg = this.add.graphics();
			itemBg.fillStyle(0xFFFFFF, 1);
			itemBg.fillCircle(-40, 0, 35);
			itemBg.lineStyle(2, 0xDDDDDD, 1);
			itemBg.strokeCircle(-40, 0, 35);
			itemContainer.add(itemBg);
			
			// 동물 이미지
			let animalImg;
			if (item.type === 'bear_purple_figma') {
				// 보라색 곰 이미지 생성 (임시)
				const bearBg = this.add.graphics();
				bearBg.fillStyle(0x9B59B6, 1);
				bearBg.fillCircle(-40, 0, 28);
				itemContainer.add(bearBg);
			} else if (this.textures.exists(item.type)) {
				animalImg = this.add.image(-40, 0, item.type);
				animalImg.setDisplaySize(56, 56);
				itemContainer.add(animalImg);
			}
			
			// 개수 텍스트 (오른쪽)
			const countText = this.add.text(40, 0, item.count.toString(), {
				fontFamily: 'Arial Black',
				fontSize: '36px',
				color: '#333333',
				fontStyle: 'bold'
			});
			countText.setOrigin(0.5, 0.5);
			itemContainer.add(countText);
			
			leftPanelContainer.add(itemContainer);
			this.missionTargets.push({ 
				container: itemContainer, 
				text: countText, 
				type: item.type,
				image: animalImg
			});
		});
		
		// 하단 버튼들
		const bottomButtonsContainer = this.add.container(0, 350);
		
		// 물음표 버튼 (파란색 배경)
		const questionBtnBg = this.add.graphics();
		questionBtnBg.fillStyle(0x4A90E2, 1);
		questionBtnBg.fillCircle(-60, 0, 35);
		questionBtnBg.lineStyle(2, 0x3A7BC8, 1);
		questionBtnBg.strokeCircle(-60, 0, 35);
		
		const questionBtn = this.add.image(-60, 0, 'question_img');
		questionBtn.setDisplaySize(30, 40);
		questionBtn.setInteractive({ useHandCursor: true });
		
		// 설정 버튼 (회색 배경)
		const settingsBtnBg = this.add.graphics();
		settingsBtnBg.fillStyle(0x888888, 1);
		settingsBtnBg.fillCircle(60, 0, 35);
		settingsBtnBg.lineStyle(2, 0x666666, 1);
		settingsBtnBg.strokeCircle(60, 0, 35);
		
		const settingsBtn = this.add.image(60, 0, 'settings_img');
		settingsBtn.setDisplaySize(40, 40);
		settingsBtn.setInteractive({ useHandCursor: true });
		
		bottomButtonsContainer.add([questionBtnBg, questionBtn, settingsBtnBg, settingsBtn]);
		leftPanelContainer.add(bottomButtonsContainer);
		
		// 물음표 버튼 클릭 이벤트 (튜토리얼)
		questionBtn.on('pointerup', () => {
			if (this.tutorialWin) {
				if (this.tutorialWin.visible) {
					this.tutorialWin.visible = false;
					this.input.setGlobalTopOnly(false);
					if (this.tileGrp) {
						this.tileGrp.getAll().forEach(tile => {
							tile.setInteractive({ draggable: true });
						});
					}
				} else {
					this.tutorialWin.visible = true;
					this.input.setGlobalTopOnly(true);
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
		
		// ===============================================
		// 게임 보드 영역 (8x6 그리드)
		// ===============================================
		const boardContainer = this.add.container(960, 540);
		
		// 게임보드 배경 (어두운 배경)
		const boardBg = this.add.graphics();
		boardBg.fillStyle(0x2C3E50, 0.9);
		boardBg.fillRoundedRect(-380, -300, 760, 600, 20);
		boardContainer.add(boardBg);
		
		// 그리드 셀 표시 (선택적)
		const gridCells = this.add.graphics();
		gridCells.fillStyle(0x34495E, 0.5);
		
		const cellSize = 85;
		const cellGap = 10;
		const totalCellWidth = cellSize + cellGap;
		const gridWidth = 8 * cellSize + 7 * cellGap;
		const gridHeight = 6 * cellSize + 5 * cellGap;
		const startX = -gridWidth / 2;
		const startY = -gridHeight / 2;
		
		for (let row = 0; row < 6; row++) {
			for (let col = 0; col < 8; col++) {
				const x = startX + col * totalCellWidth;
				const y = startY + row * totalCellWidth;
				gridCells.fillRoundedRect(x, y, cellSize, cellSize, 8);
			}
		}
		
		boardContainer.add(gridCells);
		
		// 타일 그룹
		this.tileGrp = this.add.group();
		
		// 그리드 시작 위치 설정 (보드 중앙 기준)
		this.gridStartX = 960 + startX + cellSize / 2;
		this.gridStartY = 540 + startY + cellSize / 2;
		
		// 모달과 튜토리얼 창 설정
		this.setupModalAndTutorial();
		
		// 마스크 설정 (프로그레스바용)
		this.maskShape = this.add.graphics();
		this.maskShape.visible = false;
		this.updateMaskShape = (percentage) => {
			const newWidth = 196 * (percentage / 100);
			this.progressFill.clear();
			this.progressFill.fillStyle(0xFFD700, 1);
			this.progressFill.fillRoundedRect(-98, -13, newWidth, 26, 13);
		};
		
		// 게임 시작
		this.startGame();
		
		// 게임 시작 후 미션 아이템 업데이트
		this.updateMissionItems();
		
		// 레벨 가이드 씬을 띄움
		this.time.delayedCall(100, () => {
			this.scene.launch('LevelGuideScene', { level: this.levelData.level });
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
		
		// 튜토리얼 내용 창
		const tutorialWindow = this.add.graphics();
		tutorialWindow.fillStyle(0xFFFFFF, 1);
		tutorialWindow.fillRoundedRect(560, 340, 800, 400, 25);
		tutorialWindow.lineStyle(3, 0x4A90E2, 1);
		tutorialWindow.strokeRoundedRect(560, 340, 800, 400, 25);
		this.tutorialWin.add(tutorialWindow);
		
		// 튜토리얼 제목
		const tutorialTitle = this.add.text(960, 400, '게임 방법', {
			fontFamily: 'Arial Black',
			fontSize: '36px',
			color: '#333333'
		});
		tutorialTitle.setOrigin(0.5, 0.5);
		this.tutorialWin.add(tutorialTitle);
		
		// 튜토리얼 내용
		const tutorialContent = this.add.text(960, 540, 
			'같은 동물 3개 이상을 연결하여\n없애주세요!\n\n미션 목표를 달성하면\n다음 레벨로 진행됩니다.', 
			{
				fontFamily: 'Arial',
				fontSize: '28px',
				color: '#555555',
				align: 'center',
				lineSpacing: 10
			}
		);
		tutorialContent.setOrigin(0.5, 0.5);
		this.tutorialWin.add(tutorialContent);
		
		// 튜토리얼 닫기 버튼
		const tutorialCloseBtn = this.add.graphics();
		tutorialCloseBtn.fillStyle(0x4A90E2, 1);
		tutorialCloseBtn.fillRoundedRect(860, 660, 200, 60, 20);
		tutorialCloseBtn.setInteractive(new Phaser.Geom.Rectangle(860, 660, 200, 60), Phaser.Geom.Rectangle.Contains);
		this.tutorialWin.add(tutorialCloseBtn);
		
		const tutorialCloseBtnText = this.add.text(960, 690, '닫기', {
			fontFamily: 'Arial',
			fontSize: '28px',
			color: '#FFFFFF'
		});
		tutorialCloseBtnText.setOrigin(0.5, 0.5);
		this.tutorialWin.add(tutorialCloseBtnText);
		
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
		
		tutorialCloseBtn.on("pointerdown", () => {
			this.tutorialWin.visible = false;
			this.input.setGlobalTopOnly(false);
			// 타일 드래그 가능하게 복원
			if(this.tileGrp) {
				this.tileGrp.getAll().forEach(tile => {
					tile.setInteractive({ draggable: true });
				});
			}
		});
		
		this.tutorialWin.on("pointerdown", (pointer, localX, localY, event) => {
			// 튜토리얼 창 외부 클릭시 닫기
			if (pointer.x < 560 || pointer.x > 1360 || pointer.y < 340 || pointer.y > 740) {
				this.tutorialWin.visible = false;
				this.input.setGlobalTopOnly(false);
				if(this.tileGrp) {
					this.tileGrp.getAll().forEach(tile => {
						tile.setInteractive({ draggable: true });
					});
				}
			}
		});
		
		// 커서 효과 설정
		if(window.setPointerCursor) {
			window.setPointerCursor(this.modalCloseBtn);
			window.setPointerCursor(this.modalOkBtn);
			window.setPointerCursor(tutorialCloseBtn);
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