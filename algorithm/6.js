function solution(progresses, speeds) {
  var answer = [];

  while(speeds.length > 0) {
 
      for(var i in speeds) {
          if(progresses[i] < 100) {
              progresses[i] += speeds[i];
          }
      }


      var count = 0;
      while(progresses[0] >= 100) {
          progresses.shift();
          speeds.shift();
          count++;
      }
      if(count > 0) {
          answer.push(count);
      }
  }

  return answer;
}