'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage, injectIntl, defineMessages } from 'react-intl';
import { Link } from 'react-router-dom';
import Icon from 'gabsocial/components/icon';

const messages = defineMessages({
  show: { id: 'column_header.show_settings', defaultMessage: 'Show settings' },
  hide: { id: 'column_header.hide_settings', defaultMessage: 'Hide settings' },
  homeTitle: { id: 'home_column_header.home', defaultMessage: 'Home' },
  allTitle: { id: 'home_column_header.all', defaultMessage: 'All' },
});

export default @injectIntl
class ColumnHeader extends React.PureComponent {

  static contextTypes = {
    router: PropTypes.object,
  };

  static propTypes = {
    intl: PropTypes.object.isRequired,
    active: PropTypes.bool,
    children: PropTypes.node,
    activeItem: PropTypes.string,
  };

  state = {
    collapsed: true,
    animating: false,
  };

  handleToggleClick = (e) => {
    e.stopPropagation();
    this.setState({ collapsed: !this.state.collapsed, animating: true });
  }

  handleTransitionEnd = () => {
    this.setState({ animating: false });
  }

  render () {
    const { active, children, intl: { formatMessage }, activeItem } = this.props;
    const { collapsed, animating } = this.state;

    const wrapperClassName = classNames('column-header__wrapper', {
      'active': active,
    });

    const buttonClassName = classNames('column-header', {
      'active': active,
    });

    const collapsibleClassName = classNames('column-header__collapsible', {
      'collapsed': collapsed,
      'animating': animating,
    });

    const collapsibleButtonClassName = classNames('column-header__button', {
      'active': !collapsed,
    });

    let extraContent, collapseButton;

    if (children) {
      extraContent = (
        <div key='extra-content' className='column-header__collapsible__extra'>
          {children}
        </div>
      );

      collapseButton = <button className={collapsibleButtonClassName} title={formatMessage(collapsed ? messages.show : messages.hide)} aria-label={formatMessage(collapsed ? messages.show : messages.hide)} aria-pressed={collapsed ? 'false' : 'true'} onClick={this.handleToggleClick}><Icon id='sliders' /></button>;
    }

    const collapsedContent = [
      extraContent,
    ];

    return (
      <div className={wrapperClassName}>
        <h1 className={buttonClassName}>
          <Link to='/home' className={classNames('btn grouped', {'active': 'home' === activeItem})}>
            <Icon id='home' fixedWidth className='column-header__icon' />
            {formatMessage(messages.homeTitle)}
          </Link>

          <Link to='/timeline/all' className={classNames('btn grouped', {'active': 'all' === activeItem})}>
            <Icon id='globe' fixedWidth className='column-header__icon' />
            {formatMessage(messages.allTitle)}
          </Link>

          <div className='column-header__buttons'>
            {collapseButton}
          </div>
        </h1>

        <div className={collapsibleClassName} tabIndex={collapsed ? -1 : null} onTransitionEnd={this.handleTransitionEnd}>
          <div className='column-header__collapsible-inner'>
            {(!collapsed || animating) && collapsedContent}
          </div>
        </div>
      </div>
    );
  }

}
