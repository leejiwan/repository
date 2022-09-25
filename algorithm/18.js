//올바른 괄호
function solution(s) {
    var answer = true;
    var ch1 = 0;
    var ch2 = 0;
    var arr = [...s];
    var len = arr.length;
    var i = 0;
    console.log(arr)


    if (arr[0] == '(' && arr[len - 1] == ')') {
        while (len > i) {
            if (arr[i] == '(') {
                ch1++;
            } else {
                ch2++;
            }
            i++;
            if (ch1 - ch2 < 0) {
                break;
                return false;
            }
        }

        if (ch1 == ch2) {
            answer = true;
        } else {
            answer = false;
        }

    } else {
        answer = false;
    }
    console.log(answer)
    return answer;
}
solution("()()")