import React, {Component} from 'react';

class MyComponentClass extends Component {
    state = {
        number : 1500,
        name : 'Lee'
    };
    render() {
        var {number, name} = this.state;
       return <div>{number} {name}</div>
    }
}


export default MyComponentClass;