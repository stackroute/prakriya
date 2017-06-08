import React from 'react';
import Checkbox from 'material-ui/Checkbox';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

const styles = {
	heading: {
		textAlign: 'center'
	},
	dialog: {
    backgroundColor: '#DDDBF1',
    border: '10px solid teal'
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
	col: {
		marginBottom: 20
	}
}

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
					style={styles.actionButton}
				/>,
				<FlatButton
						label="Restore Course"
						primary={true}
						onClick={this.handleRestore}
						style={styles.actionButton}
					/>
			]
			content = this.props.course.map(function (course, key) {
				if(course.Removed)
				{
					return (
						<Checkbox
									label={course.CourseName}
									value={course.CourseName}
									onCheck={th.onChangeActions}
									key={key}
								/>
						)
				}
			})
		} else {
			actions = []
			content = (<h4 style={{marginTop: '50px', textAlign: 'center'}}>Sorry you have selected any course to restore.</h4>)
		}
			return(
			<div>
				<div>
				<Dialog
		    	bodyStyle={styles.dialog}
					actionsContainerStyle={styles.actionsContainer}
					titleStyle={styles.dialogTitle}
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
