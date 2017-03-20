import React from 'react';
import Request from 'superagent';
import {Card, CardText, CardHeader} from 'material-ui/Card';
import Chip from 'material-ui/Chip';
import Avatar from 'material-ui/Avatar';
import Paper from 'material-ui/Paper';
import {Grid, Row, Col} from 'react-flexbox-grid';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import SvgIcon from 'material-ui/svg-icons/content/add';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

const styles = {
	avatar: {
		margin: '3px 10px'
	},
	card: {
		background: '#eeeeee'
	},
	paper: {
		margin: '5px',
		padding: '5px',
		width: 'auto',
		height: '120px'
	},
	wrapper: {
    display: 'flex',
    flexWrap: 'wrap',
  },
	chip: {
    margin: '4px',
  },
  chipAdd: {
  	margin: '4px',
  	marginBottom: '0px'
  }
}

export default class RoleItem extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			permissions: [],
			showDeleteDialog: false,
			showAddMoreDialog: false
		}
		this.handlePermissionDelete = this.handlePermissionDelete.bind(this);
		this.openDeleteDialog = this.openDeleteDialog.bind(this);
		this.closeDeleteDialog = this.closeDeleteDialog.bind(this);
		this.handleDeleteRole = this.handleDeleteRole.bind(this);
		this.openAddMoreDialog = this.openAddMoreDialog.bind(this);
		this.closeAddMoreDialog = this.closeAddMoreDialog.bind(this);
		this.handleAddMore = this.handleAddMore.bind(this);
	}
	componentDidMount() {
		this.setState({
			permissions: this.props.roleperm.permissions
		})
	} 
	handlePermissionDelete(data) {
		console.log(data)
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
	openAddMoreDialog() {

		this.setState({
			showAddMoreDialog: true
		})
	}
	closeAddMoreDialog() {
		this.setState({
			showAddMoreDialog: false
		})
	}
	handleDeleteRole() {
		this.props.deleteRole(this.props.roleperm.role)
	}
	handleAddMore() {

	}

	render() {
		let th = this;
		let role = this.props.roleperm.role.charAt(0).toUpperCase() + this.props.roleperm.role.slice(1)
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
        onClick={this.handleDeleteRole}
      />,
    ];
    const addMoreActions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.closeAddMoreDialog}
      />,
      <FlatButton
        label="Save"
        primary={true}
        onTouchTap={this.closeAddMoreDialog}
        onClick={this.handleAddMore}
      />,
    ];
		return (
			<div>
				<Card style={styles.card} >
					<Grid>
						<Row middle="md">
							<Col md={2}>
								<CardText>
									<Avatar style={styles.avatar}>{this.props.roleperm.role.charAt(0).toUpperCase()}</Avatar>
									{role}
								</CardText>
							</Col>
							<Col md={5} mdOffset={1}>
								<Paper style={styles.paper} zDepth={1} >
									<div style={styles.wrapper}>
										{
											this.state.permissions.map(function (permission, index) {
												return(
													<Chip
														onRequestDelete={() => th.handlePermissionDelete(permission)}
									          style={styles.chip}
									          key={index}
									        >
									          {permission}
									        </Chip>
								        )
											})
										}
									</div>
								</Paper>
							</Col>
							<Col md={1}>
								<Chip
									onTouchTap={this.openAddMoreDialog}
				          style={styles.chip}
				        >
				        	<Avatar icon={<SvgIcon />} />
				        	Add More
				        </Chip>
							</Col>
							<Col md={1} mdOffset={2}>
								<IconMenu
							    iconButtonElement={
							      <IconButton><MoreVertIcon /></IconButton>
							    }
							    targetOrigin={{horizontal: 'right', vertical: 'top'}}
							    anchorOrigin={{horizontal: 'right', vertical: 'top'}}
							  >
							    <MenuItem primaryText="Edit" />
							    <MenuItem primaryText="Delete" onClick={this.openDeleteDialog} />
							  </IconMenu>
							</Col>
						</Row>
					</Grid>
			  </Card>
			  <Dialog
          actions={deleteDialogActions}
          modal={false}
          open={this.state.showDeleteDialog}
          onRequestClose={this.closeDeleteDialog}
        >
        	Are you sure you want to delete this role?
        </Dialog>
        <Dialog
        	title="Add some more permissions"
          actions={addMoreActions}
          modal={false}
          open={this.state.showAddMoreDialog}
          onRequestClose={this.closeAddMoreDialog}
        >

        </Dialog>
			</div>
		);
	}
}