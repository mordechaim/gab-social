import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { defineMessages, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import Item from './item';
import Icon from 'gabsocial/components/icon';

const messages = defineMessages({
    title: { id: 'groups.sidebar-panel.title', defaultMessage: 'Groups you\'re in' },
});

const mapStateToProps = (state, { id }) => ({
	groupIds: state.getIn(['group_lists', 'member']),
});

export default @connect(mapStateToProps)
@injectIntl
class GroupSidebarPanel extends ImmutablePureComponent {
    static propTypes = {
        groupIds: ImmutablePropTypes.list,
    }

    render() {
        const { intl, groupIds } = this.props;

        // Only when there are groups to show
        if (groupIds.count() === 0) return null;

        return (
            <div className='wtf-panel group-sidebar-panel'>
                <div className='wtf-panel-header'>
                    <Icon id='users' className='wtf-panel-header__icon' />
                    <span className='wtf-panel-header__label'>{intl.formatMessage(messages.title)}</span>
                </div>
                
                <div className='wtf-panel__content'>
                    <div className="group-sidebar-panel__items">
                        {groupIds.map(groupId => <Item key={groupId} id={groupId} />)}
                    </div>
                </div>
            </div>
        );
    }
}