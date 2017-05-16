import React from 'react';
import PropTypes from 'prop-types';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import FlatButton from 'material-ui/FlatButton';
import MenuItem from 'material-ui/MenuItem';
import Drawer from 'material-ui/Drawer';
import {Card, CardHeader, CardMedia, CardTitle} from 'material-ui/Card';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import Badge from 'material-ui/Badge';
import Dialog from 'material-ui/Dialog';
import NotificationsIcon from 'material-ui/svg-icons/social/notifications';
import LogoutIcon from 'material-ui/svg-icons/action/exit-to-app';
import ChangePasswordIcon from 'material-ui/svg-icons/action/lock';
import ActionAccountCircle from 'material-ui/svg-icons/action/account-circle';
import ChangePassword from '../components/changePassword/index.jsx';
import {List, ListItem} from 'material-ui/List';
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
		},
    userMenu: {
      backgroundColor: 'rgba(0, 188, 212, 0.10)',
      width: '100%'
    },
    badge: {
      width: '20px',
      height: '20px',
      backgroundColor: '#990000',
      color: '#ffffff',
      top: '5px',
      right: '5px'
    },
    brief: {
  		marginTop: '70px',
  		fontSize: '16px'
  	},
  	body: {
  		textAlign: 'center',
  		fontFamily: 'sans-serif'
  	},
  	customContent: {
  	  width: '400px',
  	  maxWidth: 'none'
  	}
};

export default class Header extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
      openDialog: false,
			openDrawer: false,
			actionMenu: '',
			actions: [],
			routes: [],
      user: {
        name: '',
        username: ''
      },
      notificationCount: 0
		}
		this.logout = this.logout.bind(this);
    this.toggleChangePasswordDialog = this.toggleChangePasswordDialog.bind(this)
		this.getActions = this.getActions.bind(this);
		this.handleDrawerToggle = this.handleDrawerToggle.bind(this);
		this.handleDrawerClose = this.handleDrawerClose.bind(this);
		this.openDashboard = this.openDashboard.bind(this);
		this.handleClose = this.handleClose.bind(this);
	}

  componentWillMount() {
		if(localStorage.getItem('token')) {
			this.getActions()
		}
	}

  componentDidMount() {
    let th = this

    let socket = io()
		socket.on('show notification', function(data) {
			console.log('show notification event triggered: ', JSON.stringify(data))
			th.setState({
        notificationCount: th.state.notificationCount + 1
      })
		})
	}

	getActions() {
		let th = this
		Request
			.get('/dashboard/user')
			.set({'Authorization': localStorage.getItem('token')})
			.end(function(err, res){

				let actions = res.body.actions.sort();
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

	openDashboard() {
		this.context.router.push('/app')
	}

	handleClose() {
		this.setState({
			openDialog: !this.state.openDialog
		})
	}

  toggleChangePasswordDialog() {
    console.log('toggle changePassword: ', this.state.openDialog)
    this.setState({
      openDialog: !this.state.openDialog
    })
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
	        onTitleTouchTap={th.openDashboard}
	        onLeftIconButtonTouchTap={th.handleDrawerToggle}
	        iconElementRight={
            <div>
              <Badge
                badgeContent={th.state.notificationCount}
                badgeStyle={styles.badge}
                className={'badgeParentVisible'}
              >
                 <IconButton>
                   <NotificationsIcon />
                 </IconButton>
              </Badge>
  	        	<IconMenu
                menuStyle={styles.userMenu}
  					    iconButtonElement={
  					      <IconButton><ActionAccountCircle /></IconButton>
  					    }
  					    anchorOrigin={{horizontal: 'middle', vertical: 'bottom'}}
  					  >
                <List>
    					    <ListItem primaryText="Log Out" onClick={th.logout} leftIcon={<LogoutIcon />}/>
                  <ListItem primaryText="Change Password" onClick={th.toggleChangePasswordDialog}  leftIcon={<ChangePasswordIcon />}/>
                </List>
  					  </IconMenu>
            </div>
          }
	      />

        <Dialog
          contentStyle={styles.customContent}
          open={th.state.openDialog}
          onRequestClose={th.toggleChangePasswordDialog}
        >
          <ChangePassword username={this.props.username} handleClose={th.handleClose}/>
        </Dialog>
      </div>
		)
	}
}

Header.contextTypes = {
  router: PropTypes.object.isRequired
};
