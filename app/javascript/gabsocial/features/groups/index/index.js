import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import LoadingIndicator from '../../../components/loading_indicator';
import Column from '../../ui/components/column';
import { fetchGroups } from '../../../actions/groups';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import ImmutablePureComponent from 'react-immutable-pure-component';
import ColumnLink from '../../ui/components/column_link';
import ColumnSubheading from '../../ui/components/column_subheading';
import NewGroupForm from '../create';
import { createSelector } from 'reselect';
import ScrollableList from '../../../components/scrollable_list';

const messages = defineMessages({
  heading: { id: 'column.groups', defaultMessage: 'Groups' },
  subheading: { id: 'groups.subheading', defaultMessage: 'Your groups' },
});

const getOrderedGroups = createSelector([state => state.get('groups')], groups => {
  if (!groups) {
    return groups;
  }

  return groups.toList().filter(item => !!item);
});

const mapStateToProps = state => ({
  groups: getOrderedGroups(state),
});

export default @connect(mapStateToProps)
@injectIntl
class Groups extends ImmutablePureComponent {

  static propTypes = {
    params: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    groups: ImmutablePropTypes.list,
    intl: PropTypes.object.isRequired,
  };

  componentWillMount () {
    this.props.dispatch(fetchGroups());
  }

  render () {
    const { intl, groups } = this.props;

    if (!groups) {
      return (
        <Column>
          <LoadingIndicator />
        </Column>
      );
    }

    const emptyMessage = <FormattedMessage id='empty_column.groups' defaultMessage="No groups." />;

    return (
      <Column icon='list-ul' heading={intl.formatMessage(messages.heading)} backBtnSlim>
        <NewGroupForm />

        <ColumnSubheading text={intl.formatMessage(messages.subheading)} />
        <ScrollableList
          scrollKey='lists'
          emptyMessage={emptyMessage}
        >
          {groups.map(group =>
            <ColumnLink key={group.get('id')} to={`/groups/${group.get('id')}`} icon='list-ul' text={group.get('title')} />
          )}
        </ScrollableList>
      </Column>
    );
  }

}
