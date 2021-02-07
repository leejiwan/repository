import PropTypes from 'prop-types';

const MyComponent = props => {
    return <div>{props.name} <span>{props.children}</span></div>
};

MyComponent.defaultProps = {
    name : 1234
}

MyComponent.propTypes = {
    name : PropTypes.string
}

export default MyComponent;