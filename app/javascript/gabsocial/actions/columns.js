import { saveSettings } from './settings';

export const COLUMN_PARAMS_CHANGE = 'COLUMN_PARAMS_CHANGE';

export function changeColumnParams(uuid, path, value) {
  return dispatch => {
    dispatch({
      type: COLUMN_PARAMS_CHANGE,
      uuid,
      path,
      value,
    });

    dispatch(saveSettings());
  };
}
