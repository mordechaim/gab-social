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

const messages = defineMessages({
  close: { id: 'lightbox.close', defaultMessage: 'Close' },
});

const mapStateToProps = state => {
  return {
    account: state.getIn(['accounts', me]),
  };
};

class ComposeModal extends ImmutablePureComponent {

  static propTypes = {
    account: ImmutablePropTypes.map,
    intl: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
  };

  onClickClose = () => {
    this.props.onClose('COMPOSE');
  };

  render () {
    const { intl, onClose, account } = this.props;

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
