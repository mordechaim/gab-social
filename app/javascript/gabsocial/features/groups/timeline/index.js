import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import StatusListContainer from '../../ui/containers/status_list_container';
import Column from '../../../components/column';
import ColumnBackButton from '../../../components/column_back_button';
import ColumnHeader from '../../../components/column_header';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connectGroupStream } from '../../../actions/streaming';
import { expandGroupTimeline } from '../../../actions/timelines';
import { fetchGroup } from '../../../actions/groups';
import MissingIndicator from '../../../components/missing_indicator';
import LoadingIndicator from '../../../components/loading_indicator';
import HeaderContainer from './containers/header_container';

const mapStateToProps = (state, props) => ({
  group: state.getIn(['groups', props.params.id]),
  hasUnread: state.getIn(['timelines', `group:${props.params.id}`, 'unread']) > 0,
});

export default @connect(mapStateToProps)
@injectIntl
class GroupTimeline extends React.PureComponent {

  static contextTypes = {
    router: PropTypes.object,
  };

  static propTypes = {
    params: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    hasUnread: PropTypes.bool,
    group: PropTypes.oneOfType([ImmutablePropTypes.map, PropTypes.bool]),
    intl: PropTypes.object.isRequired,
  };

  componentDidMount () {
    const { dispatch } = this.props;
    const { id } = this.props.params;

    dispatch(fetchGroup(id));
    dispatch(expandGroupTimeline(id));

    this.disconnect = dispatch(connectGroupStream(id));
  }

  componentWillUnmount () {
    if (this.disconnect) {
      this.disconnect();
      this.disconnect = null;
    }
  }

  handleLoadMore = maxId => {
    const { id } = this.props.params;
    this.props.dispatch(expandGroupTimeline(id, { maxId }));
  }

  render () {
    const { hasUnread, group } = this.props;
    const { id } = this.props.params;
    const title  = group ? group.get('title') : id;

    if (typeof group === 'undefined') {
      return (
        <Column>
          <div>
            <LoadingIndicator />
          </div>
        </Column>
      );
    } else if (group === false) {
      return (
        <Column>
          <ColumnBackButton />
          <MissingIndicator />
        </Column>
      );
    }

    return (
      <Column label={title}>
        <ColumnHeader icon='list-ul' active={hasUnread} title={title}>
          <div className='column-header__links'>
            {/* Leave might be here */}
          </div>

          <hr />
        </ColumnHeader>

        <StatusListContainer
          prepend={<HeaderContainer groupId={id} />}
          alwaysPrepend
          scrollKey='group_timeline'
          timelineId={`group:${id}`}
          onLoadMore={this.handleLoadMore}
          emptyMessage={<FormattedMessage id='empty_column.group' defaultMessage='There is nothing in this group yet. When members of this group post new statuses, they will appear here.' />}
        />
      </Column>
    );
  }

}
