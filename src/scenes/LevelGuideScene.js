export default class LevelGuideScene extends Phaser.Scene {
    constructor() {
        super({ key: 'LevelGuideScene' });
    }

    preload() {
        // 모든 필요한 이미지들이 이미 Preload 씬에서 asset-pack.json을 통해 로드되었으므로
        // 여기서는 추가 로딩이 필요하지 않습니다.
        // 만약 이미지가 로드되지 않았다면 개별적으로 로드
        if (!this.textures.exists('game_help_bg')) {
            this.load.image('game_help_bg', 'images/game_help_bg.png');
        }
        if (!this.textures.exists('confirm_button')) {
            this.load.image('confirm_button', 'images/confirm_button.png');
        }
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
        if (!this.textures.exists('level_guide_board')) {
            this.load.image('level_guide_board', 'images/level_guide_board.png');
        }
        if (!this.textures.exists('level_banner')) {
            this.load.image('level_banner', 'images/level_banner.png');
        }
    }

    create(data) {
        this.currentLevel = data.level || 1;

        // 게임 화면이 보이도록 검은색 반투명 배경
        const bg = this.add.rectangle(960, 540, 1920, 1080, 0x000000, 0.5);
        bg.setInteractive();

        // 메인 컨테이너
        const mainContainer = this.add.container(960, 540);

        // 1. 도움말 배경 이미지 사용 (game_help_bg.png)
        let board;
        if (this.textures.exists('game_help_bg')) {
            board = this.add.image(0, 0, 'game_help_bg');
            // game_help_bg.png 크기에 맞게 조정
            board.setDisplaySize(800, 600); // 적절한 크기로 조정
        } else if (this.textures.exists('level_guide_board')) {
            // 대체 이미지 사용
            board = this.add.image(0, 0, 'level_guide_board');
            board.setScale(0.495);
        } else {
            // 기본 사각형 배경
            board = this.add.rectangle(0, 0, 800, 600, 0xf0f0f0);
            board.setStrokeStyle(4, 0x666666);
        }
        mainContainer.add(board);

        // 2. 레벨 배너 (판 위쪽에 겹치게)
        if (this.textures.exists('level_banner')) {
            const levelBanner = this.add.image(0, -250, 'level_banner');
            levelBanner.setScale(0.493);
            mainContainer.add(levelBanner);
        }

        // 레벨 텍스트 (배너 위에 또는 상단에)
        const levelText = this.add.text(0, -250, `LEVEL ${this.currentLevel.toString().padStart(2, '0')}`, {
            fontSize: '60px',
            fontFamily: 'Arial Black',
            color: '#FEF4BF',
            stroke: '#914A28',
            strokeThickness: 3
        });
        levelText.setOrigin(0.5);
        mainContainer.add(levelText);

        // 3. X 버튼 (투명 히트 영역) - 우상단
        const xButton = this.add.circle(350, -250, 48, 0xff0000, 0.1); // 약간 보이게 설정
        xButton.setInteractive({ useHandCursor: true });
        
        // X 표시 추가
        const xGraphics = this.add.graphics();
        xGraphics.lineStyle(6, 0x666666, 1);
        xGraphics.beginPath();
        xGraphics.moveTo(330, -270);
        xGraphics.lineTo(370, -230);
        xGraphics.moveTo(370, -270);
        xGraphics.lineTo(330, -230);
        xGraphics.strokePath();
        mainContainer.add(xGraphics);
        
        xButton.on('pointerup', () => {
            this.scene.stop();
            if (this.scene.get('Match3Game')) {
                this.scene.get('Match3Game').startLevel();
            }
        });
        
        mainContainer.add(xButton);

        // 4. 미션 아이템들 (회색 박스 내부)
        const missionY = -80;
        const items = this.currentLevel === 1 ? 
            [
                { x: -100, image: 'bear_purple_figma', count: 6 },
                { x: 100, image: 'cat', count: 9 }
            ] :
            [
                { x: -180, image: 'bear_purple_figma', count: 6 },
                { x: 0, image: 'quokka_yellow_figma', count: 6 },
                { x: 180, image: 'dog_cyan_figma', count: 6 }
            ];

        items.forEach((item) => {
            // 동물 그림자
            const shadowImg = this.add.image(item.x + 4, missionY + 4, item.image);
            shadowImg.setDisplaySize(110, 112);
            shadowImg.setTint(0x000000);
            shadowImg.setAlpha(0.3);
            mainContainer.add(shadowImg);
            
            // 동물 이미지
            if (this.textures.exists(item.image)) {
                const animal = this.add.image(item.x, missionY, item.image);
                animal.setDisplaySize(110, 112);
                mainContainer.add(animal);
            } else {
                // 이미지가 없으면 임시 사각형
                const tempRect = this.add.rectangle(item.x, missionY, 110, 112, 0xcccccc);
                tempRect.setStrokeStyle(2, 0x666666);
                mainContainer.add(tempRect);
                
                const tempText = this.add.text(item.x, missionY, item.image, {
                    fontSize: '12px',
                    color: '#333333'
                });
                tempText.setOrigin(0.5);
                mainContainer.add(tempText);
            }
            
            // 숫자 (오른쪽 하단)
            const numberX = item.x + 45;
            const numberY = missionY + 45;
            
            // 숫자 배경 (흰색 원)
            const numberBg = this.add.graphics();
            numberBg.fillStyle(0xFFFFFF, 1);
            numberBg.fillCircle(numberX, numberY, 20);
            numberBg.lineStyle(2, 0x666666, 1);
            numberBg.strokeCircle(numberX, numberY, 20);
            mainContainer.add(numberBg);
            
            // 숫자
            const number = this.add.text(numberX, numberY, item.count.toString(), {
                fontSize: '36px',
                fontFamily: 'Arial Black',
                color: '#333333'
            });
            number.setOrigin(0.5);
            mainContainer.add(number);
        });

        // 5. 설명 텍스트
        const descText = this.add.text(0, 50, '목표 타일의 갯수만큼\n젤리를 제거하기', {
            fontSize: '38px',
            fontFamily: 'Arial',
            color: '#528AAA',
            align: 'center',
            lineSpacing: 12
        });
        descText.setOrigin(0.5);
        mainContainer.add(descText);

        // 6. 확인 완료 버튼 (confirm_button.png 사용)
        let confirmButton;
        if (this.textures.exists('confirm_button')) {
            confirmButton = this.add.image(0, 180, 'confirm_button');
            confirmButton.setDisplaySize(200, 60); // 적절한 크기로 조정
        } else {
            // 대체 버튼
            confirmButton = this.add.rectangle(0, 180, 200, 60, 0x4CAF50);
            confirmButton.setStrokeStyle(3, 0x2E7D32);
            
            const buttonText = this.add.text(0, 180, 'CONFIRM', {
                fontSize: '24px',
                fontFamily: 'Arial Black',
                color: '#FFFFFF'
            });
            buttonText.setOrigin(0.5);
            mainContainer.add(buttonText);
        }
        
        confirmButton.setInteractive({ useHandCursor: true });
        mainContainer.add(confirmButton);
        
        // 버튼 이벤트
        confirmButton.on('pointerdown', () => {
            confirmButton.y += 5;
        });
        
        confirmButton.on('pointerup', () => {
            confirmButton.y -= 5;
            this.scene.stop();
            if (this.scene.get('Match3Game')) {
                this.scene.get('Match3Game').startLevel();
            }
        });

        // 호버 효과
        confirmButton.on('pointerover', () => {
            confirmButton.setTint(0xdddddd);
        });

        confirmButton.on('pointerout', () => {
            confirmButton.clearTint();
        });

        // 등장 애니메이션
        mainContainer.setScale(0);
        mainContainer.setAlpha(0);
        
        this.tweens.add({
            targets: mainContainer,
            scale: 1,
            alpha: 1,
            duration: 500,
            ease: 'Back.easeOut'
        });
    }
}