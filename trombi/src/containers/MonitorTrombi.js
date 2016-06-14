import {connect} from 'react-redux'
import Trombi from '../components/Trombi'
import {hitServiceRequested} from '../actions'
function getSum(total, num) {
    return total + num;
}
const mapStateToProps = (state) => {
    return {
        services: Object.keys(state.services).map(k => ({
            name: state.services[k].name,
            count: state.services[k].countRing ? state.services[k].countRing.reduce(getSum)/10 : 0,
            url: "http://" + state.services[k].hostname + "/static/img/" + state.services[k].filename,
            hitUrl: "http://" + state.services[k].hostname + "/identity/directhit",
            identityUrl: "http://" + state.services[k].hostname + "/identity",
            hitPending : state.hitPending,
            isMonitor: state.isMonitor
        }))
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        onHitClick: (service) => {
             dispatch(hitServiceRequested(service));
        }
    }
};

const MonitorTrombi = connect(
    mapStateToProps,
    mapDispatchToProps
)(Trombi);

export default MonitorTrombi