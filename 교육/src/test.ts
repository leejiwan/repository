/*
;(async function t() {
  //await는 단독으로 못쓴다 aync가 필요함
  const res1 = await fetch('https://api.heropy.dev/v0/delay?t=1000') //네트워크 통신을 위한 API, await 동기식 느낌?
  // const data = await res1.json()
  // console.log(data)
  // const res2 = await async1() //기다렸다가 처리한다
  //// console.log(res2) //Promise
  //  const res3 = await async2() //기다렸다가 처리한다
  //  console.log(res3) //Promise

  // const [r1, r2, r3] = await Promise.all([res1.json(), async1(), async2()]) //병렬로 실행
  const res = await Promise.race([res1.json(), async1(), async2()]) //제일 빨리 처리 반환

  console.log('1', r1)
  console.log('2', r2)
  console.log('3', r3)
})()
*/
//1
async function async1() {
  console.log('sync!')
  return 123
}

//2
function async2() {
  return new Promise(function (reslove, reject) {
    setTimeout(function () {
      reslove('123@@')
    }, 2000)
  })
}

//이름 내보내기
export const a = '123aa'

//기본 내보내기
export default '456'

type hello = string
const h: hello = '123'
console.log(h)
