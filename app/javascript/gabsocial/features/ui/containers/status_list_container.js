import { connect } from 'react-redux';
import StatusList from '../../../components/status_list';
import { Map as ImmutableMap, List as ImmutableList } from 'immutable';
import { createSelector } from 'reselect';
import { debounce } from 'lodash';
import { me, promotions } from '../../../initial_state';
import { dequeueTimeline } from 'gabsocial/actions/timelines';
import { scrollTopTimeline } from '../../../actions/timelines';
import { sample } from 'lodash';
import { fetchStatus } from '../../../actions/statuses';

const makeGetStatusIds = () => createSelector([
  (state, { type, id }) => state.getIn(['settings', type], ImmutableMap()),
  (state, { type, id }) => state.getIn(['timelines', id, 'items'], ImmutableList()),
  (state)           => state.get('statuses'),
], (columnSettings, statusIds, statuses) => {
  return statusIds.filter(id => {
    if (id === null) return true;

    const statusForId = statuses.get(id);
    let showStatus    = true;

    if (columnSettings.getIn(['shows', 'reblog']) === false) {
      showStatus = showStatus && statusForId.get('reblog') === null;
    }

    if (columnSettings.getIn(['shows', 'reply']) === false) {
      showStatus = showStatus && (statusForId.get('in_reply_to_id') === null || statusForId.get('in_reply_to_account_id') === me);
    }

    return showStatus;
  });
});

const mapStateToProps = (state, {timelineId}) => {
  const getStatusIds = makeGetStatusIds();
  const promotion = promotions.length > 0 && sample(promotions.filter(p => p.timeline_id === timelineId));

  return {
    statusIds: getStatusIds(state, { type: timelineId.substring(0,5) === 'group' ? 'group' : timelineId, id: timelineId }),
    isLoading: state.getIn(['timelines', timelineId, 'isLoading'], true),
    isPartial: state.getIn(['timelines', timelineId, 'isPartial'], false),
    hasMore:   state.getIn(['timelines', timelineId, 'hasMore']),
    totalQueuedItemsCount: state.getIn(['timelines', timelineId, 'totalQueuedItemsCount']),
    promotion: promotion,
    promotedStatus: promotion && state.getIn(['statuses', promotion.status_id])
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  onDequeueTimeline(timelineId) {
    dispatch(dequeueTimeline(timelineId, ownProps.onLoadMore));
  },
  onScrollToTop: debounce(() => {
    dispatch(scrollTopTimeline(ownProps.timelineId, true));
  }, 100),
  onScroll: debounce(() => {
    dispatch(scrollTopTimeline(ownProps.timelineId, false));
  }, 100),
  fetchStatus(id) {
    dispatch(fetchStatus(id));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(StatusList);
