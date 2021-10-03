import { getJsDateFromExcel } from "excel-date-to-js";
import moment from "moment";
import React, { Component } from "react";
import { Table, InputGroup, FormControl, Button } from "react-bootstrap";
import { ExcelRenderer } from "react-excel-renderer";
import AppPagination from "../commons/app-pagination";
import paginate from "../utils/paginate"

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rows: [],
      cols: [],
      updatedRows: [],
      currentPage: 1,
      searchValue: ""
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
          rows: resp.rows,
          updatedRows: resp.rows
        });
        console.log(this.state);
      } 
    });
  }
  //  WORKING CODE ---------------------

  printRow = (row, index) => {
    return (
      <tr key={index}>
        <td>{moment(getJsDateFromExcel(row[0])).format('DD-MM-YYYY')}</td>
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

  handlePageChange = (page) => {
    this.setState({currentPage: page});
  }

  handleFirstPageClicked = () => {
    this.setState({currentPage: 1});
  }
  
  handleLastPageClicked = (lastPage) => {
    this.setState({currentPage: lastPage});
  }

  handlePrevPageClicked = () => {
    if(this.state.currentPage === 1)
      return;
    this.setState({currentPage: this.state.currentPage-1});
  }

  handleNextPageClicked = (lastPage) => {
    if(this.state.currentPage === lastPage)
      return;
    this.setState({currentPage: this.state.currentPage+1});
  }

  handleSort = (path) => {
    console.log(path);
  }

  handleSearch = () => {
    if(this.state.searchValue.trim() === "")
      this.setState({updatedRows: this.state.rows});
    const updatedRows = this.state.rows.filter(r => String(r[5]).includes(this.state.searchValue));
    this.setState({updatedRows: updatedRows});
  }

  handleSearchValue = (event) => {
    this.setState({searchValue: event.target.value});
  }

  render() {

    const paginatedMovies = paginate(this.state.updatedRows, this.state.currentPage, 30);
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

              {this.state.rows[0] && <InputGroup className="mb-3">
                <FormControl
                  placeholder="Search"
                  aria-label="Search"
                  aria-describedby="search"
                  onChange={this.handleSearchValue}
                />
                <Button variant="outline-secondary" id="search" onClick={this.handleSearch}>
                  Search
                </Button>
              </InputGroup>}

            <Table striped bordered hover>
              <thead>
                {this.state.rows[0] && <tr>
                  <th onClick={() => this.handleSort("date")}>Date</th>
                  <th onClick={() => this.handleSort("timestamp")}>Timestamp</th>
                  <th onClick={() => this.handleSort("process-id")}>Process ID</th>
                  <th onClick={() => this.handleSort("application-id")}>Application ID</th>
                  <th onClick={() => this.handleSort("message")}>Message</th>
                </tr>}
              </thead>
              <tbody>
                {paginatedMovies.map(this.printRow)}
              </tbody>
            </Table>
            <AppPagination 
                itemsCount={this.state.rows.length} 
                pageSize={30} 
                currentPage={this.state.currentPage} 
                onPageChange={this.handlePageChange}
                onFirstPageClicked={this.handleFirstPageClicked}
                onLastPageClicked={this.handleLastPageClicked}
                onPrevPageClicked={this.handlePrevPageClicked}
                onNextPageClicked={this.handleNextPageClicked}

              />
        </>


    );
  }
}

export default Dashboard;