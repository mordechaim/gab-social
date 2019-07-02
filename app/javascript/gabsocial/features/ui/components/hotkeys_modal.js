import React from 'react';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import ImmutablePureComponent from 'react-immutable-pure-component';
import IconButton from 'gabsocial/components/icon_button';

const messages = defineMessages({
  close: { id: 'lightbox.close', defaultMessage: 'Close' },
});

export default @injectIntl
class HotkeysModal extends ImmutablePureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
  };

  render () {
    const { intl, onClose } = this.props;

    return (
      <div className='modal-root__modal hotkeys-modal'>
        <div className='keyboard-shortcuts'>
          <div className='keyboard-shortcuts__header'>
            <h3 className='keyboard-shortcuts__header__title'><FormattedMessage id='keyboard_shortcuts.heading' defaultMessage='Keyboard Shortcuts' /></h3>
            <IconButton className='keyboard-shortcuts__close' title={intl.formatMessage(messages.close)} icon='times' onClick={onClose} size={20} />
          </div>
          <div className='keyboard-shortcuts__content'>
            <table>
              <thead>
                <tr>
                  <th><FormattedMessage id='keyboard_shortcuts.hotkey' defaultMessage='Hotkey' /></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><kbd>r</kbd></td>
                  <td><FormattedMessage id='keyboard_shortcuts.reply' defaultMessage='reply' /></td>
                </tr>
                <tr>
                  <td><kbd>m</kbd></td>
                  <td><FormattedMessage id='keyboard_shortcuts.mention' defaultMessage='mention author' /></td>
                </tr>
                <tr>
                  <td><kbd>p</kbd></td>
                  <td><FormattedMessage id='keyboard_shortcuts.profile' defaultMessage="open author's profile" /></td>
                </tr>
                <tr>
                  <td><kbd>f</kbd></td>
                  <td><FormattedMessage id='keyboard_shortcuts.favourite' defaultMessage='favorite' /></td>
                </tr>
                <tr>
                  <td><kbd>b</kbd></td>
                  <td><FormattedMessage id='keyboard_shortcuts.boost' defaultMessage='repost' /></td>
                </tr>
                <tr>
                  <td><kbd>enter</kbd>, <kbd>o</kbd></td>
                  <td><FormattedMessage id='keyboard_shortcuts.enter' defaultMessage='open status' /></td>
                </tr>
                <tr>
                  <td><kbd>x</kbd></td>
                  <td><FormattedMessage id='keyboard_shortcuts.toggle_hidden' defaultMessage='show/hide text behind CW' /></td>
                </tr>
                <tr>
                  <td><kbd>h</kbd></td>
                  <td><FormattedMessage id='keyboard_shortcuts.toggle_sensitivity' defaultMessage='show/hide media' /></td>
                </tr>
                <tr>
                  <td><kbd>up</kbd>, <kbd>k</kbd></td>
                  <td><FormattedMessage id='keyboard_shortcuts.up' defaultMessage='move up in the list' /></td>
                </tr>
              </tbody>
            </table>
            <table>
              <thead>
                <tr>
                  <th><FormattedMessage id='keyboard_shortcuts.hotkey' defaultMessage='Hotkey' /></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><kbd>down</kbd>, <kbd>j</kbd></td>
                  <td><FormattedMessage id='keyboard_shortcuts.down' defaultMessage='move down in the list' /></td>
                </tr>
                <tr>
                  <td><kbd>1</kbd> - <kbd>9</kbd></td>
                  <td><FormattedMessage id='keyboard_shortcuts.column' defaultMessage='focus a status in one of the columns' /></td>
                </tr>
                <tr>
                  <td><kbd>n</kbd></td>
                  <td><FormattedMessage id='keyboard_shortcuts.compose' defaultMessage='focus the compose textarea' /></td>
                </tr>
                <tr>
                  <td><kbd>alt</kbd> + <kbd>n</kbd></td>
                  <td><FormattedMessage id='keyboard_shortcuts.toot' defaultMessage='start a brand new gab' /></td>
                </tr>
                <tr>
                  <td><kbd>backspace</kbd></td>
                  <td><FormattedMessage id='keyboard_shortcuts.back' defaultMessage='navigate back' /></td>
                </tr>
                <tr>
                  <td><kbd>s</kbd></td>
                  <td><FormattedMessage id='keyboard_shortcuts.search' defaultMessage='focus search' /></td>
                </tr>
                <tr>
                  <td><kbd>esc</kbd></td>
                  <td><FormattedMessage id='keyboard_shortcuts.unfocus' defaultMessage='un-focus compose textarea/search' /></td>
                </tr>
                <tr>
                  <td><kbd>g</kbd> + <kbd>h</kbd></td>
                  <td><FormattedMessage id='keyboard_shortcuts.home' defaultMessage='open home timeline' /></td>
                </tr>
                <tr>
                  <td><kbd>g</kbd> + <kbd>n</kbd></td>
                  <td><FormattedMessage id='keyboard_shortcuts.notifications' defaultMessage='open notifications column' /></td>
                </tr>
                <tr>
                  <td><kbd>g</kbd> + <kbd>d</kbd></td>
                  <td><FormattedMessage id='keyboard_shortcuts.direct' defaultMessage='open direct messages column' /></td>
                </tr>
              </tbody>
            </table>
            <table>
              <thead>
                <tr>
                  <th><FormattedMessage id='keyboard_shortcuts.hotkey' defaultMessage='Hotkey' /></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><kbd>g</kbd> + <kbd>s</kbd></td>
                  <td><FormattedMessage id='keyboard_shortcuts.start' defaultMessage='open "get started" column' /></td>
                </tr>
                <tr>
                  <td><kbd>g</kbd> + <kbd>f</kbd></td>
                  <td><FormattedMessage id='keyboard_shortcuts.favourites' defaultMessage='open favorites list' /></td>
                </tr>
                <tr>
                  <td><kbd>g</kbd> + <kbd>p</kbd></td>
                  <td><FormattedMessage id='keyboard_shortcuts.pinned' defaultMessage='open pinned gabs list' /></td>
                </tr>
                <tr>
                  <td><kbd>g</kbd> + <kbd>u</kbd></td>
                  <td><FormattedMessage id='keyboard_shortcuts.my_profile' defaultMessage='open your profile' /></td>
                </tr>
                <tr>
                  <td><kbd>g</kbd> + <kbd>b</kbd></td>
                  <td><FormattedMessage id='keyboard_shortcuts.blocked' defaultMessage='open blocked users list' /></td>
                </tr>
                <tr>
                  <td><kbd>g</kbd> + <kbd>m</kbd></td>
                  <td><FormattedMessage id='keyboard_shortcuts.muted' defaultMessage='open muted users list' /></td>
                </tr>
                <tr>
                  <td><kbd>g</kbd> + <kbd>r</kbd></td>
                  <td><FormattedMessage id='keyboard_shortcuts.requests' defaultMessage='open follow requests list' /></td>
                </tr>
                <tr>
                  <td><kbd>?</kbd></td>
                  <td><FormattedMessage id='keyboard_shortcuts.legend' defaultMessage='display this legend' /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

}
