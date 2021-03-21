//구명보트
function solution(n) {
    var answer;
    var sortArray = n.sort(function(a, b)  {
        return b - a;
      });
    var lastIndex = sortArray.length;
    var index = 0;
    while(index != lastIndex) {
        if(n[index] + n[lastIndex] > 100) {
            index++;
        }else {

        }
        answer++;
    }

}
var input = [80, 70, 50, 50];
solution(input);