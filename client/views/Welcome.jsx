import React from 'react';
import PropTypes from 'prop-types';
import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import Footer from './Footer.jsx';
import Login from '../components/login/index.jsx';
import {Card, CardMedia} from 'material-ui/Card';

const styles = {
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

export default class Welcome extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			open: false
		}
		// this.openLoginPage = this.openLoginPage.bind(this);
		this.handleOpen = this.handleOpen.bind(this);
		this.handleClose = this.handleClose.bind(this);
	}

	handleOpen() {
    this.setState({open: true});
  };

  handleClose() {
    this.setState({open: false});
  };
	// openLoginPage() {
	// 	this.context.router.push('/login')
	// }
	render() {
		const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.handleClose}
      />,
      <FlatButton
        label="Submit"
        primary={true}
        onTouchTap={this.handleClose}
      />,
    ];
		return(
			<div>
				<AppBar
	        title="Prakriya"
	        showMenuIconButton={false}
	        iconElementRight={<FlatButton label="Login" onClick={this.handleOpen} />}
		    />
		    <div style={styles.body}>
		    	<Dialog
	          contentStyle={styles.customContent}
	          open={this.state.open}
          	onRequestClose={this.handleClose}
	        >
	        <Login />
	        </Dialog>
					<h1>Welcome To Prakriya</h1>
					<Card style={{maxWidth: '650px', margin: 'auto'}} >
						<CardMedia style={{maxWidth: '600px', margin: 'auto'}} >
							<img src='../assets/images/home.png' alt='Home' />
						</CardMedia>
					</Card>
					<p style={styles.brief}>
						<em>It is a Wave Automation Tool</em>
					</p>
				</div>
				<Footer />
			</div>
		)
	}

}

Welcome.contextTypes = {
  router: PropTypes.object.isRequired
};
