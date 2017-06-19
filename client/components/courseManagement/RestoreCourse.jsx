import React from 'react';
import Checkbox from 'material-ui/Checkbox';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import dialog from '../../styles/dialog.json';
import app from '../../styles/app.json';

export default class AddCourse extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			showDialog: false,
			actions: [],
			removed: 0
		}
		this.handleRestore = this.handleRestore.bind(this);
		this.handleClose = this.handleClose.bind(this);
		this.onChangeActions = this.onChangeActions.bind(this);
	}
	componentWillMount() {
		let totalRemoved = 0;
		this.props.course.map(function(course,index) {
			if(course.Removed === true)
				totalRemoved = totalRemoved + 1;
		})
		this.setState({
			showDialog: this.props.openDialog,
			removed: totalRemoved
		})
	}
	onChangeActions(event, isChecked) {
		let actionList = this.state.actions
		if(isChecked) {
			actionList.push(event.target.value)
			this.setState({actions: actionList})
		}
		else {
			actionList = this.state.actions.filter(function(item) {
				return item != event.target.value;
			})
			this.setState({actions: actionList})
			console.log(this.state.actions);
		}
	}

	handleRestore() {
		this.props.handleRestore(this.state.actions);
	}

	handleClose() {
		this.setState({
			showDialog: false
		})
		this.props.handleClose();
	}

	render() {
		let th = this
		let actions, content
		if(this.state.removed > 0) {
			actions = [
				<FlatButton
					label="Cancel"
					primary={true}
					onTouchTap={this.handleClose}
					style={dialog.actionButton}
				/>,
				<FlatButton
						label="Restore Course"
						primary={true}
						onClick={this.handleRestore}
						style={dialog.actionButton}
					/>
			]
			content = this.props.course.map(function (course, key) {
				if(course.Removed)
				{
					return (
						<Checkbox
									label={course.ID}
									value={course.ID}
									onCheck={th.onChangeActions}
									key={key}
								/>
						)
				}
			})
		} else {
			actions = []
			content = (<h4 style={{marginTop: '50px', textAlign: 'center'}}>Sorry! You have not deleted any course to restore.</h4>)
		}
			return(
			<div>
				<div>
				<Dialog
		    	bodyStyle={dialog.body}
					actionsContainerStyle={dialog.actionsContainer}
					titleStyle={dialog.title}
          title='RESTORE COURSE'
          open={this.state.showDialog}
          autoScrollBodyContent={true}
          onRequestClose={this.handleClose}
					actions={actions}
        >
				{content}
				</Dialog>
			</div>
		</div>
		)
	}
}
