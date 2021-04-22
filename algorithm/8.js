function solution(bridge_length, weight, truck_weights) {
  var answer = 0;
  

  //첫번째
  var progress = [{
    weight: truck_weights.shift(),
    time: 0
  }];
  var proressSum = progress[0].weight;

  do{
    answer++;

    for(var n in progress) {
      progress[n].time++;
    }
 
    console.log('proressSum::' + proressSum)
    console.log(progress)

    if(progress[0].time == bridge_length) {
      proressSum = proressSum - progress[0].weight;
      progress.shift();     
    }

    if(truck_weights.length > 0) {
      if((proressSum) <= weight) {
        proressSum =  proressSum + progress[0].weight;  
        if(truck_weights.length > 0) {
          progress.push({
            weight: truck_weights.shift(),
            time: 0
          })
        }   
      }
    }
    
  }while(proressSum != 0)

  console.log('answer::' + answer)
  return answer;
}
var bridge_length = 2;	
var weight = 10;
var truck_weights = [7,4,5,6];
solution(bridge_length, weight, truck_weights);
//2	10	[7,4,5,6] 8
//100	100	[10] 101
//100	100	[10,10,10,10,10,10,10,10,10,10] 110