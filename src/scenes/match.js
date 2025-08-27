import Match3Core from './Match3Core.js';
import Match3UI from './Match3UI.js';
import Match3Animation from './Match3Animation.js';

class Match3 {
    constructor(scene) {
        this.scene = scene;
        this.core = new Match3Core(scene);
        this.ui = new Match3UI(scene, this.core);
        this.animation = new Match3Animation(scene);
        
        // 기본 설정을 core에서 가져옴 (개별 설정)
        const config = this.core.getConfig();
        this.tileSize = config.tileSize;
        this.gridSize = config.gridSize;
        this.assets = config.assets;
        this.level = config.level;
        this.level_array = config.level_array;
        this.aimCnt_array = config.aimCnt_array;
        this.ocnt_array = config.ocnt_array;
        this.aimType_array = config.aimType_array;
        this.tilesToPlace = config.tilesToPlace;
        this.selectedTile = config.selectedTile;
        this.swapping = config.swapping;
        this.startX = config.startX;
        this.startY = config.startY;
        this.score = config.score;
        this.tot_aimCnt = config.tot_aimCnt;
        this.scoreText = config.scoreText;
        this.tileGap = config.tileGap;
        // grid와 tileGrp은 getter로 처리
    }

    setScoreText(scoreText) {
        this.scoreText = scoreText;
        this.core.scoreText = scoreText;
    }

    makeMatch(Match3Game) {
        window.Match3 = this;
        window.Match3Game = Match3Game;
        
        // UI 요소들 설정
        this.ui.setupUIElements(Match3Game);
        
        // 게임 초기화
        this.core.initializeGame(Match3Game, this.ui);
        
        // 레벨 팝업 표시
        this.ui.showLevelPopup(() => {
            this.createGrid();
            this.core.game_on = true;
        });
    }
    
    createGrid() {
        this.grid = this.core.createGrid();
        this.checkMatches();
    }

    createTile(row, col, type) {
        return this.core.createTile(row, col, type);
    }
    
    placeTile(row, col, type) {
        const tile = this.core.placeTile(row, col, type);
        
        // 떨어지는 애니메이션
        this.animation.dropTileAnimation(tile.tile, 
            this.core.startY + row * (this.core.tileSize + this.core.tileGap),
            col * 50,
            () => {
                this.core.tilesToPlace--;
                if (this.core.tilesToPlace === 0) {
                    setTimeout(() => {
                        this.checkMatches();
                    }, 100);
                }
            }
        );
        
        return tile;
    }
    
    findClosestTile(draggedTile) {
        return this.core.findClosestTile(draggedTile);
    }
    
    areAdjacent(tile1, tile2) {
        return this.core.areAdjacent(tile1, tile2);
    }

    resetTilePosition(tile) {
        const pos = this.core.getTilePosition(tile.row, tile.col);
        this.animation.resetTilePosition(tile, pos.x, pos.y);
    }

    swapTiles(tile1, tile2) {
        if (this.core.swapping || !this.core.game_on) return;
        
        this.core.swapping = true;
        
        const swapData = this.core.prepareSwap(tile1, tile2);
        
        // 애니메이션
        this.animation.swapTilesAnimation(
            tile1, tile2,
            swapData.x1, swapData.y1,
            swapData.x2, swapData.y2,
            () => {
                let matched = this.checkMatches();
                if (!matched) {
                    // 매치가 없으면 되돌리기
                    this.core.revertSwap(tile1, tile2, swapData);
                    this.animation.revertSwapAnimation(
                        tile1, tile2,
                        swapData.x2, swapData.y2,
                        swapData.x1, swapData.y1,
                        () => {
                            this.core.swapping = false;
                        }
                    );
                } else {
                    this.core.swapping = false;
                }
            }
        );
    }

    checkMatches() {
        const matches = this.core.findMatches();
        
        if (matches.length > 0) {
            if(this.scene.sound && this.scene.sound.play) {
                this.scene.sound.play('matchSound', { volume: 0.5 });
            }
            this.removeMatches(matches);
            return true;
        }
        
        return false;
    }

    removeMatches(matches) {
        // 매치된 타일 처리
        this.core.processMatches(matches);
        
        // UI 업데이트
        this.ui.updateCountDisplays(this.core.ocnt_array[this.core.level - 1]);
        this.ui.updateScore(this.core.score);
        this.ui.updateProgress(this.core.getProgressPercentage());
        
        // 레벨 클리어 체크
        if (this.core.getProgressPercentage() >= 100) {
            this.levelClear();
        }
        
        // 타일 제거
        this.removeTiles(matches);
    }
    
    levelClear() {
        this.core.game_on = false;
        
        if(window.Match3Game && window.Match3Game.showModal) {
            window.Match3Game.showModal("레벨 클리어!", () => {
                this.nextLevel();
            });
        }
    }
    
    nextLevel() {
        this.core.level++;
        if (this.core.level > 3) {
            if(window.Match3Game && window.Match3Game.showModal) {
                window.Match3Game.showModal("게임 완료! 축하합니다!");
            }
            return;
        }
        
        this.clearGrid();
        this.makeMatch(window.Match3Game);
    }

    removeTiles(tiles) {
        this.core.tilesToPlace = tiles.length;
        
        tiles.forEach((tileObj) => {
            this.animation.removeTileEffect(tileObj.tile, this.core.tileGrp);
            this.core.removeTileFromGrid(tileObj.tile);
        });
        
        setTimeout(() => {
            this.dropTiles();
        }, 200);
    }

    dropTiles() {
        const dropData = this.core.calculateDrops();
        let dropCount = dropData.length;
        
        if (dropCount === 0) {
            this.fillEmptyTiles();
            return;
        }
        
        dropData.forEach(drop => {
            this.animation.dropTileAnimation(
                drop.tile,
                drop.targetY,
                0,
                () => {
                    dropCount--;
                    if (dropCount === 0) {
                        this.fillEmptyTiles();
                    }
                }
            );
        });
    }

    fillEmptyTiles() {
        const emptyTiles = this.core.getEmptyTiles();
        
        emptyTiles.forEach(({row, col}) => {
            const tileType = Phaser.Math.Between(0, this.core.assets.length - 1);
            this.placeTile(row, col, tileType);
        });
        
        setTimeout(() => {
            if (!this.isMatchAvailable()) {
                alert("더 이상 매치가 불가능합니다! 다시 섞습니다...");
                this.clearGrid();
                this.createGrid();
            }
        }, 200);
    }
    
    isMatchAvailable() {
        return this.core.isMatchAvailable();
    }
    
    clearGrid() {
        this.core.clearGrid();
    }
    
    // 기존 메서드들에 대한 래퍼
    get grid() { return this.core.grid; }
    set grid(value) { this.core.grid = value; }
    get tileGrp() { return this.core.tileGrp; }
    get game_on() { return this.core.game_on; }
}

export default Match3;