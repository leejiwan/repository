/*
this 

this를 호출하는 경우엔 global object
브라우저에서 호출하는 경우 window 객체
*/

/*
this 
함수 스코프 내에 자동으로 생성되는 특수한 식별자이자 
자기 자신이 속한 객체를 가리키는 식별자
*/

var person = {
  firstName: "John",
  lastName: "Doe",
  fullName: function () {
    return this.firstName + " " + this.lastName;
  },
};

console.log(person.fullName());
