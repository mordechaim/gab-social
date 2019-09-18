import api from '../api';

export const STATUS_REVISION_LIST_LOAD = 'STATUS_REVISION_LIST';
export const STATUS_REVISION_LIST_LOAD_SUCCESS = 'STATUS_REVISION_LIST_SUCCESS';
export const STATUS_REVISION_LIST_LOAD_FAIL = 'STATUS_REVISION_LIST_FAIL';

const loadSuccess = data => ({ type: STATUS_REVISION_LIST_LOAD_SUCCESS, payload: data });
const loadFail = e => ({ type: STATUS_REVISION_LIST_LOAD_FAIL, payload: e });

export function load(statusId) {
    return (dispatch, getState) => {
        api(getState).get(`/api/v1/statuses/${statusId}/revisions`)
            .then(res => dispatch(loadSuccess(res.data)))
            .catch(e => dispatch(loadFail(e)));
    };
}