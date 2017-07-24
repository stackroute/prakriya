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
      addFeedbackFieldDisabled: true,
      feedbackFields: ['', '', ''],
      feedbackFieldsError: ['', '', ''],
      evaluationFields: ['', '', '', '', '', ''],
      evaluationFieldsError: ['', '', '', '', '', '']
    }

    this.handleBack = this.handleBack.bind(this);
    this.handleContinue = this.handleContinue.bind(this);
    this.onChangeField = this.onChangeField.bind(this);
    this.addFeedbackField = this.addFeedbackField.bind(this);
    this.deleteFeedbackField = this.deleteFeedbackField.bind(this);
    this.validationSuccess = this.validationSuccess.bind(this);
  }

  onChangeField(e, index) {
    let th = this;
    let type = this.state.currentColumn;
    let addFeedbackFieldDisabled;
    if(type == 'Feedback') {
      let feedbackFields = this.state.feedbackFields;
      let feedbackFieldsError = this.state.feedbackFieldsError;
      feedbackFieldsError.map(function(ffError, indeX) {
        feedbackFieldsError[indeX] = '';
      });
      feedbackFields[index] = e.target.value;
      if(index == feedbackFields.length-1) {
        if(e.target.value.trim().length == 0) {
          addFeedbackFieldDisabled = true;
        } else {
          addFeedbackFieldDisabled = false;
        }
      }
      this.setState({
        feedbackFields: feedbackFields,
        feedbackFieldsError: feedbackFieldsError,
        addFeedbackFieldDisabled: addFeedbackFieldDisabled
      });
    } else if(type == 'Evaluations') {
      let fields = this.state.evaluationFields;
      let fieldsError = ['', '', '', '', '', ''];
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
    let th = this;
    let type = this.state.currentColumn;
    if(this.validationSuccess()) {
      if(type == 'Feedback') {
        this.setState({
          currentColumn: 'Evaluations'
        });
      } else if(type == 'Evaluations') {
        let obj = {
          FeedbackFields: th.state.feedbackFields,
          EvaluationFields: th.state.evaluationFields
        };
        this.props.onConfirmCourseAddition(obj);
      }
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
    let type = this.state.currentColumn;
    if(type == 'Feedback') {
      let feedbackFieldsError = this.state.feedbackFieldsError;
      let feedbackFields = this.state.feedbackFields;

      feedbackFields.some(function(feedbackField, index) {
        if(feedbackField.trim().length == 0) {
          feedbackFieldsError[index] = 'This field cannot be empty.';
          return true;
        }
      });
      this.setState({
        feedbackFieldsError: feedbackFieldsError
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
    console.log('rendering...')
    console.log(this.state.feedbackFields)
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
          {/*<div style={{backgroundColor: 'teal', padding: '10px', textAlign: 'center', fontWeight: 'bold'}}>
            ADD ONE MORE FIELD
          </div>*/}
          <FlatButton
            label="Add One More Field"
            primary
            disabled={this.state.addFeedbackFieldDisabled}
            onClick={this.addFeedbackField} />
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
