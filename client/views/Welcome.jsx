import React from 'react';
import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';
import Footer from './Footer.jsx';

export default class Welcome extends React.Component {

	constructor(props) {
		super(props)
		this.openLoginPage = this.openLoginPage.bind(this);
	}

	openLoginPage() {
		this.context.router.push('/login')
	}
	render() {
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
		return(
			<div>
				<AppBar
					style={appBarStyle}
	        title="Prakriya"
	        showMenuIconButton={false}
	        iconElementRight={<FlatButton label="Login" onClick={this.openLoginPage} />}
		    />
		    <div style={bodyStyle}>
					<h1>Welcome To Prakriya</h1>
					<img src='../assets/images/home.png' />
					<p style={briefStyle}>
						A Process management tool that uses a system of integrated applications to manage the business and automates functions related to administration and Operations.
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