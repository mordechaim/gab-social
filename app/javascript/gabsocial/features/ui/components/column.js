import React from 'react';
import ColumnHeader from './column_header';
import PropTypes from 'prop-types';
import { isMobile } from '../../../is_mobile';

export default class Column extends React.PureComponent {

  static propTypes = {
    heading: PropTypes.string,
    icon: PropTypes.string,
    children: PropTypes.node,
    active: PropTypes.bool,
    hideHeadingOnMobile: PropTypes.bool,
  };

  render () {
    const { heading, icon, children, active, hideHeadingOnMobile } = this.props;

    const showHeading = heading && (!hideHeadingOnMobile || (hideHeadingOnMobile && !isMobile(window.innerWidth)));

    const columnHeaderId = showHeading && heading.replace(/ /g, '-');
    const header = showHeading && (
      <ColumnHeader icon={icon} active={active} type={heading} columnHeaderId={columnHeaderId} />
    );
    return (
      <div role='region' aria-labelledby={columnHeaderId} className='column'>
        {header}
        {children}
      </div>
    );
  }

}
