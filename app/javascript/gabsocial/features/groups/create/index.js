import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { changeValue, submit, reset } from '../../../actions/group_editor';
import IconButton from '../../../components/icon_button';
import { defineMessages, injectIntl } from 'react-intl';

const messages = defineMessages({
	heading: { id: 'groups.create.heading', defaultMessage: 'New group' },
	title: { id: 'groups.form.title', defaultMessage: 'Title' },
	description: { id: 'groups.form.description', defaultMessage: 'Description' },
	coverImage: { id: 'groups.form.coverImage', defaultMessage: 'Cover Image' },
	create: { id: 'groups.form.create', defaultMessage: 'Create group' },
});

const mapStateToProps = state => ({
	title: state.getIn(['group_editor', 'title']),
	description: state.getIn(['group_editor', 'description']),
	coverImage: state.getIn(['group_editor', 'coverImage']),
	disabled: state.getIn(['group_editor', 'isSubmitting']),
});

const mapDispatchToProps = dispatch => ({
	onTitleChange: value => dispatch(changeValue('title', value)),
	onDescriptionChange: value => dispatch(changeValue('description', value)),
	onCoverImageChange: value => dispatch(changeValue('coverImage', value)),
	onSubmit: routerHistory => dispatch(submit(routerHistory)),
	reset: () => dispatch(reset()),
});

export default @connect(mapStateToProps, mapDispatchToProps)
@injectIntl
class Create extends React.PureComponent {

	static contextTypes = {
		router: PropTypes.object
	}

	static propTypes = {
		title: PropTypes.string.isRequired,
		description: PropTypes.string.isRequired,
		coverImage: PropTypes.object,
		disabled: PropTypes.bool,
		intl: PropTypes.object.isRequired,
		onTitleChange: PropTypes.func.isRequired,
		onSubmit: PropTypes.func.isRequired,
	};

	componentWillMount() {
		this.props.reset();
	}

	handleTitleChange = e => {
		this.props.onTitleChange(e.target.value);
	}

	handleDescriptionChange = e => {
		this.props.onDescriptionChange(e.target.value);
	}

	handleCoverImageChange = e => {
		this.props.onCoverImageChange(e.target.files[0]);
	}

	handleSubmit = e => {
		e.preventDefault();
		this.props.onSubmit(this.context.router.history);
	}

	handleClick = () => {
		this.props.onSubmit(this.context.router.history);
	}

	render () {
		const { title, description, coverImage, disabled, intl } = this.props;

		return (
			<form className='column-inline-form' onSubmit={this.handleSubmit}>
				<h2>{intl.formatMessage(messages.heading)}</h2>
				
				<label>
					<input
						className='setting-text'
						value={title}
						disabled={disabled}
						onChange={this.handleTitleChange}
						placeholder={intl.formatMessage(messages.title)}
					/>
				</label>
					
				<label>
					<input
						className='setting-text'
						value={description}
						disabled={disabled}
						onChange={this.handleDescriptionChange}
						placeholder={intl.formatMessage(messages.description)}
					/>
				</label>

				<label>
					<input
						type='file'
						className='setting-text'
						disabled={disabled}
						onChange={this.handleCoverImageChange}
						placeholder={intl.formatMessage(messages.coverImage)}
					/>
				</label>

				<IconButton
					disabled={disabled}
					icon='plus'
					title={title}
					onClick={this.handleClick}
				/>
			</form>
		);
	}

}
