//폰켓몬
function solution(nums) {
    var answer = [];
    var maxNum = nums.length / 2;

    var i = 0;

    for (var i = 0; i < nums.length; i++) {
        if (answer.length == maxNum) {
            break;
        } else {
            if (!answer.includes(nums[i])) {
                answer.push(nums[i]);
            }
        }
    }


    console.log(answer)
    return answer.length;
}
solution([3, 3, 3, 2, 2, 2])