//구명보트
function solution(people, limit) {
    var answer = 0;
    var sortArray = people.sort(function(a, b)  {
        return b - a;
      });
    var lastIndex = sortArray.length;
    var index = 0;
      // 80, 70, 50, 50 
      //70, 80, 50
    while(index <= lastIndex) {
        if(people[index] + people[lastIndex] > limit) {
            index++;
        }else {
            index++;
            lastIndex--;
        }
        answer++;
    }
    return answer;
}
var input = [70, 80, 50];
var limit = 100;
solution(input, limit);