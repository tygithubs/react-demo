import { createStore } from 'redux'

export default function() {
    function counter(state = 0, action) {
        switch(action.type) {
            case 'INCREMENT':
                return state + 1
            case 'DECREMENT':
                return state - 1
            default:
                return state
        }
    }

    let store = createStore(counter)

    store.subscribe(() => {
        console.log('current state', store.getState())
    })
    
    store.dispatch({type: 'INCREMENT'})
    store.dispatch({type: 'INCREMENT'})
    store.dispatch({type: 'DECREMENT'})
}