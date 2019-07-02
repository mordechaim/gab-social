import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import InnerHeader from './inner_header';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { FormattedMessage } from 'react-intl';
import { NavLink } from 'react-router-dom';

export default class Header extends ImmutablePureComponent {

  static propTypes = {
    group: ImmutablePropTypes.map,
    relationships: ImmutablePropTypes.map,
    toggleMembership: PropTypes.func.isRequired,
  };

  static contextTypes = {
    router: PropTypes.object,
  };

  render () {
    const { group, relationships, toggleMembership } = this.props;

    if (group === null) {
      return null;
    }

    return (
      <div className='account-timeline__header'>
        <InnerHeader
          group={group}
          relationships={relationships}
          toggleMembership={toggleMembership}
        />

        <div className='account__section-headline'>
            <NavLink exact to={`/groups/${group.get('id')}`}><FormattedMessage id='groups.posts' defaultMessage='Posts' /></NavLink>
            <NavLink exact to={`/groups/${group.get('id')}/accounts`}><FormattedMessage id='group.accounts' defaultMessage='Members' /></NavLink>
        </div>
      </div>
    );
  }

}
