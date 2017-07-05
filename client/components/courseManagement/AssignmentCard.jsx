import React from 'react';
import {
  Card,
  CardHeader
} from 'material-ui/Card';
import Paper from 'material-ui/Paper';
import Avatar from 'material-ui/Avatar';
import IconButton from 'material-ui/IconButton';
import SkillsIcon from 'material-ui/svg-icons/action/stars';
import DateIcon from 'material-ui/svg-icons/action/date-range';
import DeleteIcon from 'material-ui/svg-icons/action/delete';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';

const styles = {
  heading: {
    textAlign: 'center'
  },
  col: {
    marginBottom: 20
  },
  deleteDialog: {
    backgroundColor: '#DDDBF1',
    border: '10px solid teal'
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
  }
}

export default class AssignmentCard extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
      showDeleteDialog: false
		}
    this.openDeleteDialog = this.openDeleteDialog.bind(this);
    this.closeDeleteDialog = this.closeDeleteDialog.bind(this);
    this.handleDeleteAssignment = this.handleDeleteAssignment.bind(this);
	}

  openDeleteDialog() {
    this.setState({showDeleteDialog: true})
  }

  closeDeleteDialog() {
    this.setState({showDeleteDialog: false})
  }

  handleDeleteAssignment() {
    let th = this
		this.props.delete(this.props.assignment,'assignment');
  }

	render() {
		let th = this
		let bgColor = this.props.bgColor;
    let bgIcon = this.props.bgIcon;
    const deleteDialogActions = [ < FlatButton label = "Cancel" onTouchTap = {
        this.closeDeleteDialog
      }
      style = {
        styles.actionButton
      } />, < FlatButton label = "Delete" onTouchTap = {
        this.closeDeleteDialog
      }
      onClick = {
        this.handleDeleteAssignment
      }
      style = {
        styles.actionButton
      } />
    ]
		return(
			<div style={{
				display: 'inline-block',
				padding: '10px'
			}}>
				<Card style={{
					width: '310px',
					background: bgColor
				}}>
					<CardHeader
					title={`${this.props.assignment.Name}`}
					avatar={
						<Avatar backgroundColor={bgIcon}>
							{this.props.assignment.Week.low}
						</Avatar>
					} />

					<IconButton tooltip="Duration">
						<DateIcon/>
					</IconButton>
					<span style={{verticalAlign: 'super'}}>
						{this.props.assignment.Duration.low}&nbsp;day(s)
					</span><br/>

          <Paper style={{
            margin: '5px',
            padding: '5px',
            width: '92%',
            margin: 'auto',
            borderRadius: '2px',
            boxSizing: 'border-box'}}>
            <span style={{textAlign: 'jusitfy'}}>
              <b style={{color: bgIcon}}>Skills: </b>
              {
                this.props.assignment.Skills.length == 0 ?
                'NA' :
                this.props.assignment.Skills.map(function(skill, index) {
                  if(index == th.props.assignment.Skills.length - 1)
                    return skill;
                  return skill + ', ';
                })
              }
            </span>
          </Paper><br/>

          <Paper style={{
            margin: '5px',
            padding: '5px',
            width: '92%',
            margin: 'auto',
            borderRadius: '2px',
            boxSizing: 'border-box'}}>
            <span style={{textAlign: 'jusitfy'}}>
              <b style={{color: bgIcon}}>Description: </b>{this.props.assignment.Description}
            </span>
          </Paper><br/>
          <IconButton tooltip="Delete Assignment" style={{
            display: this.state.hide
          }} onClick={this.openDeleteDialog}>
            <DeleteIcon/>
          </IconButton>
				</Card>
        <Dialog bodyStyle={styles.deleteDialog} actionsContainerStyle={styles.actionsContainer} actions={deleteDialogActions} modal={false} open={this.state.showDeleteDialog} onRequestClose={this.closeDeleteDialog}>
          Are you sure you want to delete this Assignment?
        </Dialog>
			</div>
		)
	}
}
