function solution(progresses, speeds) {
  var answer = [];
  var result = [];
  for(var i in progresses) {
    result.push(Math.ceil((100 - progresses[i]) * (1 / speeds[i])))
  }
 
  var before = result[0];
  var index = 0;
  for(var i in result) {
    if(before >= result[i]) {
      index++;
    }

    if(before < result[i]) {
      answer.push(index);
      before = result[i];
      index = 1;
    }

    if(i == result.length-1) {
      answer.push(index);
    }

    console.log('result::' + result[i])
    console.log('index::' + index);
    console.log('before::' + before);


  }
  return answer;
}
//var progresses = [93, 30, 55]; var speeds = [1, 30, 5];;	//[7,3,9] [2, 1]
var progresses = [95, 90, 99, 99, 80, 99];	var speeds = [1, 1, 1, 1, 1, 1];	//   [1, 3, 2]
solution(progresses, speeds)
