import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { injectIntl, FormattedMessage } from 'react-intl';
import { me } from '../../../initial_state';
import { makeGetAccount } from '../../../selectors';
import ImmutablePropTypes from 'react-immutable-proptypes';
import Icon from 'gabsocial/components/icon';

const PromoPanel = () => (
  <div className='promo-panel'>
    <div className='promo-panel__container'>

      <div className='promo-panel-item'>
        <a className='promo-panel-item__btn button button-alternative-2' href='/invites'>
          <Icon id='envelope' className='promo-panel-item__icon' fixedWidth />
          <FormattedMessage id='promo.invite_heading' defaultMessage='Invite Friends' />
        </a>
        <p className='promo-panel-item__message promo-panel-item__message--dark'>
          <FormattedMessage
            id='promo.invite_message'
            defaultMessage='Invite others to be a member of Gab.'
          />
        </p>
      </div>

    </div>
  </div>
);

export default PromoPanel;
