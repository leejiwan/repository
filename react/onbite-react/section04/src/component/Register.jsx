import { useState, useRef } from "react";
/*
  1. 이름
  2. 생년월일  
  3. 국적
*/
const Register = () => {
    //useRef 컴포넌트 내부 변수이지만 리렌더링을 유발X
    const inputRef = useRef(0);

    const [input, setInput] = useState({
        name :"",
        birth : "",
        country : "",
        bio : ""
    });

    const onChange = (e) => {
        setInput({
            ...input,
            [e.target.value] : e.target.value
        })
    }
    const onSubmit = () => {
        if(input.name === "") {
            ///
            console.log(inputRef.current)
        }
    }
    return(        
        <>
            <div>
                <input ref={inputRef} onChange={onChange} placeholder={"이름"}></input>
                <input type="date"></input>
            </div>
            <div>
                <select value = {input.country} onChange={onChange}>
                    <option>한국</option>
                    <option>중국</option>    
                </select>
                {input.country}
            </div>
        </>       
    ) 
}

export default Register;