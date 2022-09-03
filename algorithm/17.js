//LV.2016년
function solution(a, b) {
    var answer = [];
    var week = ['FRI', 'SAT', 'SUN', 'MON', 'TUE', 'WED', 'THU'];
    //2016년 1월 1일 금요일
    //2016년 5월 24일 화요일
    var month = [0, 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    var bDay = 0;

    if (a == 1) {
        bDay = b;
    } else {
        for (var i = 0; i < a; i++) {
            bDay = bDay + month[i];
        }
        bDay = bDay + b;
    }
    bDay = bDay - 1;
    return week[bDay % 7];
}

solution(1, 6);