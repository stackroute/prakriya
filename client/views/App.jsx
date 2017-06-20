import React from 'react';
import Header from './Header.jsx';
import Footer from './Footer.jsx';

const styles = {
	container: {
		minHeight: '100%',
		position: 'relative'
	},
	body: {
		fontFamily: 'sans-serif',
		marginTop: 65,
	}
};

export default class App extends React.Component {

  render() {
		return (
			<div style={styles.container}>
				<Header user={this.props.user}/>
				<div style={styles.body} >
					{this.props.children}
				</div>
			</div>
		)
	}

}
