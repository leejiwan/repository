function solution(progresses, speeds) {
  let day = [];
  let answer = {};

  for(let i = 0; i < progresses.length; i ++) {
    day[i] = Math.ceil((100 - progresses[i]) / speeds[i]);
  }

  for(let i = 0; i < day.length; i ++) {
    if(day[i - 1] > day[i]) {
      day[i] = day[i - 1];
    }
  }

  let index = 0;

  for(let i = 0; i < day.length; i ++) {
    console.log(day[i])
    answer[day[i]] ? answer[day[i]]++ : answer[day[i]] = 1
  }
  console.log(answer)
  let result = [];
  for(let key in answer) {
    result.push(answer[key]);
  }


  return result;
}
var progresses = [95, 90, 99, 99, 80, 99]	;
var speeds = [1, 1, 1, 1, 1, 1];
//[95, 90, 99, 99, 80, 99]	[1, 1, 1, 1, 1, 1]	
//[93, 30, 55] [1, 30, 5]
solution(progresses, speeds) 