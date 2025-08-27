class IntroScene extends Phaser.Scene {
    constructor() {
        super({ key: 'IntroScene' });
    }

    preload() {
        // 인트로 화면에 필요한 이미지들 로드
        this.load.image('full_background', 'images/full_background.png');
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

        // 전체 배경 이미지 (하늘, 산, 구름 포함)
        const fullBg = this.add.image(centerX, centerY, 'full_background');
        fullBg.setOrigin(0.5, 0.5);
        fullBg.setDisplaySize(1920, 1080);

        // 풀숲 배경 이미지 (하단에 위치)
        const forestBg = this.add.image(centerX, 1080, 'forest_bg');
        forestBg.setOrigin(0.5, 1);
        forestBg.setDisplaySize(1920, 248);

        // 별 장식들을 먼저 배치 (로고 뒤에 위치하도록)
        // 왼쪽 별 그룹
        const starTail1 = this.add.image(600, 380, 'star_tail1');
        starTail1.setOrigin(0.5, 0.5);
        starTail1.setDisplaySize(78, 91);
        
        const sparkle1Left = this.add.image(720, 200, 'sparkle1');
        sparkle1Left.setOrigin(0.5, 0.5);
        sparkle1Left.setDisplaySize(29, 36);
        
        const star1 = this.add.image(730, 400, 'star1');
        star1.setOrigin(0.5, 0.5);
        star1.setDisplaySize(99, 99);

        // 오른쪽 별 그룹
        const sparkle1Right = this.add.image(1200, 380, 'sparkle1');
        sparkle1Right.setOrigin(0.5, 0.5);
        sparkle1Right.setDisplaySize(20, 24);
        
        const starTail2 = this.add.image(1250, 320, 'star_tail2');
        starTail2.setOrigin(0.5, 0.5);
        starTail2.setDisplaySize(77, 90);
        
        const star3 = this.add.image(1320, 250, 'star3');
        star3.setOrigin(0.5, 0.5);
        star3.setDisplaySize(13, 14);

        // 로고 (크기와 위치 조정)
        const logo = this.add.image(centerX, 350, 'logo');
        logo.setOrigin(0.5, 0.5);
        logo.setDisplaySize(546, 409); // 크기를 80%로 줄임

        // 버튼들 위치 (로고 아래에 적절한 간격으로)
        const buttonY = 650;

        // Rank 버튼 (크기: 287x102 - 80%로 조정)
        const rankButton = this.add.container(centerX - 200, buttonY);
        const rankBg = this.add.image(0, 0, 'button_bg');
        rankBg.setOrigin(0.5, 0.5);
        rankBg.setDisplaySize(287, 102);
        const rankText = this.add.image(0, 0, 'rank_text');
        rankText.setOrigin(0.5, 0.5);
        rankText.setDisplaySize(145, 43);
        rankButton.add([rankBg, rankText]);
        rankButton.setSize(287, 102);
        rankButton.setInteractive();

        // Start 버튼 (크기: 287x102 - 80%로 조정)
        const startButton = this.add.container(centerX + 200, buttonY);
        const startBg = this.add.image(0, 0, 'button_bg');
        startBg.setOrigin(0.5, 0.5);
        startBg.setDisplaySize(287, 102);
        const startText = this.add.image(0, 0, 'start_text');
        startText.setOrigin(0.5, 0.5);
        startText.setDisplaySize(168, 43);
        startButton.add([startBg, startText]);
        startButton.setSize(287, 102);
        startButton.setInteractive();

        // 버튼 호버 효과
        this.setupButtonEffects(rankButton, rankBg);
        this.setupButtonEffects(startButton, startBg);

        // Start 버튼 클릭 이벤트
        startButton.on('pointerup', () => {
            this.startGame();
        });

        // 별 애니메이션
        this.setupStarAnimations(star1, sparkle1Left, starTail1);
        this.setupStarAnimations(star3, sparkle1Right, starTail2);
    }

    setupButtonEffects(button, background) {
        button.on('pointerover', () => {
            button.setScale(1.05);
        });

        button.on('pointerout', () => {
            button.setScale(1);
        });

        button.on('pointerdown', () => {
            button.setScale(0.95);
        });

        button.on('pointerup', () => {
            button.setScale(1.05);
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
