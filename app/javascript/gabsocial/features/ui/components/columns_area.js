import React from 'react';
import PropTypes from 'prop-types';
import { defineMessages, injectIntl } from 'react-intl';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';

import ReactSwipeableViews from 'react-swipeable-views';
import { links, getIndex, getLink } from './tabs_bar';
import { Link } from 'react-router-dom';

import BundleContainer from '../containers/bundle_container';
import ColumnLoading from './column_loading';
import DrawerLoading from './drawer_loading';
import BundleColumnError from './bundle_column_error';
import { Compose, Notifications, HomeTimeline, CommunityTimeline, HashtagTimeline, DirectTimeline, FavouritedStatuses, ListTimeline } from '../../ui/util/async-components';
import Icon from 'gabsocial/components/icon';

const messages = defineMessages({
  publish: { id: 'compose_form.publish', defaultMessage: 'Gab' },
});

const shouldHideFAB = path => path.match(/^\/statuses\/|^\/search|^\/getting-started/);

export default @(component => injectIntl(component, { withRef: true }))
class ColumnsArea extends ImmutablePureComponent {

  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  static propTypes = {
    intl: PropTypes.object.isRequired,
    columns: ImmutablePropTypes.list.isRequired,
    isModalOpen: PropTypes.bool.isRequired,
    children: PropTypes.node,
    layout: PropTypes.object,
  };

  render () {
    const { columns, children, isModalOpen, intl, onOpenCompose } = this.props;
    const layout = this.props.layout || {LEFT:null,RIGHT:null};

    const floatingActionButton = shouldHideFAB(this.context.router.history.location.pathname) ? null : <button key='floating-action-button' onClick={onOpenCompose} className='floating-action-button' aria-label={intl.formatMessage(messages.publish)}></button>;

    return (
      <div className='page'>
        <div className='page__columns'>
          <div className='columns-area__panels'>

            <div className='columns-area__panels__pane columns-area__panels__pane--left'>
              <div className='columns-area__panels__pane__inner'>
                {layout.LEFT}
              </div>
            </div>

            <div className='columns-area__panels__main'>
              <div className='columns-area columns-area--mobile'>
                {children}
              </div>
            </div>

            <div className='columns-area__panels__pane columns-area__panels__pane--right'>
              <div className='columns-area__panels__pane__inner'>
                {layout.RIGHT}
              </div>
            </div>

            {floatingActionButton}
          </div>
        </div>

      </div>
    )
  }
}
