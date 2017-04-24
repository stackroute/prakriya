import React from 'react';
import Header from './Header.jsx';
import Footer from './Footer.jsx';

const styles = {
  container: {
		position: 'relative',
	  height: 'auto !important',
	  minHeight: '100%'
	},
	body: {
		fontFamily: 'sans-serif',
		marginTop: '100px'
	}
};

export default class App extends React.Component {

  render() {
		return (
			<div style={styles.container} >
				<Header />
				<div style={styles.body} >
					{this.props.children}
				</div>
				<Footer />
			</div>
		)
	}

}
