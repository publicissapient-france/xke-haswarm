import React, {PropTypes} from 'react'

import Service from "./Service"

class Trombi extends React.Component {
    render() {
        const {services} = this.props;
        return <div className="trombi">
            {
                Object.keys(services).map(k => <Service key={k} {...services[k]} />)
            }
        </div>
    }
}

Trombi.propTypes = {
    services: PropTypes.object.isRequired
};

export default Trombi;