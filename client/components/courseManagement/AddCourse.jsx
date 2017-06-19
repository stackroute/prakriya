import React from 'react';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import Dialog from 'material-ui/Dialog';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import app from '../../styles/app.json';
import select from '../../styles/select.json';
import dialog from '../../styles/dialog.json';
import CONFIG from '../../config/index';

export default class AddCourse extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			showDialog: false,
			Name: '',
			Mode: '',
			Duration: '',
			NameErrorText: '',
			ModeErrorText: '',
			DurationErrorText: '',
			key: -1
		}

		this.handleOpen = this.handleOpen.bind(this);
		this.handleClose = this.handleClose.bind(this);
		this.onChangeName = this.onChangeName.bind(this);
		this.onChangeMode = this.onChangeMode.bind(this);
		this.onChangeDuration = this.onChangeDuration.bind(this);
		this.handleCourseDelete = this.handleCourseDelete.bind(this);
		this.handleUpdate = this.handleUpdate.bind(this);
		this.resetFields = this.resetFields.bind(this);
		this.handleAdd = this.handleAdd.bind(this);
		this.validationSuccess = this.validationSuccess.bind(this)
	}

	componentWillMount() {
		if(this.props.openDialog) {
			this.setState({
				showDialog: true
			})
		}
	}

	onChangeName(e) {
		this.setState({
			Name: e.target.value,
			NameErrorText: ''
		})
	}

	onChangeMode(e, key, value) {
		console.log('mode e: ', value)
		this.setState({
			Mode: value,
			ModeErrorText: ''
		})
	}

	onChangeDuration(e) {
		this.setState({
			Duration: e.target.value,
			DurationErrorText: ''
		})
	}

	handleOpen() {
		this.setState({
			showDialog: true
		})
	}

	handleClose(e, action) {
		if(action == 'ADD') {
			if(this.validationSuccess()) {
				this.handleAdd()
				this.setState({
					showDialog: false
				})
				this.resetFields()
			}
		} else if(action == 'EDIT') {
			if(this.validationSuccess()) {
				this.handleUpdate()
				this.setState({
					showDialog: false
				})
				if(this.props.openDialog)
					this.props.handleClose()
				this.resetFields()
			}
		} else {
			this.setState({
				showDialog: false
			})
			if(this.props.openDialog)
				this.props.handleClose()
			this.resetFields()
		}
	}

	handleCourseDelete(perm) {
		let category = this.state.AssessmentCategories.filter(function(control) {
			return perm != control
		})
		this.setState({
			AssessmentCategories: category,
			disableSave: false
		})
	}

	resetFields() {
		this.setState({
			Name : '',
			Mode: '',
			Duration: '',
			NameErrorText: '',
			ModeErrorText: '',
			DurationErrorText: ''
		})
	}

	handleUpdate() {
		let th = this
		let course = {}
		course.CourseID = this.props.course.CourseID;
		course.CourseName = this.state.CourseName;
		course.AssessmentCategories = this.state.AssessmentCategories;
		course.Duration = this.state.Duration;
		course.History = '';
		this.props.handleUpdate(course);
	}

	handleAdd() {
		let th = this
		let course = {}
		console.log('id: ' + th.state.Name + '_' + th.state.Mode);
		course.ID = th.state.Name + '_' + th.state.Mode;
		course.Name = this.state.Name;
		course.Mode = this.state.Mode;
		course.Skills = [];
		course.Assignments = [];
		course.Schedule = [];
		course.Removed = false;
		course.Duration = this.state.Duration;
		course.History = '';
		this.props.handleAdd(course);
	}

	validationSuccess() {
		let durationPattern = /[0-9]{1,}/
		if(this.state.Name.trim().length == 0) {
			this.setState({
				NameErrorText: 'This field cannot be empty.'
			})
		} else if(this.state.Mode.trim().length == 0) {
			this.setState({
				ModeErrorText: 'This field cannot be empty.'
			})
		} else if(this.state.Duration.trim().length == 0) {
			this.setState({
				DurationErrorText: 'This field cannot be empty.'
			})
		} else if(!durationPattern.test(this.state.Duration)) {
			this.setState({
				DurationErrorText: 'Invalid input! Enter the number of weeks.'
			})
		} else {
			return true
		}
		return false
	}

	render() {
		let th = this
		let actions, title
		if(this.props.openDialog) {
			actions = [
				<FlatButton
					label="Cancel"
					onTouchTap={(e)=>this.handleClose(e, 'CLOSE')}
					style={dialog.actionButton}
				/>,
				<FlatButton
					label="Update Course"
					onClick={(e)=>this.handleClose(e, 'EDIT')}
					style={dialog.actionButton}
				/>
			]
			title = 'EDIT COURSE'
		} else {
			actions = [
					<FlatButton
						label="Cancel"
						onTouchTap={(e)=>this.handleClose(e, 'CLOSE')}
						style={dialog.actionButton}
					/>,
					<FlatButton
						label="Add Course"
						onClick={(e)=>this.handleClose(e, 'ADD')}
						style={dialog.actionButton}
					/>
			]
			title = 'ADD COURSE'
		}
		return(
				<div>
				<FloatingActionButton mini={true} style={app.fab} onTouchTap={this.handleOpen} >
		      <ContentAdd />
		    </FloatingActionButton>
				<Dialog
		    	bodyStyle={dialog.body}
          title={title}
					titleStyle={dialog.title}
					actionsContainerStyle={dialog.actionsContainer}
          open={this.state.showDialog}
          autoScrollBodyContent={true}
          onRequestClose={()=>this.handleClose('CLOSE')}
					actions={actions}
	        >
					<div>
						<div style={dialog.box100}>
			        <TextField
								style={{width: '100%'}}
				    		hintText="Course Name"
				    		floatingLabelText="Name *"
								floatingLabelStyle={app.mandatoryField}
				    		value={this.state.Name}
				    		onChange={this.onChangeName}
								errorText={this.state.NameErrorText}
				    	/>
						</div>
					</div>
					<div>
						<div style={dialog.box100}>
							<SelectField
								style={{width: '100%'}}
								hintText="Mode"
								floatingLabelText='Mode *'
								floatingLabelStyle={app.mandatoryField}
								value={this.state.Mode}
								onChange={this.onChangeMode}
								errorText={this.state.ModeErrorText}
								menuItemStyle={select.menu}
								listStyle={select.list}
								selectedMenuItemStyle={select.selectedMenu}
								maxHeight={600}
							>
							{
								CONFIG.MODES.map(function(mode, key) {
									return (
										<MenuItem
							        key={key}
							        value={mode}
							        primaryText={mode}
							      />
									)
								})
							}
							</SelectField>
						</div>
					</div>
					<div>
						<div style={dialog.box100}>
							<TextField
								style={{width: '100%'}}
								hintText="Duration"
								floatingLabelText="Duration (in weeks) *"
								floatingLabelStyle={app.mandatoryField}
				    		value={this.state.Duration}
								onChange={this.onChangeDuration}
								errorText={this.state.DurationErrorText}
							/>
						</div>
					</div>
					</Dialog>
					</div>
			)
	}
}
