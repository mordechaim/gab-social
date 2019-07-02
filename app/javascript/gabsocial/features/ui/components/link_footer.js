import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { invitesEnabled, version, repository, source_url, me } from 'gabsocial/initial_state';
import { connect } from 'react-redux';
import { openModal } from '../../../actions/modal';

const mapStateToProps = state => ({
  account: state.getIn(['accounts', me]),
});

const mapDispatchToProps = (dispatch) => ({
  onOpenHotkeys() {
    dispatch(openModal('HOTKEYS'));
  },
});

const LinkFooter = ({ onOpenHotkeys, account }) => (
  <div className='getting-started__footer'>
    <ul>
      {(invitesEnabled && account) && <li><a href='/invites' target='_blank'><FormattedMessage id='getting_started.invite' defaultMessage='Invite people' /></a> · </li>}
      {account && <li><a href='#' onClick={onOpenHotkeys}><FormattedMessage id='navigation_bar.keyboard_shortcuts' defaultMessage='Hotkeys' /></a> · </li>}
      {account && <li><a href='/auth/edit'><FormattedMessage id='getting_started.security' defaultMessage='Security' /></a> · </li>}
      <li><a href='/about'><FormattedMessage id='navigation_bar.info' defaultMessage='About' /></a> · </li>
      <li><a href='/settings/applications' target='_blank'><FormattedMessage id='getting_started.developers' defaultMessage='Developers' /></a> · </li>
      <li><a href='/about/guidelines'><FormattedMessage id='getting_started.guidelines' defaultMessage='Guidelines' /></a> · </li>
      <li><a href='/about/tos'><FormattedMessage id='getting_started.terms' defaultMessage='Terms of Service' /></a> · </li>
      <li><a href='/about/privacy'><FormattedMessage id='getting_started.privacy' defaultMessage='Privacy Policy' /></a></li>
      {account && <li> · <a href='/auth/sign_out' data-method='delete'><FormattedMessage id='navigation_bar.logout' defaultMessage='Logout' /></a></li>}
    </ul>

    <p>
      {/* <FormattedMessage
        id='getting_started.open_source_notice'
        defaultMessage='Gab Social is open source software. You can contribute or report issues on GitHub at {github}.'
        values={{ github: <span><a href={source_url} rel='noopener' target='_blank'>{repository}</a> (v{version})</span> }}
      /> */}
      Gab Social is open source software. You can download the source <span><a href='/src/gab-social.zip'>here</a></span>
    </p>
    <p>© 2019 Gab AI Inc.</p>
  </div>
);

LinkFooter.propTypes = {
  withHotkeys: PropTypes.bool,
};

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(LinkFooter));
