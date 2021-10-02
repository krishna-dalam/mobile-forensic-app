import React, { Component } from "react";
import { Table } from "react-bootstrap";
import { ExcelRenderer } from "react-excel-renderer";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rows: [],
      cols: []
    };
  }
//  WORKING CODE ---------------------
  changeHandler(event) {
    let fileObj = event.target.files[0];
    //just pass the fileObj as parameter
    ExcelRenderer(fileObj, (err, resp) => {
      if (err) {
        console.log(err);
      } else {
        this.setState({
          cols: resp.cols,
          rows: resp.rows
        });
        console.log(this.state);
      } 
    });
  }
  //  WORKING CODE ---------------------

  printRow = (row, index) => {
    return (
      <tr key={index}>
        <td>{row[0]}</td>
        <td>{row[1]}</td>
        <td>{row[2]}</td>
        <td>{row[3]}</td>
        <td>{this.truncateString(row[5])}</td>
      </tr>
    )
  }

  truncateString = (input) => {
    if (input.length > 100) {
      return input.substring(0, 100) + '...';
    }
   return input;
  }


  render() {
    return (
        <>
            <div>
                <h1>Upload File</h1>
                <input
                className="btn"
                type="file"
                onChange={this.changeHandler.bind(this)}
                style={{ padding: "10px" }}
                />
              </div>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Mobile ID</th>
                  <th>Timestamp</th>
                  <th>Process ID</th>
                  <th>Application ID</th>
                  <th>Message</th>
                </tr>
              </thead>
              <tbody>
                {this.state.rows.map(this.printRow)}
              </tbody>
            </Table>
        </>


    );
  }
}

export default Dashboard;