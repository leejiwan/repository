function solution(a, b) {
    var answer = [];
    var week = ['FRI', 'SAT', 'SUN', 'MON', 'TUE', 'WED', 'THU'];
    //2016년 1월 1일 금요일
    //2016년 5월 24일 화요일

    var stDate = new Date(2016, 01, 01);
    var endDate = new Date(2016, 05, 20);

    var btMs = endDate.getTime() - stDate.getTime();
    var btDay = btMs / (1000 * 60 * 60 * 24);
    console.log(btDay)
    console.log(btDay % 7)
    console.log(week[btDay % 7])
    return week[btDay % 7];
}

solution()
