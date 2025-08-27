class Match3Animation {
    constructor(scene) {
        this.scene = scene;
    }

    dropTileAnimation(tile, targetY, delay, onComplete) {
        this.scene.tweens.add({
            targets: tile,
            y: targetY,
            duration: 500,
            ease: 'Bounce.easeOut',
            delay: delay,
            onComplete: onComplete
        });
    }

    resetTilePosition(tile, x, y) {
        this.scene.tweens.add({
            targets: tile,
            x: x,
            y: y,
            duration: 200,
            ease: 'Power2'
        });
    }

    swapTilesAnimation(tile1, tile2, x1, y1, x2, y2, onComplete) {
        this.scene.tweens.add({
            targets: tile1,
            x: x1,
            y: y1,
            duration: 300,
            ease: 'Power2'
        });
        
        this.scene.tweens.add({
            targets: tile2,
            x: x2,
            y: y2,
            duration: 300,
            ease: 'Power2',
            onComplete: onComplete
        });
    }

    revertSwapAnimation(tile1, tile2, x1, y1, x2, y2, onComplete) {
        if(this.scene.sound && this.scene.sound.play) {
            this.scene.sound.play('nomatchSound', { volume: 0.5 });
        }
        
        this.scene.tweens.add({
            targets: tile1,
            x: x1,
            y: y1,
            duration: 300,
            ease: 'Power2'
        });
        
        this.scene.tweens.add({
            targets: tile2,
            x: x2,
            y: y2,
            duration: 300,
            ease: 'Power2',
            onComplete: onComplete
        });
    }

    removeTileEffect(tile, tileGrp) {
        // sparkle1 이미지를 사용한 제거 이펙트
        if (this.scene.textures.exists('sparkle1')) {
            const effect = this.scene.add.image(tile.x, tile.y, 'sparkle1');
            effect.setDepth(1);
            effect.setDisplaySize(60, 60);
            tileGrp.add(effect);
            
            // 반짝임 효과
            this.scene.tweens.add({
                targets: effect,
                scale: { from: 0.5, to: 2 },
                alpha: { from: 1, to: 0 },
                duration: 300,
                ease: 'Power2',
                onComplete: () => {
                    effect.destroy();
                }
            });
        }
        
        // 타일 축소 애니메이션
        this.scene.tweens.add({
            targets: tile,
            scale: 0,
            alpha: 0,
            duration: 300,
            ease: 'Power2',
            onComplete: () => {
                tile.destroy();
            }
        });
    }
}

export default Match3Animation;