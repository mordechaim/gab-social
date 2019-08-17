import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import { me } from '../../../initial_state';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import Avatar from '../../../components/avatar';
import ImmutablePureComponent from 'react-immutable-pure-component';
import ComposeFormContainer from '../../compose/containers/compose_form_container';
import IconButton from 'gabsocial/components/icon_button';
import { openModal } from '../../../actions/modal';
import { cancelReplyCompose } from '../../../actions/compose';

const messages = defineMessages({
  close: { id: 'lightbox.close', defaultMessage: 'Close' },
  confirm: { id: 'confirmations.delete.confirm', defaultMessage: 'Delete' },
});

const mapStateToProps = state => {
  return {
    account: state.getIn(['accounts', me]),
    composeText: state.getIn(['compose', 'text']),
    composeId: state.getIn(['compose', 'id']),
  };
};

class ComposeModal extends ImmutablePureComponent {

  static propTypes = {
    account: ImmutablePropTypes.map,
    intl: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
    composeText: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
  };

  onClickClose = () => {
    const {composeText, composeId, dispatch, onClose, intl} = this.props;

    if (!composeId && composeText) {
      dispatch(openModal('CONFIRM', {
        message: <FormattedMessage id='confirmations.delete.message' defaultMessage='Are you sure you want to delete this status?' />,
        confirm: intl.formatMessage(messages.confirm),
        onConfirm: () => dispatch(cancelReplyCompose()),
        onCancel: () => dispatch(openModal('COMPOSE')),
      }));
    }
    else {
      onClose('COMPOSE');
    }
  };

  render () {
    const { intl, account } = this.props;

    return (
      <div className='modal-root__modal compose-modal'>
        <div className='compose-modal__header'>
          <h3 className='compose-modal__header__title'><FormattedMessage id='navigation_bar.compose' defaultMessage='Compose new gab' /></h3>
          <IconButton className='compose-modal__close' title={intl.formatMessage(messages.close)} icon='times' onClick={this.onClickClose} size={20} />
        </div>
        <div className='compose-modal__content'>
          <div className='timeline-compose-block'>
            <div className='timeline-compose-block__avatar'>
              <Avatar account={account} size={32} />
            </div>
            <ComposeFormContainer />
          </div>
        </div>
      </div>
    );
  }
}

export default injectIntl(connect(mapStateToProps)(ComposeModal));
