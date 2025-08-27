function itoStr(n) {//두자리 이하숫자를 두자리 문자열로
    if (n < 10) return "0" + n;
    return String(n);
}
function roundTo3D(value) {//roundToThreeDecimals
    // 소수점 이하 3자리로 반올림하여 반환
    return Math.round(value * 1000) / 1000;
}

function ArrStrToInt(stringArray) {//숫자형 문자로 된 원소로 구성된 배열 원소를 숫자형으로 변환
    return stringArray.map(function (item) {
        return parseInt(item, 10); // 10진수로 변환
    });
}
function delElmFromArr(array, element) {//배열에서 해당 원소를 제거하는 함수
    let index;
    while ((index = array.indexOf(element)) !== -1) {
        array.splice(index, 1);
    }
}
function arraysEqual(arr1, arr2) {//배열이 같은지 비교하는 함수
    // 배열의 길이가 다르면 false 반환
    if (arr1.length !== arr2.length) return false;
    // 배열의 각 원소를 비교
    for (let i = 0; i < arr1.length; i++) {// 배열일 경우 재귀적으로 비교
        if (Array.isArray(arr1[i]) && Array.isArray(arr2[i])) {
            if (!arraysEqual(arr1[i], arr2[i])) return false;
        } else if (arr1[i] !== arr2[i]) {
            return false; // 원소가 다르면 false 반환
        }
    }
    return true; // 모든 원소가 같으면 true 반환
}
function addElmSort(array, element) {// 중복된 원소가 없으면 배열에 추가
    if (!array.includes(element)) {
        array.push(element);
    }
    // 배열을 오름차순으로 정렬
    array.sort(function (a, b) {
        return a - b;
    });
}
function isEmpty(ipStr) {//ipStr 은 문자열
    if (typeof (ipStr) == "undefined") return true;
    if (typeof (ipStr) == "string" && (ipStr.indexOf("mjx-container") > 0 && ipStr.indexOf("path") < 0)) return true;//처음 $("#QuizInput").html() 에 빈 mjx-container 값이 들어가서 임시로 처리
    if (!isNaN(ipStr) && typeof (ipStr) == "number") return false;
    if (ipStr == "" || ipStr == " " || ipStr == undefined) return true;
    return false;
}
function shake_fn(button) {//button 은 jquery 개체
    var times = 8; // 애니메이션 횟수
    var distance = 5; // 떨림 거리
    var duration = 50; // 한 번 떨림의 지속 시간
    function shake(times, distance, duration) {
        if (times > 0) {
            button.css('transform', 'translateX(' + (times % 2 === 0 ? distance : -distance) + 'px)');
            setTimeout(function () {
                shake(--times, distance, duration);
            }, duration);
        } else {
            button.css('transform', 'translateX(0px)');
        }
    }
    shake(times, distance, duration);
}
function setPointerCursor(target) {//캔버스 객체에 커서를 지정하는 함수
    target.on('pointerover', () => {
        target.scene.input.manager.canvas.style.cursor = 'pointer';
    });

    target.on('pointerout', () => {
        target.scene.input.manager.canvas.style.cursor = 'default';
    });
}
function shuffleArray(array) {//배열을 무작위로 섞는 함수
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
function initializeNamedChildren(instance) {
    function addNamedChildren(parent) {
        parent.children.list.forEach(child => {
            if (child.name) {
                parent[child.name] = child;  // 현재 parent에 자식 요소 이름으로 추가
            }
            // 자식 요소가 Container일 경우 재귀 호출
            if (child instanceof Phaser.GameObjects.Container) {
                addNamedChildren(child);
            }
        });
    }

    // 루트 인스턴스의 자식 요소 탐색 시작
    addNamedChildren(instance);
}