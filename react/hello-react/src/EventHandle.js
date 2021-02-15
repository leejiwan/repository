import React, {Component} from 'react';


class Event extends Component {
    state = {
        message : 'test',
        num: 0
    }

    render() {
        return (
            <div>
              <h>{this.props.name}</h>
              <div>
               <input type="text" 
               id="name" 
               name="message" 
               required minlength="4" 
               maxlength="8" 
               size="10"
               value={this.state.message}
               onChange={(e)=>{this.setState({message:e.target.value})}} />
              </div>
              <button onClick={()=> {this.setState({message:'', num: this.state.num + 1}); alert(this.state.num); }}>reset</button>
              </div>
        )
    }
}

Event.defaultProps = {
    name: 'lee'
}

export default Event;