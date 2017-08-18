import React from 'react';
import Paper from 'material-ui/Paper';
import Request from 'superagent';

const styles = {
	paper: {
		padding: '10px'
	}
};

export default class ProductProfile extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			product: {},
			versionIndex: 0
		}

		this.getProduct = this.getProduct.bind(this);
	}

	componentWillMount() {
		this.getProduct();
	}

	getProduct() {
		let th = this;
		Request
			.get('/dashboard/project/' + th.props.routeParams.name)
			.set({'Authorization': localStorage.getItem('token')})
			.end(function(err, res) {
				if(err)
		    	console.log(err);
		    else {
					console.log('Product: ', res.body)
					th.setState(res.body);
		    }
		  });
	}

	render() {
		return (
			<div>
				<Paper style={styles.paper}>
					<center>ProductName: {this.props.routeParams.name}</center>
				</Paper>
			</div>
		);
	}
}
