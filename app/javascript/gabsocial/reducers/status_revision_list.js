import { Map as ImmutableMap } from 'immutable';
import {
    STATUS_REVISION_LIST_LOAD,
    STATUS_REVISION_LIST_LOAD_SUCCESS,
    STATUS_REVISION_LIST_LOAD_FAIL
} from '../actions/status_revision_list';

const initialState = ImmutableMap({
    loading: false,
    error: null,
    data: null
});

export default function statusRevisionList(state = initialState, action) {
    switch(action.type) {
    case STATUS_REVISION_LIST_LOAD:
        return initialState;
    case STATUS_REVISION_LIST_LOAD_SUCCESS:
        return state.withMutations(mutable => {
            mutable.set('loading', false);
            mutable.set('data', action.payload);
        });
    case STATUS_REVISION_LIST_LOAD_FAIL:
        return state.withMutations(mutable => {
            mutable.set('loading', false);
            mutable.set('error', action.payload);
        });
    default:
        return state;
    }
};
