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
import AddIcon from 'material-ui/svg-icons/content/add';
import RemoveIcon from 'material-ui/svg-icons/content/remove';

const styles = {
    dialog: {
      textAlign: 'center'
    },
    link: {
      wordWrap: 'break-word'
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
			AssessmentVideos: [''],
			VideoUrl: '',
			AssessmentBlogs: [''],
			BlogUrl: '',
			AssessmentDocs: [''],
			DocUrl: '',
			showDeleteDialog: false,
		}
		this.handleOpen = this.handleOpen.bind(this);
	  this.handleClose = this.handleClose.bind(this);
	  this.handleSubmit = this.handleSubmit.bind(this);
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
		this.onChangeAddVideo = this.onChangeAddVideo.bind(this);
		this.onChangeRemoveVideo = this.onChangeRemoveVideo.bind(this);
		this.pushVideo = this.pushVideo.bind(this);
		this.onChangeAddBlog = this.onChangeAddBlog.bind(this);
		this.onChangeRemoveBlog = this.onChangeRemoveBlog.bind(this);
		this.pushBlog = this.pushBlog.bind(this);
		this.onChangeAddDoc = this.onChangeAddDoc.bind(this);
		this.onChangeRemoveDoc = this.onChangeRemoveDoc.bind(this);
		this.pushDoc = this.pushDoc.bind(this);

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
		this.pushVideo();
		this.pushBlog();
		this.pushDoc();
		let th = this;
		let course = {};
		course.CourseID = this.props.courseID;
		let category = {};
		category.Name = this.state.AssessmentName;
		category.Mentor= this.state.AssessmentMentor;
		category.Duration= this.state.AssessmentDuration;
		category.Videos= this.state.AssessmentVideos;
		category.Blogs= this.state.AssessmentBlogs;
		category.Docs= this.state.AssessmentDocs;
		course.Categories = category;
		course.History = '';
		this.resetFields();
		this.props.handleAddCategory(course);
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

	onChangeAssessmentVideos(e, prevValue) {
		let prevArray = this.state.AssessmentVideos;
		if(prevArray.indexOf(prevValue)>-1) {
			let newVideoArray = prevArray;
			let index = prevArray.indexOf(prevValue);
			newVideoArray[index] = e.target.value;
			this.setState({
				AssessmentVideos: newVideoArray
			})
		} else {
			this.setState({
				VideoUrl: e.target.value
			})
		}
	}

	onChangeAssessmentBlogs(e, prevValue) {
		let prevArray = this.state.AssessmentBlogs;
		if(prevArray.indexOf(prevValue)>-1) {
			let newBlogArray = prevArray;
			let index = prevArray.indexOf(prevValue);
			newBlogArray[index] = e.target.value;
			this.setState({
				AssessmentBlogs: newBlogArray
			})
		} else {
			this.setState({
				BlogUrl: e.target.value
			})
		}
	}
	onChangeAssessmentDocs(e, prevValue) {
		let prevArray = this.state.AssessmentDocs;
		if(prevArray.indexOf(prevValue)>-1) {
			let newDocArray = prevArray;
			let index = prevArray.indexOf(prevValue);
			newDocArray[index] = e.target.value;
			this.setState({
				AssessmentDocs: newDocArray
			})
		} else {
			this.setState({
				DocUrl: e.target.value
			})
		}
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
		let course = {};
		let category = this.props.category;
		course.CourseID = this.props.courseID;
		course.Categories = category;
		course.History = '';
		this.props.deleteCategory(course);
	}

	pushVideo() {
		if(this.state.VideoUrl !== '')
		{
			let video = this.state.AssessmentVideos;
			video.push(this.state.VideoUrl);
			this.setState({
				AssessmentVideos: video,
				VideoUrl: ''
			})
		}
	}

	pushDoc() {
		if(this.state.DocUrl !== '')
		{
			let doc = this.state.AssessmentDocs;
			doc.push(this.state.DocUrl);
			this.setState({
				AssessmentDocs: doc,
				DocUrl: ''
			})
		}
	}

	pushBlog() {
		if(this.state.BlogUrl !== '')
		{
			let blog = this.state.AssessmentBlogs;
			blog.push(this.state.BlogUrl);
			this.setState({
				AssessmentBlogs: blog,
				BlogUrl: ''
			})
		}
	}

	onChangeAddVideo() {
		this.pushVideo();
		let a = this.state.AssessmentVideos;
		a = a.concat('');
		this.setState({
			AssessmentVideos: a
		})
	}

	onChangeAddBlog() {
		this.pushBlog();
		let a = this.state.AssessmentBlogs;
		a = a.concat('');
		this.setState({
			AssessmentBlogs: a
		})
	}

	onChangeAddDoc() {
		this.pushDoc();
		let a = this.state.AssessmentDocs;
		a = a.concat('');
		this.setState({
			AssessmentDocs: a
		})
	}

	onChangeRemoveVideo(id) {
		let value = this.state.AssessmentVideos[id];
		let th = this;
		let a = this.state.AssessmentVideos;
		a.splice(id,1);
		this.pushVideo();
		 this.setState({
      AssessmentVideos: a
    })
	}
	
	onChangeRemoveBlog(id) {
		let value = this.state.AssessmentBlogs[id];
		let th = this;
		let a = this.state.AssessmentBlogs;
		a.splice(id,1);
		this.pushBlog();
		 this.setState({
      AssessmentBlogs: a
    })
	}
		
	onChangeRemoveDoc(id) {
		let value = this.state.AssessmentDocs[id];
		let th = this;
		let a = this.state.AssessmentDocs;
		a.splice(id,1);
		this.pushDoc();
		 this.setState({
      AssessmentDocs: a
    })
	}
			
	render() {
		let text = '';
		let th = this;
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
						    		floatingLabelText="Category Name"
						    		value={this.state.AssessmentName}
						    		onChange={this.onChangeAssessmentName}
					/>
					<br/>
		    	<TextField
		    		hintText="Mentor Name"
		    		floatingLabelText="Mentor"
		    		value={this.state.AssessmentMentor}
		    		onChange={this.onChangeAssessmentMentor}
		    	/>
					<br/>
		    	<TextField
						    		hintText="Duration"
						    		floatingLabelText="Duration"
						    		value={this.state.AssessmentDuration}
						    		onChange={this.onChangeAssessmentDuration}
					/>
					<br/>
					{th.state.AssessmentVideos.map(function(video,index){
						text = "Videos #"+index;
						return (
						<div>
						<TextField
						    		hintText="videos"
						    		floatingLabelText= {text}
						    		value={video}
						    		onChange={(event) => th.onChangeAssessmentVideos(
						    				event, 
						    				video
						    			)}
						/>
						<IconButton tooltip="Remove video" onClick={th.onChangeRemoveVideo.bind(th,index)}>
			      <RemoveIcon/>
			    </IconButton>
						</div>)				  	
					})}
					<IconButton tooltip="Add video" onClick={this.onChangeAddVideo} disabled={this.state.disableSave}>
			      <AddIcon/>
			    </IconButton>

					<br/>
					{th.state.AssessmentBlogs.map(function(blog,index){
						text = "Blogs #"+index;
						return (
						<div>
						<TextField
						    		hintText="blogs"
						    		floatingLabelText= {text}
						    		value={blog}
						    		onChange={(event) => th.onChangeAssessmentBlogs(
						    				event, 
						    				blog
						    			)}
						/>
						<IconButton tooltip="Remove blog" onClick={th.onChangeRemoveBlog.bind(th,index)}>
			      <RemoveIcon/>
			    </IconButton>
						</div>)				  	
					})}
					<IconButton tooltip="Add blog" onClick={this.onChangeAddBlog} disabled={this.state.disableSave}>
			      <AddIcon/>
			    </IconButton>
					<br/>
					{th.state.AssessmentDocs.map(function(doc,index){
						text = "Document #"+index;
						return (
						<div>
						<TextField
						    		hintText="document"
						    		floatingLabelText= {text}
						    		value={doc}
						    		onChange={(event) => th.onChangeAssessmentDocs(
						    				event, 
						    				doc
						    			)}
						/>
						<IconButton tooltip="Add assessment" onClick={th.onChangeRemoveDoc.bind(th,index)}>
			      <RemoveIcon/>
			    </IconButton>
						</div>)				  	
					})}
					<IconButton tooltip="Add assessment" onClick={this.onChangeAddDoc} disabled={this.state.disableSave}>
			      <AddIcon/>
			    </IconButton>
					<br/>
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
      				<IconButton tooltip="Delete category" style={{marginLeft:'-80px'}}  onClick={this.openDeleteDialog}>
					      <DeleteIcon/>
					    </IconButton>
					 </CardHeader>
			    <CardText expandable={true}>
			    		<h3>Blogs:</h3>
					    {
					    	this.props.category.Blogs.map(function(Blog,index) {
					    		return (<div>{index+1} . <a href={Blog} target="_blank" style={styles.link}>{Blog}</a></div>)
					    })
					    }
					    <h3>Videos:</h3>
					    {
					    	this.props.category.Videos.map(function(Video,index) {
					    	return (<div>{index+1} . <a href={Video} target="_blank" style={styles.link}>{Video}</a></div>)
					    })
					    }
					    <h3>Docs:</h3>
					    {
					    	this.props.category.Docs.map(function(Doc,index) {
					    	return (<div>{index+1} . <a href={Doc} target="_blank" style={styles.link}>{Doc}</a></div>)
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
