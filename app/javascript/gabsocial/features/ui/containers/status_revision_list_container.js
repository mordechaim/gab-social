import React from 'react';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { connect } from 'react-redux';
import { load } from '../../../actions/status_revision_list';
import StatusRevisionList from '../components/status_revision_list';

class StatusRevisionListContainer extends ImmutablePureComponent {
    componentDidMount() {
        this.props.load(this.props.id);
    }

    render() {
        return <StatusRevisionList {...this.props} />;
    }
}

const mapStateToProps = state => ({
    loading: state.getIn(['status_revision_list', 'loading']),
    error: state.getIn(['status_revision_list', 'error']),
    data: state.getIn(['status_revision_list', 'data']),
});

const mapDispatchToProps = {
    load
};

export default connect(mapStateToProps, mapDispatchToProps)(StatusRevisionListContainer);