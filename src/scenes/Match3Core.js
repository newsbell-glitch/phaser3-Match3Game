class Match3Core {
    constructor(scene) {
        this.scene = scene;
        this.tileSize = 94;
        this.gridSize = 8;
        // 새로운 동물 이미지 사용
        this.assets = ["bear_img", "cat_img", "dog_img", "rabbit_img", "raccoon_img", "quokka_img"];
        this.level = 1;
        this.level_array = [[6,9],[3,6,9],[6,9,9]];
        this.aimCnt_array = [];
        this.ocnt_array = [];
        this.aimType_array = [];
        this.grid = [];
        this.tilesToPlace = this.gridSize * this.gridSize;
        this.selectedTile = null;
        this.swapping = false;
        this.startX = 630;
        this.startY = 155;
        this.score = 0;
        this.tot_aimCnt = 0;
        this.scoreText = null;
        this.tileGrp = scene.tileGrp;
        this.game_on = false;
        this.tileGap = 46;
    }

    getConfig() {
        return {
            tileSize: this.tileSize,
            gridSize: this.gridSize,
            assets: this.assets,
            level: this.level,
            level_array: this.level_array,
            aimCnt_array: this.aimCnt_array,
            ocnt_array: this.ocnt_array,
            aimType_array: this.aimType_array,
            grid: this.grid,
            tilesToPlace: this.tilesToPlace,
            selectedTile: this.selectedTile,
            swapping: this.swapping,
            startX: this.startX,
            startY: this.startY,
            score: this.score,
            tot_aimCnt: this.tot_aimCnt,
            scoreText: this.scoreText,
            tileGrp: this.tileGrp,
            game_on: this.game_on,
            tileGap: this.tileGap
        };
    }

    initializeGame(Match3Game, ui) {
        // 레벨별 목표타입 지정 - 새로운 동물 이미지 사용
        this.aimType_array[0] = ["bear_img", "cat_img"];
        this.aimType_array[1] = ["bear_img", "special", "dog_img"];
        this.aimType_array[2] = ["rabbit_img", "raccoon_img", "quokka_img"];

        // 레벨별 목표 개수
        this.aimCnt_array[0] = [6, 9];
        this.aimCnt_array[1] = [3, 6, 9];
        this.aimCnt_array[2] = [6, 9, 9];

        // 레벨별 현재 개수
        this.ocnt_array[0] = [0, 0];
        this.ocnt_array[1] = [0, 0, 0];
        this.ocnt_array[2] = [0, 0, 0];
        
        // 목표 개수 총합
        this.tot_aimCnt = 0;
        this.level_array.forEach((element) => {
            element.forEach((el) => {
                this.tot_aimCnt += el;
            });
        });
        
        // UI 업데이트
        if(Match3Game.updateMaskShape) Match3Game.updateMaskShape(0);
        if(Match3Game.lv_txt) Match3Game.lv_txt.text = this.level;
        if(Match3Game.Level_txt) Match3Game.Level_txt.text = "** Level " + this.level + " **";
    }

    createGrid() {
        this.grid = [];
        for (let row = 0; row < this.gridSize; row++) {
            this.grid[row] = [];
            for (let col = 0; col < this.gridSize; col++) {
                let randomType = Math.floor(Math.random() * this.assets.length);
                let tile = this.createTile(row, col, randomType);
                this.grid[row][col] = tile;
            }
        }
        return this.grid;
    }

    createTile(row, col, type) {
        let x = this.startX + col * (this.tileSize + this.tileGap);
        let y = this.startY + row * (this.tileSize + this.tileGap);
        
        let tile = this.scene.add.image(x, y, this.assets[type]);
        tile.setDisplaySize(this.tileSize, this.tileSize);
        tile.row = row;
        tile.col = col;
        tile.type = type;
        tile.tileType = type;
        tile.setInteractive({ draggable: true });
        
        tile.preFX.addShadow(0, 4, 0.1, 0.5, 0x000000, 4, 1);
        
        this.tileGrp.add(tile);

        // 드래그 이벤트 설정
        this.setupTileDragEvents(tile);

        return { tile: tile, tileType: type };
    }

    placeTile(row, col, type) {
        let x = this.startX + col * (this.tileSize + this.tileGap);
        let y = this.startY - this.tileSize;
        
        let tile = this.scene.add.image(x, y, this.assets[type]);
        tile.setDisplaySize(this.tileSize, this.tileSize);
        tile.row = row;
        tile.col = col;
        tile.type = type;
        tile.tileType = type;
        tile.setInteractive({ draggable: true });
        
        tile.preFX.addShadow(0, 4, 0.1, 0.5, 0x000000, 4, 1);
        
        this.tileGrp.add(tile);
        this.setupTileDragEvents(tile);
        
        this.grid[row][col] = { tile: tile, tileType: type };
        
        return this.grid[row][col];
    }

    setupTileDragEvents(tile) {
        tile.on('drag', (pointer, dragX, dragY) => {
            if (this.swapping || !this.game_on) return;
            
            tile.setDepth(1);
            let localPoint = this.tileGrp.getLocalPoint(dragX, dragY);
            tile.x = localPoint.x;
            tile.y = localPoint.y;
        });

        tile.on('dragend', () => {
            if (this.swapping || !this.game_on) {
                window.Match3.resetTilePosition(tile);
                return;
            }
            
            tile.setDepth(0);
            let closestTile = this.findClosestTile(tile);
            
            if (closestTile && this.areAdjacent(tile, closestTile)) {
                window.Match3.swapTiles(tile, closestTile);
            } else {
                window.Match3.resetTilePosition(tile);
            }
        });
    }

    getTilePosition(row, col) {
        return {
            x: this.startX + col * (this.tileSize + this.tileGap),
            y: this.startY + row * (this.tileSize + this.tileGap)
        };
    }

    findClosestTile(draggedTile) {
        let minDistance = Infinity;
        let closestTile = null;
        
        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize; col++) {
                let tile = this.grid[row][col];
                if (tile && tile.tile !== draggedTile) {
                    let distance = Phaser.Math.Distance.Between(
                        draggedTile.x, draggedTile.y,
                        tile.tile.x, tile.tile.y
                    );
                    
                    if (distance < minDistance) {
                        minDistance = distance;
                        closestTile = tile.tile;
                    }
                }
            }
        }
        
        return closestTile;
    }

    areAdjacent(tile1, tile2) {
        let rowDiff = Math.abs(tile1.row - tile2.row);
        let colDiff = Math.abs(tile1.col - tile2.col);
        
        return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
    }

    prepareSwap(tile1, tile2) {
        let gridTile1 = this.grid[tile1.row][tile1.col];
        let gridTile2 = this.grid[tile2.row][tile2.col];
        
        let tempRow = tile1.row;
        let tempCol = tile1.col;
        
        tile1.row = tile2.row;
        tile1.col = tile2.col;
        
        tile2.row = tempRow;
        tile2.col = tempCol;
        
        this.grid[tile1.row][tile1.col] = gridTile1;
        this.grid[tile2.row][tile2.col] = gridTile2;
        
        let pos1 = this.getTilePosition(tile1.row, tile1.col);
        let pos2 = this.getTilePosition(tile2.row, tile2.col);
        
        return {
            gridTile1: gridTile1,
            gridTile2: gridTile2,
            x1: pos1.x,
            y1: pos1.y,
            x2: pos2.x,
            y2: pos2.y
        };
    }

    revertSwap(tile1, tile2, swapData) {
        let tempRow = tile1.row;
        let tempCol = tile1.col;
        
        tile1.row = tile2.row;
        tile1.col = tile2.col;
        
        tile2.row = tempRow;
        tile2.col = tempCol;
        
        this.grid[tile1.row][tile1.col] = swapData.gridTile1;
        this.grid[tile2.row][tile2.col] = swapData.gridTile2;
    }

    findMatches() {
        let matches = [];
        
        // 가로 매치 체크
        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize - 2; col++) {
                let tile1 = this.grid[row][col];
                let tile2 = this.grid[row][col + 1];
                let tile3 = this.grid[row][col + 2];
                
                if (tile1 && tile2 && tile3 && 
                    tile1.tileType === tile2.tileType && 
                    tile2.tileType === tile3.tileType) {
                    if (!matches.find(m => m.tile === tile1.tile)) matches.push(tile1);
                    if (!matches.find(m => m.tile === tile2.tile)) matches.push(tile2);
                    if (!matches.find(m => m.tile === tile3.tile)) matches.push(tile3);
                }
            }
        }
        
        // 세로 매치 체크
        for (let col = 0; col < this.gridSize; col++) {
            for (let row = 0; row < this.gridSize - 2; row++) {
                let tile1 = this.grid[row][col];
                let tile2 = this.grid[row + 1][col];
                let tile3 = this.grid[row + 2][col];
                
                if (tile1 && tile2 && tile3 && 
                    tile1.tileType === tile2.tileType && 
                    tile2.tileType === tile3.tileType) {
                    if (!matches.find(m => m.tile === tile1.tile)) matches.push(tile1);
                    if (!matches.find(m => m.tile === tile2.tile)) matches.push(tile2);
                    if (!matches.find(m => m.tile === tile3.tile)) matches.push(tile3);
                }
            }
        }
        
        return matches;
    }

    processMatches(matches) {
        matches.forEach(tileObj => {
            let tileType = this.assets[tileObj.tileType];
            let aimTypeArray = this.aimType_array[this.level - 1];
            let aimIndex = aimTypeArray.indexOf(tileType);
            
            if (aimIndex !== -1) {
                this.ocnt_array[this.level - 1][aimIndex]++;
            }
        });
        
        this.score += matches.length * 10;
    }

    getProgressPercentage() {
        let totalCurrent = 0;
        let totalTarget = 0;
        
        this.ocnt_array[this.level - 1].forEach((count, index) => {
            totalCurrent += Math.min(count, this.aimCnt_array[this.level - 1][index]);
            totalTarget += this.aimCnt_array[this.level - 1][index];
        });
        
        return (totalCurrent / totalTarget) * 100;
    }

    removeTileFromGrid(tile) {
        const position = this.findTilePosition(tile);
        if (position) {
            this.grid[position.row][position.col] = null;
        }
        tile.destroy();
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

    calculateDrops() {
        let drops = [];

        for (let col = 0; col < this.gridSize; col++) {
            for (let row = this.gridSize - 1; row >= 0; row--) {
                if (this.grid[row][col] === null) {
                    for (let aboveRow = row - 1; aboveRow >= 0; aboveRow--) {
                        if (this.grid[aboveRow][col] !== null) {
                            var moveGrid = this.grid[aboveRow][col];
                            this.grid[row][col] = moveGrid;
                            this.grid[aboveRow][col] = null;
                            
                            moveGrid.tile.row = row;
                            
                            drops.push({
                                tile: moveGrid.tile,
                                targetY: this.startY + row * (this.tileSize + this.tileGap)
                            });
                            
                            break;
                        }
                    }
                }
            }
        }

        return drops;
    }

    getEmptyTiles() {
        let emptyTiles = [];
        
        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize; col++) {
                if (this.grid[row][col] === null) {
                    emptyTiles.push({ row, col });
                }
            }
        }
        
        return emptyTiles;
    }

    isMatchAvailable() {
        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize; col++) {
                if (this.checkSwapAndMatch(row, col, row + 1, col)) return true;
                if (this.checkSwapAndMatch(row, col, row, col + 1)) return true;
            }
        }
        return false;
    }

    checkSwapAndMatch(row1, col1, row2, col2) {
        if (row2 >= this.gridSize || col2 >= this.gridSize) return false;
    
        const tempTile = this.grid[row1][col1];
        this.grid[row1][col1] = this.grid[row2][col2];
        this.grid[row2][col2] = tempTile;
    
        const hasMatch = this.findMatches().length > 0;
    
        this.grid[row2][col2] = this.grid[row1][col1];
        this.grid[row1][col1] = tempTile;
    
        return hasMatch;
    }

    clearGrid() {
        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize; col++) {
                if (this.grid[row][col] && this.grid[row][col].tile) {
                    this.grid[row][col].tile.destroy();
                }
                this.grid[row][col] = null;
            }
        }
        this.tilesToPlace = this.gridSize * this.gridSize;
    }
}

export default Match3Core;