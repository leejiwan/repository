function solution(bridge_length, weight, truck_weights) {
  var answer = 1;

  //첫번째 트럭 넣기
  var progress = [{
    weight: truck_weights.shift(),
    time: 0
  }];
  var proressSum = progress[0].weight;

  do{
    answer++;

    //시간증가
    for(var n in progress) {
      progress[n].time++;
    }
     
    //다리에 뺴기
    if(progress[0].time == bridge_length) {
      proressSum = proressSum - progress[0].weight;
      progress.shift();     
    }
    
    
    if(truck_weights.length > 0) {
      //다리에 넣기
      if((proressSum + truck_weights[0]) <= weight) {
        proressSum =  proressSum + truck_weights[0];  
        progress.push({
          weight: truck_weights.shift(),
          time: 0
        })
      }
    }
  //  console.log('-------------------------')
   // console.log(progress)
   // console.log('proressSum::' + proressSum)
   
  }while(proressSum != 0)
  return answer;
}
var bridge_length = 100;	
var weight = 100;
var truck_weights = [10];
solution(bridge_length, weight, truck_weights);
//2	10	[7,4,5,6] 8
//100	100	[10] 101
//100	100	[10,10,10,10,10,10,10,10,10,10] 110