function solution(numbers) {
  var answer = 0;

  var t = numbers.map(function(a) {
    return a.toString();
  })

  //아 sort는 모르겠다.. 진짜
  var c = t.sort(function(a,b) {
    return (b+a) - (a+b);
  }) 

  var result = c.join('').toString();
  if(result.charAt(0) == '0') {
    result = '0';
  }
  return result;
}
var numbers = [0, 0, 0];
solution(numbers);