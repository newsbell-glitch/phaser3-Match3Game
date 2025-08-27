export default class LevelGuideScene extends Phaser.Scene {
    constructor() {
        super({ key: 'LevelGuideScene' });
    }

    preload() {
        // 피그마에서 가져온 이미지들
        this.load.image('bear_purple_figma', 'images/bear_purple_figma.png');
        this.load.image('cat_figma', 'images/cat.png');
        this.load.image('quokka_yellow_figma', 'images/quokka_yellow_figma.png');
        this.load.image('dog_cyan_figma', 'images/dog_cyan_figma.png');
        
        // 판 이미지와 버튼들
        this.load.image('level_guide_board', 'images/level_guide_board.png');
        this.load.image('level_banner', 'images/level_banner.png');
        this.load.image('confirm_button', 'images/confirm_button.png');
    }

    create(data) {
        this.currentLevel = data.level || 1;

        // 게임 화면이 보이도록 검은색 반투명 배경
        const bg = this.add.rectangle(960, 540, 1920, 1080, 0x000000, 0.5);
        bg.setInteractive();

        // 메인 컨테이너
        const mainContainer = this.add.container(960, 540);

        // 1. 판 이미지 배치 (피그마 크기: 752x725)
        const board = this.add.image(0, 0, 'level_guide_board');
        board.setScale(0.495); // 752/1520 = 0.495
        mainContainer.add(board);

        // 2. 레벨 배너 (판 위쪽에 겹치게)
        const levelBanner = this.add.image(0, -340, 'level_banner');
        levelBanner.setScale(0.493);
        mainContainer.add(levelBanner);

        // 레벨 텍스트 (배너 위에)
        const levelText = this.add.text(0, -340, `LEVEL ${this.currentLevel.toString().padStart(2, '0')}`, {
            fontSize: '60px',
            fontFamily: 'Arial Black',
            color: '#FEF4BF',
            stroke: '#914A28',
            strokeThickness: 3
        });
        levelText.setOrigin(0.5);
        mainContainer.add(levelText);

        // 3. X 버튼 (투명 히트 영역)
        const xButton = this.add.circle(340, -340, 48, 0x000000, 0);
        xButton.setInteractive({ useHandCursor: true });
        
        xButton.on('pointerup', () => {
            this.scene.stop();
            this.scene.get('Match3Game').startLevel();
        });
        
        mainContainer.add(xButton);

        // 4. 미션 아이템들 (회색 박스 내부)
        const missionY = -120;
        const items = this.currentLevel === 1 ? 
            [
                { x: -100, image: 'bear_purple_figma', count: 6 },
                { x: 100, image: 'cat_figma', count: 9 }
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

        // 6. 확인 완료 버튼 (텍스트 없이 버튼만)
        const confirmButton = this.add.image(0, 210, 'confirm_button');
        confirmButton.setScale(0.204);
        confirmButton.setInteractive({ useHandCursor: true });
        mainContainer.add(confirmButton);
        
        // 버튼 이벤트
        confirmButton.on('pointerdown', () => {
            confirmButton.y += 5;
        });
        
        confirmButton.on('pointerup', () => {
            confirmButton.y -= 5;
            this.scene.stop();
            this.scene.get('Match3Game').startLevel();
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