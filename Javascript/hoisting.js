/*
호이스팅
스크립트 내 변수와 함수의 선언 순서에 상관 없이 순서가 끌어올려진 듯 한 현상
자바스크립트 엔진이 먼저 전체 코드를 한 번 스캔하고 실행컨텍스트에 미리 기록해 놓기 때문에 이런 현상이 발생


*/

test(); //호이스팅 개념 없이 이론적으로 생각해보면 실행이 불가능해야할거 같음

function test() {
  console.log("test");
}

test();

/*
변수가 호이스팅 될 때는 선언, 초기화만 된채로 호이스팅
할당까지 호이스팅은 되지 않음
*/

console.log(name); //undefined
var name = "lee";
console.log(name); // "lee"
