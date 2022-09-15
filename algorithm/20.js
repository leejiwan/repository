function solution(numbers, hand) {
    var answer = '';
    var temp = {};


    for (var i = 0; i < numbers.length; i++) {
        if (numbers[i] == 1 || numbers[i] == 4 || numbers[i] == 7) {
            answer.push('L');
            temp.hand = 'L';
        } else if (numbers[i] == 3 || numbers[i] == 6 || numbers[i] == 9) {
            answer.push('R');
            temp.hand = 'R';
        } else {
            if (temp.hand == null) {
                hand == 'right' ? temp.hand = 'R' : temp.hand = 'L';
            } else {



            }
        }
        temp.num = numbers[i];

    }

    return answer;
}
function fncKeypad(l, r, keybtn) {
    //1,2,3
    //4,5,6
    //7,8,9
    //*,0,#
    //   var keypad = [[1, 2, 3],
    //   [4, 5, 6],
    //  [7, 8, 9]
    //  ['*', 0, '#']];


    var keypad = {
        1: [0, 0], 2: [0, 1], 3: [0, 2],
        4: [1, 0], 5: [1, 1], 6: [1, 2],
        7: [2, 0], 8: [2, 1], 9: [2, 2],
        '*': [3, 0], 0: [3, 1], '#': [3, 2]
    };


    var lDeep = Math.abs(keypad[l][0] - keypad[keybtn][0]) + Math.abs(keypad[l][1] - keypad[keybtn][1]);
    var rDeep = Math.abs(keypad[r][0] - keypad[keybtn][0]) + Math.abs(keypad[r][1] - keypad[keybtn][1]);



    return lDeep > rDeep ? rDeep : lDeep;
}
fncKeypad(1, '#', 0);