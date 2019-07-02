import api from '../api';
import { me } from 'gabsocial/initial_state';

export const GROUP_FETCH_REQUEST = 'GROUP_FETCH_REQUEST';
export const GROUP_FETCH_SUCCESS = 'GROUP_FETCH_SUCCESS';
export const GROUP_FETCH_FAIL    = 'GROUP_FETCH_FAIL';

export const GROUP_RELATIONSHIPS_FETCH_REQUEST = 'GROUP_RELATIONSHIPS_FETCH_REQUEST';
export const GROUP_RELATIONSHIPS_FETCH_SUCCESS = 'GROUP_RELATIONSHIPS_FETCH_SUCCESS';
export const GROUP_RELATIONSHIPS_FETCH_FAIL    = 'GROUP_RELATIONSHIPS_FETCH_FAIL';

export const GROUPS_FETCH_REQUEST = 'GROUPS_FETCH_REQUEST';
export const GROUPS_FETCH_SUCCESS = 'GROUPS_FETCH_SUCCESS';
export const GROUPS_FETCH_FAIL    = 'GROUPS_FETCH_FAIL';

export const GROUP_JOIN_REQUEST = 'GROUP_JOIN_REQUEST';
export const GROUP_JOIN_SUCCESS = 'GROUP_JOIN_SUCCESS';
export const GROUP_JOIN_FAIL    = 'GROUP_JOIN_FAIL';

export const GROUP_LEAVE_REQUEST = 'GROUP_LEAVE_REQUEST';
export const GROUP_LEAVE_SUCCESS = 'GROUP_LEAVE_SUCCESS';
export const GROUP_LEAVE_FAIL    = 'GROUP_LEAVE_FAIL';

export const fetchGroup = id => (dispatch, getState) => {
  if (!me) return;

  dispatch(fetchGroupRelationships([id]));

  if (getState().getIn(['groups', id])) {
    return;
  }

  dispatch(fetchGroupRequest(id));

  api(getState).get(`/api/v1/groups/${id}`)
    .then(({ data }) => dispatch(fetchGroupSuccess(data)))
    .catch(err => dispatch(fetchGroupFail(id, err)));
};

export const fetchGroupRequest = id => ({
  type: GROUP_FETCH_REQUEST,
  id,
});

export const fetchGroupSuccess = group => ({
  type: GROUP_FETCH_SUCCESS,
  group,
});

export const fetchGroupFail = (id, error) => ({
  type: GROUP_FETCH_FAIL,
  id,
  error,
});

export function fetchGroupRelationships(groupIds) {
  return (dispatch, getState) => {
    if (!me) return;

    const loadedRelationships = getState().get('group_relationships');
    const newGroupIds = groupIds.filter(id => loadedRelationships.get(id, null) === null);

    if (newGroupIds.length === 0) {
      return;
    }

    dispatch(fetchGroupRelationshipsRequest(newGroupIds));

    api(getState).get(`/api/v1/groups/${newGroupIds[0]}/relationships?${newGroupIds.map(id => `id[]=${id}`).join('&')}`).then(response => {
      dispatch(fetchGroupRelationshipsSuccess(response.data));
    }).catch(error => {
      dispatch(fetchGroupRelationshipsFail(error));
    });
  };
};

export function fetchGroupRelationshipsRequest(ids) {
  return {
    type: GROUP_RELATIONSHIPS_FETCH_REQUEST,
    ids,
    skipLoading: true,
  };
};

export function fetchGroupRelationshipsSuccess(relationships) {
  return {
    type: GROUP_RELATIONSHIPS_FETCH_SUCCESS,
    relationships,
    skipLoading: true,
  };
};

export function fetchGroupRelationshipsFail(error) {
  return {
    type: GROUP_RELATIONSHIPS_FETCH_FAIL,
    error,
    skipLoading: true,
  };
};

export const fetchGroups = () => (dispatch, getState) => {
  if (!me) return;

  dispatch(fetchGroupsRequest());

  api(getState).get('/api/v1/groups')
    .then(({ data }) => dispatch(fetchGroupsSuccess(data)))
    .catch(err => dispatch(fetchGroupsFail(err)));
};

export const fetchGroupsRequest = () => ({
  type: GROUPS_FETCH_REQUEST,
});

export const fetchGroupsSuccess = groups => ({
  type: GROUPS_FETCH_SUCCESS,
  groups,
});

export const fetchGroupsFail = error => ({
  type: GROUPS_FETCH_FAIL,
  error,
});

export function joinGroup(id) {
  return (dispatch, getState) => {
    if (!me) return;

    dispatch(joinGroupRequest(id));

    api(getState).post(`/api/v1/groups/${id}/accounts`).then(response => {
      dispatch(joinGroupSuccess(response.data));
    }).catch(error => {
      dispatch(joinGroupFail(id, error));
    });
  };
};

export function leaveGroup(id) {
  return (dispatch, getState) => {
    if (!me) return;
    
    dispatch(leaveGroupRequest(id));

    api(getState).delete(`/api/v1/groups/${id}/accounts`).then(response => {
      dispatch(leaveGroupSuccess(response.data));
    }).catch(error => {
      dispatch(leaveGroupFail(id, error));
    });
  };
};

export function joinGroupRequest(id) {
  return {
    type: GROUP_JOIN_REQUEST,
    id,
  };
};

export function joinGroupSuccess(relationship) {
  return {
    type: GROUP_JOIN_SUCCESS,
    relationship
  };
};

export function joinGroupFail(error) {
  return {
    type: GROUP_JOIN_FAIL,
    error,
  };
};

export function leaveGroupRequest(id) {
  return {
    type: GROUP_LEAVE_REQUEST,
    id,
  };
};

export function leaveGroupSuccess(relationship) {
  return {
    type: GROUP_LEAVE_SUCCESS,
    relationship,
  };
};

export function leaveGroupFail(error) {
  return {
    type: GROUP_LEAVE_FAIL,
    error,
  };
};
