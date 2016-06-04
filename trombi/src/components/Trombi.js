import React, {PropTypes} from 'react'

import Service from "./Service"

class Trombi extends React.Component {
    render() {
        const {services} = this.props;
        return <div className="trombi">
            {
                services.map(s => <Service key={s.name} {...s} />)
            }
        </div>
    }
}

Trombi.propTypes = {
    services: PropTypes.array.isRequired
};

export default Trombi;