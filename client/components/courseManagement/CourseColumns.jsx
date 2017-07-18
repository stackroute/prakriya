import React from 'react';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import Dialog from 'material-ui/Dialog';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import app from '../../styles/app.json';
import dialog from '../../styles/dialog.json';
import Paper from 'material-ui/Paper';
import Chip from 'material-ui/Chip';

const styles = {
  paper: {
    margin: '5px',
    padding: '5px',
    width: 'auto',
    height: '120px',
    borderRadius: '2px'
  },
  wrapper: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  chip: {
    margin: '4px',
    background: '#eee'
  }
}

export default class CourseColumns extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showDialog: false,
      fields: ['', '', '', '', '', ''],
      fieldsError: ['', '', '', '', '', '']
    }

    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.onChangeField = this.onChangeField.bind(this);
    this.handleAdd = this.handleAdd.bind(this);
    this.validationSuccess = this.validationSuccess.bind(this);
  }

  componentWillMount() {
    // if (this.props.openDialog) {
    //   this.setState({
    //     showDialog: true,
    //     Name: this.props.course.Name,
    //     Mode: this.props.course.Mode,
    //     Duration: this.props.course.Duration.low,
    //     Skills: this.props.course.Skills
    //   })
    // }
  }

  onChangeField(e, index) {
    let fieldsError = ['', '', '', '', '', ''];
    let fields = this.state.fields;
    fields[index] = e.target.value;
    this.setState({
      fields: fields,
      fieldsError: fieldsError
    });
  }

  handleOpen() {
    this.setState({showDialog: true})
  }

  handleClose(e, action) {
    if(action == 'CLOSE') {
      this.props.onClose();
    } else if(action == 'CONTINUE') {
      this.handleAdd();
    }
  }

  handleAdd() {
    let th = this;
    console.log('handleAdd: courseColumns')
    if(this.validationSuccess()) {
      console.log('state: ', this.state)
    }
  }

  validationSuccess() {
    let fieldsError = this.state.fieldsError;
    if (this.state.fields[0].length == 0) {
      fieldsError[0] = 'This field cannot be empty.';
    } else if (this.state.fields[1].length == 0) {
      fieldsError[1] = 'This field cannot be empty.';
    } else if (this.state.fields[2].length == 0) {
      fieldsError[2] = 'This field cannot be empty.';
    } else {
      return true;
    }
    this.setState({
      fieldsError: fieldsError
    });
    return false;
  }

  render() {
    let th = this;
    let actions, title;
    actions = [
      <FlatButton
        label="Back" onTouchTap={(e) => this.handleClose(e, 'CLOSE')}
        style={dialog.actionButton} />,
      <FlatButton
        label="Continue" onTouchTap={(e) => this.handleClose(e, 'CONTINUE')}
        style={dialog.actionButton} />
    ]
    title = 'COURSE COLUMNS -- ' + this.props.columnTitle.toUpperCase() + ' FIELDS';

    return (
      <div>
        <Dialog
          bodyStyle={dialog.body}
          title={title}
          titleStyle={dialog.title}
          actionsContainerStyle={dialog.actionsContainer}
          open={this.props.open}
          autoScrollBodyContent={true}
          onRequestClose={() => this.handleClose('CLOSE')}
          actions={actions}>
          <div>
          {
            th.state.fields.map(function(field, index) {
              let hintText = th.props.columnTitle + ' Field ' + (index + 1);
              let floatingLabelText = index > 2 ? hintText : hintText + ' *';
              let floatingLabelStyle = index > 2 ? {} : app.mandatoryField;
              return (
                <div style={dialog.box100} key={index}>
                  <TextField
                    style={{width: '100%'}}
                    hintText={hintText}
                    floatingLabelText={floatingLabelText}
                    floatingLabelStyle={floatingLabelStyle}
                    value={th.state.fields[index]}
                    onChange={(e)=>{th.onChangeField(e, index)}}
                    errorText={th.state.fieldsError[index]}/>
                </div>
              )
            })
          }
          </div>
        </Dialog>
      </div>
    )
  }
}
