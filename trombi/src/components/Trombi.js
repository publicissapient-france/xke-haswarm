import React, {PropTypes} from 'react'

import Service from "./Service"

class Trombi extends React.Component {
    render() {
        const {services, onHitClick} = this.props;
        return <div className="trombi">
            {
                services.map(s => <Service key={s.name} {...s} onServiceClick={() => onHitClick(s)}/>)
            }
        </div>
    }
}

Trombi.propTypes = {
    services: PropTypes.array.isRequired,
    onHitClick: PropTypes.func.isRequired
};

export default Trombi;