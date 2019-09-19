import { connect } from 'react-redux';
import SchedulePostDropdown from '../components/schedule_post_dropdown';
import { changeScheduledAt } from '../../../actions/compose';
import { openModal } from '../../../actions/modal';
import { me } from '../../../initial_state';

const mapStateToProps = state => ({
  date: state.getIn(['compose', 'scheduled_at']),
  isPro: state.getIn(['accounts', me, 'is_pro']),
});

const mapDispatchToProps = dispatch => ({
  setScheduledAt (date) {
    dispatch(changeScheduledAt(date));
  },

  onOpenProUpgradeModal() {
    dispatch(openModal('PRO_UPGRADE'));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(SchedulePostDropdown);
