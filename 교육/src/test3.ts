//es6 이상부터 var X var는 호이스팅이 발생함
const a: [number, string] = [1, 'aa']

console.log(a)

type hello = string | number
type world = { a: number } & { b: number }

const w: world = { a: 1, b: 1 }
console.log(w)

const el = document.querySelector('div')
el?.innerHTML = 'hello'
