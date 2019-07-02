import React from 'react';
import PropTypes from 'prop-types';
import { NavLink, withRouter } from 'react-router-dom';
import { FormattedMessage, injectIntl } from 'react-intl';
import { debounce } from 'lodash';
import { connect } from 'react-redux';
import { isUserTouching } from '../../../is_mobile';
import { me } from '../../../initial_state';
import { Link } from 'react-router-dom';
import NotificationsCounterIcon from './notifications_counter_icon';
import SearchContainer from 'gabsocial/features/compose/containers/search_container';
import Avatar from '../../../components/avatar';
import ActionBar from 'gabsocial/features/compose/components/action_bar';
import { openModal } from '../../../actions/modal';

export const privateLinks = [
  <NavLink className='tabs-bar__link--logo' to='/home#' data-preview-title-id='column.home' style={{ padding: '0' }}>
    <FormattedMessage id='tabs_bar.home' defaultMessage='Home' />
  </NavLink>,
  <NavLink className='tabs-bar__link home' to='/home' data-preview-title-id='column.home'  >
    <FormattedMessage id='tabs_bar.home' defaultMessage='Home' />
  </NavLink>,
  <NavLink className='tabs-bar__link notifications' to='/notifications' data-preview-title-id='column.notifications' >
    <NotificationsCounterIcon />
    <FormattedMessage id='tabs_bar.notifications' defaultMessage='Notifications' />
  </NavLink>,
  <NavLink className='tabs-bar__link home' to='/groups' data-preview-title-id='column.groups' >
    <FormattedMessage id='tabs_bar.groups' defaultMessage='Groups' />
  </NavLink>,
  <NavLink className='tabs-bar__link optional' to='/search' data-preview-title-id='tabs_bar.search' >
    <FormattedMessage id='tabs_bar.search' defaultMessage='Search' />
  </NavLink>,
];

export const publicLinks = [
  <a className='tabs-bar__link--logo' href='/#' data-preview-title-id='column.home' style={{ padding: '0' }}>
    <FormattedMessage id='tabs_bar.home' defaultMessage='Home' />
  </a>,
  <a className='tabs-bar__link home' href='/home' data-preview-title-id='column.home'  >
    <FormattedMessage id='tabs_bar.home' defaultMessage='Home' />
  </a>,
  <NavLink className='tabs-bar__link optional' to='/search' data-preview-title-id='tabs_bar.search' >
    <FormattedMessage id='tabs_bar.search' defaultMessage='Search' />
  </NavLink>,
];

@withRouter
class TabsBar extends React.PureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    onOpenCompose: PropTypes.func,
  }

  setRef = ref => {
    this.node = ref;
  }

  render () {
    const { intl: { formatMessage }, account, onOpenCompose } = this.props;
    const links = account ? privateLinks : publicLinks;

    return (
      <nav className='tabs-bar' ref={this.setRef}>
        <div className='tabs-bar__container'>
          <div className='tabs-bar__split tabs-bar__split--left'>
            {
              account && links.map((link) =>
                React.cloneElement(link, {
                  key: link.props.to,
                  'aria-label': formatMessage({
                    id: link.props['data-preview-title-id']
                  })
                }))
            }
            {
              !account && links.map((link, i) => React.cloneElement(link, {
                key: i,
              }))
            }
          </div>
          <div className='tabs-bar__split tabs-bar__split--right'>
            <div className='tabs-bar__search-container'>
              <SearchContainer openInRoute />
            </div>
            { account &&
              <div className='flex'>
                <div className='tabs-bar__profile'>
                  <Avatar account={account} />
                  <ActionBar account={account} size={34} />
                </div>
                <button className='tabs-bar__button-compose button' onClick={onOpenCompose} aria-label='Gab'>
                  <span>Gab</span>
                </button>
              </div>
            }
            {
              !account &&
              <div className='flex'>
                <a className='tabs-bar__button button' href='/auth/sign_in'>
                  <FormattedMessage id='account.login' defaultMessage='Log In' />
                </a>
                <a className='tabs-bar__button button button-alternative-2' href='/auth/sign_up'>
                  <FormattedMessage id='account.register' defaultMessage='Sign up' />
                </a>
              </div>
            }
          </div>
        </div>
      </nav>
    );
  }
}

const mapStateToProps = state => {
  return {
    account: state.getIn(['accounts', me]),
  };
};

const mapDispatchToProps = (dispatch) => ({
  onOpenCompose() {
    dispatch(openModal('COMPOSE'));
  },
});

export default injectIntl(
  connect(mapStateToProps, mapDispatchToProps, null, { forwardRef: true }
)(TabsBar))
