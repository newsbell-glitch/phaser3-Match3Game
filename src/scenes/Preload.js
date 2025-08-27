class Preload extends Phaser.Scene {
    constructor() {
        super("Preload");
    }

    preload() {
        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;

        // 로딩 배경
        this.add.rectangle(centerX, centerY, 1920, 1080, 0x242424);

        // 로딩 텍스트
        const loadingText = this.add.text(centerX, centerY - 50, 'Loading...', {
            fontFamily: 'Arial',
            fontSize: '32px',
            color: '#e0e0e0'
        });
        loadingText.setOrigin(0.5, 0.5);

        // 프로그레스 바 배경
        const progressBg = this.add.rectangle(centerX, centerY + 50, 400, 30, 0x666666);
        progressBg.setStrokeStyle(2, 0x999999);
        
        // 프로그레스 바
        const progressBar = this.add.rectangle(centerX - 200, centerY + 50, 0, 26, 0x00ff00);
        progressBar.setOrigin(0, 0.5);

        // 로딩 진행률 업데이트
        this.load.on('progress', (value) => {
            progressBar.width = 400 * value;
        });

        // 에셋 로드
        this.load.pack("asset-pack", "assets/asset-pack.json");
        this.load.audio('matchSound', 'assets/audio/yes.mp3');
        this.load.audio('nomatchSound', 'assets/audio/no.mp3');

        // 로딩 완료 시 IntroScene으로 이동
        this.load.on('complete', () => {
            this.scene.start("IntroScene");
        });
    }
}

export default Preload;