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
import Paper from 'material-ui/Paper';
import RemoveIcon from 'material-ui/svg-icons/content/remove-circle-outline';

const styles = {
  button: {
    float: 'right'
  },
  paperHidden: {
    display: 'none',
		padding: 20,
		borderRadius: 5,
		backgroundColor: '#C6D8D3'
	},
  paper: {
		padding: 20,
		borderRadius: 5,
		backgroundColor: '#C6D8D3'
	}
}

const file_types = ['ZCOP', 'ERD', 'Digi-Thon']

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
      value: null,
      billabilityGData: [],
      gType: '',
      gTitle: '',
      graphs: [],
      billabilityStats: [],
      billabilityStatsWithoutCandidates: []
    }

    this.handleFileChange = this.handleFileChange.bind(this);
    this.handleDrop = this.handleDrop.bind(this);
    this.handleMerge = this.handleMerge.bind(this);
    this.handleDownload = this.handleDownload.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.addGraph = this.addGraph.bind(this);
    this.removeGraph = this.removeGraph.bind(this);
    this.isADuplicateGraph = this.isADuplicateGraph.bind(this);
    this.handleGPropChange = this.handleGPropChange.bind(this);
    this.getBillabilityStats = this.getBillabilityStats.bind(this);
  }

  componentWillMount() {
    this.getBillabilityStats();
  }

  handleFileChange(event, key, val) {
    this.setState({file: val})
  }

  handleDrop(acc, rej, type) {
    let files = this.state.files;
    if (type == 'REPORT') {
      files[type] = acc[0];
    } else {
      files['SRC'] = acc[0];
    }
    this.setState({files: files})
  }

  handleMerge() {
    console.log('Sending a request')
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

  getBillabilityStats() {
     let th = this;
     Request.get('/dashboard/billabilitystats')
     .set({'Authorization': localStorage.getItem('token')})
     .end(function(err, res) {
       if (err)
         console.log(err);
       else {
         let billabilityStats = JSON.parse(JSON.stringify(res.body))
         let billabilityStatsWithoutCandidates = res.body
         billabilityStatsWithoutCandidates.map(function(element) {
           if(element.label == 'Billable') {
             element.color = '#F9CB40'
           } else if(element.label == 'Non-Billable (Internal)') {
             element.color = '#FF715B'
           } else if(element.label == 'Non-Billable (Customer)') {
             element.color = '#06D6A0'
           } else if(element.label == 'Free') {
             element.color = '#BCED09'
           } else if(element.label == 'Support') {
             element.color = '#2F52E0'
           }
           element.value = element.value.length
         })
         let newState = {
           billabilityStats: billabilityStats,
           billabilityStatsWithoutCandidates: billabilityStatsWithoutCandidates
         }
         th.setState(newState)
       }
     })
  }

  handleChange(event, key, values) {
    console.log(values)
    this.setState({value: values, billabilityGData: key})
  }

  addGraph() {
    let th = this;
    let graph = {};
    let graphs = th.state.graphs;
    console.log('gTitle: ', th.state.gTitle)
    if(th.state.gTitle == 'billability') {
      graph.title = th.state.gTitle;
      graph.data = th.state.billabilityStatsWithoutCandidates;
        if(!th.isADuplicateGraph(th.state.gTitle)) graphs.push(graph);
        th.setState({
          graphs: graphs
        });
    } else if(th.state.gTitle == 'training completed') {
      graph.title = th.state.gTitle;
      graph.data = [
          {
            label: 'Immersive',
            value: 100,
            color: "#F9CB40"
          }, {
            label: 'Hybrid',
            value: 200,
            color: "#FF715B"
          }, {
            label: 'Online',
            value: 25,
            color: "#06D6A0"
          }
        ];
        if(!th.isADuplicateGraph(th.state.gTitle)) graphs.push(graph);
        th.setState({
          graphs: graphs
        });
    }
    console.log('graphs: ', th.state.graphs)
  }

  removeGraph(title) {
    let graphs = this.state.graphs;
    let filteredGraphs = graphs.filter(function (graph) {
      return graph.title != title
    });
    this.setState({
      graphs: filteredGraphs
    });
    console.log('remove graph called');
  }

  isADuplicateGraph(title) {
    let graphs = this.state.graphs;
    return graphs.some(function(graph) {
      return graph.title == title
    });
  }

  handleGPropChange(prop, value) {
    let th = this;
    let newState = {};
    let propName = 'g' + prop[0].toUpperCase() + prop.slice(1);
    newState[propName] = value;
    this.setState(newState);
    console.log('newState: ', newState)

  }

  render() {
    let th = this;

    // var datavalue = [];
    // if (this.state.value != null) {
    //   this.state.value.map(function(val, k) {
    //     for (var i = 0; i < data.length; i++) {
    //       if (data[i].label === val) {
    //         console.log(data[i].label)
    //         datavalue.push(data[i])
    //       }
    //     }
    //   })
    // }
    // console.log(datavalue, "datavalue")

    return (
      <div>
        <Paper  style={styles.paperHidden}>
          <WaveDetails /><br/>
        </Paper>
        <Paper style={styles.paperHidden}>
          <div>
          <SelectField value={this.state.file} onChange={this.handleFileChange} floatingLabelText="Select File">
            {
              file_types.map(function(file, key) {
                return <MenuItem key={key} value={file} primaryText={file}/>
              })
            }
          </SelectField>
          <RaisedButton label="Merge" primary={true} onClick={this.handleMerge}/>
          <br/>
          <CSVLink data={this.state.csvData} filename="da_db.xlsx" style={styles.button}>
            Download
          </CSVLink>
        </div>
        <div>
          <FileDrop type={this.state.file} handleDrop={this.handleDrop}/>
          <br/>
          <FileDrop type="REPORT" handleDrop={this.handleDrop}/>
        </div>
      </Paper>
      {/*<Paper  style={styles.paperHidden}>
        <Grid>
          <Row>
            <Col md={5}>
              <SelectField value={this.state.value} onChange={this.handleChange} multiple={true} floatingLabelText="Select Billability">
                {
                  items.map(function(item, key) {
                    return <MenuItem key={key} value={item} primaryText={item}/>
                  })
                }
              </SelectField>

              <NVD3Chart id="pieChart" type="pieChart" tooltip={{
                enabled: true
              }} datum={datavalue} x="label" y="value" width="550" height="600"/>
            </Col>
          </Row>
        </Grid>
      </Paper>*/}
      <Paper  style={styles.paper}>
        <div style={{border: '2px solid black'}}>
          <div style={{display: 'inline-block', border: '1px solid silver', width: 250}}>
            <SelectField
              value={this.state.gType || 'pieChart'}
              onChange={(e, k, v)=>{th.handleGPropChange('type', v)}}
              floatingLabelText="Graph Type">
              {
                ['pieChart', 'barChart'].map(function(type, key) {
                  return <MenuItem key={key} value={type} primaryText={type.toUpperCase()}/>
                })
              }
            </SelectField>
          </div>
          <div style={{display: 'inline-block', border: '1px solid silver', width: 250}}>
            <SelectField
              value={this.state.gTitle}
              onChange={(e, k, v)=>{th.handleGPropChange('title', v)}}
              floatingLabelText="Target Field">
              {
                ['billability', 'training completed', 'training in progress'].map(function(title, key) {
                  return <MenuItem key={key} value={title} primaryText={title.toUpperCase()}/>
                })
              }
            </SelectField>
          </div>
          <div style={{display: 'inline-block', border: '1px solid silver', width: 250}}>
            <RaisedButton label="Add Graph" primary={true} onClick={th.addGraph} style={{width: '100%'}}/>
          </div>
        </div>
        <div>
        {
          th.state.graphs.map(function(graph) {
            return (
              <Paper style={{
                width: '570',
                height: '300',
                backgroundColor: '#bbb',
                display: 'inline-block',
                margin: '5px',
                position: 'relative'
              }}>
                <h3 style={{height: '5%', textAlign: 'center', textTransform: 'uppercase'}}>
                  {graph.title}
                </h3>
                <div style={{width: '100%', height:'95%'}}>
                  <NVD3Chart
                  id="pieChart" type="pieChart" tooltip={{enabled: true}}
                  datum={graph.data} x="label" y="value" />
                </div>
                <RemoveIcon
                  style={{position: 'absolute', right: 10, top: 15, cursor: 'pointer'}}
                  onTouchTap={()=>{th.removeGraph(graph.title)}}
                />
              </Paper>
            )
          })
        }
        </div>
      </Paper>
      </div>
    )
  }
}
