import React from 'react';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import Dialog from 'material-ui/Dialog';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import Chip from 'material-ui/Chip';
import FlatButton from 'material-ui/FlatButton';
import SaveIcon from 'material-ui/svg-icons/content/save';
import AddIcon from 'material-ui/svg-icons/content/add-circle-outline';
import IconButton from 'material-ui/IconButton';

const styles = {
	addButton: {
		position:'fixed',
	  bottom: '60px',
	  right: '15px',
	  zIndex: 1
	},
	dialog: {
		backgroundColor: '#DDDBF1',
		borderBottom: '3px solid teal',
		borderRight: '10px solid teal',
		borderLeft: '10px solid teal'
	},
	dialogTitle: {
		fontWeight: 'bold',
		backgroundColor: 'teal',
		color: '#DDDBF1',
		textAlign: 'center'
	},
	actionsContainer: {
		backgroundColor: 'teal',
		borderTop: '0px',
		marginTop: '0px'
	},
	actionButton: {
		backgroundColor: '#DDDBF1',
		width: '50%',
		color: 'teal',
		border: '1px solid teal',
		height: '100%'
	},
	paper: {
		margin: '5px',
		padding: '5px',
		width: 'auto',
		height: '120px',
		borderRadius: '2px'
	},
	wrapper: {
    display: 'flex',
    flexWrap: 'wrap',
  },
	chip: {
    margin: '4px',
    background: '#eee'
  }
}

export default class AddCourse extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			showDialog: false,
			CourseName: '',
			AssessmentName: '',
			AssessmentCategories: [],
			Duration: '',
			key: -1,
			CourseNameErrorText: '',
			DurationErrorText: ''
		}

		this.handleOpen = this.handleOpen.bind(this);
		this.handleClose = this.handleClose.bind(this);
		this.onChangeName = this.onChangeName.bind(this);
		this.onChangeDuration = this.onChangeDuration.bind(this);
		this.handleCourseDelete = this.handleCourseDelete.bind(this);
		this.onChangeAssessmentCategory = this.onChangeAssessmentCategory.bind(this);
		this.onChangeAssessment = this.onChangeAssessment.bind(this);
		this.handleUpdate = this.handleUpdate.bind(this);
		this.resetFields = this.resetFields.bind(this);
		this.handleAdd = this.handleAdd.bind(this);
		this.validationSuccess = this.validationSuccess.bind(this)
	}

	componentWillMount() {
		if(this.props.openDialog) {
			this.setState({
				showDialog: true,
				CourseName: this.props.course.CourseName,
				AssessmentCategories: this.props.course.AssessmentCategories,
				Duration: this.props.course.Duration,
				disableSave: true,
			})
		}
	}

	onChangeName(e) {
		this.setState({
			CourseName: e.target.value,
			CourseNameErrorText: ''
		})
	}

	onChangeDuration(e) {
		this.setState({
			Duration: e.target.value,
			DurationErrorText: ''
		})
	}

	onChangeAssessmentCategory() {
		if(this.state.AssessmentName.trim().length != 0) {
			let assessment = this.state.AssessmentCategories
			assessment.push(this.state.AssessmentName)
			this.setState({
				AssessmentCategories: assessment,
				AssessmentName: '',
				disableSave: true
			})
		}
	}

	onChangeAssessment(e) {
		this.setState({
			AssessmentName: e.target.value,
			disableSave: false
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
			CourseName : '',
			AssessmentCategories : [],
			Duration: '',
			CourseNameErrorText: '',
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
		course.CourseID = 0;
		course.CourseName = this.state.CourseName;
		course.AssessmentCategories = this.state.AssessmentCategories;
		course.Categories = [];
		course.Removed = false;
		course.Duration = this.state.Duration;
		course.History = '';
		this.props.handleAdd(course);
	}

	validationSuccess() {
		if(this.state.CourseName.trim().length == 0) {
			this.setState({
				CourseNameErrorText: 'This field cannot be empty'
			})
		} else if(this.state.Duration.trim().length == 0) {
			this.setState({
				DurationErrorText: 'This field cannot be empty'
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
					style={styles.actionButton}
				/>,
				<FlatButton
					label="Update Course"
					onClick={(e)=>this.handleClose(e, 'EDIT')}
					style={styles.actionButton}
				/>
			]
			title = 'EDIT COURSE'
		} else {
			actions = [
					<FlatButton
						label="Cancel"
						onTouchTap={(e)=>this.handleClose(e, 'CLOSE')}
						style={styles.actionButton}
					/>,
					<FlatButton
						label="Add Course"
						onClick={(e)=>this.handleClose(e, 'ADD')}
						style={styles.actionButton}
					/>
			]
			title = 'ADD COURSE'
		}
		return(
				<div>
				<FloatingActionButton mini={true} style={styles.addButton} onTouchTap={this.handleOpen} >
		      <ContentAdd />
		    </FloatingActionButton>
				<Dialog
		    	bodyStyle={styles.dialog}
          title={title}
					titleStyle={styles.dialogTitle}
					actionsContainerStyle={styles.actionsContainer}
          open={this.state.showDialog}
          autoScrollBodyContent={true}
          onRequestClose={()=>this.handleClose('CLOSE')}
					actions={actions}
	        >
					<div>
						<div style={{border: '2px solid white', width: '50%', display: 'inline-block', boxSizing: 'border-box', padding: '5px'}}>
			        <TextField
				    		hintText="Course Name"
				    		floatingLabelText="Name"
				    		value={this.state.CourseName}
				    		onChange={this.onChangeName}
								errorText={this.state.CourseNameErrorText}
				    	/>
						</div>
						<div style={{border: '2px solid white', width: '50%', display: 'inline-block', boxSizing: 'border-box', padding: '5px'}}>
							<TextField
								hintText="In Weeks"
								floatingLabelText="Duration"
								value={this.state.Duration}
								onChange={this.onChangeDuration}
								errorText={this.state.DurationErrorText}
							/>
						</div>
					</div>
					<div  style={{border: '2px solid white', width: '100%', display: 'inline-block', boxSizing: 'border-box', padding: '5px'}}>
			    	<TextField
			    		hintText="assessment"
			    		floatingLabelText="Assessment Category"
			    		value={this.state.AssessmentName}
			    		onChange={this.onChangeAssessment}
			    	/>
			    	<IconButton tooltip="Add Assessment" onClick={this.onChangeAssessmentCategory} disabled={this.state.disableSave}>
				      <AddIcon/>
				    </IconButton>
						<Paper style={styles.paper} zDepth={1} >
							<div style={styles.wrapper}>
								{
									this.state.AssessmentCategories.map(function (category, index) {
										return(
											<Chip
												onRequestDelete={()=>th.handleCourseDelete(category)}
							          style={styles.chip}
							          key={index}
							        >
							          <span style={styles.chipName}>{category}</span>
							        </Chip>
						        )
									})
								}
							</div>
						</Paper>
						</div>
					</Dialog>
					</div>
			)
	}
}
