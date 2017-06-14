import React from 'react';
import Request from 'superagent'
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import Avatar from 'material-ui/Avatar';
import Moment from 'moment';
import Dialog from 'material-ui/Dialog';
import IconButton from 'material-ui/IconButton';
import EditIcon from 'material-ui/svg-icons/editor/mode-edit';
import DeleteIcon from 'material-ui/svg-icons/action/delete';
import ProjectDialog from './ProjectDialog.jsx';
import FlatButton from 'material-ui/FlatButton';
import Cadets from './Cadets.jsx';
import {Grid, Row, Col} from 'react-flexbox-grid';
import ExpandIcon from 'material-ui/svg-icons/navigation/expand-more';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

const styles = {
    text: {
      wordWrap: 'break-word',
      textAlign: 'justify'
    },
    view: {
    	cursor: 'pointer',
    	textDecoration: 'underline',
    	color: 'blue'
    },
    dialog: {
      backgroundColor: '#DDDBF1',
  		borderBottom: '10px solid teal',
  		borderRight: '10px solid teal',
  		borderLeft: '10px solid teal'
    },
    dialogTitle: {
  		fontWeight: 'bold',
  		backgroundColor: 'teal',
  		color: '#DDDBF1',
  		textAlign: 'center'
  	},
		col: {
			marginBottom: 20,
			marginRight: -20,
			width:150
		},
		grid: {
			width: '100%'
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

};

export default class ProjectCard extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			dialog: false,
			openDialog: false,
			dialogOpen: false,
			showDeleteDialog: false,
      versionName:[],
      selectedVersion: '',
      selectedVersionIndex: 0,
			cadets: [],
      project: {}
		}
		this.formatDate = this.formatDate.bind(this);
		this.handleClose = this.handleClose.bind(this);
		this.handleOpen = this.handleOpen.bind(this);
		this.handleEditProject = this.handleEditProject.bind(this);
		this.handleUpdateProject = this.handleUpdateProject.bind(this);
		this.openDeleteDialog = this.openDeleteDialog.bind(this);
		this.closeDeleteDialog = this.closeDeleteDialog.bind(this);
		this.getCadets = this.getCadets.bind(this);
		this.handleDeleteProject = this.handleDeleteProject.bind(this);
    this.onVersionChange = this.onVersionChange.bind(this);
	}
  componentWillMount() {

    let versionName = [];
    this.props.project.version.map(function (x, i) {
			versionName.push(x.name);
		})
    this.setState({
      project: this.props.project,
      versionName: versionName
    })
    console.log('Version Names', versionName)
    console.log('ProjectObj from props', this.props.project);
  }

	getCadets(name) {
		let th = this;
		Request
			.post('/dashboard/cadetsofproj')
			.set({'Authorization': localStorage.getItem('token')})
			.send({name:name})
			.end(function(err, res) {
				if(err)
		    	console.log(err);
		    else {
		    	console.log('Successfully fetched all cadets', res.body)
		    	th.setState({
		    		cadets: res.body,
		    		dialog: false,
		    		dialogOpen: true
		    	})
		    }
			})
	}


	formatDate(date) {
		return Moment(date).fromNow();
	}

	handleClose() {
		this.setState({
			dialogOpen: false,
			openDialog: false
		})
	}

	handleOpen() {
		this.setState({
			dialog: true
		})
	}

	handleEditProject() {
		this.setState({
			openDialog: true
		})
	}

	handleUpdateProject(project) {
		this.props.handleUpdate(project);
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

	handleDeleteProject() {
		this.props.handleDelete(this.props.project);
		this.closeDeleteDialog();
	}
  onVersionChange(index, value) {

    this.setState({
      selectedVersion: value,
      selectedVersionIndex: index
    })

    }

	render() {
    console.log(this.state.project.version[this.state.selectedVersionIndex].updated,"updated")
    let detail = '';
  		if(this.state.project.version[this.state.selectedVersionIndex].updated) {
			detail = this.state.project.version[this.state.selectedVersionIndex].addedBy + ' updated ' + this.formatDate(this.state.project.version[this.state.selectedVersionIndex].addedOn)
		} else {
			detail = this.state.project.version[this.state.selectedVersionIndex].addedBy + ' added ' + this.formatDate(this.state.project.version[this.state.selectedVersionIndex].addedOn)
		}
		const deleteDialogActions = [
      <FlatButton
        label='Cancel'
        style={styles.actionButton}
        onTouchTap={this.closeDeleteDialog}
      />,
      <FlatButton
        label='Delete'
        style={styles.actionButton}
        onClick={this.handleDeleteProject}
      />
    ]
    let bgColor = this.props.bgColor;
    let th = this
		return (
			<div>
				<Card
					style={{
						width:'370px',
						marginRight:'20px',
						marginBottom:'20px',
						background: bgColor
					}}
				>

					<CardHeader
			      title={this.props.project.product}
            subtitle={detail}
			      avatar={
			      	<Avatar>
			      		{this.props.project.product.charAt(0).toUpperCase()}
                </Avatar>
			      }/>
            <div>
              <h3 style={{marginLeft:'15px',marginBottom:'-60px'}}>Version:</h3>
              <SelectField
  							floatingLabelText="Select Version"
  							value={th.state.selectedVersion}
                style={{marginLeft:'110px',width:'130'}}
                floatingLabelStyle={{color:'blue'}}
                underlineStyle={{display:'none'}}
                >
  							{
  								th.state.versionName.map(function(val, key) {
  									return <MenuItem key={key} value={val} primaryText={val} onTouchTap={(e)=>th.onVersionChange(key, val)}/>
  								})
  							}
  						</SelectField>
              </div>
          <CardText style={styles.text}>
            <h3>Description:</h3>{this.props.project.version[this.state.selectedVersionIndex].description}
			    	<h3>Tech Skills:</h3><ul>{this.props.project.version[this.state.selectedVersionIndex].skills.map(function(skill, index){
        		return <li key={index}>{skill}</li>
        		})}</ul>
			    	<h3>Developed By:</h3>{this.props.project.version[this.state.selectedVersionIndex].wave}
			    	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span onClick={this.handleOpen} style={styles.view}>view members</span>
			    	</CardText>
			    	<IconButton tooltip="Edit project" onClick={this.handleEditProject}>
				      <EditIcon/>
				    </IconButton>
				    <IconButton tooltip="Delete project" onClick={this.openDeleteDialog}>
				      <DeleteIcon/>
				    </IconButton>
				  	</Card>
				 {
				 		this.state.dialog &&
				 		th.getCadets(this.props.project.version[this.state.selectedVersionIndex].name)}
				 		<Dialog
                bodyStyle={styles.dialog}
			          title='TEAM MEMBERS'
			          titleStyle={styles.dialogTitle}
			          open={this.state.dialogOpen}
			          autoScrollBodyContent={true}
			          onRequestClose={this.handleClose}
        		>
		        <Grid style={styles.grid}><Row>
			       {
		          this.state.cadets.length > 0 ?
		            this.state.cadets.map(function(cadet, index){
		                return <Col xs={3} key={index} style={styles.col}><Cadets cadet={cadet}/></Col>
		            }) :
		          <div><br/>Team list has not been updated yet. Sorry for the inconvenience caused.</div>
		        }
		        </Row>
			      </Grid>
		        </Dialog>

        {
							this.state.openDialog &&
							<ProjectDialog project={this.props.project}  versionIndex={this.props.selectedVersionIndex} openDialog={this.state.openDialog} handleUpdate={this.handleUpdateProject} handleClose={this.handleClose} dialogTitle={'EDIT PRODUCT'}/>
				}
				<Dialog
					bodyStyle={styles.deleteDialog}
          actions={deleteDialogActions}
          modal={false}
          actionsContainerStyle={styles.actionsContainer}
          open={this.state.showDeleteDialog}
          onRequestClose={this.closeDeleteDialog}
        >
        	Are you sure you want to delete this project?
        </Dialog>
			</div>
		)
	}
}
