function solution(priorities, location) {
  var answer = 0;
  var arr = [];
  for(var i=0; i<priorities.length; i++) {
    var object = {};
    object.key = (i == location) ? true : false ;
    object.value = priorities[i];
    arr.push(object);
  }

  var flag = false;
  while(true) {
    var sh = arr.shift();
    for(var i=0; i<arr.length; i++) {
      if(arr[i].value > sh.value) {
          flag = true;
          break;
      }else {
          flag  = false;
      }
    }

    if(flag) {
      arr.push(sh);
    }else {
      answer++;
      if(sh.key == true) {
        break;
      }
    }
  }
  return answer;
}