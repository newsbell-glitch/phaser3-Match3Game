class Match3UI {
    constructor(scene, core) {
        this.scene = scene;
        this.core = core;
        this.progressGrp = null;
        this.noticeGrp = null;
        this.levelPanGrp = null;
        this.aimLists = {};
        this.cntTexts = {};
    }

    setupUIElements(Match3Game) {
        // UI 요소들 저장 - 없으면 무시
        this.progress_bar = Match3Game.progress_bar || null;
        this.maskShape = Match3Game.maskShape || null;
        
        // 목표 리스트 - 없으면 빈 객체
        this.aimLists = {};
        this.aimLists[1] = Match3Game.aimList_1 || null;
        this.aimLists[2] = Match3Game.aimList_2 || null;
        this.aimLists[3] = Match3Game.aimList_3 || null;
        this.aimLists[4] = Match3Game.aimList_4 || null;
        this.aimLists[5] = Match3Game.aimList_5 || null;
        this.aimLists[6] = Match3Game.aimList_6 || null;
        
        // 카운트 텍스트
        this.cntTexts = {};
        this.cntTexts[1] = Match3Game.cntTxt1 || null;
        this.cntTexts[2] = Match3Game.cntTxt2 || null;
        this.cntTexts[3] = Match3Game.cntTxt3 || null;
        
        this.levelPanGrp = Match3Game.levelPanGrp || null;
        
        // 초기 위치 저장
        if(this.aimLists[4]) this.aimLists[4].yp = this.aimLists[4].y || 0;
        if(this.aimLists[5]) this.aimLists[5].yp = this.aimLists[5].y || 0;
        if(this.aimLists[6]) this.aimLists[6].yp = this.aimLists[6].y || 0;
        
        // 레벨 목표 설정 - UI 요소가 있을 때만
        if(Object.keys(this.aimLists).some(key => this.aimLists[key] !== null)) {
            this.setupLevelAims();
            this.setupGameAims();
        }
    }

    setupLevelAims() {
        const aimType_array = this.core.aimType_array[this.core.level - 1];
        const aimCnt_array = this.core.aimCnt_array[this.core.level - 1];
        
        if(!this.aimLists[4] || !this.aimLists[5] || !this.aimLists[6]) return;
        
        // 모든 목표 리스트 숨기기
        for(let i = 4; i <= 6; i++) {
            if(this.aimLists[i]) this.aimLists[i].visible = false;
        }
        
        // 목표 설정
        aimType_array.forEach((element, i) => {
            const listNum = i + 4;
            const aimList = this.aimLists[listNum];
            
            if(aimList) {
                aimList.visible = true;
                const pic = aimList.getByName(`pic_${listNum}`);
                const text = aimList.getByName(`text_${listNum}`);
                
                if(pic && element !== "special") pic.setTexture(element);
                if(text) text.text = aimCnt_array[i] + "개";
                
                // 위치 조정
                this.adjustAimListPositions(aimType_array.length);
            }
        });
    }

    setupGameAims() {
        const aimType_array = this.core.aimType_array[this.core.level - 1];
        const aimCnt_array = this.core.aimCnt_array[this.core.level - 1];
        const ocnt_array = this.core.ocnt_array[this.core.level - 1];
        
        if(!this.aimLists[1] || !this.aimLists[2] || !this.aimLists[3]) return;
        
        // 모든 목표 리스트 숨기기
        for(let i = 1; i <= 3; i++) {
            if(this.aimLists[i]) this.aimLists[i].visible = false;
        }
        
        // 목표 설정
        aimType_array.forEach((element, i) => {
            const listNum = i + 1;
            const aimList = this.aimLists[listNum];
            
            if(aimList) {
                aimList.visible = true;
                const pic = aimList.getByName(`pic_${listNum}`);
                const text = aimList.getByName(`text_${listNum}`);
                const cntTxt = this.cntTexts[listNum];
                
                if(pic && element !== "special") pic.setTexture(element);
                if(text) text.text = " / " + aimCnt_array[i];
                if(cntTxt) cntTxt.text = ocnt_array[i];
                
                // 위치 조정
                this.adjustGameAimListPositions(aimType_array.length);
            }
        });
    }

    adjustAimListPositions(count) {
        if(count === 1) {
            this.aimLists[4].y = this.aimLists[5].yp;
        } else if(count === 2) {
            this.aimLists[4].y = this.aimLists[4].yp + 32;
            this.aimLists[5].y = this.aimLists[5].yp + 32;
        } else if(count === 3) {
            this.aimLists[4].y = this.aimLists[4].yp;
            this.aimLists[5].y = this.aimLists[5].yp;
            this.aimLists[6].y = this.aimLists[6].yp;
        }
    }

    adjustGameAimListPositions(count) {
        if(count === 1) {
            this.aimLists[1].y = 70;
        } else if(count === 2) {
            this.aimLists[1].y = 35;
            this.aimLists[2].y = 105;
        } else if(count === 3) {
            this.aimLists[1].y = 0;
            this.aimLists[2].y = 70;
            this.aimLists[3].y = 140;
        }
    }

    showLevelPopup(callback) {
        // levelPanGrp가 없으면 바로 콜백 실행
        if(!this.levelPanGrp) {
            if(callback) callback();
            return;
        }
        
        this.scene.tweens.add({
            targets: this.levelPanGrp,
            alpha: 0,
            duration: 10,
            onComplete: () => {
                this.levelPanGrp.visible = true;
                this.levelPanGrp.alpha = 1;
                
                this.scene.tweens.add({
                    targets: this.levelPanGrp,
                    alpha: 0,
                    duration: 500,
                    delay: 2000,
                    onComplete: () => {
                        this.levelPanGrp.visible = false;
                        callback();
                    }
                });
            }
        });
    }

    updateCountDisplays(counts) {
        counts.forEach((count, index) => {
            const cntTxt = this.cntTexts[index + 1];
            if(cntTxt) cntTxt.text = count;
        });
    }

    updateScore(score) {
        if(this.core.scoreText) {
            this.core.scoreText.setText(score.toString());
        }
    }

    updateProgress(percentage) {
        if(window.Match3Game && window.Match3Game.updateMaskShape) {
            window.Match3Game.updateMaskShape(percentage);
        }
    }
}

export default Match3UI;