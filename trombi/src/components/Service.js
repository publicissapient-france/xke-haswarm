import React, {PropTypes} from "react"

class Service extends React.Component {
    render() {
        console.log(this.props);
        const {name,url,count} = this.props;
        var divStyle = {
            backgroundImage: 'url(' + url + ')'
        };

        return <div className="service" >
            <div className="image" style={divStyle}></div>
            <div className="name">{name}</div>
            <div className="counter">{count}</div>
        </div>
    }
}

Service.propTypes = {
    name: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired
};

export default Service;