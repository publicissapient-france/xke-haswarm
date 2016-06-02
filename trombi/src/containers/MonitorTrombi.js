import {connect} from 'react-redux'
import Trombi from '../components/Trombi'

const mapStateToProps = (state) => {
    return {
        services: state.services
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        // onRunClick: (id) => {
        //     dispatch(runProject(id))
        // }
    }
};

const MonitorTrombi = connect(
    mapStateToProps,
    mapDispatchToProps
)(Trombi);

export default MonitorTrombi