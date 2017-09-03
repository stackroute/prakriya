import React from 'react';
import Header from './Header.jsx';
import Footer from './Footer.jsx';

const styles = {
	container: {
		minHeight: '100%',
		backgroundColor: '#F0F8FF'
	},
	body: {
		fontFamily: 'sans-serif',
		height: '100%',
		marginTop: 50,
		paddingTop: 20,
		backgroundColor: '#F0F8FF'
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
