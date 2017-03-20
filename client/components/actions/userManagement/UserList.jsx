import React from 'react';
import Request from 'superagent';
import { Grid, Row, Col } from 'react-flexbox-grid/lib/index';
import {Card, CardActions, CardTitle, CardText} from 'material-ui/Card';
import IconButton from 'material-ui/IconButton';
import {grey400, darkBlack, lightBlack} from 'material-ui/styles/colors'; 
import Avatar from 'material-ui/Avatar';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import EditIcon from 'material-ui/svg-icons/editor/mode-edit';
import DeleteIcon from 'material-ui/svg-icons/navigation/cancel';



// let allUsers = [];
// const iconButtonElement = (
// 	<div>
		
// 				<IconButton tooltip="edit" tooltipPosition="bottom-left">
// 			    <EditIcon color={grey400} />
// 			  </IconButton>
// 			  <IconButton tooltip="delete" tooltipPosition="bottom-left">
// 					<DeleteIcon color={grey400} />
// 			  </IconButton>
			
		
// 	</div>
  
  
// );

// const actionButtons = (
//   <Grid>
//   	<Row between="md">
//   		<Col xs={6} md={6} >  			
//     		<EditIcon />
//   		</Col>
//     	<Col xs={6} md={6} >
//     		<DeleteIcon />
//     	</Col>
//     </Row>
    
//   </Grid>
// );

export default class UserList extends React.Component {
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
			<div>
				<Card style={{width:'80%', margin:'auto' }}>
					<Grid>
						<Row middle="md">
							<Subheader>Available Users</Subheader>
						</Row>
						
							
								<List>
						      
						      {this.state.users.map( (user, index) => (
						      	<Row between="md" key={index}>
						      		<Col md={6}>
								      	<ListItem 
								      	key={index}								      				      	
								        primaryText={user.name}
								        leftAvatar={<Avatar src="../../../assets/images/avt-default.jpg" />}								        				        
								      	/>
								      </Col>	
								      <Col md={2} mdOffset={4}>	
								      	<IconButton tooltip="delete" tooltipPosition="bottom-left">
													<DeleteIcon color={grey400} />
											  </IconButton>	
							      	</Col>
							      </Row>			              
				          ))}				      
						    </List>
							
							
						
							
														
							
						
					</Grid>
					
				</Card>	
				
			</div>
		);
	}
}