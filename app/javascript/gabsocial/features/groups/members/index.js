import React from 'react';
import { connect } from 'react-redux';
import ImmutablePureComponent from 'react-immutable-pure-component';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { debounce } from 'lodash';
import LoadingIndicator from '../../../components/loading_indicator';
import {
	fetchMembers,
	expandMembers,
	updateRole,
	createRemovedAccount,
} from '../../../actions/groups';
import { FormattedMessage } from 'react-intl';
import AccountContainer from '../../../containers/account_container';
import Column from '../../ui/components/column';
import ScrollableList from '../../../components/scrollable_list';
import DropdownMenuContainer from '../../../containers/dropdown_menu_container';

const mapStateToProps = (state, { params: { id } }) => ({
	group: state.getIn(['groups', id]),
	relationships: state.getIn(['group_relationships', id]),
	accountIds: state.getIn(['user_lists', 'groups', id, 'items']),
	hasMore: !!state.getIn(['user_lists', 'groups', id, 'next']),
});

export default @connect(mapStateToProps)
class GroupMembers extends ImmutablePureComponent {

	static propTypes = {
		params: PropTypes.object.isRequired,
		dispatch: PropTypes.func.isRequired,
		accountIds: ImmutablePropTypes.list,
		hasMore: PropTypes.bool,
	};

	componentWillMount () {
		const { params: { id } } = this.props;

		this.props.dispatch(fetchMembers(id));
	}

	componentWillReceiveProps (nextProps) {
		if (nextProps.params.id !== this.props.params.id) {
			this.props.dispatch(fetchMembers(nextProps.params.id));
		}
	}

	handleLoadMore = debounce(() => {
		this.props.dispatch(expandMembers(this.props.params.id));
	}, 300, { leading: true });

	render () {
		const { accountIds, hasMore, group, relationships, dispatch } = this.props;
		
		if (!group || !accountIds || !relationships) {
			return (
				<Column>
					<LoadingIndicator />
				</Column>
			);
		}

		return (
			<Column>
				<ScrollableList
					scrollKey='members'
					hasMore={hasMore}
					onLoadMore={this.handleLoadMore}
					emptyMessage={<FormattedMessage id='group.members.empty' defaultMessage='This group does not has any members.' />}
				>
					{accountIds.map(id => {
						let menu = [];

						if (relationships.get('admin')) {
							menu = [
								{ text: 'Remove from group', action: () => dispatch(createRemovedAccount(group.get('id'), id)) },
								{ text: 'Make administrator', action: () => dispatch(updateRole(group.get('id'), id, 'admin')) },
							]
						}

						return (
							<div className="group-account-wrapper" key={id}>
								<AccountContainer id={id} withNote={false} actionIcon="none" onActionClick={() => true} />
								{menu.length > 0 && <DropdownMenuContainer items={menu} icon='ellipsis-h' size={18} direction='right' />}
							</div>
						);
					})}
				</ScrollableList>
			</Column>
		);
	}
}
