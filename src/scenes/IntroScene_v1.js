class IntroScene extends Phaser.Scene {
    constructor() {
        super({ key: 'IntroScene' });
    }

    preload() {
        // 인트로 화면에 필요한 이미지들 로드
        this.load.image('forest_bg', 'images/forest_bg.png');
        this.load.image('logo', 'images/logo.png');
        this.load.image('button_bg', 'images/button_bg.png');
        this.load.image('rank_text', 'images/rank_text.png');
        this.load.image('start_text', 'images/start_text.png');
        this.load.image('star_tail1', 'images/star_tail1.png');
        this.load.image('sparkle1', 'images/sparkle1.png');
        this.load.image('star1', 'images/star1.png');
        this.load.image('star_tail2', 'images/star_tail2.png');
        this.load.image('star3', 'images/star3.png');
    }

    create() {
        // 게임 크기 설정
        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;

        // 배경 설정 (흰색)
        this.cameras.main.setBackgroundColor('#FFFFFF');

        // 배경 이미지 (절대 위치)
        const forestBg = this.add.image(centerX, 1080, 'forest_bg');
        forestBg.setOrigin(0.5, 1);
        forestBg.setDisplaySize(1920, 248);

        // 로고 (중앙 정렬)
        const logo = this.add.image(centerX, 184 + 255.5, 'logo');
        logo.setOrigin(0.5, 0.5);

        // 버튼들 (로고 아래 110px gap)
        const buttonY = 184 + 255.5 + 255.5 + 110;

        // Rank 버튼
        const rankButton = this.add.container(centerX - 247.5, buttonY);
        const rankBg = this.add.image(0, 0, 'button_bg');
        rankBg.setOrigin(0.5, 0.5);
        const rankText = this.add.image(0, 0, 'rank_text');
        rankText.setOrigin(0.5, 0.5);
        rankText.setScale(181.33 / rankText.width, 53.67 / rankText.height);
        rankButton.add([rankBg, rankText]);
        rankButton.setSize(359, 128);
        rankButton.setInteractive();

        // Start 버튼
        const startButton = this.add.container(centerX + 247.5, buttonY);
        const startBg = this.add.image(0, 0, 'button_bg');
        startBg.setOrigin(0.5, 0.5);
        const startText = this.add.image(0, 0, 'start_text');
        startText.setOrigin(0.5, 0.5);
        startText.setScale(209.67 / startText.width, 53.67 / startText.height);
        startButton.add([startBg, startText]);
        startButton.setSize(359, 128);
        startButton.setInteractive();

        // Start 버튼 (가운데 큰 버튼) - 위치: x=636, y=501에서 시작하는 383.43x126 크기
        const startMainButton = this.add.container(636 + 383.43/2, 501 + 126/2);
        
        // 그림자 효과
        const shadow = this.add.graphics();
        shadow.fillStyle(0x000000, 0.25);
        shadow.fillRoundedRect(-383.43/2 + 4, -126/2 + 4, 383.43, 126, 63);
        
        // 버튼 배경 (빈 사각형 - 이미지가 없음)
        const graphics = this.add.graphics();
        graphics.fillStyle(0xFFFFFF, 0); // 투명
        graphics.fillRect(-383.43/2, -126/2, 383.43, 126);
        
        startMainButton.add([shadow, graphics]);
        startMainButton.setSize(383.43, 126);
        startMainButton.setInteractive();

        // 왼쪽 별 그룹 - 중앙에서 왼쪽으로 (gap: 122px)
        const leftStarX = centerX - 122 - 137;
        const leftStarY = 204 + 153;
        
        const starTail1 = this.add.image(leftStarX - 133.035 + 48.72, leftStarY + 165.05 - 153 + 57.085, 'star_tail1');
        starTail1.setOrigin(0.5, 0.5);
        starTail1.setDisplaySize(97.44, 114.17);
        
        const sparkle1Left = this.add.image(leftStarX - 133.035 + 160.285, leftStarY - 153 + 22.435, 'sparkle1');
        sparkle1Left.setOrigin(0.5, 0.5);
        sparkle1Left.setDisplaySize(36.53, 44.87);
        
        const star1 = this.add.image(leftStarX - 133.035 + 204.02, leftStarY + 181.9 - 153 + 62.05, 'star1');
        star1.setOrigin(0.5, 0.5);
        star1.setDisplaySize(124.1, 124.1);

        // 오른쪽 별 그룹
        const rightStarX = centerX + 122;
        const rightStarY = 204 + 158;
        
        const sparkle1Right = this.add.image(rightStarX + 78.96, rightStarY + 200 - 158 + 15, 'sparkle1');
        sparkle1Right.setOrigin(0.5, 0.5);
        sparkle1Right.setDisplaySize(24.42, 30);
        
        const starTail2 = this.add.image(rightStarX + 118.29, rightStarY + 101.5 - 158 + 56.5, 'star_tail2');
        starTail2.setOrigin(0.5, 0.5);
        starTail2.setDisplaySize(96.58, 113);
        
        const star3 = this.add.image(rightStarX + 158.99, rightStarY + 68 - 158 + 8.5, 'star3');
        star3.setOrigin(0.5, 0.5);
        star3.setDisplaySize(16.06, 17);

        // 버튼 호버 효과
        this.setupButtonEffects(rankButton, rankBg);
        this.setupButtonEffects(startButton, startBg);
        this.setupButtonEffects(startMainButton, graphics);

        // Start 버튼 클릭 이벤트
        startButton.on('pointerup', () => {
            this.startGame();
        });

        startMainButton.on('pointerup', () => {
            this.startGame();
        });

        // 별 애니메이션
        this.setupStarAnimations(star1, sparkle1Left, starTail1);
        this.setupStarAnimations(star3, sparkle1Right, starTail2);
    }

    setupButtonEffects(button, background) {
        const originalScale = background.scaleX;
        
        button.on('pointerover', () => {
            if (background.setScale) {
                background.setScale(originalScale * 1.05);
            }
        });

        button.on('pointerout', () => {
            if (background.setScale) {
                background.setScale(originalScale);
            }
        });

        button.on('pointerdown', () => {
            if (background.setScale) {
                background.setScale(originalScale * 0.95);
            }
        });

        button.on('pointerup', () => {
            if (background.setScale) {
                background.setScale(originalScale * 1.05);
            }
        });
    }

    setupStarAnimations(star, sparkle, tail) {
        // 별 회전 애니메이션
        this.tweens.add({
            targets: star,
            angle: 360,
            duration: 3000,
            repeat: -1,
            ease: 'Linear'
        });

        // 반짝임 애니메이션
        this.tweens.add({
            targets: sparkle,
            alpha: { from: 0.5, to: 1 },
            scale: { from: 0.8, to: 1.2 },
            duration: 800,
            repeat: -1,
            yoyo: true,
            ease: 'Sine.easeInOut'
        });

        // 꼬리 흔들림 애니메이션
        this.tweens.add({
            targets: tail,
            angle: { from: -5, to: 5 },
            duration: 1500,
            repeat: -1,
            yoyo: true,
            ease: 'Sine.easeInOut'
        });
    }

    startGame() {
        // 게임 시작 - 다음 씬으로 전환
        this.scene.start('Match3Game');
    }
}

export default IntroScene;
