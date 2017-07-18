import React from 'react';
import Dropzone from 'react-dropzone';

const styles = {
	dropzone: {
		background: '#eee',
		height: '70px',
		borderStyle: 'dashed',
		paddingTop: '25px',
		textAlign: 'center',
		boxSizing: 'border-box'
	}
}

export default class FileDrop extends React.Component {
	constructor(props) {
		super(props);
		this.handleDrop = this.handleDrop.bind(this);
	}

	handleDrop(accepted, rejected) {
		this.props.handleDrop(accepted, rejected, this.props.type)
	}

	render() {
		return(
			<div>
				<Dropzone 
					style={styles.dropzone} 
					onDrop={this.handleDrop}
				>
					<div>Drop your {this.props.type} file</div>
				</Dropzone>
			</div>
		)
	}
}