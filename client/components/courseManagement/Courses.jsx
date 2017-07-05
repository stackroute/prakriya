import React from 'react';
import CourseCard from './CourseCard.jsx';
import Request from 'superagent';
import {Grid, Row, Col} from 'react-flexbox-grid';
import RestoreIcon from 'material-ui/svg-icons/content/undo';
import IconButton from 'material-ui/IconButton';
import RestoreCourse from './RestoreCourse.jsx';
import AddCourse from './AddCourse.jsx';
import Assignments from './Assignments.jsx';
import Schedule from './Schedule.jsx';

const styles = {
	heading: {
		textAlign: 'center'
	},
	col: {
		marginBottom: 20
	},
	restore: {
		position: 'fixed',
		top: '100px',
		right: '50px'
	}
}

const backgroundColors = [
	'#F5DEBF',
	'#DDDBF1',
	'#CAF5B3',
	'#C6D8D3'
	]

const backgroundIcons = [
	'#847662',
	'#666682',
	'#4e5f46',
	'#535f5b'
	]

export default class Courses extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			courses: [],
			currentCard: {},
			openDialog: false,
			assignmentsDialog: false,
			scheduleDialog: false
		}
		this.getCourses = this.getCourses.bind(this);
		this.updateCourse = this.updateCourse.bind(this);
		this.deleteCourse = this.deleteCourse.bind(this);
		this.openRestoreDialog = this.openRestoreDialog.bind(this);
		this.closeRestoreDialog = this.closeRestoreDialog.bind(this);
		this.handleRestoreCourse = this.handleRestoreCourse.bind(this);
		this.restoreCourses = this.restoreCourses.bind(this);
		this.addCategory = this.addCategory.bind(this);
		this.deleteCategory = this.deleteCategory.bind(this);
		this.addCourse = this.addCourse.bind(this);
		this.openAssignments = this.openAssignments.bind(this);
		this.closeAssignments = this.closeAssignments.bind(this);
		this.openSchedule = this.openSchedule.bind(this);
		this.closeSchedule = this.closeSchedule.bind(this);
		this.setCurrentCourse = this.setCurrentCourse.bind(this);
	}

	componentWillMount() {
		this.getCourses();
	}

	openRestoreDialog() {
		this.setState({
			openDialog: true
		})
	}

	closeRestoreDialog() {
		this.setState({
			openDialog: false
		})
	}

	handleRestoreCourse(actions) {
		this.setState({
			openDialog: false
		})
		this.restoreCourses(actions);
	}

	getCourses() {
		let th = this;
		Request
			.get('/dashboard/courses')
			.set({'Authorization': localStorage.getItem('token')})
			.end(function(err, res) {
				if(err)
		    	console.log(err);
		    else {
		    	console.log('Successfully fetched all courses', res.body)
		    	th.setState({
		    		courses: res.body
		    	})
		    }
			})
	}

	addCourse(course){
		let th = this
		course.CourseID = this.state.courses.length + 1;
		Request
			.post('/dashboard/addcourse')
			.set({'Authorization': localStorage.getItem('token')})
			.send(course)
			.end(function(err, res){
		    if(err)
		    	console.log(err);
		    else {
		    	th.getCourses();
		    }
		  });
	}

	updateCourse(course, edit){
		let th = this
		console.log(edit)
		Request
			.post('/dashboard/updatecourse')
			.set({'Authorization': localStorage.getItem('token')})
			.send({course:course,edit:edit})
			.end(function(err, res){
		    if(err)
		    	console.log(err);
		    else {
		    	th.getCourses();
		    }
		  });
	}

	deleteCourse(course){
		let th = this
		console.log(course)
		Request
			.post('/mentor/deletecourse')
			.set({'Authorization': localStorage.getItem('token')})
			.send(course)
			.end(function(err, res){
		    if(err)
		    	console.log(err);
		    else {
		    	th.getCourses();
		    }
		  });
	}

	restoreCourses(actions){
		let th = this
		Request
			.post('/mentor/restorecourse')
			.set({'Authorization': localStorage.getItem('token')})
			.send(actions)
			.end(function(err, res){
		    if(err)
		    	console.log(err);
		    else {
		    	th.getCourses();
		    }
		  });
	}

	addCategory(category){
		let th = this
		Request
			.post('/mentor/addcategory')
			.set({'Authorization': localStorage.getItem('token')})
			.send(category)
			.end(function(err, res){
		    if(err)
		    	console.log(err);
		    else {
		    	th.getCourses();
		    }
		  });
	}

	deleteCategory(category){
		let th = this
		Request
			.post('/mentor/deletecategory')
			.set({'Authorization': localStorage.getItem('token')})
			.send(category)
			.end(function(err, res){
		    if(err)
		    	console.log(err);
		    else {
		    	th.getCourses();
		    }
		  });
	}

	openAssignments() {
		this.setState({
			assignmentsDialog: true
		});
	}

	closeAssignments() {
		this.setState({
			assignmentsDialog: false
		});
	}

	openSchedule() {
		this.setState({
			scheduleDialog: true
		});
	}

	closeSchedule() {
		this.setState({
			scheduleDialog: false
		});
	}

	setCurrentCourse(currentCourse, bgColor, iconColor) {
		this.setState({
			currentCard: {
				course: currentCourse,
				bgColor: bgColor,
				iconColor: iconColor
			}
		});
	}

	render() {
		let th = this;
		return(
			<div>
				<div>
				<h2 style={styles.heading}>Course Management</h2>
				<AddCourse handleAdd={this.addCourse}/>
				<Grid style={styles.grid}>
					<Row>
						{
							this.state.courses.map(function (course, key) {
								if(!course.Removed)
								{
									return (
											<Col md={3} key={key} style={styles.col}>
												<CourseCard course={course}
												updateCourse={th.updateCourse}
												deleteCourse={th.deleteCourse}
												addCategory={th.addCategory}
												deleteCategory={th.deleteCategory}
												bgColor={backgroundColors[key%4]}
												bgIcon={backgroundIcons[key%4]}
												openAssignments={th.openAssignments}
												closeAssignments={th.closeAssignments}
												openSchedule={th.openSchedule}
												closeSchedule={th.closeSchedule}
												setCurrentCourse={()=>{th.setCurrentCourse(course, backgroundColors[key%4], backgroundIcons[key%4])}}
												/>
											</Col>
											)
								}
							})
						}
					</Row>
				</Grid>
			</div>
			<IconButton tooltip="Restore Deleted Course" style = {styles.restore}  onClick={this.openRestoreDialog}>
					      <RestoreIcon/>
			</IconButton>
			 {
							this.state.openDialog &&
							<RestoreCourse course={this.state.courses} openDialog={this.state.openDialog} handleRestore={this.handleRestoreCourse} handleClose={this.closeRestoreDialog}/>
				}
				<Assignments
					bgColor={this.state.currentCard.bgColor || 'white'}
					bgIcon={this.state.currentCard.iconColor || 'white'}
					courseID={this.state.currentCard.course ? this.state.currentCard.course.ID : 'NA'}
					assignments={
						this.state.currentCard.course ?
						this.state.currentCard.course.Assignments.sort(function(a, b) {
							return a.Week.low - b.Week.low
						}) :
						[]
					}
					openDialog={this.state.assignmentsDialog}
					closeDialog={this.closeAssignments} />

					<Schedule
						bgColor={this.state.currentCard.bgColor || 'white'}
						bgIcon={this.state.currentCard.iconColor || 'white'}
						courseID={this.state.currentCard.course ? this.state.currentCard.course.ID : 'NA'}
						sessions={
							this.state.currentCard.course ?
							this.state.currentCard.course.Schedule.sort(function(a, b) {
								return a.Day - b.Day
							}) :
							[]
						}
						openDialog={this.state.scheduleDialog}
						closeDialog={this.closeSchedule} />
			</div>
		)
	}
}
