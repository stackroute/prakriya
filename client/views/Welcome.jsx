import React from 'react';
import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import Footer from './Footer.jsx';
import Login from '../components/login/index.jsx';
import {Card, CardMedia} from 'material-ui/Card';

const briefStyle = {
	marginTop: '70px',
	fontSize: '16px'
}
const bodyStyle = {
	textAlign: 'center',
	fontFamily: 'sans-serif'
}
const customContentStyle = {
  width: '400px',
  maxWidth: 'none',
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
  	console.log('Remove dialog')
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
		    <div style={bodyStyle}>
		    	<Dialog
	          title="Log In to Continue"
	          contentStyle={customContentStyle}
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
					<p style={briefStyle}>
						<em>It is a Wave Automation Tool</em>
					</p>
				</div>
				<Footer />
			</div>
		)
	}

}

Welcome.contextTypes = {
  router: React.PropTypes.object.isRequired
};