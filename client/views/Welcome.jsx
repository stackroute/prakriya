import React from 'react';
import PropTypes from 'prop-types';
import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import Footer from './Footer.jsx';
import Login from '../components/login/index.jsx';
import {Card, CardMedia} from 'material-ui/Card';

const styles = {
	container: {
		height: '100%',
		background: 'url("../assets/images/bg1.jpg")',
		color: '#bbb'
	},
	body: {
		marginTop: 70,
		textAlign: 'center',
		fontFamily: 'sans-serif'
	},
	login: {
		width: 400,
		margin: 'auto'
	}
};

export default class Welcome extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			open: false
		}
		this.handleOpen = this.handleOpen.bind(this);
		this.handleClose = this.handleClose.bind(this);
	}

	handleOpen() {
    this.setState({open: true});
  };

  handleClose() {
    this.setState({open: false});
  };
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
			<div style={styles.container}>
				<AppBar
	        title="Prakriya"
	        showMenuIconButton={false}
	        style={styles.appBar}
		    />
		    <div style={styles.body}>
					<div style={styles.login}>
						<Login />
					</div>
				</div>
			</div>
		)
	}

}

Welcome.contextTypes = {
  router: PropTypes.object.isRequired
};
