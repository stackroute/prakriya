import React from 'react';
import Dialog from 'material-ui/Dialog';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import app from '../../styles/app.json';
import dialog from '../../styles/dialog.json';
import CloseIcon from 'material-ui/svg-icons/content/remove-circle-outline';

export default class CourseColumns extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentColumn: 'Feedback',
      feedbackFields: ['', '', ''],
      feedbackFieldsError: ['', '', ''],
      addFeedbackFieldDisabled: true
    };
    this.handleBack = this.handleBack.bind(this);
    this.handleContinue = this.handleContinue.bind(this);
    this.onChangeField = this.onChangeField.bind(this);
    this.addFeedbackField = this.addFeedbackField.bind(this);
    this.deleteFeedbackField = this.deleteFeedbackField.bind(this);
    this.validationSuccess = this.validationSuccess.bind(this);
  }

  onChangeField(e, index) {
    let th = this;
    let feedbackFields = this.state.feedbackFields;
    let feedbackFieldsError = this.state.feedbackFieldsError;
    feedbackFieldsError.map(function(ffError, indeX) {
      feedbackFieldsError[indeX] = '';
    });
    feedbackFields[index] = e.target.value;
    if(index == feedbackFields.length-1) {
      if(e.target.value.trim().length == 0) {
        th.setState({
          addFeedbackFieldDisabled: true
        });
      } else {
        th.setState({
          addFeedbackFieldDisabled: false
        });
      }
    }
    this.setState({
      feedbackFields: feedbackFields,
      feedbackFieldsError: feedbackFieldsError
    });
  }

  handleBack() {
    this.props.onClose();
  }

  handleContinue() {
    let th = this;
    if(this.validationSuccess()) {
      let obj = {
        FeedbackFields: th.state.feedbackFields
      };
      this.props.onConfirmCourseAddition(obj);
    }
  }

  addFeedbackField() {
    let feedbackFields = this.state.feedbackFields;
    let feedbackFieldsError = this.state.feedbackFieldsError;
    feedbackFields.push('');
    feedbackFieldsError.push('');
    this.setState({
      feedbackFields: feedbackFields,
      feedbackFieldsError: feedbackFieldsError,
      addFeedbackFieldDisabled: true
    });
  }

  deleteFeedbackField(index) {
    console.log('deleteFeedbackField...');
    let feedbackFields = this.state.feedbackFields;
    feedbackFields.splice(index, 1);
    this.setState({
      feedbackFields: feedbackFields
    });
  }

  validationSuccess() {
    let validationFailed = false;
    let feedbackFieldsError = this.state.feedbackFieldsError;
    let feedbackFields = this.state.feedbackFields;
    feedbackFields.some(function(feedbackField, index) {
      if(feedbackField.trim().length == 0) {
        feedbackFieldsError[index] = 'This field cannot be empty.';
        validationFailed = true;
        return true;
      }
    });
    this.setState({
      feedbackFieldsError: feedbackFieldsError
    });
    console.log('validationFailed: ', validationFailed);
    return !validationFailed;
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
              let closeIcon = index <= 2 ? '' :
              (<CloseIcon
                style={{position: 'absolute', right: 0, top: 35, width: 20, height: 20, zIndex: 1, cursor: 'pointer'}}
                onTouchTap={()=>th.deleteFeedbackField(index)}/>);
              return (
                <div style={{position: 'relative', display: 'inline-block', width: '100%'}}  key={index}>
    							  {closeIcon}
                    <TextField
                      style={{width: '100%'}}
                      hintText={hintText}
                      floatingLabelText={floatingLabelText}
                      floatingLabelStyle={app.mandatoryField}
                      value={th.state.feedbackFields[index]}
                      onChange={(e)=>{th.onChangeField(e, index)}}
                      errorText={th.state.feedbackFieldsError[index]}/>
                </div>
              )
            })
          }
          </div>
          <FlatButton
            label="Add One More Field"
            primary
            disabled={this.state.addFeedbackFieldDisabled}
            onClick={this.addFeedbackField} />
        </Dialog>
      </div>
    )
  }
}
