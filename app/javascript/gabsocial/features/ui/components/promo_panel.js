import React from 'react';
import { FormattedMessage } from 'react-intl';
import Icon from 'gabsocial/components/icon';

export default class PromoPanel extends React.PureComponent {
  render() {
    return (
      <div className='wtf-panel promo-panel'>
        <div className='promo-panel__container'>
          <div className='promo-panel-item'>
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