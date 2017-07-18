import React from 'react';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import Dialog from 'material-ui/Dialog';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import app from '../../styles/app.json';
import dialog from '../../styles/dialog.json';

export default class CourseColumns extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentColumn: 'Feedback',
      feedbackFields: ['', '', '', '', '', ''],
      feedbackFieldsError: ['', '', '', '', '', ''],
      evaluationFields: ['', '', '', '', '', ''],
      evaluationFieldsError: ['', '', '', '', '', '']
    }

    this.handleBack = this.handleBack.bind(this);
    this.handleContinue = this.handleContinue.bind(this);
    this.onChangeField = this.onChangeField.bind(this);
    this.validationSuccess = this.validationSuccess.bind(this);
  }

  onChangeField(e, index) {
    let th = this;
    let type = this.state.currentColumn;
    let fieldsError = ['', '', '', '', '', ''];
    if(type == 'Feedback') {
      let fields = this.state.feedbackFields;
      fields[index] = e.target.value;
      this.setState({
        feedbackFields: fields,
        feedbackFieldsError: fieldsError
      });
    } else if(type == 'Evaluations') {
      let fields = this.state.evaluationFields;
      fields[index] = e.target.value;
      this.setState({
        evaluationFields: fields,
        evaluationFieldsError: fieldsError
      });
    }
  }

  handleBack() {
    let type = this.state.currentColumn;
    if(type == 'Feedback') {
      this.props.onClose();
    } else if(type == 'Evaluations') {
      this.setState({
        currentColumn: 'Feedback'
      });
    }
  }

  handleContinue() {
    let type = this.state.currentColumn;
    if(this.validationSuccess()) {
      if(type == 'Feedback') {
        this.setState({
          currentColumn: 'Evaluations'
        });
      } else if(type == 'Evaluations') {

      }
    }
  }

  validationSuccess() {
    let type = this.state.currentColumn;
    if(type == 'Feedback') {
      let fieldsError = this.state.feedbackFieldsError;
      if (this.state.feedbackFields[0].length == 0) {
        fieldsError[0] = 'This field cannot be empty.';
      } else if (this.state.feedbackFields[1].length == 0) {
        fieldsError[1] = 'This field cannot be empty.';
      } else if (this.state.feedbackFields[2].length == 0) {
        fieldsError[2] = 'This field cannot be empty.';
      } else {
        return true;
      }
      this.setState({
        feedbackFieldsError: fieldsError
      });
    } else if(type == 'Evaluations') {
      let fieldsError = this.state.evaluationFieldsError;
      if (this.state.evaluationFields[0].length == 0) {
        fieldsError[0] = 'This field cannot be empty.';
      } else if (this.state.evaluationFields[1].length == 0) {
        fieldsError[1] = 'This field cannot be empty.';
      } else if (this.state.evaluationFields[2].length == 0) {
        fieldsError[2] = 'This field cannot be empty.';
      } else {
        return true;
      }
      this.setState({
        evaluationFieldsError: fieldsError
      });
    }
    return false;
  }

  render() {
    let th = this;
    let actions, title;
    actions = [
      <FlatButton
        label="Back" onTouchTap={this.handleBack}
        style={dialog.actionButton} />,
      <FlatButton
        label="Continue" onTouchTap={this.handleContinue}
        style={dialog.actionButton} />
    ]
    title = 'COURSE COLUMNS -- ' + this.state.currentColumn.toUpperCase() + ' FIELDS';

    return (
      <div>
        <Dialog
          bodyStyle={dialog.body}
          title={title}
          titleStyle={dialog.title}
          actionsContainerStyle={dialog.actionsContainer}
          open={this.props.open && this.state.currentColumn == 'Feedback'}
          autoScrollBodyContent={true}
          actions={actions}>
          <div>
          {
            th.state.feedbackFields.map(function(field, index) {
              let hintText = th.state.currentColumn + ' Field ' + (index + 1);
              let floatingLabelText = index > 2 ? hintText : hintText + ' *';
              let floatingLabelStyle = index > 2 ? {} : app.mandatoryField;
              return (
                <div style={dialog.box100} key={index}>
                  <TextField
                    style={{width: '100%'}}
                    hintText={hintText}
                    floatingLabelText={floatingLabelText}
                    floatingLabelStyle={floatingLabelStyle}
                    value={th.state.feedbackFields[index]}
                    onChange={(e)=>{th.onChangeField(e, index)}}
                    errorText={th.state.feedbackFieldsError[index]}/>
                </div>
              )
            })
          }
          </div>
        </Dialog>

        <Dialog
          bodyStyle={dialog.body}
          title={title}
          titleStyle={dialog.title}
          actionsContainerStyle={dialog.actionsContainer}
          open={this.props.open && this.state.currentColumn == 'Evaluations'}
          autoScrollBodyContent={true}
          actions={actions}>
          <div>
          {
            th.state.evaluationFields.map(function(field, index) {
              let hintText = th.state.currentColumn + ' Field ' + (index + 1);
              let floatingLabelText = index > 2 ? hintText : hintText + ' *';
              let floatingLabelStyle = index > 2 ? {} : app.mandatoryField;
              return (
                <div style={dialog.box100} key={index}>
                  <TextField
                    style={{width: '100%'}}
                    hintText={hintText}
                    floatingLabelText={floatingLabelText}
                    floatingLabelStyle={floatingLabelStyle}
                    value={th.state.evaluationFields[index]}
                    onChange={(e)=>{th.onChangeField(e, index)}}
                    errorText={th.state.evaluationFieldsError[index]}/>
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
