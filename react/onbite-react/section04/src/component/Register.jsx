import { useState } from "react";
/*
  1. 이름
  2. 생년월일  
  3. 국적
*/
const Register = () => {
    const [name, setName] = useState("");
    const onChangeName = (e) => {
        setName(e.target.value)
    }
    return(        
        <div>
            <input onChange={onChangeName} placeholder={"이름"}></input>
            <input type="date"></input>
        </div>
    ) 
}

export default Register;