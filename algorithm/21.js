function solution(people, limit) {
    var answer = 0;

    var boat = people.sort(function (a, b) {
        return a - b;
    });
    console.log(boat)
    var indexLength = 0;
    var boatLength = boat.length;
    while (boat.length > indexLength) {
        console.log('indexLength::' + indexLength)
        if (boat[indexLength] + boat[indexLength + 1] <= limit) {
            indexLength++;
            boatLength--;
        } else {
            indexLength++;
        }
        answer++;
        if (indexLength == boatLength) {
            break;
        }
    }
    console.log('answer::' + answer);
    return answer;
}
//40 40 60 60
//solution([70, 50, 80, 50], 100);
solution([70, 80, 50], 100);