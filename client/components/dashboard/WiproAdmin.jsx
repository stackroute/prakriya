import React from 'react';
import WaveDetails from './WaveDetails.jsx';
import PieChart from "react-svg-piechart";
import Request from 'superagent';

export default class WiproAdmin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expandedSector: '',
      billableCount: 0,
      supportCount: 0,
      nonbillableCount: 0,
      FreeCount: 0
    }

    this.handleMouseEnterOnSector = this.handleMouseEnterOnSector.bind(this);
    this.getBillability = this.getBillability.bind(this);
    this.getNonBillability = this.getNonBillability.bind(this);
    this.getBillabilitySupport = this.getBillabilitySupport.bind(this);
    this.getBillabilityFree = this.getBillabilityFree.bind(this)
  }
  componentDidMount() {
    this.getBillability();
    this.getNonBillability();
    this.getBillabilitySupport();
    this.getBillabilityFree();
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
        th.setState({billableCount: res.body})
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
        th.setState({nonbillableCount: res.body})
      }
    })
  }

  getBillabilityFree() {
    let th = this;
    Request.get('/dashboard/free').set({'Authorization': localStorage.getItem('token')}).end(function(err, res) {
      if (err)
        console.log(err);
      else {
        th.setState({FreeCount: res.body})
      }
    })
  }
  getBillabilitySupport() {
    let th = this;
    Request.get('/dashboard/support').set({'Authorization': localStorage.getItem('token')}).end(function(err, res) {
      if (err)
        console.log(err);
      else {
        th.setState({supportCount: res.body})
      }
    })
  }
  render() {
    console.log(this.state.billableCount,"billableCount")
    const data = [
      {
        label: "Billable",
        value: this.state.billableCount,
        color: "#F9CB40"
      }, {
        label: "Non-billable",
        value: this.state.nonbillableCount,
        color: "#FF715B"
      }, {
        label: "Free",
        value: this.state.FreeCount,
        color: "#BCED09"
      }, {
        label: "Support",
        value: this.state.supportCount,
        color: "#2F52E0"
      }
    ]

    return (
      <div>
        <h2>Billability status</h2>
        <PieChart data={data} expandedSector={this.state.expandedSector} onSectorHover={this.handleMouseEnterOnSector} sectorStrokeWidth={2} expandOnHover={true}/> {data.map((element, i) => (
          <div key={i}>
            <span style={{
              backgroundColor: element.color,
              height: '16px',
              width: '16px',
              display: 'inline-block'
            }}></span>
            <span style={{
              fontWeight: this.state.expandedSector === i
                ? "bold"
                : null
            }}>
              &nbsp;&nbsp;{element.label}
              : {element.value}
            </span>

          </div>
        ))
}
        <WaveDetails/>
      </div>
    )
  }
}
