import React from 'react';
import Request from 'superagent';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import Avatar from 'material-ui/Avatar';
import IconButton from 'material-ui/IconButton';
import EditIcon from 'material-ui/svg-icons/editor/mode-edit';
import CourseIcon from 'material-ui/svg-icons/action/book';
import DeleteIcon from 'material-ui/svg-icons/action/delete';
import AddIcon from 'material-ui/svg-icons/content/add-circle-outline';
import DateIcon from 'material-ui/svg-icons/action/date-range';
import GroupIcon from 'material-ui/svg-icons/social/group';
import LocationIcon from 'material-ui/svg-icons/communication/location-on';
import Dialog from 'material-ui/Dialog';
import Cadets from './Cadets.jsx';
import {Grid, Row, Col} from 'react-flexbox-grid';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import DatePicker from 'material-ui/DatePicker';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';

const styles = {
    text: {
      wordWrap: 'break-word'
    },
    view: {
    	cursor: 'pointer',
    	textDecoration: 'underline',
    	color: 'blue'
    },
	col: {
		marginBottom: 20,
		marginRight: -20,
		width:150
	},
	grid: {
		width: '100%'
	},
  dialog: {
    backgroundColor: '#DDDBF1',
    borderBottom: '10px solid teal',
    borderRight: '10px solid teal',
    borderLeft: '10px solid teal'
  },
  deleteDialog: {
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
	}
}

export default class WaveCard extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			cadetFetch: false,
			cadets: [],
			dialog: false,
			imageURL: [],
			showDeleteDialog: false,
			openDialog: false,
			wave: {},
			courses: [],
			selectedCourse: [],
			addCadet: false,
			newCadets: [],
			selectedCadets: [],
			disableSave: true
		}
		this.handleOpen = this.handleOpen.bind(this);
		this.handleClose = this.handleClose.bind(this);
		this.handleEditWave = this.handleEditWave.bind(this);
		this.getCadets = this.getCadets.bind(this);
		this.openDeleteDialog = this.openDeleteDialog.bind(this);
		this.closeDeleteDialog = this.closeDeleteDialog.bind(this);
		this.handleDeleteWave = this.handleDeleteWave.bind(this);
		this.handleUpdateWave = this.handleUpdateWave.bind(this);
		this.closeUpdateDialog = this.closeUpdateDialog.bind(this);
		this.getCourses = this.getCourses.bind(this);
		this.handleCoursesChange = this.handleCoursesChange.bind(this);
		this.handleLocationChange = this.handleLocationChange.bind(this);
		this.handleStartDateChange = this.handleStartDateChange.bind(this);
		this.handleEndDateChange = this.handleEndDateChange.bind(this);
		this.openAddDialog = this.openAddDialog.bind(this);
		this.handleCadetsChange = this.handleCadetsChange.bind(this);
		this.getNewCadets = this.getNewCadets.bind(this);
	}

	handleEditWave() {
		this.setState({
			openDialog: true,
			wave: this.props.wave
		})
		this.getCourses();
	}

	getCourses() {
		let th = this;
		Request
			.get('/mentor/courses')
			.set({'Authorization': localStorage.getItem('token')})
			.end(function(err, res) {
				if(err)
		    	console.log(err);
		    else {
		    	console.log('Successfully fetched all courses', res.body)
		    	th.setState({
		    		courses: res.body,
		    		selectedCourse: th.state.wave.CourseNames
		    	})
		    }
			})
	}

	getNewCadets() {
		let th = this;
		Request
			.get('/dashboard/cadets')
			.set({'Authorization': localStorage.getItem('token')})
			.end(function(err, res) {
				if(err)
		    	console.log(err);
		    else {
		    	let cadets = res.body.filter(function(cadet) {
		    		if((cadet.Wave == undefined || cadet.Wave == '') && (cadet.Selected === 'Yes' || cadet.Selected === 'DS' ))
		    			return cadet;
		    	})
		    	th.setState({
		    		newCadets: cadets
		    	})
		    	console.log(th.state.newCadets);
		    }
			})
	}

	handleUpdateWave() {
		let wave = this.state.wave;
		wave.CourseNames = this.state.selectedCourse;
		this.props.handleUpdate(wave);
		if(this.state.addCadet)
			this.updateCadet(this.state.selectedCadets);
		this.closeUpdateDialog();
	}

	updateCadets() {
		
	}

	handleDeleteWave() {
		this.props.handleDelete(this.props.wave);
		this.closeDeleteDialog();
	}

	openDeleteDialog() {
		this.setState({
			showDeleteDialog: true
		})
	}

	handleCadetsChange(event, key, val) {
		let wave = this.props.wave;
		val.map(function(cadet){
			wave.Cadets.push(cadet);	
		})
		this.setState({
			selectedCadets: val,
			wave: wave,
			disableSave: false
		})
	}

	closeDeleteDialog() {
		this.setState({
			showDeleteDialog: false
		})
	}

	closeUpdateDialog() {
		this.setState({
			openDialog: false,
			addCadet: false,
			cadets: this.state.wave.Cadets
		})
	}

	handleOpen() {
		this.setState({
			cadetFetch: true
		})
	}

	getCadets(cadets) {
		let th = this;
		Request
			.post('/dashboard/cadetsofwave')
			.set({'Authorization': localStorage.getItem('token')})
			.send({cadets:cadets})
			.end(function(err, res) {
				if(err)
		    	console.log(err);
		    else {
		    	console.log('Successfully fetched all cadets', res.body)
		    	th.setState({
		    		cadets: res.body,
		    		cadetFetch: false,
		    		dialog: true
		    	})
		    }
			})
	}

	handleClose() {
		this.setState({
			dialog: false
		})
	}

	handleLocationChange(event) {
		let wave = this.state.wave;
		wave.Location = event.target.value
		this.setState({
			wave: wave
		})
	}
	handleStartDateChange(event, date) {
		let wave = this.state.wave;
		wave.StartDate = new Date(date);
		wave.EndDate = new Date(date.setDate(date.getDate() + 84));
		this.setState({
			wave: wave
		})
	}
	handleEndDateChange(event, date) {
		let wave = this.state.wave;
		wave.EndDate= date;
		this.setState({
			wave: wave
		})
	}
	handleCoursesChange(event, key, val) {
		console.log(this.state.selectedCourse+'selected');
		this.setState({
			selectedCourse: val
		})
	}

	openAddDialog() {
		this.setState({
			addCadet: true
		})
		this.getNewCadets();
	}

	render() {
		let startdate = new Date(this.props.wave.StartDate);
		startdate = startdate.getFullYear() + '/' + (startdate.getMonth()+1) + '/' + startdate.getDate();
		let enddate = new Date(this.props.wave.EndDate);
		enddate = enddate.getFullYear() + '/' + (enddate.getMonth()+1) + '/' + enddate.getDate();
		let start = (new Date(startdate));
		start = start.toString();
		start = start.split(' ');
		start = start[2]+' '+start[1]+' '+start[3];
		let end = (new Date(enddate));
		end = end.toString();
		end = end.split(' ');
		end = end[2]+' '+end[1]+' '+end[3];
		let date = start + ' - ' + end;
		let th = this

		const deleteDialogActions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.closeDeleteDialog}
        style={styles.actionButton}
      />,
      <FlatButton
        label="Delete"
        primary={true}
        onClick={this.handleDeleteWave}
        style={styles.actionButton}
      />,
    ]

    const editWave = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.closeUpdateDialog}
        style={styles.actionButton}
      />,
      <FlatButton
        label="Update"
        primary={true}
        onClick={this.handleUpdateWave}
        style={styles.actionButton}
      />
    ]
    let view = 'inline'
    if(this.state.addCadet)
    {
    	view = 'none'
    }
    let bgColor = this.props.bgColor;
		let bgIcon = this.props.bgIcon;
		return (
			<div>
		<Card
					style={{
						width:'300px',
						marginRight:'20px',
						marginBottom:'20px',
						background: bgColor
					}}
				>
					<CardHeader
			      title={<span style={{fontSize:'20px', position: 'absolute',top: '32%'}}><b>{this.props.wave.WaveNumber}</b></span>}
			      avatar={
			      	<Avatar backgroundColor={bgIcon}>
			      		{this.props.wave.WaveID.charAt(0).toUpperCase()}
			      	</Avatar>
			      }/>
			    	<CardText style={styles.text}>
			    	<IconButton tooltip="Location">
				      <LocationIcon/>
				    </IconButton>
				    <span style={{position: 'absolute',top: '33%'}}>{this.props.wave.Location}</span><br/>
				    <IconButton tooltip="Date">
				      <DateIcon/>
				    </IconButton>
				    <span style={{position: 'absolute',top: '47%'}}>{date}</span><br/>
				    <IconButton  tooltip="Course">
				      <CourseIcon/>
				    </IconButton><span style={{position: 'absolute',top: '62%'}}>
			    	{this.props.wave.CourseNames.map(function(course, index) {
			    		if(course != '')
			    			if(index != 0)
			    				course = ', ' + course
			    			return <span key={index}>{course}</span>
			    	})
			    	}</span><br/>
			    	<IconButton tooltip="Members" onClick={this.handleOpen}>
				      <GroupIcon/>
				    </IconButton>
				  	<IconButton tooltip="Delete Wave" onClick={this.openDeleteDialog} style={{float:'right'}}>
				      <DeleteIcon/>
				    </IconButton>
				  	<IconButton tooltip="Edit Wave" onClick={this.handleEditWave} style={{float:'right'}}>
				      <EditIcon/>
				    </IconButton>
				    </CardText>
			    	</Card>
				  	{this.state.cadetFetch &&
		        	th.getCadets(this.props.wave.Cadets)}
		        	<Dialog
					    	style={styles.dialog}
			          title='CADETS'
			          open={this.state.dialog}
			          autoScrollBodyContent={true}
			          onRequestClose={this.handleClose}
                actionsContainerStyle={styles.actionsContainer}
                bodyStyle={styles.dialog}
                titleStyle={styles.dialogTitle}
			        >
			        <Grid style={styles.grid}><Row>
			        {
			        	th.state.cadets.map(function(cadet,index){
			        		return <Col xs={3} key={index} style={styles.col}><Cadets cadet={cadet}/></Col>
			        	})
			        }
			        </Row>
			        </Grid>
			        <IconButton tooltip="Add Cadet" style={{display:view,float: 'right'}} onClick={this.openAddDialog}>
					      <AddIcon/>
					    </IconButton>
					    {
					    	this.state.addCadet && <p><SelectField
		        		multiple={true}
				        hintText="Select Cadets"
								floatingLabelText='Cadets'
				        value={this.state.selectedCadets}
				        onChange={this.handleCadetsChange}
								menuItemStyle={{borderTop: '1px solid teal', borderBottom: '1px solid teal', backgroundColor: '#DDDBF1'}}
								listStyle={{backgroundColor: 'teal', borderLeft: '5px solid teal', borderRight: '5px solid teal'}}
								style={{width: '100%'}}
								selectedMenuItemStyle={{color: 'black', fontWeight: 'bold'}}
								maxHeight='600'
				      >
				      {
				        	this.state.newCadets.map(function(cadet, i) {
				        		return (
				        			cadet.Selected != undefined &&
				        			(cadet.Selected == 'Yes' ||
											cadet.Selected == 'DS') &&
				        			<MenuItem
								        key={i}
								        insetChildren={true}
								        checked={
								        	th.state.selectedCadets &&
								        	th.state.selectedCadets.includes(cadet.EmployeeID)
								       	}
								        value={cadet.EmployeeID}
								        primaryText={`${cadet.EmployeeName} (${cadet.EmployeeID})`}
								      />
								      )
		        				})
		        			}
		      			</SelectField>
		      			<RaisedButton 
						    	label="Save Changes" 
						    	disabled={this.state.disableSave} 
						    	primary={true}
						    	onClick={this.handleUpdateWave}
						    />
						    </p>
							}
			        </Dialog>
			        <Dialog
			          actions={deleteDialogActions}
			          modal={false}
			          open={this.state.showDeleteDialog}
			          onRequestClose={this.closeDeleteDialog}
                actionsContainerStyle={styles.actionsContainer}
                bodyStyle={styles.deleteDialog}
			        >
        			Are you sure you want to delete this Wave?
        			</Dialog>
        			<Dialog
			          actions={editWave}
			          modal={false}
			          title='EDIT WAVE'
			          open={this.state.openDialog}
			          onRequestClose={this.closeDeleteDialog}
                titleStyle={styles.dialogTitle}
                bodyStyle={styles.dialog}
                actionsContainerStyle={styles.actionsContainer}
			        >
              <div>
                <div style={{border: '2px solid white', width: '50%', display: 'inline-block', boxSizing: 'border-box', padding: '5px'}}>
	    		        <TextField
  						      floatingLabelText="Wave Name"
  						      value={this.state.wave.WaveNumber}
  						      fullWidth={true}
  						      disabled={true}
                    underlineDisabledStyle={{display: 'none'}}
				          />
                </div>
                <div style={{border: '2px solid white', width: '50%', display: 'inline-block', boxSizing: 'border-box', padding: '5px'}}>
  						    <TextField
  						      hintText="Provide the base location"
  						      floatingLabelText="Location"
  						      value={this.state.wave.Location}
  						      onChange={this.handleLocationChange}
  						      fullWidth={true}
  						    />
                </div>
              </div>
              <div>
                <div style={{border: '2px solid white', width: '50%', display: 'inline-block', boxSizing: 'border-box', padding: '5px'}}>
						    <DatePicker
						    	hintText='Start Date'
                  floatingLabelText='Start Date'
						    	value={new Date(startdate)}
						    	onChange={this.handleStartDateChange}
						    />
                </div>
                <div style={{border: '2px solid white', width: '50%', display: 'inline-block', boxSizing: 'border-box', padding: '5px'}}>
						    <DatePicker
						    	hintText='End Date'
                  floatingLabelText='End Date'
						    	value={new Date(enddate)}
						    	onChange={this.handleEndDateChange}
						    />
                </div>
              </div>
              <div style={{border: '2px solid white', width: '100%', display: 'inline-block', boxSizing: 'border-box', padding: '5px'}}>
						    <SelectField
					        multiple={true}
					        hintText="Select Courses"
                  floatingLabelText='Courses'
					        value={this.state.selectedCourse}
					        onChange={this.handleCoursesChange}
                  menuItemStyle={{borderTop: '1px solid teal', borderBottom: '1px solid teal', backgroundColor: '#DDDBF1'}}
                  listStyle={{backgroundColor: 'teal', borderLeft: '5px solid teal', borderRight: '5px solid teal'}}
                  selectedMenuItemStyle={{color: 'black', fontWeight: 'bold'}}
                  maxHeight={600}
                  style={{width: '100%'}}
					      >
					        {
					        	this.state.courses.map(function(course, i) {
					        		return (
					        			<MenuItem
									        key={i}
									        insetChildren={true}
									        checked={
									        	th.state.selectedCourse && th.state.selectedCourse.includes(course.CourseName)
									       	}
									        value={course.CourseName}
									        primaryText={course.CourseName}

									      />
					        		)
					        	})
					        }
					      </SelectField>
              </div>
			        </Dialog>
        </div>
		)
	}
}
