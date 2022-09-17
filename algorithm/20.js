//[카카오 인턴] 키패드 누르기
function solution(numbers, hand) {
    var answer = '';
    var temp = {};


    for (var i = 0; i < numbers.length; i++) {
        if (i == 0) {
            temp = fncKeypad(hand, '*', '#', numbers[i], '');
        } else {
            temp = fncKeypad(hand, temp.l, temp.r, numbers[i], temp.moveHand);
        }
        // console.log(numbers[i])
        answer = answer + temp.moveHand;
        console.log(numbers[i])
        console.log(temp)
    }

    console.log(answer)
    return answer;
}
/*
defaultHand : 손잡이
l : 왼손위치
r : 오른손위치
keybtn : 눌러야할 숫자
moveHand : 움직인 손
*/

function fncKeypad(defaultHand, l, r, keybtn, moveHand) {
    //1,2,3
    //4,5,6
    //7,8,9
    //*,0,#
    //   var keypad = [[1, 2, 3],
    //   [4, 5, 6],
    //  [7, 8, 9]
    //  ['*', 0, '#']];
    var result = {};
    result.defaultHand = defaultHand;
    var lKeyPad = [1, 4, 7, '*'];
    var rKeyPad = [3, 6, 9, '#'];
    var keypad = {
        1: [0, 0], 2: [0, 1], 3: [0, 2],
        4: [1, 0], 5: [1, 1], 6: [1, 2],
        7: [2, 0], 8: [2, 1], 9: [2, 2],
        '*': [3, 0], 0: [3, 1], '#': [3, 2]
    };

    //1, 4, 7, '*' 왼쪽이면 무조건 왼손
    if (lKeyPad.includes(keybtn)) {
        result.l = keybtn;
        result.r = r;
        result.moveHand = 'L';
        //1, 4, 7, '*' 오른쪽이면 무조건오른쪽 
    } else if (rKeyPad.includes(keybtn)) {
        result.l = l;
        result.r = keybtn;
        result.moveHand = 'R';
    } else {
        //2,5,8,0 거리를 구해서 가까운 손 이동
        var lPoint = Math.abs(keypad[l][0] - keypad[keybtn][0]) + Math.abs(keypad[l][1] - keypad[keybtn][1]);
        var rPoint = Math.abs(keypad[r][0] - keypad[keybtn][0]) + Math.abs(keypad[r][1] - keypad[keybtn][1]);
        if (lPoint == rPoint) {
            defaultHand == 'right' ? moveHand = 'R' : moveHand = 'L';
            moveHand == 'R' ? result.l = l : result.l = keybtn;
            moveHand == 'R' ? result.r = keybtn : result.r = r;
        } else {
            lPoint > rPoint ? moveHand = 'R' : moveHand = 'L';
            moveHand == 'R' ? result.l = l : result.l = keybtn;
            moveHand == 'R' ? result.r = keybtn : result.r = r;
        }
        result.moveHand = moveHand;

    }

    return result;
}
solution([7, 0, 8, 2, 8, 3, 1, 5, 7, 6, 2], 'left');
