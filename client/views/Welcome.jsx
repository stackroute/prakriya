import React from 'react';
import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import Footer from './Footer.jsx';
import Login from '../components/login/index.jsx';

const briefStyle = {
	marginTop: '50px',
	fontSize: '14px'
}
const appBarStyle = {
	marginLeft: '-8px',
	marginTop: '-8px'
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
					style={appBarStyle}
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
					<img src='../assets/images/home.png' alt='Home' />
					<p style={briefStyle}>
						It is a Wave Automation Tool<br/>
						Supporting, generating and disseminating timely and accurate information on business operations at StackRoute.
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