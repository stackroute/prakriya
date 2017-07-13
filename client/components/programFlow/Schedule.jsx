import React from 'react';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn
} from 'material-ui/Table';
import MenuItem from 'material-ui/MenuItem';
import Paper from 'material-ui/Paper';
import SelectField from 'material-ui/SelectField';
import TextField from 'material-ui/TextField';
import DatePicker from 'material-ui/DatePicker';
import SaveIcon from 'material-ui/svg-icons/content/save';
import IconButton from 'material-ui/IconButton';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import {Grid, Row, Col} from 'react-flexbox-grid';
import Dialog from 'material-ui/Dialog';

const status = [
 < MenuItem key = {1} value = "Pending" primaryText = "Pending" />,
 < MenuItem key = {2} value = "Completed" primaryText = "Completed" />
];

const styles = {
  textCenter: {
    textAlign: 'center',
    marginTop: 10
  },
  fields: {
    marginRight: 10
  }
}

export default class Schedule extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      wave: {},
      session: {},
      SessionBy: '',
      SessionOn: null,
      Status: '',
      waveObj: {},
      open: false
    }
    this.handleSessionByChange = this.handleSessionByChange.bind(this);
    this.handleSessionOnChange = this.handleSessionOnChange.bind(this);
    this.handleStatusChange = this.handleStatusChange.bind(this);
    this.handleWaveUpdate = this.handleWaveUpdate.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleOpen = this.handleOpen.bind(this);

  }

  componentWillMount() {
    let wave = this.props.wave;

    this.setState({wave: wave, session: this.props.session})
  }

  componentWillReceiveProps(nextProps) {
    this.setState({wave: nextProps.wave, session: nextProps.session})
  }

  handleSessionByChange(event) {
    let wave = this.state.wave;
    wave.SessionBy = event.target.value;
    this.setState({wave: wave, SessionBy: event.target.value})
  }

  handleSessionOnChange(event, date) {
    let wave = this.state.wave;
    wave.SessionOn = date;
    this.setState({SessionOn: date, wave: wave})

  }

  handleStatusChange(event, key, val) {
    let wave = this.state.wave;
    wave.Status = val;
    this.setState({wave: wave, Status: val})

  }

  handleOpen() {
    this.setState({open: true})
  }

  handleClose() {
    this.setState({open: false})
  }

  handleWaveUpdate() {
    let waveObj = this.state.wave;
    waveObj.SessionBy = this.state.SessionBy;
    waveObj.SessionOn = this.state.SessionOn;
    this.props.handleWaveUpdate(waveObj);
  }
  handleDelete() {
    let waveObj = this.state.wave;
    this.props.handleDelete(waveObj)
  }
  render() {
    const actions = [
			 < FlatButton label = "Cancel" primary = {true} onTouchTap = {this.handleClose}/>,
			 < FlatButton label = "Submit" primary = {true} onTouchTap = {  this.handleClose } onClick = {this.handleDelete} />
        ];

    let th = this
    console.log(this.state.wave, "wave@waveObj")
    return (
      <div>
        <Grid>
          <Row>
            <Col md={1}>{th.state.wave.Day.low}</Col>
            <Col md={1}>{th.state.wave.Name}</Col>
            <Col md={1}>
              <ul>
                {th.state.wave.skill.map(function(result) {
                  return (
                    <li>{result}</li>
                  )
                })
}
              </ul>
            </Col>
            <Col md={2} style={styles.fields}>
              <TextField hintText="Who took session ?" value={th.state.wave.SessionBy} onChange={th.handleSessionByChange} onBlur={th.handleWaveUpdate}/>
            </Col>
            <Col md={2} style={styles.fields}>
              <DatePicker hintText="Session On" value={th.state.wave.SessionOn} onChange={th.handleSessionOnChange}/>
            </Col>
            <Col md={2} style={styles.fields}>
              <SelectField hintText="What's the status?" value={th.state.wave.Status} onChange={th.handleStatusChange}>
                {status}
              </SelectField>
            </Col>
          </Row>
        </Grid>
        <RaisedButton label="Save" primary={true} onClick={this.handleWaveUpdate}/>&nbsp;
        <RaisedButton label="Delete" primary={true} onTouchTap={this.handleOpen}/>
        <Dialog title="Are you sure want to delete the session?" actions={actions} modal={true} open={this.state.open}></Dialog>
      </div>
    )

  }
}
