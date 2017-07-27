import React from 'react';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import Dialog from 'material-ui/Dialog';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import app from '../../styles/app.json';
import select from '../../styles/select.json';
import dialog from '../../styles/dialog.json';
import CONFIG from '../../config/index';
import Paper from 'material-ui/Paper';
import Chip from 'material-ui/Chip';
import SaveIcon from 'material-ui/svg-icons/content/save';
import AddIcon from 'material-ui/svg-icons/content/add-circle-outline';
import IconButton from 'material-ui/IconButton';
import CourseColumns from './CourseColumns.jsx';

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

export default class AddCourse extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      courseColumns: false,
      showDialog: false,
      Name: '',
      Mode: '',
      Duration: '',
      NameErrorText: '',
      ModeErrorText: '',
      DurationErrorText: '',
      SkillsErrorText: '',
      Skills: [],
      SkillName: '',
      disableSave: true
    }

    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.onChangeName = this.onChangeName.bind(this);
    this.onChangeMode = this.onChangeMode.bind(this);
    this.onChangeDuration = this.onChangeDuration.bind(this);
    this.handleSkillDelete = this.handleSkillDelete.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.resetFields = this.resetFields.bind(this);
    this.handleAdd = this.handleAdd.bind(this);
    this.validationSuccess = this.validationSuccess.bind(this);
    this.handleSkillChange = this.handleSkillChange.bind(this);
    this.onAddSkill = this.onAddSkill.bind(this);
    this.closeCourseColumns = this.closeCourseColumns.bind(this);
  }

  componentWillMount() {
    if (this.props.openDialog) {
      this.setState({showDialog: true, Name: this.props.course.Name, Mode: this.props.course.Mode, Duration: this.props.course.Duration.low, Skills: this.props.course.Skills});
    }
  }

  onChangeName(e) {
    this.setState({Name: e.target.value, NameErrorText: ''});
  }

  onChangeMode(e, key, value) {
    console.log('mode e: ', value)
    this.setState({Mode: value, ModeErrorText: ''});
  }

  onChangeDuration(e) {
    this.setState({Duration: e.target.value, DurationErrorText: ''});
  }

  handleSkillChange(e) {
    this.setState({SkillName: e.target.value, disableSave: false, SkillsErrorText: ''});
  }

  onAddSkill() {
    if (this.state.SkillName.trim().length != 0) {
      let skill = this.state.Skills;
      skill.push(this.state.SkillName);
      this.setState({Skills: skill, SkillName: '', disableSave: true, SkillsErrorText: ''});
    }
  }

  handleOpen() {
    this.setState({showDialog: true});
  }

  handleClose(e, action) {
    if (action == 'ADD') {
      if (this.validationSuccess()) {
        this.setState({
          showDialog: false,
          courseColumns: true
        });
        // this.resetFields()
      }
    } else if (action == 'EDIT') {
      if (this.validationSuccess()) {
        this.handleUpdate()
        this.setState({showDialog: false})
        if (this.props.openDialog)
          this.props.handleClose()
        this.resetFields()
      }
    } else {
      this.setState({showDialog: false})
      if (this.props.openDialog)
        this.props.handleClose()
      this.resetFields()
    }
  }

  handleSkillDelete(perm) {
    let skill = this.state.Skills.filter(function(control) {
      return perm != control
    })
    this.setState({Skills: skill, disableSave: false})
  }

  resetFields() {
    this.setState({
      Name: '',
      Mode: '',
      Duration: '',
      Skills: [],
      SkillName: '',
      NameErrorText: '',
      ModeErrorText: '',
      DurationErrorText: '',
      SkillsErrorText: ''
    })
  }

  handleUpdate() {
    let th = this
    let course = {}
    course.ID = this.props.course.ID;
    course.Name = this.state.Name;
    course.Mode = this.state.Mode;
    course.Duration = this.state.Duration;
		course.Skills = this.state.Skills;
    course.Removed = false;
    course.History = '';
    this.props.handleUpdate(course, 'edit');
  }

  handleAdd(courseColumns) {
    let th = this;
    let course = {};
    course.ID = th.state.Name + '_' + th.state.Mode;
    course.Name = this.state.Name;
    course.Mode = this.state.Mode;
    course.Skills = this.state.Skills;
    course.Assignments = [];
    course.Schedule = [];
    course.Removed = false;
    course.Duration = this.state.Duration;
    course.History = '';
    console.log('CourseColumns: ', courseColumns);
    course.FeedbackFields = courseColumns.FeedbackFields;
    course.EvaluationFields = courseColumns.EvaluationFields;
    this.props.handleAdd(course);
    this.setState({
      courseColumns: false
    });
  }

  validationSuccess() {
    let durationPattern = /[0-9]{1,}/
    if (this.state.Name.trim().length == 0) {
      this.setState({NameErrorText: 'This field cannot be empty.'})
    } else if (this.state.Mode.trim().length == 0) {
      this.setState({ModeErrorText: 'This field cannot be empty.'})
    } else if ((this.state.Duration + '').trim().length == 0) {
      this.setState({DurationErrorText: 'This field cannot be empty.'})
    } else if (!durationPattern.test(this.state.Duration)) {
      this.setState({DurationErrorText: 'Invalid input! Enter the number of weeks.'})
    } else if (this.state.Skills.length == 0) {
      this.setState({SkillsErrorText: 'Skillset cannot be empty. Add atleast one skill.'})
    } else {
      return true
    }
    return false
  }

  closeCourseColumns() {
    this.setState({
      courseColumns: false,
      showDialog: true
    });
  }

  render() {
    let th = this
      let actions,
        title
      if (this.props.openDialog) {
        actions = [ < FlatButton label = "Cancel" onTouchTap = {
            (e) => this.handleClose(e, 'CLOSE')
          }
          style = {
            dialog.actionButton
          } />, < FlatButton label = "Update Course" onClick = {
            (e) => this.handleClose(e, 'EDIT')
          }
          style = {
            dialog.actionButton
          } />
        ]
        title = 'EDIT COURSE'
      } else {
        actions = [ < FlatButton label = "Cancel" onTouchTap = {
            (e) => this.handleClose(e, 'CLOSE')
          }
          style = {
            dialog.actionButton
          } />, < FlatButton label = "Add Course" onClick = {
            (e) => this.handleClose(e, 'ADD')
          }
          style = {
            dialog.actionButton
          } />
        ]
        title = 'ADD COURSE'
      }
      return (
        <div>
          <FloatingActionButton mini={true} style={app.fab} onTouchTap={this.handleOpen}>
            <ContentAdd/>
          </FloatingActionButton>
          <Dialog bodyStyle={dialog.body} title={title} titleStyle={dialog.title} actionsContainerStyle={dialog.actionsContainer} open={this.state.showDialog} autoScrollBodyContent={true} actions={actions}>
            <div>
              <div style={dialog.box100}>
                <TextField style={{
                  width: '100%'
                }} hintText="Course Name" floatingLabelText="Name *" floatingLabelStyle={app.mandatoryField} value={this.state.Name} onChange={this.onChangeName} errorText={this.state.NameErrorText}/>
              </div>
            </div>
            <div>
              <div style={dialog.box100}>
                <SelectField style={{
                  width: '100%'
                }} hintText="Mode" floatingLabelText='Mode *' floatingLabelStyle={app.mandatoryField} value={this.state.Mode} onChange={this.onChangeMode} errorText={this.state.ModeErrorText} menuItemStyle={select.menu} listStyle={select.list} selectedMenuItemStyle={select.selectedMenu} maxHeight={600}>
                  {
                    CONFIG.MODES.map(function(mode, key) {
                      return (<MenuItem key={key} value={mode} primaryText={mode}/>)
                    })
                  }
                </SelectField>
              </div>
            </div>
            <div>
              <div style={dialog.box100}>
                <TextField style={{
                  width: '100%'
                }} hintText="Duration" floatingLabelText="Duration (in weeks) *" floatingLabelStyle={app.mandatoryField} value={this.state.Duration} onChange={this.onChangeDuration} errorText={this.state.DurationErrorText}/>
              </div>
            </div>
            <div>
              <div style={dialog.box100}>
                <TextField hintText="Skills" floatingLabelText="Skills *" floatingLabelStyle={app.mandatoryField} value={this.state.SkillName} onChange={this.handleSkillChange} errorText={this.state.SkillsErrorText}/>
                <IconButton tooltip="Add Skill" onClick={this.onAddSkill} disabled={this.state.disableSave}>
                  <AddIcon/>
                </IconButton>
                <Paper style={styles.paper} zDepth={1}>
                  <div style={styles.wrapper}>
                    {
                      this.state.Skills.map(function(skill, index) {
                        return (
                          <Chip onRequestDelete={() => th.handleSkillDelete(skill)} style={styles.chip} key={index}>
                            <span>{skill}</span>
                          </Chip>
                        )
                      })
                   }
                  </div>
                </Paper>
              </div>
            </div>
          </Dialog>
          <CourseColumns
          open={this.state.courseColumns}
          onClose={this.closeCourseColumns}
          onConfirmCourseAddition={this.handleAdd}
          />
        </div>
      )
    }
  }
