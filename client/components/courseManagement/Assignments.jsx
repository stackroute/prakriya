import React from 'react';
import Dialog from 'material-ui/Dialog';
import dialog from '../../styles/dialog.json';
import AssignmentCard from './AssignmentCard.jsx';

export default class Assignments extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showDialog: false
    }
    this.delete = this.delete.bind(this);
}

	componentWillReceiveProps(nextProps) {
		this.setState({showDialog: nextProps.openDialog});
	}

  delete(obj,type) {
    this.props.delete(obj,type);
    this.props.closeDialog();
  }

  render() {
    let th = this
		let title = `${th.props.courseID} - Assignments`
    return (
      <div>
        <Dialog
					bodyStyle={dialog.body}
					title={title}
					titleStyle={dialog.title}
					actionsContainerStyle={dialog.actionsContainer}
					open={this.state.showDialog}
					modal={false}
					autoScrollBodyContent={true}
					onRequestClose={this.props.closeDialog}>

          <div>
            <div style={dialog.box100}>
						{
							this.props.assignments.map(function(assignment, key) {
								return (<AssignmentCard
									bgColor={th.props.bgColor}
									bgIcon={th.props.bgIcon}
									assignment={assignment}
									key={key} delete={th.delete}/>)
							})
						}
            </div>
          </div>
					<div>
            <div style={dialog.box100}>
              {/* pagination area */}
            </div>
          </div>
        </Dialog>
      </div>
    )
  }
}
