//숫자의 표현
function solution(n) {
    var len = n/2 + 1;
    var result = 0;
    var sum;
    for(var i=0; i<len; i++) {
        sum = 0;
        for(var j = i+1; j<len && sum < n; j++) {
            sum += j;
            if(sum == n) {
                result++;
                break;
            }
        }
    }
    return result + 1;
}
solution(15);