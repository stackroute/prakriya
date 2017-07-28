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

const file_types = ['ZCOP', 'ERD', 'Digi-Thon']

const items = ['Billable', 'Non-billable(Internal)', 'Non-billable(Customer)', 'Support', 'Free']

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
      nbiCadets: [],
      nbcCadets: [],
      fCadets: [],
      sCadets: [],
      value: [],
      billabilityGData: []
    }
    this.handleFileChange = this.handleFileChange.bind(this);
    this.handleDrop = this.handleDrop.bind(this);
    this.handleMerge = this.handleMerge.bind(this);
    this.handleDownload = this.handleDownload.bind(this);
    this.handleMouseEnterOnSector = this.handleMouseEnterOnSector.bind(this);
    this.getBillability = this.getBillability.bind(this);
    this.getNonBillabilityInternal = this.getNonBillabilityInternal.bind(this);
    this.getNonBillabilityCustomer = this.getNonBillabilityCustomer.bind(this);
    this.getBillabilitySupport = this.getBillabilitySupport.bind(this);
    this.getBillabilityFree = this.getBillabilityFree.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  componentWillMount() {
    this.getBillability();
    this.getNonBillabilityInternal();
    this.getNonBillabilityCustomer();
    this.getBillabilitySupport();
    this.getBillabilityFree();
  }

  handleFileChange(event, key, val) {
    console.log('File selected', val)
    this.setState({file: val})
  }

  handleDrop(acc, rej, type) {
    let files = this.state.files;
    if (type == 'REPORT') {
      files[type] = acc[0];
    } else {
      files['SRC'] = acc[0];
    }
    console.log('Files', files)
    this.setState({files: files})
  }

  handleMerge() {
    let th = this;
    Request.post('/upload/merge?file=' + th.state.file).set({'Authorization': localStorage.getItem('token')}).attach('src', this.state.files.SRC).attach('report', this.state.files.REPORT).end(function(err, res) {
      if (err)
        console.log(err);
      else {
        console.log('File data', res.body)
        th.setState({csvData: res.body})
      }
    })
  }
  handleDownload() {}

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
        th.setState({bcadets: res.body, billableCount: res.body.length})
      }
    })
  }
  getNonBillabilityInternal() {
    console.log("getNonBillabilityInternal")
    let th = this;
    Request.get('/dashboard/nonbillableInternal').set({'Authorization': localStorage.getItem('token')}).end(function(err, res) {
      if (err)
        console.log(err);
      else {
        th.setState({nonbillableInternalCount: res.body.length, nbCadets: res.body})
        console.log(th.state.nbiCadets)
      }
    })
  }
  getNonBillabilityCustomer() {
    console.log("getNonBillabilityCustomer")
    let th = this;
    Request.get('/dashboard/nonbillableCustomer').set({'Authorization': localStorage.getItem('token')}).end(function(err, res) {
      if (err)
        console.log(err);
      else {
        th.setState({nonbillableCustomerCount: res.body.length, nbcCadets: res.body})
        console.log(th.state.nbcCadets)
      }
    })
  }
  getBillabilityFree() {
    let th = this;
    Request.get('/dashboard/free').set({'Authorization': localStorage.getItem('token')}).end(function(err, res) {
      if (err)
        console.log(err);
      else {
        th.setState({FreeCount: res.body.length, fCadets: res.body})
      }
    })
  }
  getBillabilitySupport() {
    let th = this;
    Request.get('/dashboard/support').set({'Authorization': localStorage.getItem('token')}).end(function(err, res) {
      if (err)
        console.log(err);
      else {
        th.setState({supportCount: res.body.length, sCadets: res.body})
      }
    })
  }
  handleChange(event, key, values) {
    let arr1 = [];
    let arr2 = [];
    if(this.state.value.length > values.length) {
      arr1 = this.state.value;
    }
    else {
      arr1 = values;
    }
    arr1.map(function(val1, index) {
      if(arr2.indexOf(val1) == -1) {
        key = items.indexOf(val1);
      }
    })
    console.log(values)
    console.log(key, "ind")
    console.log(this.state.billabilityGData, "index")
    this.setState(
      {
        value:values,
        billabilityGData :key
      }
    )
  }
  render() {
    let th = this;
    console.log(this.state.billableCount, "billableCount")
    console.log(this.state.nonbillableInternalCount, "nbic")
    console.log(this.state.nonbillableCustomerCount, "nbcc")
    console.log(this.state.FreeCount, "fCount")
    console.log(this.state.supportCount, "sCount")

    const data = [
      {
        label: 'Billable',
        value: this.state.billableCount,
        color: "#F9CB40",
        members: this.state.bcadets
      }, {
        label: "Non-billable(Internal)",
        value: this.state.nonbillableInternalCount,
        color: "#FF715B",
        members: this.state.nbiCadets
      }, {
        label: "Non-billable(Customer)",
        value: this.state.nonbillableCustomerCount,
        color: "#06D6A0",
        members: this.state.nbcCadets
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
            <SelectField
              value={this.state.value}
              onChange={this.handleChange}
              multiple={true}
              floatingLabelText="Select Billability"
            >
              {
                items.map(function(item, key) {
                  return <MenuItem key={key} value={item} primaryText={item}/>
                })
              }
            </SelectField>
            <Col md={5}></Col>

            <Col md={3}>
              <FileDrop type="ZCOP" handleDrop={this.handleDrop}/>
              <br/>
              <RaisedButton label="Merge" primary={true} style={styles.button} onClick={this.handleMerge}/>
            </Col>
            <Col md={3}>
              <FileDrop type="ERD" handleDrop={this.handleDrop}/>
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
