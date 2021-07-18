function solution(array, commands) {
    var answer = [];
    
    commands.forEach(function(element, index) {
        var i;
        var j;
        var k;
        var temp;
        element.forEach(function(element, index) {
            if(index == 0) {
                i = element;
            }else if(index == 1) {
                j = element;
            }else {
                k = element;    
            }
        })
        temp = array.slice(i-1, j).sort(function(a,b) {
            return a-b;
        });
        answer.push(temp[k-1])
    });

    return answer;
}
var a =  [1, 5, 2, 6, 3, 7, 4];
var b = [[2, 5, 3], [4, 4, 1], [1, 7, 3]]; 

solution(a, b);