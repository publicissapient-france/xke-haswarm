import expect from 'expect'
import reducer from '../src/reducers/index'
import * as actions from '../src/actions'

describe('services reducer', () => {
    it('should return the initial state', () => {
        expect(
            reducer(undefined, {})
        ).toEqual(
            {
                ringOffset: 0,
                services: {},
                isMonitor: false
            }
        )
    });

    it('should handle RING_TICK', () => {
        expect(
            reducer(undefined, {
                type: actions.RING_TICK
            })
        ).toEqual(
            {
                ringOffset: 1,
                services: {},
                isMonitor: false
            }
        );
    });

    it('should handle SERVICE_HIT', () => {
        var service = {
            name: "M test",
            filename: "test.png",
            hostname: "test.example.com"
        };
        var state = reducer(undefined, actions.hitService(service));

        expect(state).toEqual(
            {
                ringOffset: 0,
                services: {
                    "M test": {
                        countBuffer: 1,
                        countRing: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        name: "M test",
                        filename: "test.png",
                        hostname: "test.example.com"
                    }
                },
                isMonitor: false
            }
        );
    });


    it('should rotate RING_TICK', () => {
        var state = {
            ringOffset: 99,
            services: {},
            isMonitor: false
        };
        state = reducer(state, {type: actions.RING_TICK});

        expect(state).toEqual(
            {
                ringOffset: 0,
                services: {},
                isMonitor: false
            }
        );
    });

    it('should RING_TICK rotates counter', () => {
        var service = {
            name: "M test",
            filename: "test.png",
            hostname: "test.example.com"
        };
        var state = {
            ringOffset: 0,
            services: {},
            isMonitor: false
        };

        for (var i = 0; i < 5; i++) {
            state = reducer(state, actions.hitService(service));
            state = reducer(state, actions.hitService(service));
            state = reducer(state, actions.ringTick())
        }

        expect(state.ringOffset).toEqual(5);
        expect(state.services['M test'].countRing
            .reduce((total, num) => total + num))
            .toEqual(10);
    })
})
;
