import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import Button from 'gabsocial/components/button';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { defineMessages, injectIntl } from 'react-intl';
import { NavLink } from 'react-router-dom';

const messages = defineMessages({
	join: { id: 'groups.join', defaultMessage: 'Join group' },
	leave: { id: 'groups.leave', defaultMessage: 'Leave group' },
});

export default @injectIntl
class Header extends ImmutablePureComponent {
	static propTypes = {
		group: ImmutablePropTypes.map,
		relationships: ImmutablePropTypes.map,
		toggleMembership: PropTypes.func.isRequired,
	};

	static contextTypes = {
		router: PropTypes.object,
	};

	getActionButton() {
		const { group, relationships, toggleMembership, intl } = this.props;
		const toggle = () => toggleMembership(group, relationships);

		if (!relationships) {
			return '';
		} else if (!relationships.get('member')) {
			return <Button className='logo-button' text={intl.formatMessage(messages.join)} onClick={toggle} />;
		} else if (relationships.get('member')) {
			return <Button className='logo-button' text={intl.formatMessage(messages.leave, { name: group.get('title') })} onClick={toggle} />;
		}
	}

	render () {
		const { group, relationships } = this.props;

		if (!group || !relationships) {
			return null;
		}

		return (
			<div className='group__header-container'>
				<div className="group__header">
					<div className='group__cover'>
						<img src={group.get('cover_image_url')} alt='' className='parallax' />
					</div>
					
					<div className='group__tabs'>
						<NavLink exact className='group__tabs__tab' activeClassName='group__tabs__tab--active' to={`/groups/${group.get('id')}`}>Posts</NavLink>
						<NavLink exact className='group__tabs__tab' activeClassName='group__tabs__tab--active' to={`/groups/${group.get('id')}/members`}>Members</NavLink>
						{this.getActionButton()}
					</div>
				</div>
			</div>
		);
	}
}
