import React from 'react';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import FlatButton from 'material-ui/FlatButton';
import MenuItem from 'material-ui/MenuItem';
import Drawer from 'material-ui/Drawer';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import {Link} from 'react-router';

export default class Header extends React.Component {

	constructor(props) {
		super(props) 
		this.state = {
			loginStatus: false,
			openDrawer: false
		}
		this.openLoginPage = this.openLoginPage.bind(this);
		this.handleDrawerToggle = this.handleDrawerToggle.bind(this);
		this.handleDrawerClose = this.handleDrawerClose.bind(this);
	}

	openLoginPage() {
		this.context.router.push('/login')
	}

	handleDrawerToggle() {
		this.setState({
			openDrawer: !this.state.openDrawer
		})
	}
	handleDrawerClose() {
		this.setState({
			openDrawer: false
		})
	}
	render() {
		const style = {
			marginLeft: -8,
			marginTop: -8
		}
		let rightMenu, header
		if(localStorage.getItem('token')) {
			rightMenu = 
				<IconMenu
			    iconButtonElement={
			      <IconButton><MoreVertIcon /></IconButton>
			    }
			    targetOrigin={{horizontal: 'right', vertical: 'top'}}
			    anchorOrigin={{horizontal: 'right', vertical: 'top'}}
			  >
			    <MenuItem primaryText="LOG OUT" />
			  </IconMenu>

			header = 
				<div>
					<Drawer
			      docked={false}
			      width={250}
			      open={this.state.openDrawer}
			      onRequestChange={(openDrawer) => this.setState({openDrawer})}>
			      <Link to='/adduser'>
				      <MenuItem onTouchTap={this.handleDrawerClose}>
					      <FlatButton label='add user' hoverColor= '#e8f1fb' labelStyle={{textAlign: 'left'}}
					      style = {{fontSize: '50px', marginTop: '4px'}}/>
				      </MenuItem>
			      </Link>
		      </Drawer>
					<AppBar
						style={style}
		        title="Prakriya"
		        onLeftIconButtonTouchTap={this.handleDrawerToggle}
		        iconElementRight={rightMenu}
		      />
	      </div>

		}
		else {
			rightMenu = <FlatButton label="Login" onClick={this.openLoginPage} />

			header = 
				<AppBar
					style={style}
	        title="Prakriya"
	        showMenuIconButton={false}
	        iconElementRight={rightMenu}
	      />
		}
		return(
			<div>
				{header}
	    </div>  
		)
	}
}

Header.contextTypes = {
  router: React.PropTypes.object.isRequired
};