import "./Main.css"
/*
 1. 중괄호 내부에는 자바스크립트 표현식만 가능
 2. JSX 숫자, 문자열, 배열 값만 랜더링 가능
 3. 모든 태그는 닫혀있어야 함
 4. 최상위 태그는 반드시 하나 (빈태그 가능능)
*/
const Main = () =>{
  const user = {
    name : "Lee",
    isLogin : false
  }

  return (
    <>
        {user.isLogin ? (<div>로그아웃</div>) : (<div className="logout">로그인</div>)}
    </>
  )
}

export default Main;