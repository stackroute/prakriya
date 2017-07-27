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
		this.state = {
			file_type: ''
		}
		this.handleDrop = this.handleDrop.bind(this);
	}
	componentWillMount() {
		this.setState({
			file_type: this.props.type
		})
	}
	componentWillReceiveProps(nextProps) {
		this.setState({
			file_type: nextProps.type
		})
	}

	handleDrop(accepted, rejected) {
		this.props.handleDrop(accepted, rejected, this.state.file_type)
	}

	render() {
		return(
			<div>
				<Dropzone 
					style={styles.dropzone} 
					onDrop={this.handleDrop}
				>
					<div>Drop your {this.state.file_type} file</div>
				</Dropzone>
			</div>
		)
	}
}