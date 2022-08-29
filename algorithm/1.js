function solution(n) {
    var binary = n.toString(2);
    var num = 0;
    var resultNum;
    var result = n;
    //매개변수 2진수 1의 갯수
    for (var i = 0; i < binary.length; i++) {
        if (binary[i] == 1) {
            num++;
        }
    }

    while (true) {
        result = result + 1;
        resultNum = 0;
        var rBinary = result.toString(2)

        for (var i = 0; i < rBinary.length; i++) {
            if (rBinary[i] == 1) {
                resultNum++;
            }
        }

        if (num == resultNum) {
            break;
        }
    }
    return result;
}

function solution(answers) {
    //1,2,3,4,5,1
    //2,1,2,3,2,4,2,5
    //3,3,1,1,2,2,4,4,5,5
    var answer = [];
    let a = '12345';
    let b = '21232425';
    let c = '3311224455';
    let a1 = test(a, answers);
    let b1 = test(b, answers);
    let c1 = test(c, answers);


    if (a1 == b1 && b1 == c1) {
        answer = [1, 2, 3];
    } else {
        var maxTemp = Math.max(a1, b1, c1);
        var max;
        if (maxTemp == a1) {
            max = 1;
        } else if (maxTemp == b1) {
            max = 2;
        } else if (maxTemp == c1) {
            max = 3;
        }
        answer.push(max);
    }
    console.log(answer)
    return answer;
}

function test(input, answers) {
    while (input.length < answers.length) {
        if (input.length > answers.length) {
            break;
        }
        input + input;
    }


    var correct = 0;
    for (var i = 0; i < answers.length; i++) {
        let tempAnswer = input.slice(i, i + 1);
        if (tempAnswer == answers[i]) {
            correct++;
        }
    }
    return correct;
}
solution([1, 2, 3, 4, 5]);