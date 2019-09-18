import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { me } from '../../../initial_state';
import IconButton from '../../../components/icon_button';
import Icon from '../../../components/icon';

const messages = defineMessages({
  close: { id: 'lightbox.close', defaultMessage: 'Close' },
});

const mapStateToProps = state => {
  return {
    account: state.getIn(['accounts', me]),
  };
};

class ProUpgradeModal extends ImmutablePureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
  };

  onClickClose = () => {
    this.props.onClose('PRO_UPGRADE');
  };

  render () {
    const { intl } = this.props;

    return (
      <div className='modal-root__modal compose-modal pro-upgrade-modal'>
        <div className='compose-modal__header'>
          <h3 className='compose-modal__header__title'><FormattedMessage id='promo.gab_pro' defaultMessage='Upgrade to GabPRO' /></h3>
          <IconButton className='compose-modal__close' title={intl.formatMessage(messages.close)} icon='times' onClick={this.onClickClose} size={20} />
        </div>
        <div className='compose-modal__content pro-upgrade-modal__content'>
          <div>
            <span className="pro-upgrade-modal__text">
              <FormattedMessage id='pro_upgrade_modal.text' defaultMessage='Gab is fully funded by people like you. Please consider supporting us on our mission to defend free expression online for all people.' />
              <FormattedMessage id='pro_upgrade_modal.benefits' defaultMessage='Here are just some of the benefits that thousands of GabPRO members receive:' />
            </span>
            <ul className="pro-upgrade-modal__list">
              <li>Schedule Posts</li>
              <li>Get Verified</li>
              <li>Create Groups</li>
              <li>Larger Video and Image Uploads</li>
              <li>Receive the PRO Badge</li>
              <li>Remove in-feed promotions</li>
              <li>More value being added daily!</li>
            </ul>
            <a href='https://pro.gab.com' className='pro-upgrade-modal__button button'>
              <Icon id='arrow-up' fixedWidth/>
              <FormattedMessage id='promo.gab_pro' defaultMessage='Upgrade to GabPRO' />
            </a>
          </div>
        </div>
      </div>
    );
  }
}

export default injectIntl(connect(mapStateToProps)(ProUpgradeModal));
