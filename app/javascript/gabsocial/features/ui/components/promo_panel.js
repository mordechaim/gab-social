import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import Icon from 'gabsocial/components/icon';
import { connect } from 'react-redux';
import { me } from '../../../initial_state';

const mapStateToProps = state => {
  return {
    isPro: state.getIn(['accounts', me, 'is_pro']),
  };
};

export default
@connect(mapStateToProps)
class PromoPanel extends React.PureComponent {
  static propTypes = {
    isPro: PropTypes.bool,
  };

  render() {
    const { isPro } = this.props;

    return (
      <div className='wtf-panel promo-panel'>
        <div className='promo-panel__container'>
          {
            !isPro &&
            <div className='promo-panel-item promo-panel-item--highlighted'>
              <a className='promo-panel-item__btn' href='https://pro.gab.com'>
                <Icon id='arrow-up' className='promo-panel-item__icon' fixedWidth />
                <FormattedMessage id='promo.gab_pro' defaultMessage='Upgrade to GabPRO' />
              </a>
            </div>
          }

          <div className={`promo-panel-item ${!isPro ? 'promo-panel-item--top-rounded' : ''}`}>
            <a className='promo-panel-item__btn' href='https://news.gab.com'>
              <Icon id='align-left' className='promo-panel-item__icon' fixedWidth />
              <FormattedMessage id='promo.gab_news' defaultMessage='Gab News' />
            </a>
          </div>

          <div className='promo-panel-item'>
            <a className='promo-panel-item__btn' href='https://news.gab.com/support-gab'>
              <Icon id='users' className='promo-panel-item__icon' fixedWidth />
              <FormattedMessage id='promo.partners' defaultMessage='Affiliate Partners' />
            </a>
          </div>

          <div className='promo-panel-item'>
            <a className='promo-panel-item__btn' href='https://apps.gab.com'>
              <Icon id='th' className='promo-panel-item__icon' fixedWidth />
              <FormattedMessage id='promo.gab_apps' defaultMessage='Gab Apps' />
            </a>
          </div>
        </div>
      </div>
    )
  }
}