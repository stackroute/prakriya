import React from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import Avatar from 'material-ui/Avatar';
import IconButton from 'material-ui/IconButton';
import Moment from 'moment';
import EditIcon from 'material-ui/svg-icons/editor/mode-edit';
import DeleteIcon from 'material-ui/svg-icons/action/delete';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';

const styles = {
    dialog: {
      textAlign: 'center'
    }
};

export default class CourseCard extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			open: false,
			AssessmentName: '',
			AssessmentMentor: '',
			AssessmentDuration: '',
			AssessmentVideos: '',
			AssessmentBlogs: '',
			AssementDocs: '',
			showDeleteDialog: false,
		}
		this.handleOpen = this.handleOpen.bind(this);
	  this.handleClose = this.handleClose.bind(this);
	  this.handleSubmit = this.handleSubmit.bind(this);
		this.handleUpdate = this.handleUpdate.bind(this);
		this.resetFields = this.resetFields.bind(this);
		this.onChangeAssessmentName = this.onChangeAssessmentName.bind(this);
		this.onChangeAssessmentMentor = this.onChangeAssessmentMentor.bind(this);
		this.onChangeAssessmentDuration = this.onChangeAssessmentDuration.bind(this);
		this.onChangeAssessmentVideos = this.onChangeAssessmentVideos.bind(this);
		this.onChangeAssessmentBlogs = this.onChangeAssessmentBlogs.bind(this);
		this.onChangeAssessmentDocs = this.onChangeAssessmentDocs.bind(this);
		this.openDeleteDialog = this.openDeleteDialog.bind(this);
		this.closeDeleteDialog = this.closeDeleteDialog.bind(this);
		this.handleDeleteCategory = this.handleDeleteCategory.bind(this);
	}
	componentDidMount() {
		if(this.props.openDialog) {
			this.setState({
				open: true,
				})
		}
	}
	handleOpen() {
    this.setState({open: true});
  };

  handleClose() {
    this.setState({open: false});
    this.props.handleClose();
  };
  resetFields() {
		this.setState({name: '',
			username: '',
			email: '',
			password: '',
			cpassword: '',
			role: ''
		});
	}

	handleSubmit() {
		console.log('here1')
		let th = this;
		let category = {};
		category.CourseID = this.props.courseID;
		category.Name = this.state.AssessmentName;
		category.Mentor= this.state.AssessmentMentor;
		category.Duration= this.state.AssessmentDuration;
		category.Videos= this.state.AssessmentVideos;
		category.Blogs= this.state.AssessmentBlogs;
		category.Docs= this.state.AssessmentDocs;
		this.resetFields();
		this.props.handleAddCategory(category);
	}

	handleUpdate() {
		let th = this
		let user = {}
		user.name = this.state.name
		user.username = this.state.username
		user.email = this.state.email
		user.password = this.state.password
		user.role = this.state.role
		this.resetFields();
		this.props.handleUpdate(user);

	}

	onChangeAssessmentName(e) {
		this.setState({
			AssessmentName: e.target.value
		})
	}

	onChangeAssessmentMentor(e) {
		this.setState({
			AssessmentMentor: e.target.value
		})
	}

	onChangeAssessmentDuration(e) {
		this.setState({
			AssessmentDuration: e.target.value
		})
	}

	onChangeAssessmentVideos(e) {
		this.setState({
			AssessmentVideos: e.target.value
		})
	}

	onChangeAssessmentBlogs(e) {
		this.setState({
			AssessmentBlogs: e.target.value
		})
	}

	onChangeAssessmentDocs(e) {
		this.setState({
			AssessmentDocs: e.target.value
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

	handleDeleteCategory() {
		let category = this.props.category;
		category.CourseID = this.props.courseID;
		this.props.deleteCategory(this.props.category);
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
        onClick={this.handleDeleteCategory}
      />,
    ];
		const style = {
			fontFamily: 'sans-serif',
			margin: 'auto',
			width: '500px'
		}
		let dialogTitle
		if(this.props.openDialog) {
			dialogTitle = "Add Category"
		}
		else {
			dialogTitle = "Edit Category"
		}
		let submitButton
		if(this.props.openDialog) {
			submitButton = <RaisedButton
						    	 		label="Add Category"
						    	   	primary={true}
						    			onClick={this.handleSubmit}
						    	 	/>
		}
		else {
			submitButton = <RaisedButton
						    	 		label="Update Category"
						    	   	primary={true}
						    			onClick={this.handleUpdate}
						    	 	/>
		}
		if(this.props.openDialog)
		{
			return(
				<Dialog style={styles.dialog}
          title={dialogTitle}
          modal={false}
          open={this.state.open}
          autoScrollBodyContent={true}
          onRequestClose={this.handleClose}
        >
        	<TextField
						    		hintText="Category Name"
						    		floatingLabelText="Assessment Category Name"
						    		value={this.state.AssessmentName}
						    		onChange={this.onChangeAssessmentName}
					/>
					<br/>
		    	<TextField
		    		hintText="Mentor Name"
		    		floatingLabelText="Assessment Mentor"
		    		value={this.state.AssessmentMentor}
		    		onChange={this.onChangeAssessmentMentor}
		    	/>
					<br/>
		    	<TextField
						    		hintText="Duration"
						    		floatingLabelText="Assessment Duration"
						    		value={this.state.AssessmentDuration}
						    		onChange={this.onChangeAssessmentDuration}
					/>
					<br/>
					<TextField
						    		hintText="Assessment videos"
						    		floatingLabelText="Assessment Videos"
						    		value={this.state.AssessmentVideos}
						    		onChange={this.onChangeAssessmentVideos}
					/>
					<br/>
					<TextField
						    		hintText="assessment blogs"
						    		floatingLabelText="Assessment Blogs"
						    		value={this.state.AssessmentBlogs}
						    		onChange={this.onChangeAssessmentBlogs}
					/>
					<br/>
					<TextField
						    		hintText="assessment docs"
						    		floatingLabelText="Assessment Docs"
						    		value={this.state.AssessmentDocs}
						    		onChange={this.onChangeAssessmentDocs}
					/>
					
				    			<div>
				    				{submitButton}
				    				&emsp;
					    			<RaisedButton
						    	 		label="Cancel"
						    	   	primary={true}
						    			onTouchTap={this.handleClose}
						    	 	/>
				    			</div>

        </Dialog>
        )
		}
		return (
			<div>
				<Card>
					<CardHeader
			      title={this.props.category.Name}
			      subtitle={this.props.category.Duration}
			      avatar={
			      	<Avatar>
			      		{this.props.category.Name.charAt(0).toUpperCase()}
			      	</Avatar>
			      }
			      actAsExpander={true}
      			showExpandableButton={true} >
      				<IconButton tooltip="Delete category" style={{marginRight:'25px'}}  onClick={this.openDeleteDialog}>
					      <DeleteIcon/>
					    </IconButton>
					 </CardHeader>
			    <CardText expandable={true}>
			    		<h3>Blogs:</h3>
					    {
					    	this.props.category.Blogs.map(function(Blog,index) {
					    	return (<p>{Blog}</p>)
					    })
					    }
					    <h3>Videos:</h3>
					    {
					    	this.props.category.Videos.map(function(Video,index) {
					    	return (<p>{Video}</p>)
					    })
					    }
					    <h3>Docs:</h3>
					    {
					    	this.props.category.Docs.map(function(Doc,index) {
					    	return (<p>{Doc}</p>)
					    })
					    }
					    <h3>Mentors:</h3>
					    {
					    	this.props.category.Mentor.map(function(mentors,index) {
					    	return (<p>{mentors}</p>)
					    })	
					    	}
			    </CardText>
				</Card>
				<Dialog
          actions={deleteDialogActions}
          modal={false}
          open={this.state.showDeleteDialog}
          onRequestClose={this.closeDeleteDialog}
        >
        	Are you sure you want to delete this category?
        </Dialog>
			</div>
		)
	}
}
