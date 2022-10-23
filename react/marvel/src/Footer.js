import { CDBFooter, CDBFooterLink, CDBBox, CDBBtn, CDBIcon } from 'cdbreact';
import { useSelector } from "react-redux"

function Footer(data) {
    let wrapStyle = {
        'backgroundColor': 'rgba(0, 0, 0, 0.2)'
    }
    return (
        <div>
            <div>
                <div className="text-center p-3" style={wrapStyle}>
                    <div dangerouslySetInnerHTML={{ __html: data.data }} />
                </div>
            </div>
        </div>
    )
}
//https://www.devwares.com/docs/contrast/react/components/footer/
function FooterV1() {
    let footText = useSelector((state) => { return state });
    return (
        <CDBFooter className="shadow">
            <CDBBox
                display="flex"
                justifyContent="between"
                alignItems="center"
                className="mx-auto py-4 flex-wrap"
                style={{ width: '20%' }}
            >

                <CDBBox alignItems="center">
                    <small className="ml-2">&copy; {footText.footerData}</small>
                </CDBBox>
            </CDBBox>
        </CDBFooter>
    )
}


export { Footer, FooterV1 };
