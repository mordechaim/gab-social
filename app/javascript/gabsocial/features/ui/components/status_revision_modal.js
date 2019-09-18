import React from 'react';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import IconButton from 'gabsocial/components/icon_button';
import StatusRevisionListContainer from '../containers/status_revision_list_container';

const messages = defineMessages({
  close: { id: 'lightbox.close', defaultMessage: 'Close' },
});

export default @injectIntl
class StatusRevisionModal extends ImmutablePureComponent {

    static propTypes = {
        intl: PropTypes.object.isRequired,
        onClose: PropTypes.func.isRequired,
        status: ImmutablePropTypes.map.isRequired
    };

    render () {
        const { intl, onClose, status } = this.props;

        return (
            <div className='modal-root__modal status-revisions-root'>
                <div className='status-revisions'>
                    <div className='status-revisions__header'>
                        <h3 className='status-revisions__header__title'><FormattedMessage id='status_revisions.heading' defaultMessage='Revision History' /></h3>
                        <IconButton className='status-revisions__close' title={intl.formatMessage(messages.close)} icon='times' onClick={onClose} size={20} />
                    </div>
                    
                    <div className='status-revisions__content'>
                        <StatusRevisionListContainer id={status.get('id')} />
                    </div>
                </div>
            </div>
        );
    }
}
