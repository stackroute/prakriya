import React from 'react'
import Request from 'superagent'
import RaisedButton from 'material-ui/RaisedButton'
import SelectField from 'material-ui/SelectField'
import {Grid, Row, Col} from 'react-flexbox-grid'
import MenuItem from 'material-ui/MenuItem'
import DropDownMenu from 'material-ui/DropDownMenu'
import AutoComplete from 'material-ui/AutoComplete'
import DatePicker from 'material-ui/DatePicker'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import AddIcon from 'material-ui/svg-icons/content/add'
import {Card, CardText, CardHeader} from 'material-ui/Card';
import IconButton from 'material-ui/IconButton';
import Paper from 'material-ui/Paper';
import {lightBlack} from 'material-ui/styles/colors';
import Schedule from './Schedule.jsx';
import app from '../../styles/app.json';

const styles = {
  tableHeading: {
    paddingTop: 20,
    paddingBottom: 20,
    background: '#333',
    color: '#eee',
    textAlign: 'center'
  }
}

export default class Wave extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      waves: [],
      waveString: '',
      waveObj: {},
      setState: true
    }

    this.getWaveIDs = this.getWaveIDs.bind(this)
    this.getWave = this.getWave.bind(this)
    this.waveUpdate = this.waveUpdate.bind(this)
    this.onWaveChange = this.onWaveChange.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
  }

  componentWillMount() {
    if (localStorage.getItem('token')) {
      this.getWaveIDs()
    }
  }

  getWaveIDs() {
    let th = this
    Request.get('/dashboard/waveids').set({'Authorization': localStorage.getItem('token')}).end(function(err, res) {
      th.setState({waves: res.body.waveids})
    })
  }

  getWave(waveID) {
    let th = this
    Request.get(`/dashboard/waveobject/${waveID}`).set({'Authorization': localStorage.getItem('token')}).end(function(err, res) {
      th.setState({waveObj: res.body.waveObject, setState: false})
      console.log(th.state.waveObj, "waveobj")
    })
  }

  waveUpdate(waveObj) {
    console.log(this.state.waveString, "waveString")
    let th = this
    Request.post('/dashboard/updatesession').set({'Authorization': localStorage.getItem('token')}).send({'wave': waveObj, 'waveString': th.state.waveString}).end(function(err, res) {
      console.log('Wave Updated', waveObj)
      console.log("wave string", th.state.waveString)
    })
  }
  handleDelete(waveObj)
  {
    let th = this;
    Request.post('/dashboard/deleteSession').set({'Authorization': localStorage.getItem('token')}).send({'wave': waveObj, 'waveString': th.state.waveString}).end(function(err, res) {
      if (err)
        console.log(err);
      else {
        console.log('Successfully deleted a session for this wave')
      }
    })
  }
  onWaveChange(e) {
    this.setState({waveString: e.target.outerText, waveObj: {}})
    this.getWave(e.target.outerText)
  }

  render() {
    let th = this
    console.log(th.state.waves)
    console.log(this.state.waveObj)
    return (
      <div>
        <h1 style={app.heading}>Program Flow</h1>
        <Grid>
          <Row>
            <Col md={6}>
              <SelectField onChange={th.onWaveChange} floatingLabelText="Select Wave" value={th.state.waveString}>
                {th.state.waves.map(function(val, key) {
                  return <MenuItem key={key} value={val} primaryText={val}/>
                })
}
              </SelectField>
            </Col>
          </Row>
          {th.state.setState === false && (th.state.waveObj).length !== 0 && <Row style={styles.tableHeading}>
            <Col md={1}>Day</Col>
            <Col md={2}>Name</Col>
            <Col md={2}>Skills</Col>
            <Col md={2}>Session By</Col>
            <Col md={2}>Session On</Col>
            <Col md={2}>Status</Col>
          </Row>
}
          {th.state.setState === false && (th.state.waveObj).length !== 0 && th.state.waveObj.result.map(function(session, i) {
            return (<Schedule wave={session} key={i} handleWaveUpdate={th.waveUpdate} handleDelete={th.handleDelete}/>)
          })
}
        </Grid>
      </div>
    )

  }
}
