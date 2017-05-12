import React from 'react';
import Header from './Header.jsx';
import Footer from './Footer.jsx';

const styles = {
  container: {
		position: 'relative',
	  height: 'auto !important',
	},
	body: {
		fontFamily: 'sans-serif',
		marginTop: 100,
		minHeight: 450
	}
};

export default class App extends React.Component {

  render() {
		return (
			<div style={styles.container} >
				<Header username={this.props.user.username}/>
				<div style={styles.body} >
					{this.props.children}
				</div>
				<Footer />
			</div>
		)
	}

}
