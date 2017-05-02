import React from 'react';
import CourseCard from './CourseCard.jsx';
import Request from 'superagent';
import {Grid, Row, Col} from 'react-flexbox-grid';
import RestoreIcon from 'material-ui/svg-icons/action/restore';
import IconButton from 'material-ui/IconButton';
import RestoreCourse from './RestoreCourse.jsx';
import AddCourse from './AddCourse.jsx';

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

export default class Courses extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			courses: [],
			openDialog: false
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
	}

	componentDidMount() {
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
			.get('/mentor/courses')
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
			.post('/mentor/addcourse')
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
	
	updateCourse(course){
		let th = this
		Request
			.post('/mentor/updatecourse')
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

	deleteCourse(course){
		let th = this
		console.log(course)
		Request
			.delete('/mentor/deletecourse')
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
		console.log('here3');
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

	render() {
		let th = this;
		return(
			<div>
				<div>
				<h2 style={styles.heading}>Course Management</h2>
				<AddCourse handleAdd={this.addCourse}/>
				<Grid>
					<Row>
						{
							this.state.courses.map(function (course, key) {
								if(!course.Removed)
								{
									return (
											<Col md={3} key={key} style={styles.col}>
												<CourseCard course={course} updateCourse={th.updateCourse} deleteCourse={th.deleteCourse} addCategory={th.addCategory} deleteCategory={th.deleteCategory}/>
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
			</div>
		)
	}
}