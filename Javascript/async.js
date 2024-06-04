/*
비동기 async /await
*/
function getData() {
  return new Promise((resolve, reject) => {
    // response가 3초 걸린다고 가정 (비동기 처리)
    setTimeout(() => {
      const value = 100;
      resolve(value); // Promise 성공 객체 반환
    }, 3000);
  });
}

async function process() {
  let data = await getData(); // await 키워드로 Promise가 완료될 때까지 기다린다
  console.log("data : ", data);
}

console.log("111");
process();
console.log("222");

/*
111
222
data : 1000
*/
