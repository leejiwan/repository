//최댓값과 최솟값
function solution(n) {
    var answer;
    var nArray = n.split(' ');
    var max = Math.max.apply(null, nArray);
    var min = Math.min.apply(null, nArray);
    answer = min.toString().concat(' ', max.toString());
    return answer;
}
var test = '1 2 3 4';
solution(test);