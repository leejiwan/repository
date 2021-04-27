function solution(clothes) {
  var answer = 1;
  var obj = {};
  clothes.forEach(function(ele, index) {
    if(obj[ele[1]]>=1)    
      obj[ele[1]] +=1
    else                    
     obj[ele[1]] = 1
  });

  //(a+1) * (b+1) * (c+1) -1
  for(var i in obj) {
    answer = answer * (obj[i] + 1);
  }

  return answer - 1;
}
var clothes = [["yellowhat", "headgear"], ["bluesunglasses", "eyewear"], ["green_turban", "headgear"]];
solution(clothes);