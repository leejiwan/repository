import { Table } from "react-bootstrap";
//redux
import { useSelector, useDispatch } from "react-redux";
import { update, update2, updateProd } from "./store.js";
/*
Redux
*/
function Cart() {
    let a = useSelector(state => {
        return state;
    });

    let dispatch = useDispatch(); //store.js로 요청보내주는 함수

    return (
        <div>
            {a.user.name}의 장바구니
            <button onClick={() => {
                dispatch(update2(a));
            }}>{a.user.age}</button>
            <Table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>상품명</th>
                        <th>수량</th>
                        <th>변경하기</th>
                    </tr>
                </thead>
                <tbody>
                    {a.prod.map((data, index) => {
                        return (
                            <tr>
                                <td>{data.id}</td>
                                <td>{data.name}</td>
                                <td>{data.count}</td>
                                <td>
                                    <button onClick={(e) => {
                                        dispatch(updateProd(data.id));
                                    }}>+
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </Table>
        </div>
    );
}

export default Cart;
