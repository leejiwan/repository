//2021 카카오 인턴 1차 120분, 알고리즘 1문제
function solution(n, m) {
  var x = n; //가로
  var y = m; //세로
  var print;
  for(var i=0; i<y; i++) {
    print = '';
    for(var j=0; j<x; j++) {
      print += '*';
    }
    console.log(print);
  }
}
function solution2(n) {
  var print;
  for(var i=0; i<n; i++) {
    print = '';
    for(var j=0; j<=i; j++) {
      print += '*';
    }
    console.log(print);
  }
}
//solution(5,3);
solution2(3);
