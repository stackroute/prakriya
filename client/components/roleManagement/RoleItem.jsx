import React from 'react';
import Request from 'superagent';
import {Card, CardText, CardHeader, CardActions} from 'material-ui/Card';
import Chip from 'material-ui/Chip';
import Avatar from 'material-ui/Avatar';
import Paper from 'material-ui/Paper';
import {Grid, Row, Col} from 'react-flexbox-grid';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import AddIcon from 'material-ui/svg-icons/content/add';
import SaveIcon from 'material-ui/svg-icons/content/save';
import DeleteIcon from 'material-ui/svg-icons/action/delete';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import AutoComplete from 'material-ui/AutoComplete';
import Snackbar from 'material-ui/Snackbar';
import dialog from '../../styles/dialog.json';

const styles = {
	avatar: {
		margin: '3px 10px'
	},
	card: {
		// background: '#f5f5f5',
	},
	paper: {
		margin: '5px',
		padding: '5px',
		width: 'auto',
		height: '120px',
		borderRadius: '2px'
	},
	wrapper: {
    display: 'flex',
    flexWrap: 'wrap',
  },
	chip: {
    margin: '4px',
    background: '#eee'
  },
  chipName: {
  	// fontSize: '12px'
  },
  deleteIcon: {
  	float: 'right',
  	cursor: 'pointer',
  	color: '#999'
  },
  cardActions: {
  	textAlign: 'right'
  },
  cardText: {
  	paddingTop: 0
  }
}

export default class RoleItem extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			controls: [],
			controlsList: [],
			searchPerm: '',
			lastModified: '',
			showDeleteDialog: false,
			showAddMoreDialog: false,
			disableSave: true,
			openSnackBar: false,
			snackBarMsg: ''
		}
		this.handleControlDelete = this.handleControlDelete.bind(this);
		this.handleUpdateInputPerm = this.handleUpdateInputPerm.bind(this);
		this.handleAddNewPerm = this.handleAddNewPerm.bind(this);
		this.savePerms = this.savePerms.bind(this);
		this.openDeleteDialog = this.openDeleteDialog.bind(this);
		this.closeDeleteDialog = this.closeDeleteDialog.bind(this);
		this.handleDeleteRole = this.handleDeleteRole.bind(this);
		this.handleSnackBarClose = this.handleSnackBarClose.bind(this);
	}
	componentWillMount() {
		let th = this;
		let date = new Date(this.props.roleperm.lastModified);
		date = date.toString();
		let formatDate =
			"Last modified: " +
			date.substr(8,2) + " " +
			date.substr(4,3) + " " +
			date.substr(11,4);
		let controls = [];
		let controlsList = [];
		this.props.controls.map(function (control, key) {
			controlsList.push(control.name);
			if(th.props.roleperm.controls.indexOf(control.code) >= 0)
				controls.push(control.name);
		})
		this.setState({
			lastModified: formatDate,
			controls: controls,
			controlsList: controlsList
		})
	}
	handleControlDelete(perm) {
		let controls = this.state.controls.filter(function(control) {
			return perm != control
		})
		this.setState({
			controls: controls,
			disableSave: false
		})
	}
	handleUpdateInputPerm(searchPerm) {
		this.setState({
			searchPerm: searchPerm
		})
	}
	handleAddNewPerm() {
		let perms = this.state.controls
		perms.push(this.state.searchPerm)
		this.setState({
			controls: perms,
			searchPerm: '',
			disableSave: false
		})
	}
	savePerms() {
		let th = this;
		let controlsCode = [];
		this.props.controls.map(function (control, key) {
			if(th.state.controls.indexOf(control.name) >= 0)
				controlsCode.push(control.code);
		})
		let roleObj = {
			name: this.props.roleperm.name,
			controls: controlsCode
		}
		this.setState({
			disableSave: true,
			snackBarMsg: "Changes applied to the role",
			openSnackBar: true
		})
		this.props.savePermissions(roleObj)
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
	handleDeleteRole() {
		this.setState({
			snackBarMsg: "Role deleted",
			openSnackBar: true
		})
		this.props.deleteRole(this.props.roleperm.name)
	}
	handleSnackBarClose() {
		this.setState({openSnackBar: false})
	}
	componentWillReceiveProps(nextProps) {
		let controls = [];
		let controlsList = [];
		let th = this;
		this.props.controls.map(function (control, key) {
			controlsList.push(control.name);
			if(nextProps.roleperm.controls.indexOf(control.code) >= 0)
				controls.push(control.name);
		})
		this.setState({
			controls: controls,
		})
	}

	render() {
		let th = this;
		let role = this.props.roleperm.name.charAt(0).toUpperCase() + this.props.roleperm.name.slice(1)
		const deleteDialogActions = [
      <FlatButton
        label='Not sure. May be later'
        onTouchTap={this.closeDeleteDialog}
				style={dialog.actionButton}
      />,
      <FlatButton
        label='Delete'
        onTouchTap={this.closeDeleteDialog}
        onClick={this.handleDeleteRole}
				style={dialog.actionButton}
      />,
    ];
		return (
			<div>
				<Card style={styles.card} >
					<CardHeader
			      title={role}
			      subtitle={this.state.lastModified}
			      avatar={
			      	<Avatar>
			      		{this.props.roleperm.name.charAt(0).toUpperCase()}
			      	</Avatar>
			     	}
			    >
			    	<DeleteIcon style={styles.deleteIcon} onClick={this.openDeleteDialog} />
			    </CardHeader>
			    <CardText style={styles.cardText} >
						<AutoComplete
				      floatingLabelText="Add more permissions..."
				      filter={AutoComplete.fuzzyFilter}
				      searchText={this.state.searchPerm}
		          onUpdateInput={this.handleUpdateInputPerm}
		          onNewRequest={this.handleAddNewPerm}
				      dataSource={this.state.controlsList}
				      maxSearchResults={5}
				    />
			    	<Paper style={styles.paper} zDepth={1} >
							<div style={styles.wrapper}>
								{
									this.state.controls.map(function (control, index) {
										return(
											<Chip
												onRequestDelete={() => th.handleControlDelete(control)}
							          style={styles.chip}
							          key={index}
							        >
							          <span style={styles.chipName}>{control}</span>
							        </Chip>
						        )
									})
								}
							</div>
						</Paper>
			    </CardText>
			    <CardActions style={styles.cardActions}>
			    	<FlatButton
			    		label="Apply"
			    		primary={true}
			    		disabled={this.state.disableSave}
			    		icon={<SaveIcon />}
			    		onClick={this.savePerms}
			    	/>
			    </CardActions>
			  </Card>
			  <Snackbar
          open={this.state.openSnackBar}
          message={this.state.snackBarMsg}
          autoHideDuration={4000}
          onRequestClose={this.handleSnackBarClose}
        />
			  <Dialog
					bodyStyle={dialog.confirmBox}
					actionsContainerStyle={dialog.actionsContainer}
          actions={deleteDialogActions}
          modal={false}
          open={this.state.showDeleteDialog}
          onRequestClose={this.closeDeleteDialog}
        >
        	Are you sure? You want to delete this role?
        </Dialog>
			</div>
		);
	}
}
