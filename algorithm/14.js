function solution(A,B) {
    var answer = 0;

    A.sort(function(a,b) {
        return a-b;
    });

    B.sort(function(a,b) {
        return b-a;
    })

    A.forEach(function(ele, index) {
  
        answer += (ele * B[index]); 
    });

    return answer;
}
var a =  [1, 4, 2];
var b = [5, 4, 4]; 

solution(a, b);