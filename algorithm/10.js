function solution(n) {
  var answer = 0;
  if(fibo(n) < 1234567) {
    answer = 
  }else {
    answer = fibo(n)%1234567;
  }

  return answer;
}
function fibo(n) {
  if(n <= 1) {
    return n;
  }else {
    return fibo(n-2) + fibo(n-1);
  }
}
solution(5);