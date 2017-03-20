import React from 'react';
import Header from './Header.jsx';
import Footer from './Footer.jsx';

export default class App extends React.Component {

	render() {
		const bodyStyle = {
			fontFamily: 'sans-serif',
			marginBottom: '40px'
		}
		return (
			<div>
				<Header />
				<div style={bodyStyle}>
					{this.props.children}
				</div>
				<Footer />
			</div>
		)
	}

}