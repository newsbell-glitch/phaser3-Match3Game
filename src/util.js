// 유틸리티 함수들

// 커서를 포인터로 변경
function setPointerCursor(gameObject) {
    gameObject.on('pointerover', function() {
        this.scene.input.setDefaultCursor('pointer');
    });
    
    gameObject.on('pointerout', function() {
        this.scene.input.setDefaultCursor('default');
    });
}

// 배열에 중복없이 요소 추가
function addElmSort(array, element) {
    if (!array.includes(element)) {
        array.push(element);
    }
    array.sort(function (a, b) {
        return a - b;
    });
}

// 전역 유틸리티로 등록
window.setPointerCursor = setPointerCursor;
window.addElmSort = addElmSort;