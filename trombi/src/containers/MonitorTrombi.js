import {connect} from 'react-redux'
import Trombi from '../components/Trombi'
function getSum(total, num) {
    return total + num;
}
const mapStateToProps = (state) => {
    return {
        services: Object.keys(state.services).map(k => ({
            name: state.services[k].name,
            count: state.services[k].countRing ? state.services[k].countRing.reduce(getSum)/10 : 0,
            url: state.services[k].url
        }))
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