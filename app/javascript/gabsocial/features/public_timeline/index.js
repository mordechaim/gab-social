import React from 'react';
import { connect } from 'react-redux';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import StatusListContainer from '../ui/containers/status_list_container';
import Column from '../../components/column';
import ColumnHeader from '../../components/column_header';
import { expandPublicTimeline } from '../../actions/timelines';
import ColumnSettingsContainer from './containers/column_settings_container';
import { connectPublicStream } from '../../actions/streaming';

const messages = defineMessages({
  title: { id: 'column.public', defaultMessage: 'Federated timeline' },
});

const mapStateToProps = (state, { onlyMedia }) => {
  const columns = state.getIn(['settings', 'columns']);

  return {
    hasUnread: state.getIn(['timelines', `public${onlyMedia ? ':media' : ''}`, 'unread']) > 0,
    onlyMedia: state.getIn(['settings', 'public', 'other', 'onlyMedia']),
  };
};

export default @connect(mapStateToProps)
@injectIntl
class PublicTimeline extends React.PureComponent {

  static contextTypes = {
    router: PropTypes.object,
  };

  static defaultProps = {
    onlyMedia: false,
  };

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    hasUnread: PropTypes.bool,
    onlyMedia: PropTypes.bool,
  };

  componentDidMount () {
    const { dispatch, onlyMedia } = this.props;

    dispatch(expandPublicTimeline({ onlyMedia }));
    this.disconnect = dispatch(connectPublicStream({ onlyMedia }));
  }

  componentDidUpdate (prevProps) {
    if (prevProps.onlyMedia !== this.props.onlyMedia) {
      const { dispatch, onlyMedia } = this.props;

      this.disconnect();
      dispatch(expandPublicTimeline({ onlyMedia }));
      this.disconnect = dispatch(connectPublicStream({ onlyMedia }));
    }
  }

  componentWillUnmount () {
    if (this.disconnect) {
      this.disconnect();
      this.disconnect = null;
    }
  }

  handleLoadMore = maxId => {
    const { dispatch, onlyMedia } = this.props;

    dispatch(expandPublicTimeline({ maxId, onlyMedia }));
  }

  render () {
    const { intl, hasUnread, onlyMedia } = this.props;

    return (
      <Column label={intl.formatMessage(messages.title)}>
        <ColumnHeader icon='globe' active={hasUnread} title={intl.formatMessage(messages.title)}>
          <ColumnSettingsContainer/>
        </ColumnHeader>

        <StatusListContainer
          timelineId={`public${onlyMedia ? ':media' : ''}`}
          onLoadMore={this.handleLoadMore}
          scrollKey='public_timeline'
          emptyMessage={<FormattedMessage id='empty_column.public' defaultMessage='There is nothing here! Write something publicly, or manually follow users from other servers to fill it up' />}
        />
      </Column>
    );
  }

}
