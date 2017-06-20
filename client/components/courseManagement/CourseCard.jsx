import React from 'react';
import {
  Card,
  CardActions,
  CardHeader,
  CardMedia,
  CardTitle,
  CardText
} from 'material-ui/Card';
import Avatar from 'material-ui/Avatar';
import IconButton from 'material-ui/IconButton';
import Moment from 'moment';
import EditIcon from 'material-ui/svg-icons/editor/mode-edit';
import AddIcon from 'material-ui/svg-icons/content/add-circle-outline';
import DeleteIcon from 'material-ui/svg-icons/action/delete';
import HistoryIcon from 'material-ui/svg-icons/action/history';
import CourseSubCard from './CourseSubCard.jsx';
import AddCourse from './AddCourse.jsx';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import DateIcon from 'material-ui/svg-icons/action/date-range';

const styles = {
  heading: {
    textAlign: 'center'
  },
  col: {
    marginBottom: 20
  },
  deleteDialog: {
    backgroundColor: '#DDDBF1',
    border: '10px solid teal'
  },
  actionsContainer: {
    backgroundColor: 'teal',
    borderTop: '0px',
    marginTop: '0px'
  },
  actionButton: {
    backgroundColor: '#DDDBF1',
    width: '50%',
    color: 'teal',
    border: '1px solid teal',
    height: '100%'
  }
}

export default class CourseCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
      hide: 'inline',
      show: 'none',
      showDeleteDialog: false,
      openDialog: false
    }
    this.handleExpandChange = this.handleExpandChange.bind(this);
    this.handleEditCourse = this.handleEditCourse.bind(this);
    this.handleUpdateCourse = this.handleUpdateCourse.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleDeleteCourse = this.handleDeleteCourse.bind(this);
    this.openDeleteDialog = this.openDeleteDialog.bind(this);
    this.closeDeleteDialog = this.closeDeleteDialog.bind(this);
    this.formatDate = this.formatDate.bind(this);
  }

  handleExpandChange = (expanded) => {
    this.setState({expanded: expanded});
    if (this.state.expanded) {
      this.setState({expanded: false, hide: 'inline', show: 'none'});
    } else {
      this.setState({expanded: true, hide: 'none', show: 'inline'});
    }
  };

  handleEditCourse() {
    this.setState({openDialog: true})
  }

  handleClose() {
    this.setState({openDialog: false, showAddCategoryDialog: false})
  }

  openDeleteDialog() {
    this.setState({showDeleteDialog: true})
  }

  closeDeleteDialog() {
    this.setState({showDeleteDialog: false})
  }

  handleUpdateCourse(course) {
    course.History = this.props.course.History;
    this.props.updateCourse(course);
  }

  handleDeleteCourse(course) {
    this.props.deleteCourse(this.props.course);
  }

  formatDate(date) {
    if (date) {
      return Moment(date).fromNow();
      // return Humanize.naturalDay(newdate,'H:i:s dS M, Y')
    } else
      return '-'
  }

  render() {
    const deleteDialogActions = [ < FlatButton label = "Cancel" onTouchTap = {
        this.closeDeleteDialog
      }
      style = {
        styles.actionButton
      } />, < FlatButton label = "Delete" onTouchTap = {
        this.closeDeleteDialog
      }
      onClick = {
        this.handleDeleteCourse
      }
      style = {
        styles.actionButton
      } />
    ]
    let th = this
    let history = this.props.course.History.split('\n');
    history = history[history.length - 2].split(' on ');
    if (history[1].includes(':')) {
      let date = history[1].split(' : ');
      history[1] = date[0];
    }
    console.log(this.props.course.Mode);
    let bgColor = this.props.bgColor;
    let bgIcon = this.props.bgIcon;
		let subTitle = <h5>{history[0]}-<br/>{th.formatDate(history[1])}</h5>
    return (
      <div>
        <Card expanded={this.state.expanded} onExpandChange={this.handleExpandChange} style={{
          width: '300px',
          marginRight: '20px',
          marginBottom: '20px',
          background: bgColor
        }}>
          <CardHeader title={`${this.props.course.Name} - ${this.props.course.Mode}`} subtitle={`${subtitle}`} avatar={< Avatar backgroundColor = {
            bgIcon
          } > {
            this.props.course.Mode.charAt(0).toUpperCase()
          } < /Avatar>} actAsExpander={true} showExpandableButton={true}/>
					<IconButton tooltip="Date">
						<DateIcon/>
					</IconButton>
          <h4 style={{marginTop
          }}>{this.props.course.Duration}
            weeks</h4><br/>
          <IconButton tooltip="Edit Course" onClick={this.handleEditCourse} style={{
            display: this.state.hide,
            marginLeft: '10px'
          }}>
            <EditIcon/>
          </IconButton>
          <IconButton tooltip="Delete Course" style={{
            display: this.state.hide
          }} onClick={this.openDeleteDialog}>
            <DeleteIcon/>
          </IconButton>
          {this.state.openDialog && <AddCourse course={this.props.course} openDialog={this.state.openDialog} handleUpdate={this.handleUpdateCourse} handleClose={this.handleClose}/>
}
        </Card>
        <Dialog bodyStyle={styles.deleteDialog} actionsContainerStyle={styles.actionsContainer} actions={deleteDialogActions} modal={false} open={this.state.showDeleteDialog} onRequestClose={this.closeDeleteDialog}>
          Are you sure you want to delete this course?
        </Dialog>
      </div>
    )
  }
}
