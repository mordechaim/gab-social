import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import IntersectionObserverArticleContainer from '../containers/intersection_observer_article_container';
import LoadMore from './load_more';
import IntersectionObserverWrapper from '../features/ui/util/intersection_observer_wrapper';
import { throttle } from 'lodash';
import { List as ImmutableList } from 'immutable';
import classNames from 'classnames';
import LoadingIndicator from './loading_indicator';

const MOUSE_IDLE_DELAY = 300;

export default class ScrollableList extends PureComponent {

  static contextTypes = {
    router: PropTypes.object,
  };

  static propTypes = {
    scrollKey: PropTypes.string.isRequired,
    onLoadMore: PropTypes.func,
    isLoading: PropTypes.bool,
    showLoading: PropTypes.bool,
    hasMore: PropTypes.bool,
    prepend: PropTypes.node,
    alwaysPrepend: PropTypes.bool,
    emptyMessage: PropTypes.node,
    children: PropTypes.node,
    onScrollToTop: PropTypes.func,
    onScroll: PropTypes.func,
  };

  state = {
    cachedMediaWidth: 250, // Default media/card width using default Gab Social theme
  };

  intersectionObserverWrapper = new IntersectionObserverWrapper();

  mouseIdleTimer = null;
  mouseMovedRecently = false;
  lastScrollWasSynthetic = false;
  scrollToTopOnMouseIdle = false;

  setScrollTop = newScrollTop => {
    if (this.node.scrollTop !== newScrollTop) {
      this.lastScrollWasSynthetic = true;
      this.node.scrollTop = newScrollTop;
    }
  };

  clearMouseIdleTimer = () => {
    if (this.mouseIdleTimer === null) {
      return;
    }

    clearTimeout(this.mouseIdleTimer);
    this.mouseIdleTimer = null;
  };

  handleMouseMove = throttle(() => {
    // As long as the mouse keeps moving, clear and restart the idle timer.
    this.clearMouseIdleTimer();
    this.mouseIdleTimer = setTimeout(this.handleMouseIdle, MOUSE_IDLE_DELAY);

    if (!this.mouseMovedRecently && this.node.scrollTop === 0) {
      // Only set if we just started moving and are scrolled to the top.
      this.scrollToTopOnMouseIdle = true;
    }

    // Save setting this flag for last, so we can do the comparison above.
    this.mouseMovedRecently = true;
  }, MOUSE_IDLE_DELAY / 2);

  handleMouseIdle = () => {
    if (this.scrollToTopOnMouseIdle) {
      this.setScrollTop(0);
    }

    this.mouseMovedRecently = false;
    this.scrollToTopOnMouseIdle = false;
  }

  componentDidMount () {
    this.attachIntersectionObserver();
  }

  getScrollPosition = () => {
    if (this.node && (this.node.scrollTop > 0 || this.mouseMovedRecently)) {
      return { height: this.node.scrollHeight, top: this.node.scrollTop };
    } else {
      return null;
    }
  }

  updateScrollBottom = (snapshot) => {
    const newScrollTop = this.node.scrollHeight - snapshot;

    this.setScrollTop(newScrollTop);
  }

  componentDidUpdate (prevProps, prevState, snapshot) {
    // Reset the scroll position when a new child comes in in order not to
    // jerk the scrollbar around if you're already scrolled down the page.
    if (snapshot !== null) {
      this.setScrollTop(this.node.scrollHeight - snapshot);
    }
  }

  cacheMediaWidth = (width) => {
    if (width && this.state.cachedMediaWidth !== width) {
      this.setState({ cachedMediaWidth: width });
    }
  }

  componentWillUnmount () {
    this.clearMouseIdleTimer();
    this.detachIntersectionObserver();
  }

  attachIntersectionObserver () {
    this.intersectionObserverWrapper.connect();
  }

  detachIntersectionObserver () {
    this.intersectionObserverWrapper.disconnect();
  }

  getFirstChildKey (props) {
    const { children } = props;
    let firstChild     = children;

    if (children instanceof ImmutableList) {
      firstChild = children.get(0);
    } else if (Array.isArray(children)) {
      firstChild = children[0];
    }

    return firstChild && firstChild.key;
  }

  setRef = (c) => {
    this.node = c;
  }

  handleLoadMore = e => {
    e.preventDefault();
    this.props.onLoadMore();
  }

  render () {
    const { children, scrollKey, showLoading, isLoading, hasMore, prepend, alwaysPrepend, emptyMessage, onLoadMore } = this.props;
    const childrenCount = React.Children.count(children);

    const trackScroll = true; //placeholder

    const loadMore     = (hasMore && onLoadMore) ? <LoadMore visible={!isLoading} onClick={this.handleLoadMore} /> : null;
    let scrollableArea = null;

    if (showLoading) {
      scrollableArea = (
        <div className='slist slist--flex' ref={this.setRef}>
          <div role='feed' className='item-list'>
            {prepend}
          </div>

          <div className='slist__append'>
            <LoadingIndicator />
          </div>
        </div>
      );
    } else if (isLoading || childrenCount > 0 || hasMore || !emptyMessage) {
      scrollableArea = (
        <div className='slist' ref={this.setRef} onMouseMove={this.handleMouseMove}>
          <div role='feed' className='item-list'>
            {prepend}

            {React.Children.map(this.props.children, (child, index) => (
              <IntersectionObserverArticleContainer
                key={child.key}
                id={child.key}
                index={index}
                listLength={childrenCount}
                intersectionObserverWrapper={this.intersectionObserverWrapper}
                saveHeightKey={trackScroll ? `${this.context.router.route.location.key}:${scrollKey}` : null}
              >
                {React.cloneElement(child, {
                  getScrollPosition: this.getScrollPosition,
                  updateScrollBottom: this.updateScrollBottom,
                  cachedMediaWidth: this.state.cachedMediaWidth,
                  cacheMediaWidth: this.cacheMediaWidth,
                })}
              </IntersectionObserverArticleContainer>
            ))}

            {loadMore}
          </div>
        </div>
      );
    } else {
      scrollableArea = (
        <div className='slist slist--flex' ref={this.setRef}>
          {alwaysPrepend && prepend}

          <div className='empty-column-indicator'>
            {emptyMessage}
          </div>
        </div>
      );
    }

    return scrollableArea;
  }

}
