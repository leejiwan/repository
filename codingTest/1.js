function solution(n) {
        var binary = n.toString(2);
    var num = 0;
    var resultNum;
    var result = n;
    //매개변수 2진수 1의 갯수
    for(var i = 0; i<binary.length; i++) {
        if(binary[i] == 1) {
            num++;
        }
    }

    while(true) {
        result = result + 1;
        resultNum = 0;
        var rBinary = result.toString(2)
        
        for(var i = 0; i<rBinary.length; i++) {
            if(rBinary[i] == 1) {
                resultNum++;
            }
        }
     
        if(num == resultNum) {
            break;
        }
    }
    return result;
}