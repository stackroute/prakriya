import React from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import Avatar from 'material-ui/Avatar';
import IconButton from 'material-ui/IconButton';
import Moment from 'moment';
import EditIcon from 'material-ui/svg-icons/editor/mode-edit';
import AddIcon from 'material-ui/svg-icons/content/add';
import DeleteIcon from 'material-ui/svg-icons/action/delete';
import HistoryIcon from 'material-ui/svg-icons/action/history';
import CourseSubCard from './CourseSubCard.jsx';
import AddCourse from './AddCourse.jsx';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';

const styles = {
	heading: {
		textAlign: 'center'
	},
	col: {
		marginBottom: 20
	}
}

export default class CourseCard extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			expanded: false,
			hide: 'inline',
			show:'none',
			showDeleteDialog: false,
			openDialog:false,
			showAddCategoryDialog: false
		}
			this.handleExpandChange = this.handleExpandChange.bind(this);
			this.handleEditCourse = this.handleEditCourse.bind(this);
			this.handleUpdateCourse = this.handleUpdateCourse.bind(this);
			this.handleClose = this.handleClose.bind(this);
			this.handleDeleteCourse = this.handleDeleteCourse.bind(this);		
			this.openDeleteDialog = this.openDeleteDialog.bind(this);
			this.closeDeleteDialog = this.closeDeleteDialog.bind(this);
			this.handleAddCategory = this.handleAddCategory.bind(this);
			this.openAddCategoryDialog = this.openAddCategoryDialog.bind(this);
			this.handleDeleteCategory = this.handleDeleteCategory.bind(this);
			this.formatDate = this.formatDate.bind(this);
	}

	handleExpandChange = (expanded) => {
    this.setState({expanded: expanded});
    if(this.state.expanded)
  	{
    	this.setState({expanded: false,hide:'inline',show:'none'});
    }
    else
    {
    	this.setState({expanded: true,hide:'none',show:'inline'});
    }
  };

  handleEditCourse() {
		this.setState({
			openDialog: true
		})
	}

	handleClose() {
		this.setState({
			openDialog: false,
			showAddCategoryDialog:false
		})
	}

	openDeleteDialog() {
		this.setState({
			showDeleteDialog: true
		})
	}
	closeDeleteDialog() {
		this.setState({
			showDeleteDialog: false
		})
	}
	openAddCategoryDialog() {
		this.setState({
			showAddCategoryDialog: true
		})
	}

	handleUpdateCourse(course) {
		course.History = this.props.course.History;
		this.props.updateCourse(course);
	}

	handleAddCategory(category) {
		category.History = this.props.course.History;
		this.props.addCategory(category);
		this.handleClose();
	}

	handleDeleteCourse(course) {
		this.props.deleteCourse(this.props.course);
	}

	handleDeleteCategory(category) {
		category.History = this.props.course.History;
		this.props.deleteCategory(category);
	}

	formatDate(date) {
		if(date) {
			return Moment(date).fromNow();
			// return Humanize.naturalDay(newdate,'H:i:s dS M, Y')
		}
		else 
			return '-' 
	}

	render() {
		const deleteDialogActions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.closeDeleteDialog}
      />,
      <FlatButton
        label="Delete"
        primary={true}
        onTouchTap={this.closeDeleteDialog}
        onClick={this.handleDeleteCourse}
      />,
    ];
    let th = this;
    let history = this.props.course.History.split('\n');
    history = history[history.length-2].split('on');
		return (
			<div>
				<Card expanded={this.state.expanded} onExpandChange={this.handleExpandChange} style = {{width:'300px', marginRight:'20px', marginBottom:'20px'}}>
					<CardHeader
			      title={this.props.course.CourseName}
			      subtitle={this.props.course.Duration}
			      avatar={
			      	<Avatar>
			      		{this.props.course.CourseName.charAt(0).toUpperCase()}
			      	</Avatar>
			      }
			      actAsExpander={true}
      			showExpandableButton={true}/>
			    <CardText expandable={true}>
			    	{
			    		this.props.course.Categories.map(function(category,key) {
			    			return (<CourseSubCard category={category} key={key} deleteCategory={th.handleDeleteCategory} courseID={th.props.course.CourseID}/>)
			    		})
			    	}
			    	
			    </CardText>
			    <h4 style={{display:this.state.hide,marginLeft:'20px'}}>{history[0]}</h4><br/>
					<h5 style={{display:this.state.hide,marginLeft:'20px',color:'grey'}}>{th.formatDate(history[1])}</h5><br/>
					<IconButton tooltip="Edit Course" onClick={this.handleEditCourse} style={{display:this.state.hide,marginLeft:'10px'}}>
					      <EditIcon/>
					    </IconButton>
					    <IconButton tooltip="Delete Course" style={{display:this.state.hide}} onClick={this.openDeleteDialog}>
					      <DeleteIcon/>
					    </IconButton>
					    <IconButton tooltip="Add another Category" style={{display:this.state.show}} onClick={this.openAddCategoryDialog}>
					      <AddIcon/>
					    </IconButton>
					    {
							this.state.openDialog &&
							<AddCourse course={this.props.course} openDialog={this.state.openDialog} handleUpdate={this.handleUpdateCourse} handleClose={this.handleClose}/>
						}
						{
							this.state.showAddCategoryDialog &&
							<CourseSubCard handleAddCategory={this.handleAddCategory} courseID={this.props.course.CourseID} openDialog = {this.state.showAddCategoryDialog}  handleClose={this.handleClose}/>
						}
				</Card>
				<Dialog
          actions={deleteDialogActions}
          modal={false}
          open={this.state.showDeleteDialog}
          onRequestClose={this.closeDeleteDialog}
        >
        	Are you sure you want to delete this course?
        </Dialog>
			</div>
		)
	}
}