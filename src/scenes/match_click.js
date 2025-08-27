class Match3 {
    constructor(scene) {
        this.tileSize = 80;
        this.gridSize = 7;
        this.assets = ["pic1", "pic2", "pic3", "pic4", "pic5", "pic6"];
        this.grid = [];
        this.tilesToPlace = this.gridSize * this.gridSize;
        this.scene = scene;
        this.selectedTile = null;
        this.swapping = false;
        this.startX = 640 - (this.gridSize * this.tileSize) / 2;  // 중앙에 맞추기 위해 시작 X 좌표 조정
        this.startY = 360 - (this.gridSize * this.tileSize) / 2;  // 중앙에 맞추기 위해 시작 Y 좌표 조정
    }

    makeMatch() {//Level.js 에서 start 시 호출처리하고 있음.
        for (let row = 0; row < this.gridSize; row++) {
            this.grid[row] = [];
            for (let col = 0; col < this.gridSize; col++) {
                let tileType;
                do {
                    tileType = Phaser.Math.Between(0, this.assets.length - 1);
                } while (
                    (col >= 2 &&
                        tileType === this.grid[row][col - 1]?.tileType &&
                        tileType === this.grid[row][col - 2]?.tileType) ||
                    (row >= 2 &&
                        tileType === this.grid[row - 1][col]?.tileType &&
                        tileType === this.grid[row - 2][col]?.tileType)
                );
                this.placeTile(row, col, tileType);
            }
        }
    }

    placeTile(row, col, tileType) {
        const x = this.startX + col * this.tileSize + this.tileSize / 2;
        const y = this.startY + row * this.tileSize + this.tileSize / 2;

        // 타일 이미지 생성
        const tileImage = this.scene.add.image(0, 0, this.assets[tileType]);
        tileImage.setDisplaySize(this.tileSize, this.tileSize);

        // outline 생성
        //const padding = 4; // 원하는 패딩 크기만큼 설정
		//const outline = this.scene.add.rectangle(0, 0, this.tileSize - padding * 2, this.tileSize - padding * 2);
		const outline = this.scene.add.rectangle(0, 0, this.tileSize, this.tileSize);
        //outline.setStrokeStyle(4, 0xffff00,0.5);
		outline.setFillStyle(0xffff00,0.3);
        outline.setVisible(false);

        // Container 생성 및 타일과 outline을 추가
        const tileContainer = this.scene.add.container(x, y, [outline, tileImage]);
        tileContainer.setSize(this.tileSize, this.tileSize);
        tileContainer.setInteractive(new Phaser.Geom.Rectangle(0, 0, this.tileSize, this.tileSize), Phaser.Geom.Rectangle.Contains);

		// outline을 타일 이미지보다 앞으로 이동
		tileContainer.bringToTop(outline);

        // Container를 grid에 저장
        this.grid[row][col] = { tileType:tileType, tile: tileContainer, outline:outline };

        this.scene.tweens.add({
            targets: tileContainer,
            y: y,
            delay: 100,
            duration: 300,
            ease: "Cubic.easeOut",
            onComplete: () => {
                this.tilesToPlace--;
                if (this.tilesToPlace === 0) {
                    this.checkMatch();
                }
            },
        });

        // 클릭 이벤트 핸들러 추가
        tileContainer.on("pointerdown", () => this.selectTile(tileContainer));
    }
    
    selectTile(tile) {
        const position = this.findTilePosition(tile);
        if (!position || this.swapping) return;

        const { row, col } = position;

        if (!this.selectedTile) {
            this.selectedTile = { tile, row, col };
            this.grid[row][col].outline.setVisible(true); // outline 보이기
        } else {
			this.grid[row][col].outline.setVisible(true); // outline 보이기
            if ( Math.abs(this.selectedTile.row - row) + Math.abs(this.selectedTile.col - col) === 1 ) {
                setTimeout(() => {
                    this.swapTiles(this.selectedTile.row, this.selectedTile.col, row, col);
                }, 200);
            } else {
                this.grid[this.selectedTile.row][this.selectedTile.col].outline.setVisible(false); // outline 숨기기
                this.selectedTile = { tile, row, col };
                this.grid[row][col].outline.setVisible(true); // outline 보이기
            }
        }
    }

    swapTiles(row1, col1, row2, col2) {
        this.swapping = true;
		const tile1 = this.grid[row1][col1].tile;
		const tile2 = this.grid[row2][col2].tile;
		// 타일과 tileType 모두 교환
		const tempTile = this.grid[row1][col1];
		this.grid[row1][col1] = this.grid[row2][col2];
		this.grid[row2][col2] = tempTile;

        this.scene.tweens.add({
            targets: tile1,
            x: this.startX + col2 * this.tileSize + this.tileSize / 2,
            y: this.startY + row2 * this.tileSize + this.tileSize / 2,
            duration: 200,
        });

        this.scene.tweens.add({
            targets: tile2,
            x: this.startX + col1 * this.tileSize + this.tileSize / 2,
            y: this.startY + row1 * this.tileSize + this.tileSize / 2,
            duration: 200,
            onComplete: () => {
                this.checkMatch();
                if (!this.swapping) {
                    this.scene.sound.play('nomatchSound');

                    // 타일과 tileType 복원
					const tempTileBack = this.grid[row1][col1];
					this.grid[row1][col1] = this.grid[row2][col2];
					this.grid[row2][col2] = tempTileBack;

                    this.scene.tweens.add({
                        targets: tile1,
                        x: this.startX + col1 * this.tileSize + this.tileSize / 2,
                        y: this.startY + row1 * this.tileSize + this.tileSize / 2,
                        duration: 150,
                    });
                    this.scene.tweens.add({
                        targets: tile2,
                        x: this.startX + col2 * this.tileSize + this.tileSize / 2,
                        y: this.startY + row2 * this.tileSize + this.tileSize / 2,
                        duration: 150,
                        onComplete: () => {
							this.grid[row1][col1].outline.setVisible(false); // outline 숨기기
							this.grid[row2][col2].outline.setVisible(false); // outline 숨기기
                            this.swapping = false;
                        },
                    });
                }else{
					if(!isEmpty(this.grid[row1][col1])) this.grid[row1][col1].outline.setVisible(false); // outline 숨기기
					if(!isEmpty(this.grid[row2][col2])) this.grid[row2][col2].outline.setVisible(false); // outline 숨기기
				}
            },
        });

        this.selectedTile = null;
    }

    findTilePosition(tile) {
        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize; col++) {
                if (this.grid[row][col] && this.grid[row][col].tile === tile) {
                    return { row, col };
                }
            }
        }
        return null;
    }

    checkMatch() {
        let matchedTiles = this.getMatchedTiles();
        if (matchedTiles.length > 0) {
            this.removeTiles(matchedTiles);
            this.scene.sound.play('matchSound');
        } else {
            this.swapping = false;
        }
        this.selectedTile = null;
    }

    getMatchedTiles() {
        let matchedTiles = [];

        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize - 2; col++) {
                const tile1 = this.grid[row][col];
                const tile2 = this.grid[row][col + 1];
                const tile3 = this.grid[row][col + 2];

                if (
                    tile1.tileType === tile2.tileType &&
                    tile2.tileType === tile3.tileType
                ) {
                    addElmSort(matchedTiles, tile1);
                    addElmSort(matchedTiles, tile2);
                    addElmSort(matchedTiles, tile3);
                }
            }
        }

        for (let col = 0; col < this.gridSize; col++) {
            for (let row = 0; row < this.gridSize - 2; row++) {
                const tile1 = this.grid[row][col];
                const tile2 = this.grid[row + 1][col];
                const tile3 = this.grid[row + 2][col];

                if (
                    tile1.tileType === tile2.tileType &&
                    tile2.tileType === tile3.tileType
                ) {
                    addElmSort(matchedTiles, tile1);
                    addElmSort(matchedTiles, tile2);
                    addElmSort(matchedTiles, tile3);
                }
            }
        }
        return matchedTiles;
    }

    removeTiles(tiles) {
        this.tilesToPlace = tiles.length;
        tiles.forEach((tile) => {
            const position = this.findTilePosition(tile.tile);
            if (position) {
                const { row, col } = position;

                const effect = this.scene.add.sprite(
                    this.startX + col * this.tileSize + this.tileSize / 2,
                    this.startY + row * this.tileSize + this.tileSize / 2,
                    'removeEff'
                );
                effect.setDepth(1);
                try {
                    effect.play('removeEff');
                    effect.on('animationcomplete', () => {
                        effect.destroy();
                    });
                } catch (e) {
                    console.log(e);
                }
                this.grid[row][col] = null;
            }
            tile.tile.destroy();  // Container 전체를 삭제, 포함된 outline과 image도 함께 삭제
        });
        setTimeout(() => {
            this.dropTiles();
        }, 200);
    }

    dropTiles() {
        let dropCount = 0;

        for (let col = 0; col < this.gridSize; col++) {
            for (let row = this.gridSize - 1; row >= 0; row--) {
                if (this.grid[row][col] === null) {
                    for (let aboveRow = row - 1; aboveRow >= 0; aboveRow--) {
                        if (this.grid[aboveRow][col] !== null) {
                            var moveGrid = this.grid[aboveRow][col];
							this.grid[row][col] = moveGrid;
							this.grid[aboveRow][col] = null;
                            this.scene.tweens.add({
                                targets: this.grid[row][col].tile,
                                y: this.startY + row * this.tileSize + this.tileSize / 2,
                                duration: 400,
                                ease: "Cubic.easeOut",
                                onComplete: () => {
                                    dropCount--;
                                    if (dropCount === 0) {
                                        setTimeout(() => {
                                            this.fillEmptyTiles();
                                        }, 200);
                                    }
                                },
                            });
                            dropCount++;
                            break;
                        }
                    }
                }
            }
        }

        if (dropCount === 0) {
            setTimeout(() => {
                this.fillEmptyTiles();
            }, 200);
        }
    }

    fillEmptyTiles() {
        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize; col++) {
                if (this.grid[row][col] === null) {
                    const tileType = Phaser.Math.Between(0, this.assets.length - 1);
                    this.placeTile(row, col, tileType);
                }
            }
        }
    }
}

export default Match3;
