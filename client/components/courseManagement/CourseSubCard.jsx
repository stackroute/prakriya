import React from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import Avatar from 'material-ui/Avatar';
import IconButton from 'material-ui/IconButton';
import Moment from 'moment';
import EditIcon from 'material-ui/svg-icons/editor/mode-edit';
import DeleteIcon from 'material-ui/svg-icons/action/delete';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import AddIcon from 'material-ui/svg-icons/content/add-circle-outline';
import RemoveIcon from 'material-ui/svg-icons/content/remove-circle-outline';
import app from '../../styles/app.json';

const styles = {
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
  },
  link: {
      wordWrap: 'break-word'
  }
}

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

	componentWillMount() {
		if(this.props.openDialog) {
			this.setState({
					open: true,
				})
		}
	}

	handleOpen() {
    this.setState({open: true});
  }

  handleClose() {
    this.setState({open: false});
    this.props.handleClose();
  }

  resetFields() {
		this.setState({name: '',
			username: '',
			email: '',
			password: '',
			cpassword: '',
			role: ''
		})
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
        onTouchTap={this.closeDeleteDialog}
        style={styles.actionButton}
      />,
      <FlatButton
        label="Delete"
        onTouchTap={this.closeDeleteDialog}
        onClick={this.handleDeleteCategory}
        style={styles.actionButton}
      />
    ]
		const style = {
			fontFamily: 'sans-serif',
			margin: 'auto',
			width: '500px'
		}
    if(this.props.openDialog) {
      let title = "ADD CATEGORY"
  		let actions = [
        <FlatButton
          label="Cancel"
          style={styles.actionButton}
          onTouchTap={this.handleClose}
        />,
        <FlatButton
          label="Add Category"
          onClick={this.handleSubmit}
          style={styles.actionButton}
        />
      ]
			return(
				<Dialog
          bodyStyle={styles.dialog}
          title={title}
          titleStyle={styles.dialogTitle}
          modal={false}
          open={this.state.open}
          autoScrollBodyContent={true}
          onRequestClose={this.handleClose}
          actionsContainerStyle={styles.actionsContainer}
          actions={actions}
        >
          <div>
            <div style={{border: '2px solid white', width: '33%', display: 'inline-block', boxSizing: 'border-box', padding: '5px'}}>
            	<TextField
    						    		hintText="Category Name"
    						    		floatingLabelText="Category Name *"
                        floatingLabelStyle={app.mandatoryField}
          			    		value={this.state.AssessmentName}
    						    		onChange={this.onChangeAssessmentName}
    					/>
					  </div>
            <div style={{border: '2px solid white', width: '34%', display: 'inline-block', boxSizing: 'border-box', padding: '5px'}}>
              <TextField
    						    		hintText="Duration"
    						    		floatingLabelText="Duration *"
                        floatingLabelStyle={app.mandatoryField}
          			    		value={this.state.AssessmentDuration}
    						    		onChange={this.onChangeAssessmentDuration}
    					/>
            </div>
            <div style={{border: '2px solid white', width: '33%', display: 'inline-block', boxSizing: 'border-box', padding: '5px'}}>
              <TextField
    		    		hintText="Mentor Name"
    		    		floatingLabelText="Mentor *"
                floatingLabelStyle={app.mandatoryField}
  			    		value={this.state.AssessmentMentor}
    		    		onChange={this.onChangeAssessmentMentor}
    		    	/>
            </div>
          </div>
          <div>
            <div style={{border: '2px solid white', width: '33%', display: 'inline-block', boxSizing: 'border-box', padding: '5px'}}>
              <div style={{backgroundColor: '#49AAAA', textAlign: 'center'}}>
                  <span>Videos</span>
                  <IconButton
                    tooltip="Add Video"
                    onClick={this.onChangeAddVideo}
                    disabled={this.state.disableSave}
                    >
                    <AddIcon/>
                  </IconButton>
              </div>
              <div>
              {
                th.state.AssessmentVideos.map(function(video,index){
                  text = "Video #"+(index + 1);
                  return (
                    <div style={{backgroundColor: '#DDDBF1', border: '2px solid #49AAAA', textAlign: 'center'}}>
                      <TextField
                        hintText="videos"
                        floatingLabelText= {text}
                        value={video}
                        onChange={(event) => th.onChangeAssessmentVideos(event, video)}
                        style={{display: 'inline-block', width: '80%'}}
                        />
                     <IconButton
                        tooltip="Remove Video"
                        onClick={th.onChangeRemoveVideo.bind(th,index)}
                        style={{display: 'inline-block', width: '20%'}}>
                        <RemoveIcon/>
                     </IconButton>
                   </div>
                  )}
                )
              }
              </div>
            </div>
            <div style={{border: '2px solid white', width: '34%', display: 'inline-block', boxSizing: 'border-box', padding: '5px'}}>
              <div style={{backgroundColor: '#49AAAA', textAlign: 'center'}}>
                <span>Blogs</span>
                <IconButton
                  tooltip="Add Blog"
                  onClick={this.onChangeAddBlog}
                  disabled={this.state.disableSave}
                  >
      			      <AddIcon/>
      			    </IconButton>
              </div>
              <div>
                {
                  th.state.AssessmentBlogs.map(function(blog,index){
                    text = "Blogs #"+(index + 1);
                    return (
                      <div style={{backgroundColor: '#DDDBF1', border: '2px solid #49AAAA', textAlign: 'center'}}>
                        <TextField
                          hintText="blogs"
                          floatingLabelText= {text}
                          value={blog}
                          onChange={(event) => th.onChangeAssessmentBlogs(event, blog)}
                          style={{display: 'inline-block', width: '80%'}}
                          />
                        <IconButton
                          tooltip="Remove blog"
                          onClick={th.onChangeRemoveBlog.bind(th,index)}
                          style={{display: 'inline-block', width: '20%'}}>
                          <RemoveIcon/>
                        </IconButton>
                     </div>
                   )
                 })
               }
              </div>
            </div>
            <div style={{border: '2px solid white', width: '33%', display: 'inline-block', boxSizing: 'border-box', padding: '5px'}}>
              <div  style={{backgroundColor: '#49AAAA', textAlign: 'center'}}>
                <span>Documents</span>
                <IconButton
                  tooltip="Add Assessment"
                  onClick={this.onChangeAddDoc}
                  disabled={this.state.disableSave}
                  >
      			      <AddIcon/>
      			    </IconButton>
              </div>
              <div>
                {
                  th.state.AssessmentDocs.map(function(doc,index){
                    text = "Document #"+(index + 1);
                    return (
                      <div style={{backgroundColor: '#DDDBF1', border: '2px solid #49AAAA', textAlign: 'center'}}>
                        <TextField
                          hintText="document"
                          floatingLabelText= {text}
                          value={doc}
                          onChange={(event) => th.onChangeAssessmentDocs(event, doc)}
                          style={{display: 'inline-block', width: '80%'}}
                          />
                        <IconButton
                          tooltip="Add Assessment"
                          onClick={th.onChangeRemoveDoc.bind(th,index)}
                          style={{display: 'inline-block', width: '20%'}}>
                          <RemoveIcon/>
                        </IconButton>
                      </div>
                    )
                  })
                }
              </div>
            </div>
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
			    		{
			    			this.props.category.Blogs.map(function(Blog,index) {
					    		if(Blog !== '')
					    		{
										if(index === 0)
										{
											return(<div><h3>Blogs:</h3>{index+1} . <a href={Blog} target="_blank" style={styles.link}>{Blog}</a></div>);
										}
										return (<div>{index+1} . <a href={Blog} target="_blank" style={styles.link}>{Blog}</a></div>)
									}
					    })
					    }
					    {
					    	this.props.category.Videos.map(function(Video,index) {
					    		if(Video !== '')
					    		{
										if(index === 0)
										{
											return (<div><h3>Videos:</h3>{index+1} . <a href={Video} target="_blank" style={styles.link}>{Video}</a></div>);
										}
										return (<div>{index+1} . <a href={Video} target="_blank" style={styles.link}>{Video}</a></div>)
									}
					    })
					    }
					    {
					    	this.props.category.Docs.map(function(Doc,index) {
					    		if(Doc !== '')
									{
										if(index === 0)
										{
											return (<div><h3>Docs:</h3>{index+1} . <a href={Doc} target="_blank" style={styles.link}>{Doc}</a></div>);
										}
										return (<div>{index+1} . <a href={Doc} target="_blank" style={styles.link}>{Doc}</a></div>)
					    		}
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
          bodyStyle={styles.deleteDialog}
          actionsContainerStyle={styles.actionsContainer}
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
