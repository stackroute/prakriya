import React from 'react';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import FlatButton from 'material-ui/FlatButton';
import MenuItem from 'material-ui/MenuItem';
import Drawer from 'material-ui/Drawer';
import {Card, CardHeader, CardMedia, CardTitle} from 'material-ui/Card';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import {Link} from 'react-router';
import Request from 'superagent';

const styles = {
  title: {
    cursor: 'pointer',
  },
  header: {
			zIndex: 2,
			fontFamily: 'sans-serif',
			backgroundColor: 'rgb(0, 188, 212)',
			color: '#fff',
			position: 'fixed',
			left: 0,
			top: 0,
	    height: '40px',
	    width: '100%',
		}
};

export default class Header extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			openDrawer: false,
			actionMenu: '',
			actions: [],
			routes: [],
      user: {
        name: '',
        username: ''
      }
		}
		this.logout = this.logout.bind(this);
		this.getActions = this.getActions.bind(this);
		this.handleDrawerToggle = this.handleDrawerToggle.bind(this);
		this.handleDrawerClose = this.handleDrawerClose.bind(this);
		this.openDashboard = this.openDashboard.bind(this);
    this.setIndexRoute = this.setIndexRoute.bind(this);
	}

	componentDidMount() {
		if(localStorage.getItem('token')) {
			this.getActions()
		}
	}
	getActions() {
		let th = this
		Request
			.get('/dashboard/user')
			.set({'Authorization': localStorage.getItem('token')})
			.end(function(err, res){

				let actions = res.body.actions;
				let routes = actions.map(function(item) {
					return item.replace(/\s/g,'').toLowerCase()
				});
				th.setState({
					actions: actions,
					routes: routes,
          user: {
            name: res.body.name,
            username: res.body.username
          }
				})
        if(th.state.actions.length > 0) th.setIndexRoute(th.state.actions[0].toLowerCase().replace(/\s/g,''))
				console.log(th.state.actions)
			});
	}
  setIndexRoute(indexRoute) {
    this.context.router.push(indexRoute)
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
	openDashboard() {
		// this.context.router.push('/app')
	}
	render() {
		let th = this
		return(
			<div style={styles.header}>
				<Drawer
		      docked={false}
		      width={250}
		      open={this.state.openDrawer}
		      onRequestChange={(openDrawer) => this.setState({openDrawer})}
          >
          <Card>
             <CardMedia
              overlay={
                <CardHeader
                  subtitle={this.state.user.username}
                  title={this.state.user.name}
					        avatar="../assets/images/avt-default.jpg"
					      />
              }
             >
                 <img src="./assets/images/drawer_top.jpg" style={{width: '100%'}}/>
             </CardMedia>
          </Card>
		      {
		      	localStorage.getItem('token') &&
		      	this.state.actions.map(function(action, key) {
		      		return (
		      			<Link to={th.state.routes[key]} key={key} style={{textDecoration: 'none'}} >
					      	<MenuItem
                    primaryText={action}
                    onTouchTap={th.handleDrawerClose}
                   />
				      	</Link>
				      )
		      	})
		      }
	      </Drawer>
				<AppBar
	        title={<span style={styles.title}>Prakriya</span>}
	        onTitleTouchTap={this.openDashboard}
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
