import { connect } from 'react-redux';
import ColumnsArea from '../components/columns_area';
import { openModal } from '../../../actions/modal';

const mapStateToProps = state => ({
  columns: state.getIn(['settings', 'columns']),
  isModalOpen: !!state.get('modal').modalType,
});


const mapDispatchToProps = (dispatch) => ({
  onOpenCompose() {
    dispatch(openModal('COMPOSE'));
  },
});

export default connect(mapStateToProps, mapDispatchToProps, null, { forwardRef: true })(ColumnsArea);
