'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import Button from 'gabsocial/components/button';
import ImmutablePureComponent from 'react-immutable-pure-component';
import Icon from 'gabsocial/components/icon';
import DropdownMenuContainer from 'gabsocial/containers/dropdown_menu_container';

const messages = defineMessages({
  join: { id: 'groups.join', defaultMessage: 'Join' },
  leave: { id: 'groups.leave', defaultMessage: 'Leave' },
});

export default @injectIntl
class InnerHeader extends ImmutablePureComponent {

  static propTypes = {
    group: ImmutablePropTypes.map,
    relationships: ImmutablePropTypes.map,
    toggleMembership: PropTypes.func.isRequired,
  };

  isStatusesPageActive = (match, location) => {
    if (!match) {
      return false;
    }

    return !location.pathname.match(/\/(accounts)\/?$/);
  }

  render () {
    const { group, relationships, intl } = this.props;

    if (!group || !relationships) {
      return null;
    }

    let info        = [];
    let actionBtn   = '';
    let lockedIcon  = '';
    let menu        = [];

    if (relationships.get('admin')) {
      info.push(<span key='admin'><FormattedMessage id='group.admin' defaultMessage='You are an admin' /></span>);
    }
    
    if (!relationships) { // Wait until the relationship is loaded
      actionBtn = '';
    } else if (!relationships.get('member')) {
      actionBtn = <Button className='logo-button' text={intl.formatMessage(messages.join)} onClick={() => this.props.toggleMembership(group, relationships)} />;
    } else if (relationships.get('member')) {
      actionBtn = <Button className='logo-button' text={intl.formatMessage(messages.leave, { name: group.get('title') })} onClick={() => this.props.toggleMembership(group, relationships)} />;
    }

    if (group.get('archived')) {
      lockedIcon = <Icon id='lock' title={intl.formatMessage(messages.group_archived)} />;
    }

    return (
      <div className='account__header'>
        <div className='account__header__image'>
          <div className='account__header__info'>
            <img src={group.get('cover_image_url')} alt='' className='parallax' />
          </div>
        </div>

        <div className='account__header__bar'>
          <div className='account__header__tabs'>
            <div className='account__header__tabs__buttons'>
              {actionBtn}

              <DropdownMenuContainer items={menu} icon='ellipsis-v' size={24} direction='right' />
            </div>
          </div>

          <div className='account__header__tabs__name'>
            <h1>
              <span>{group.get('title')} {info}</span>
              <small>{lockedIcon}</small>
            </h1>
          </div>

          <div className='account__header__extra'>
            <div className='account__header__bio'>
              {group.get('description').length > 0 && <div className='account__header__content'>{group.get('description')}</div>}
            </div>
          </div>
        </div>
      </div>
    );
  }

}
