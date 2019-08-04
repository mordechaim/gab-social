import { connect } from 'react-redux';
import QuotedStatusPreview from '../components/quoted_status_preview';

const mapStateToProps = (state, { id }) => ({
    status: state.getIn(['statuses', id]),
    account: state.getIn(['accounts', state.getIn(['statuses', id, 'account'])]),
});

export default connect(mapStateToProps)(QuotedStatusPreview);