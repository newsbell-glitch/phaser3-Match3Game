class IntroScene extends Phaser.Scene {
    constructor() {
        super({ key: 'IntroScene' });
    }

    preload() {
        // 배경 및 기본 이미지들
        this.load.image('intro_bg', 'assets/full_background.png');
        this.load.image('logo', 'assets/logo.png');
        this.load.image('button_bg', 'assets/button_bg.png');
        
        // 텍스트 이미지들
        this.load.image('rank_text', 'assets/rank_text.png');
        this.load.image('start_text', 'assets/start_text.png');
        
        // 별 관련 이미지들
        this.load.image('star_tail1', 'assets/star_tail1.png');
        this.load.image('sparkle1', 'assets/sparkle1.png');
        this.load.image('star1', 'assets/star1.png');
        this.load.image('star_tail2', 'assets/star_tail2.png');
        this.load.image('star3', 'assets/star3.png');
    }

    create() {
        // 게임 크기 설정
        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;

        // 1. 전체 배경 이미지 (파란 하늘, 산, 꽃밭 포함)
        const bgImage = this.add.image(centerX, centerY, 'intro_bg');
        bgImage.setDisplaySize(1920, 1080);

        // 2. 왼쪽 별 장식들 (로고 왼쪽)
        // 큰 별 꼬리
        const leftStarTail = this.add.image(466, 380, 'star_tail1');
        leftStarTail.setDisplaySize(97, 114);
        leftStarTail.setAngle(-15);
        
        // 작은 반짝임 (다이아몬드) - 크기 축소
        const leftSparkle = this.add.image(578, 250, 'sparkle1');
        leftSparkle.setDisplaySize(20, 24);  // 원본보다 훨씬 작게
        
        // 큰 별
        const leftBigStar = this.add.image(622, 386, 'star1');
        leftBigStar.setDisplaySize(124, 124);

        // 3. 로고 (JELLY POP) - 가로로 늘리고 세로는 줄임
        const logo = this.add.image(centerX, 420, 'logo');
        logo.setDisplaySize(682, 511);  // 가로 늘리고 세로 줄임

        // 4. 오른쪽 별 장식들 (로고 오른쪽)
        // 작은 반짝임 (다이아몬드) - 크기 축소
        const rightSparkle = this.add.image(1239, 417, 'sparkle1');
        rightSparkle.setDisplaySize(15, 18);  // 더 작게
        
        // 별 꼬리
        const rightStarTail = this.add.image(1278, 357, 'star_tail2');
        rightStarTail.setDisplaySize(97, 113);
        rightStarTail.setAngle(15);
        
        // 작은 별
        const rightSmallStar = this.add.image(1319, 276, 'star3');
        rightSmallStar.setDisplaySize(16, 17);

        // 5. 버튼들 (더 아래로 이동)
        const buttonY = 860;  

        // RANK 버튼
        const rankButton = this.add.container(centerX - 245, buttonY);
        const rankBg = this.add.image(0, 0, 'button_bg');
        rankBg.setDisplaySize(359, 128);
        const rankText = this.add.image(0, 0, 'rank_text');
        rankText.setDisplaySize(181, 54);
        rankButton.add([rankBg, rankText]);
        rankButton.setSize(359, 128);
        rankButton.setInteractive();

        // START 버튼
        const startButton = this.add.container(centerX + 245, buttonY);
        const startBg = this.add.image(0, 0, 'button_bg');
        startBg.setDisplaySize(359, 128);
        const startText = this.add.image(0, 0, 'start_text');
        startText.setDisplaySize(210, 54);
        startButton.add([startBg, startText]);
        startButton.setSize(359, 128);
        startButton.setInteractive();

        // 버튼 호버 효과
        this.setupButtonEffects(rankButton, buttonY);
        this.setupButtonEffects(startButton, buttonY);

        // Start 버튼 클릭 이벤트 - Match3Game 씬으로 직접 이동
        startButton.on('pointerup', () => {
            // 페이드 아웃 효과
            this.cameras.main.fadeOut(500, 0, 0, 0);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.start('Match3Game', { level: 1 });
            });
        });

        // Rank 버튼 클릭 이벤트 (임시로 레벨 2 시작)
        rankButton.on('pointerup', () => {
            this.cameras.main.fadeOut(500, 0, 0, 0);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.start('Match3Game', { level: 2 });
            });
        });

        // 애니메이션 설정
        this.setupAnimations(logo, leftBigStar, leftSparkle, leftStarTail, rightSmallStar, rightSparkle, rightStarTail);
    }

    setupButtonEffects(button, originalY) {
        const container = button;
        
        button.on('pointerover', () => {
            container.setScale(1.05);
            this.tweens.add({
                targets: container,
                y: originalY - 5,
                duration: 200,
                ease: 'Power2'
            });
        });

        button.on('pointerout', () => {
            container.setScale(1);
            this.tweens.add({
                targets: container,
                y: originalY,
                duration: 200,
                ease: 'Power2'
            });
        });

        button.on('pointerdown', () => {
            container.setScale(0.98);
        });

        button.on('pointerup', () => {
            container.setScale(1.05);
        });
    }

    setupAnimations(logo, leftBigStar, leftSparkle, leftStarTail, rightSmallStar, rightSparkle, rightStarTail) {
        // 로고 부드러운 위아래 움직임
        this.tweens.add({
            targets: logo,
            y: logo.y - 20,
            duration: 3000,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1
        });

        // 왼쪽 큰 별 회전
        this.tweens.add({
            targets: leftBigStar,
            angle: 360,
            duration: 4000,
            repeat: -1,
            ease: 'Linear'
        });

        // 왼쪽 반짝임 크기 변화 (작은 크기 유지)
        this.tweens.add({
            targets: leftSparkle,
            scale: { from: 0.9, to: 1.1 },
            alpha: { from: 0.7, to: 1 },
            duration: 800,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // 왼쪽 꼬리 흔들림
        this.tweens.add({
            targets: leftStarTail,
            angle: { from: -15, to: -25 },
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // 오른쪽 작은 별 회전
        this.tweens.add({
            targets: rightSmallStar,
            angle: 360,
            duration: 3000,
            repeat: -1,
            ease: 'Linear'
        });

        // 오른쪽 반짝임 깜빡임 (작은 크기 유지)
        this.tweens.add({
            targets: rightSparkle,
            scale: { from: 0.95, to: 1.05 },
            alpha: { from: 0.6, to: 1 },
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // 오른쪽 꼬리 흔들림
        this.tweens.add({
            targets: rightStarTail,
            angle: { from: 15, to: 25 },
            duration: 1700,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // 추가 반짝임 효과 - 별들이 살짝 빛나는 효과
        this.tweens.add({
            targets: [leftBigStar, rightSmallStar],
            alpha: { from: 0.9, to: 1 },
            duration: 500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }
}

export default IntroScene;