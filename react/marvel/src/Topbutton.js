import { useEffect, useState } from "react";
import { ArrowUpCircleFill } from 'react-bootstrap-icons';

const TopButton = () => {
    const [showButton, setShowButton] = useState(false);

    const scrollToTop = () => {
        window.scroll({
            top: 0,
            behavior: 'smooth'
        })
    }


    useEffect(() => {
        const showButtonClick = () => {
            if (window.scrollY > 400) {
                setShowButton(true);
            } else {
                setShowButton(false);
            }
        }
        console.log('window.scrollY:::' + window.scrollY)
        window.addEventListener('scroll', showButtonClick);
        return () => {
            window.removeEventListener('scroll', showButtonClick)
        }
    }, [])

    return (
        <>
            {showButton &&
                <div className="topButtop">
                    <ArrowUpCircleFill size={46} onClick={scrollToTop} type='button'>top</ArrowUpCircleFill>
                </div>
            }
        </>
    )
};

export { TopButton };
