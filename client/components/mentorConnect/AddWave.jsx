import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';

const styles = {
	addButton: {
		position:'fixed',
	  bottom: 40,
	  right: 20,
	},
}

export default class AddWave extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			open: false
		}
		this.handleOpen = this.handleOpen.bind(this);
		this.handleClose = this.handleClose.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}
	handleOpen() {
		this.setState({
			open: true
		})
	}
	handleClose() {
		this.setState({
			open: false
		})
	}
	handleSubmit() {

	}

	render() {
		const dialogActions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.handleClose}
      />,
      <FlatButton
        label="Add"
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.handleClose}
        onClick={this.handleSubmit}
      />,
    ];
		return(
			<div>
				<Dialog
          title="Add a new Wave"
          actions={dialogActions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
          autoScrollBodyContent={true}
        >
        </Dialog>
				<FloatingActionButton mini={true} style={styles.addButton} onTouchTap={this.handleOpen} >
		      <ContentAdd />
		    </FloatingActionButton>
			</div>
		)
	}
}