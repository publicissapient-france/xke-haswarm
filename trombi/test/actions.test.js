import expect from 'expect'
import * as actions from '../src/actions'

describe('actions', () => {
    it('should create an action to hit a service', () => {
        const service = {
            name: "M test",
            filename: "test.png",
            hostname: "test.example.com",
            hits: 1685
        };

        const expectedAction = {
            type: actions.SERVICE_HIT,
            filename: "test.png",
            name: "M test",
            hostname: "test.example.com"
        };
        expect(actions.hitService(service)).toEqual(expectedAction)
    });

    it('should create an action to tic counters', () => {
        const expectedAction = {type: actions.RING_TICK};
        expect(actions.ringTick()).toEqual(expectedAction)
    })
});
