import React from 'react';
import Dialog from 'material-ui/Dialog';
import dialog from '../../styles/dialog.json';
import SessionCard from './SessionCard.jsx';

export default class Schedule extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showDialog: false
    }

  }

	componentWillReceiveProps(nextProps) {
		this.setState({showDialog: nextProps.openDialog});
	}

  render() {
    let th = this
		let title = `${th.props.courseID} - Schedule`
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
							this.props.sessions.map(function(session, key) {
								return (<SessionCard
									bgColor={th.props.bgColor}
									bgIcon={th.props.bgIcon}
									session={session}
									key={key}/>)
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
