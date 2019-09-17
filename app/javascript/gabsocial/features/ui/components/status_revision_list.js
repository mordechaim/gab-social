import React from 'react';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import ImmutablePureComponent from 'react-immutable-pure-component';
import ModalLoading from './modal_loading';
import RelativeTimestamp from '../../../components/relative_timestamp';

export default @injectIntl
class StatusRevisionsList extends ImmutablePureComponent {

    static propTypes = {
        loading: PropTypes.bool.isRequired,
        error: PropTypes.object,
        data: PropTypes.array
    };

    render () {
        const { loading, error, data } = this.props;

        if (loading || !data) return <ModalLoading />;

        if (error) return (
            <div className='status-revisions-list'>
                <div className='status-revisions-list__error'>
                    An error occured
                </div>
            </div>
        );

        return (
            <div className='status-revisions-list'>
                {data.map((revision, i) => (
                    <div key={i} className='status-revisions-list__item'>
                        <div className='status-revisions-list__item__timestamp'>
                            <RelativeTimestamp timestamp={revision.created_at} />
                        </div>

                        <div className='status-revisions-list__item__text'>{revision.text}</div>
                    </div>
                ))}
            </div>
        );
    }
}