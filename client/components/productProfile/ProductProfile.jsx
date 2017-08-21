import React from 'react';
import Request from 'superagent';

export default class ProductProfile extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			version: null
		}

		this.getProductVersion = this.getProductVersion.bind(this);
	}

	componentWillMount() {
		this.getProductVersion();
	}

	getProductVersion() {
		let th = this;
		Request
			.get('/dashboard/version/' + th.props.routeParams.name)
			.set({'Authorization': localStorage.getItem('token')})
			.end(function(err, res) {
				if(err) {
					console.log(err);
				} else {
					th.setState({version: res.body.version});
		    }
		  });
	}

	render() {
		let th = this;
		return (
			<div>
				<h3>
					<center>{th.props.routeParams.name.toUpperCase()}</center>
				</h3>
				<br />
			</div>
		);
	}
}
