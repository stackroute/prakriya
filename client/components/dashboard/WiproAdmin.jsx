import React from 'react';
import WaveDetails from './WaveDetails.jsx';
import Request from 'superagent';
import RaisedButton from 'material-ui/RaisedButton';
import {Grid, Row, Col} from 'react-flexbox-grid/lib';
import {CSVLink, CSVDownload} from 'react-csv';
import FileDrop from './FileDrop.jsx';
import NVD3Chart from 'react-nvd3';

const styles = {
  button: {
    float: 'right'
  }
}

export default class WiproAdmin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      files: {
        ZCOP: {},
        ERD: {}
      },
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

  handleDrop(acc, rej, type) {
    let files = this.state.files;
    files[type] = acc[0];
    this.setState({
      files: files
    })
    if(Object.keys(this.state.files.ZCOP).length > 0 && Object.keys(this.state.files.ERD).length > 0) {
      this.setState({
        disableMerge: false
      })
    }
  }

  handleMerge() {
    let th = this;
    Request
      .post('/upload/merge')
      .set({'Authorization': localStorage.getItem('token')})
      .attach('zcop', this.state.files.ZCOP)
      .attach('erd', this.state.files.ERD)
      .end(function(err, res) {
        if(err)
          console.log(err);
        else {
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

    const csvData =[
      ['firstname', 'lastname', 'email'] ,
      ['Gajendra', 'Singh' , 'gajsa@gmail.com']
    ];

    return (
      <div>
        <Grid>
          <Row>
          <Col md={5}>
<NVD3Chart id="pieChart" type="pieChart"  tooltip={{enabled:true}}   datum={data} x="label" y="value" width="500" height="500" />
          </Col>

            <Col md={3}>
              <FileDrop type="ZCOP" handleDrop={this.handleDrop} />
              <br/>
              <RaisedButton
                label="Merge"
                primary={true}
                style={styles.button}
                onClick={this.handleMerge}
              />
            </Col>
            <Col md={3}>
              <FileDrop type="ERD" handleDrop={this.handleDrop} />
              <br/>
              <CSVLink data={this.state.csvData} filename="da_db.xlsx">
                Download
              </CSVLink>
            </Col>
          </Row>
        </Grid>
      </div>
    )
  }
}
