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
import dialog from '../../styles/dialog.json';

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
        dialog.actionButton
      } />, < FlatButton label = "Delete" onTouchTap = {
        this.closeDeleteDialog
      }
      onClick = {
        this.handleDeleteAssignment
      }
      style = {
        dialog.actionButton
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
        <Dialog bodyStyle={dialog.confirmBox} actionsContainerStyle={dialog.actionsContainer} actions={deleteDialogActions} modal={false} open={this.state.showDeleteDialog} onRequestClose={this.closeDeleteDialog}>
          Are you sure? You want to delete this assignment?
        </Dialog>
			</div>
		)
	}
}
