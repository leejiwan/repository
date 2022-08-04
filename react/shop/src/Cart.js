import { Table } from "react-bootstrap";
//redux
import { useSelector } from "react-redux";
/*
Redux
*/
function Cart() {
  let a = useSelector(state => {
    return state;
  });
  console.log(a.prod);
  return (
    <div>
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
                <td>안녕</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
}

export default Cart;
