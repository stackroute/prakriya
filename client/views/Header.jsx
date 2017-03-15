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
import Request from 'superagent';

export default class Header extends React.Component {

	constructor(props) {
		super(props) 
		this.state = {
			openDrawer: false,
			actionMenu: '',
			actions: [],
			routes: []
		}
		this.logout = this.logout.bind(this);
		this.getActions = this.getActions.bind(this);
		this.handleDrawerToggle = this.handleDrawerToggle.bind(this);
		this.handleDrawerClose = this.handleDrawerClose.bind(this);
	}

	componentDidMount() {
		if(localStorage.getItem('token')) {
			this.getActions()
		}
	}
	getActions() {
		let th = this
		Request
			.get('/dashboard/getuser')
			.set({'Authorization': localStorage.getItem('token')})
			.end(function(err, res){
				let actions = res.body.actions;
				let routes = actions.map(function(item) {
					return item.replace(" ", "").toLowerCase()
				});
				th.setState({
					actions: actions,
					routes: routes
					// actionMenu: 
					// 	<Link to={routes[0]}>
			  //     	<MenuItem primaryText={actions[0]} onTouchTap={th.handleDrawerClose} />
		   //    	</Link>
				})
				console.log(th.state.actions)
			});
	}
	logout() {
		localStorage.removeItem('token')
		this.context.router.push('/')
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
		let th = this;
		const style = {
			marginLeft: '-8px',
			marginTop: '-8px'
		}
		return(
			<div>
				<Drawer
		      docked={false}
		      width={250}
		      open={this.state.openDrawer}
		      onRequestChange={(openDrawer) => this.setState({openDrawer})}>
		      {
		      	localStorage.getItem('token') && 
		      	this.state.actions.map(function(action, key) {
		      		return (
		      			<Link to={th.state.routes[key]} key={key} style={{textDecoration: 'none'}} >
					      	<MenuItem primaryText={action} onTouchTap={th.handleDrawerClose} />
				      	</Link>
				      )
		      	})
		      }
	      </Drawer>
				<AppBar
					style={style}
	        title="Prakriya"
	        onLeftIconButtonTouchTap={this.handleDrawerToggle}
	        iconElementRight={
	        	<IconMenu
					    iconButtonElement={
					      <IconButton><MoreVertIcon /></IconButton>
					    }
					    targetOrigin={{horizontal: 'right', vertical: 'top'}}
					    anchorOrigin={{horizontal: 'right', vertical: 'top'}}
					  >
					    <MenuItem primaryText="LOG OUT" onClick={this.logout} />
					  </IconMenu>}
	      />
      </div> 
		)
	}
}

Header.contextTypes = {
  router: React.PropTypes.object.isRequired
};