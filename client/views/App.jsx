import React from 'react';
import Header from './Header.jsx';
import Footer from './Footer.jsx';

export default class App extends React.Component {

	render() {
		return (
			<div>
				<Header />
				{this.props.children}
				<Footer />
			</div>
		)
	}

}