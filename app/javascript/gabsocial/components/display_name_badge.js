import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';

export default class DisplayNameBadge extends React.PureComponent {

  static propTypes = {
    label: PropTypes.string,
  };

  render() {
  	const { label } = this.props;

  	return <span className="display-name__badge">{label}</span>;
  }

}