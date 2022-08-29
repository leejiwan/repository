//Lv1. 로또의 최고 순위와 최저 순위
function solution(lottos, win_nums) {
    var answer = [];

    var max = result(lottos, win_nums, true);
    var min = result(lottos, win_nums, false);

    answer.push(ranking(max))
    answer.push(ranking(min))

    return answer;
}
//일치번호갯수 return
function result(lottos, win_nums, isMax) {
    var t = 0;

    for (var i = 0; i < lottos.length; i++) {
        if (lottos[i] != 0) {
            for (var j = 0; j < win_nums.length; j++) {
                if (win_nums[j] == lottos[i]) {
                    t++;
                }
            }
        } else {
            //0 무조건 맞을걸로
            if (isMax) {
                t++;
            }
        }
    }

    return t;
}
//일치번호갯수에 따른 순위 return
function ranking(num) {
    var returnNum;
    switch (num) {
        case 6:
            returnNum = 1;
            break;
        case 5:
            returnNum = 2;
            break;
        case 4:
            returnNum = 3;
            break;
        case 3:
            returnNum = 4;
            break;
        case 2:
            returnNum = 5;
            break;
        case 1:
            returnNum = 6;
            break;
        case 0:
            returnNum = 6;
            break;
        default:
    }
    return returnNum;
}