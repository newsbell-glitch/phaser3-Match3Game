export default class LevelGuideScene extends Phaser.Scene {
    constructor() {
        super({ key: 'LevelGuideScene' });
    }

    preload() {
        // 필요한 이미지들 로드
        if (!this.textures.exists('bear_purple_figma')) {
            this.load.image('bear_purple_figma', 'images/bear_purple_figma.png');
        }
        if (!this.textures.exists('cat')) {
            this.load.image('cat', 'images/cat.png');
        }
        if (!this.textures.exists('quokka_yellow_figma')) {
            this.load.image('quokka_yellow_figma', 'images/quokka_yellow_figma.png');
        }
        if (!this.textures.exists('dog_cyan_figma')) {
            this.load.image('dog_cyan_figma', 'images/dog_cyan_figma.png');
        }
    }

    create(data) {
        this.currentLevel = data.level || 1;

        // 게임 화면이 보이도록 검은색 반투명 배경
        const bg = this.add.rectangle(960, 540, 1920, 1080, 0x000000, 0.6);
        bg.setInteractive();

        // 메인 컨테이너
        const mainContainer = this.add.container(960, 540);

        // 1. 메인 패널 배경 (파란색 계열)
        const panelBg = this.add.graphics();
        panelBg.fillStyle(0x4A90E2, 1);
        panelBg.fillRoundedRect(-350, -250, 700, 500, 30);
        panelBg.lineStyle(4, 0x3A7BC8, 1);
        panelBg.strokeRoundedRect(-350, -250, 700, 500, 30);
        mainContainer.add(panelBg);

        // 2. 상단 레벨 표시 영역 (갈색 리본 스타일)
        const ribbonBg = this.add.graphics();
        ribbonBg.fillStyle(0x8B4513, 1);
        ribbonBg.fillRoundedRect(-200, -240, 400, 80, 15);
        ribbonBg.lineStyle(2, 0x654321, 1);
        ribbonBg.strokeRoundedRect(-200, -240, 400, 80, 15);
        mainContainer.add(ribbonBg);

        // 레벨 텍스트
        const levelText = this.add.text(0, -200, `LEVEL ${this.currentLevel.toString().padStart(2, '0')}`, {
            fontSize: '52px',
            fontFamily: 'Arial Black',
            color: '#FFFFFF',
            stroke: '#654321',
            strokeThickness: 4,
            shadow: {
                offsetY: 3,
                color: '#000000',
                blur: 2,
                fill: true
            }
        });
        levelText.setOrigin(0.5);
        mainContainer.add(levelText);

        // 3. X 버튼 (우상단)
        const xButtonBg = this.add.graphics();
        xButtonBg.fillStyle(0xFF0000, 0.01);
        xButtonBg.fillCircle(320, -210, 35);
        xButtonBg.setInteractive(new Phaser.Geom.Circle(320, -210, 35), Phaser.Geom.Circle.Contains);
        mainContainer.add(xButtonBg);
        
        // X 표시
        const xMark = this.add.graphics();
        xMark.lineStyle(5, 0xFFFFFF, 1);
        xMark.moveTo(305, -225);
        xMark.lineTo(335, -195);
        xMark.moveTo(335, -225);
        xMark.lineTo(305, -195);
        xMark.strokePath();
        mainContainer.add(xMark);

        xButtonBg.on('pointerup', () => {
            this.closeGuideAndStartGame();
        });

        // 4. 미션 영역 배경
        const missionAreaBg = this.add.graphics();
        missionAreaBg.fillStyle(0xFFFFFF, 0.95);
        missionAreaBg.fillRoundedRect(-320, -100, 640, 200, 20);
        mainContainer.add(missionAreaBg);

        // 5. 미션 아이템들
        const missionY = 0;
        const items = this.currentLevel === 1 ? 
            [
                { x: -200, image: 'bear_purple_figma', count: 6, color: 0x9B59B6 },
                { x: 0, image: 'quokka_yellow_figma', count: 6, color: 0xF1C40F },
                { x: 200, image: 'cat', count: 6, color: 0xE67E22 }
            ] : this.currentLevel === 2 ?
            [
                { x: -200, image: 'bear_purple_figma', count: 3, color: 0x9B59B6 },
                { x: 0, image: 'cat', count: 6, color: 0xE67E22 },
                { x: 200, image: 'dog_cyan_figma', count: 9, color: 0x3498DB }
            ] :
            [
                { x: -200, image: 'bear_purple_figma', count: 6, color: 0x9B59B6 },
                { x: 0, image: 'quokka_yellow_figma', count: 6, color: 0xF1C40F },
                { x: 200, image: 'dog_cyan_figma', count: 6, color: 0x3498DB }
            ];

        items.forEach((item) => {
            // 동물 컨테이너
            const animalContainer = this.add.container(item.x, missionY);
            
            // 동물 배경 원
            const animalBg = this.add.graphics();
            animalBg.fillStyle(0xF0F0F0, 1);
            animalBg.fillCircle(0, -10, 55);
            animalBg.lineStyle(3, 0xDDDDDD, 1);
            animalBg.strokeCircle(0, -10, 55);
            animalContainer.add(animalBg);
            
            // 동물 이미지 또는 색상 원
            if (this.textures.exists(item.image)) {
                const animal = this.add.image(0, -10, item.image);
                animal.setDisplaySize(90, 90);
                animalContainer.add(animal);
            } else {
                // 이미지가 없으면 색상 원으로 대체
                const colorCircle = this.add.graphics();
                colorCircle.fillStyle(item.color, 1);
                colorCircle.fillCircle(0, -10, 45);
                animalContainer.add(colorCircle);
                
                // 간단한 얼굴 표시
                const face = this.add.graphics();
                face.fillStyle(0xFFFFFF, 1);
                face.fillCircle(-15, -15, 5);
                face.fillCircle(15, -15, 5);
                face.lineStyle(3, 0xFFFFFF, 1);
                face.moveTo(-10, 0);
                face.lineTo(10, 0);
                face.strokePath();
                animalContainer.add(face);
            }
            
            // 숫자 배경 (큰 원)
            const numberBg = this.add.graphics();
            numberBg.fillStyle(0xFFFFFF, 1);
            numberBg.fillCircle(0, 55, 28);
            numberBg.lineStyle(3, 0x333333, 1);
            numberBg.strokeCircle(0, 55, 28);
            animalContainer.add(numberBg);
            
            // 숫자
            const number = this.add.text(0, 55, item.count.toString(), {
                fontSize: '36px',
                fontFamily: 'Arial Black',
                color: '#333333',
                fontStyle: 'bold'
            });
            number.setOrigin(0.5);
            animalContainer.add(number);
            
            mainContainer.add(animalContainer);
        });

        // 6. 설명 텍스트
        const descText = this.add.text(0, 130, '목표 타일의 갯수만큼\n젤리를 제거하기', {
            fontSize: '28px',
            fontFamily: 'Arial',
            color: '#333333',
            align: 'center',
            lineSpacing: 8
        });
        descText.setOrigin(0.5);
        mainContainer.add(descText);

        // 7. 확인 버튼 (노란색)
        const confirmButton = this.add.graphics();
        confirmButton.fillStyle(0xFFD700, 1);
        confirmButton.fillRoundedRect(-100, 180, 200, 60, 25);
        confirmButton.lineStyle(3, 0xFFA500, 1);
        confirmButton.strokeRoundedRect(-100, 180, 200, 60, 25);
        confirmButton.setInteractive(new Phaser.Geom.Rectangle(-100, 180, 200, 60), Phaser.Geom.Rectangle.Contains);
        mainContainer.add(confirmButton);
        
        // 버튼 텍스트
        const buttonText = this.add.text(0, 210, '확인', {
            fontSize: '32px',
            fontFamily: 'Arial Black',
            color: '#FFFFFF',
            stroke: '#FF8C00',
            strokeThickness: 3
        });
        buttonText.setOrigin(0.5);
        mainContainer.add(buttonText);

        // 버튼 호버 효과
        confirmButton.on('pointerover', () => {
            confirmButton.clear();
            confirmButton.fillStyle(0xFFE44D, 1);
            confirmButton.fillRoundedRect(-100, 180, 200, 60, 25);
            confirmButton.lineStyle(3, 0xFFA500, 1);
            confirmButton.strokeRoundedRect(-100, 180, 200, 60, 25);
        });

        confirmButton.on('pointerout', () => {
            confirmButton.clear();
            confirmButton.fillStyle(0xFFD700, 1);
            confirmButton.fillRoundedRect(-100, 180, 200, 60, 25);
            confirmButton.lineStyle(3, 0xFFA500, 1);
            confirmButton.strokeRoundedRect(-100, 180, 200, 60, 25);
        });

        confirmButton.on('pointerup', () => {
            this.closeGuideAndStartGame();
        });

        // 애니메이션 효과
        mainContainer.setScale(0.8);
        mainContainer.setAlpha(0);
        
        this.tweens.add({
            targets: mainContainer,
            scale: 1,
            alpha: 1,
            duration: 300,
            ease: 'Back.easeOut'
        });
    }

    closeGuideAndStartGame() {
        // 페이드 아웃 애니메이션
        this.tweens.add({
            targets: this.children.list,
            alpha: 0,
            duration: 200,
            onComplete: () => {
                // Match3Game 씬에 게임 시작 신호 보내기
                const gameScene = this.scene.get('Match3Game');
                if (gameScene && gameScene.startLevel) {
                    gameScene.startLevel();
                }
                this.scene.stop();
            }
        });
    }
}