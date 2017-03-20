import React from 'react';
import Request from 'superagent';
import {Grid, Row, Col} from 'react-flexbox-grid';
import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';
import AddUser from './AddUser.jsx';
import UserList from './UserList.jsx';

const styles = {
	heading: {
		textAlign: 'center'
	},	
	card: {
		margin: '10px 10px',
		height: 'auto'
	}
}

const style = {
  height: 100,
  width: 100,
  margin: 20,
  textAlign: 'center',
  display: 'inline-block',
};



export default class Users extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			users: []
		}
	}
	componentDidMount() {
		let th = this;
		Request
			.get('/admin/users')
			.set({'Authorization': localStorage.getItem('token')})			
			.end(function(err, res){
		    if(err)
		    	console.log(err);
		    else
		    	th.setState({
		    		users: res.body
		    	}) 
		    	console.log("Users");
		    	console.log(th.state.users);
			    
		    	
		    // th.context.router.push('/app')
		  });
	}
	render() {
		return (
			<div >
				<AddUser />
				<h1 style={styles.heading}>User Management</h1>
				<Grid>
					<Row>
					<Col  md={4}>
						<Paper style={style} zDepth={1}>
							<FlatButton label="ADD" />
						</Paper>
					</Col>
					{
						this.state.users.map(function (user, index) {
							return(
								<Col md={4} key={index}>
									 
										<UserList style={styles.card} currUser={user} />
									
								</Col>
								
							)
						})
					}
					</Row>
				</Grid>
			</div>
		);
	}
}