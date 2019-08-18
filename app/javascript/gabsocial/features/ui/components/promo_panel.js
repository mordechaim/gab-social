import React from 'react';
import { FormattedMessage } from 'react-intl';
import Icon from 'gabsocial/components/icon';

export default class PromoPanel extends React.PureComponent {
  render() {
    return (
      <div className='promo-panel'>
        <div className='promo-panel__container'>

          <div className='promo-panel-item'>
            <a className='promo-panel-item__btn button button-alternative-2' href='https://apps.gab.com'>
              <Icon id='th' className='promo-panel-item__icon' fixedWidth />
              <FormattedMessage id='promo.gab_apps' defaultMessage='Gab Apps' />
            </a>
          </div>

          <div className='promo-panel-item'>
            <a className='promo-panel-item__btn button button-alternative-2' href='https://blog.gab.com'>
              <Icon id='align-left' className='promo-panel-item__icon' fixedWidth />
              <FormattedMessage id='promo.gab_news' defaultMessage='Gab News' />
            </a>
          </div>

        </div>
      </div>
    )
  }
}