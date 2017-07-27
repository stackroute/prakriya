import React from 'react';
import WaveDetails from './WaveDetails.jsx';
import Request from 'superagent';
import RaisedButton from 'material-ui/RaisedButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import {Grid, Row, Col} from 'react-flexbox-grid/lib';
import {CSVLink, CSVDownload} from 'react-csv';
import FileDrop from './FileDrop.jsx';
import NVD3Chart from 'react-nvd3';

const styles = {
  button: {
    float: 'right'
  }
}

const file_types = [
  'ZCOP',
  'ERD',
  'Digi-Thon'
]

export default class WiproAdmin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      files: {
        SRC: {},
        REPORT: {}
      },
      file: '',
      csvData: [],
      disableMerge: true,
      expandedSector: '',
      billableCount: 0,
      supportCount: 0,
      nonbillableCount: 0,
      FreeCount: 0,
      bcadets: [],
      nbCadets: [],
      fCadets: [],
      sCadets: []
    }
    this.handleFileChange = this.handleFileChange.bind(this);
    this.handleDrop = this.handleDrop.bind(this);
    this.handleMerge = this.handleMerge.bind(this);
    this.handleDownload = this.handleDownload.bind(this);
    this.handleMouseEnterOnSector = this.handleMouseEnterOnSector.bind(this);
    this.getBillability = this.getBillability.bind(this);
    this.getNonBillability = this.getNonBillability.bind(this);
    this.getBillabilitySupport = this.getBillabilitySupport.bind(this);
    this.getBillabilityFree = this.getBillabilityFree.bind(this)
  }
  componentWillMount() {
    this.getBillability();
    this.getNonBillability();
    this.getBillabilitySupport();
    this.getBillabilityFree();
  }

  handleFileChange(event, key, val) {
    console.log('File selected', val)
    this.setState({
      file: val
    })
  }

  handleDrop(acc, rej, type) {
    let files = this.state.files;
    if(type == 'REPORT') {
      files[type] = acc[0];
    }
    else {
      files['SRC'] = acc[0];
    }
    console.log('Files', files)
    this.setState({
      files: files
    })
  }

  handleMerge() {
    let th = this;
    Request
      .post('/upload/merge?file='+th.state.file)
      .set({'Authorization': localStorage.getItem('token')})
      .attach('src', this.state.files.SRC)
      .attach('report', this.state.files.REPORT)
      .end(function(err, res) {
        if(err)
          console.log(err);
        else {
          console.log('File data', res.body)
          th.setState({
            csvData: res.body
          })
        }
      })
  }
  handleDownload() {

  }

  handleMouseEnterOnSector(sector) {
    this.setState({expandedSector: sector})
  }
  getBillability() {
    let th = this;
    Request.get('/dashboard/billable').set({'Authorization': localStorage.getItem('token')}).end(function(err, res) {
      console.log(res);
      if (err)
        console.log(err);
      else {
        th.setState({
          bcadets:res.body,
          billableCount: res.body.length
        })
      }
    })
  }
  getNonBillability() {
    console.log("getnonBillability")
    let th = this;
    Request.get('/dashboard/nonbillable').set({'Authorization': localStorage.getItem('token')}).end(function(err, res) {
      if (err)
        console.log(err);
      else {
        th.setState({
          nonbillableCount: res.body.length,
          nbCadets: res.body
        })
      }
    })
  }

  getBillabilityFree() {
    let th = this;
    Request.get('/dashboard/free').set({'Authorization': localStorage.getItem('token')}).end(function(err, res) {
      if (err)
        console.log(err);
      else {
        th.setState({
          FreeCount: res.body.length,
        fCadets: res.body
        })
      }
    })
  }
  getBillabilitySupport() {
    let th = this;
    Request.get('/dashboard/support').set({'Authorization': localStorage.getItem('token')}).end(function(err, res) {
      if (err)
        console.log(err);
      else {
        th.setState({
          supportCount: res.body.length,
          sCadets: res.body
        })
      }
    })
  }
  render() {
    console.log(this.state.billableCount,"billableCount")
    console.log(this.state.nonbillableCount,"nbc")
    console.log(this.state.FreeCount,"fCount")
    console.log(this.state.supportCount,"sCount")

    const data = [
      {
        label: 'Billability',
        value: this.state.billableCount,
        color: "#F9CB40",
        members: this.state.bcadets
      }, {
        label: "Non-billable",
        value: this.state.nonbillableCount,
        color: "#FF715B",
        members: this.state.nbCadets
      }, {
        label: "Free",
        value: this.state.FreeCount,
        color: "#BCED09",
        members: this.state.fCadets
      }, {
        label: "Support",
        value: this.state.supportCount,
        color: "#2F52E0",
        members: this.state.sCadets
      }
    ]

    return (
      <div>
        <Grid>
          <Row>
            <Col md={5}>
              <WaveDetails/>
              <h2>Billability status</h2>
              <NVD3Chart id="pieChart" type="pieChart"  tooltip={{enabled:true}}   datum={data} x="label" y="value" width="500" height="500" />
            </Col>
            <Col md={3} mdOffset={1}>
              <SelectField
                value={this.state.file}
                onChange={this.handleFileChange}
                floatingLabelText="Select File"
              >
                {
                  file_types.map(function (file, key) {
                    return <MenuItem key={key} value={file} primaryText={file} />
                  })
                }
              </SelectField>
              <RaisedButton
                label="Merge"
                primary={true}
                onClick={this.handleMerge}
              />
              <br/>
              <CSVLink data={this.state.csvData} filename="da_db.xlsx" style={styles.button}>
                Download
              </CSVLink>
            </Col>
            <Col md={3}>
              <FileDrop type={this.state.file} handleDrop={this.handleDrop} />
              <br/>
              <FileDrop type="REPORT" handleDrop={this.handleDrop} />
            </Col>
          </Row>
        </Grid>
      </div>
    )
  }
}
