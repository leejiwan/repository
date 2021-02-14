import React, {Component} from 'react';


class Event extends Component {
    render() {
        return (
            <div>
              <h>{this.props.name}</h>
              <div>
               <input type="text" 
               id="name" 
               name="name" 
               required minlength="4" 
               maxlength="8" 
               size="10"
               onChange={(e)=> {console.log(e)}}/>
              </div>
              </div>
        )
    }
}

Event.defaultProps = {
    name: 'lee'
}

export default Event;