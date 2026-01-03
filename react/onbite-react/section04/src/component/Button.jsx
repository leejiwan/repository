const Button = ({text, color = "red"}) => {
    const onClickBtn = () => {
        console.log(text)
    }
    return (
        <button onClick={onClickBtn}
        style={{color : color}}>{text}</button>
    )
}

export default Button;
 