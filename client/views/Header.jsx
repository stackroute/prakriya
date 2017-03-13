import React from 'react';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import FlatButton from 'material-ui/FlatButton';
import MenuItem from 'material-ui/MenuItem';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import {Link} from 'react-router';

export default class Header extends React.Component {

	constructor(props) {
		super(props) 
		this.state = {
			loginStatus: false
		}
		this.openLoginPage = this.openLoginPage.bind(this);
	}

	openLoginPage() {
		this.context.router.push('/login')
	}

	render() {
		let rightMenu
		if(window.loginStatus) {
			rightMenu = 
				<IconMenu
			    iconButtonElement={
			      <IconButton><MoreVertIcon /></IconButton>
			    }
			    targetOrigin={{horizontal: 'right', vertical: 'top'}}
			    anchorOrigin={{horizontal: 'right', vertical: 'top'}}
			  >
			    <MenuItem primaryText="LOG OUT" onClick={console.log('logout clicked')} />
			  </IconMenu>
		}
		else {
			rightMenu = <FlatButton label="Login" onClick={this.openLoginPage} />
		}
		const style = {
			marginLeft: -8,
			marginTop: -8
		}
		return(
			<div>
				<AppBar
					style={style}
	        title="Prakriya"
	        showMenuIconButton={false} 
	        iconElementRight={rightMenu}
	      />
	    </div>  
		)
	}
}

Header.contextTypes = {
  router: React.PropTypes.object.isRequired
};