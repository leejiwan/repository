//N개의 최소 공배수
function solution(n) {
    var answer = n[0];
    for(var i=1; i<n.length; i++) {
        answer = lcm(answer, n[i]);
    }
    return answer;
}
//최대공약수
function gcd(a, b) {
    var temp;
    while(b > 0) {
        temp = a%b;
        a = b;
        b = temp;
    }
    return a; //최대공약수
};
//최소공배수
function lcm(a,b) {
    return (a*b)/gcd(a,b);
}
solution(test);