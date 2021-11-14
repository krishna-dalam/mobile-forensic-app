import { getJsDateFromExcel } from "excel-date-to-js";
import moment from "moment";
import React, { Component } from "react";
import {
  Table,
  InputGroup,
  FormControl,
  Button,
  Row,
  Col,
} from "react-bootstrap";
import { ExcelRenderer } from "react-excel-renderer";
import AppPagination from "../commons/app-pagination";
import paginate from "../utils/paginate";
import _ from "lodash";
import Picker from "./Picker";
import { DatePicker } from "@material-ui/pickers";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      forensicInfo: [],
      updatedRows: [],
      currentPage: 1,
      searchValue: "",
      sortColumn: { path: "date", order: "asc" },
      selectedFromDate: new Date(),
      selectedToDate: new Date(),
      dateFilteredRows: [],
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
        const forensicInfo = this.transformArrayToObjects(resp.rows);
        this.setState({
          forensicInfo,
          updatedRows: forensicInfo,
          dateFilteredRows: forensicInfo,
        });
        console.log(this.state);
      }
    });
  }
  //  WORKING CODE ---------------------

  printRow = (row, index) => {
    return (
      <tr key={index}>
        <td>{row["date"]}</td>
        <td>{row["timestamp"]}</td>
        <td>{row["process-id"]}</td>
        <td>{row["application-id"]}</td>
        <td>{row["message"]}</td>
      </tr>
    );
  };

  transformArrayToObjects = (rows) => {
    return rows.map((r) => {
      return {
        date: this.excelDateToJS(r[0]),
        timestamp: this.excelTimeToJS(r[1]),
        // timestamp: moment(r[1]).format("HH:mm"),
        "process-id": r[2],
        "application-id": r[3],
        message: r[7],
      };
    });
  };

  excelDateToJS = (serial) => {
    var utc_days = Math.floor(serial - 25569);
    var utc_value = utc_days * 86400;
    var date_info = new Date(utc_value * 1000);

    var fractional_day = serial - Math.floor(serial) + 0.0000001;

    var total_seconds = Math.floor(86400 * fractional_day);

    var seconds = total_seconds % 60;

    total_seconds -= seconds;

    var hours = Math.floor(total_seconds / (60 * 60));
    var minutes = Math.floor(total_seconds / 60) % 60;

    return new Date(
      date_info.getFullYear(),
      date_info.getMonth(),
      date_info.getDate()
    ).toLocaleDateString(navigator.language, {});
  };

  excelTimeToJS = (excel_date) => {
    let day_time = excel_date % 1;
    let meridiem = "AMPM";
    let hour = Math.floor(day_time * 24);
    let minute = Math.floor(Math.abs(day_time * 24 * 60) % 60);
    let second = Math.floor(Math.abs(day_time * 24 * 60 * 60) % 60);
    hour >= 12
      ? (meridiem = meridiem.slice(2, 4))
      : (meridiem = meridiem.slice(0, 2));
    hour > 12 ? (hour = hour - 12) : (hour = hour);
    minute = minute < 10 ? "0" + minute : minute;
    second = second < 10 ? "0" + second : second;
    let daytime = "" + hour + ":" + minute + ":" + second + " " + meridiem;
    return daytime;
  };

  truncateString = (input) => {
    if (input.length > 100) {
      return input.substring(0, 100) + "...";
    }
    return input;
  };

  handlePageChange = (page) => {
    this.setState({ currentPage: page });
  };

  handleFirstPageClicked = () => {
    this.setState({ currentPage: 1 });
  };

  handleLastPageClicked = (lastPage) => {
    this.setState({ currentPage: lastPage });
  };

  handlePrevPageClicked = () => {
    if (this.state.currentPage === 1) return;
    this.setState({ currentPage: this.state.currentPage - 1 });
  };

  handleNextPageClicked = (lastPage) => {
    if (this.state.currentPage === lastPage) return;
    this.setState({ currentPage: this.state.currentPage + 1 });
  };

  handleSort = (path) => {
    console.log(path);
    this.setState({ sortColumn: { path, order: "asc" } });
  };

  handleSearch = () => {
    if (this.state.searchValue.trim() === "")
      this.setState({ updatedRows: this.state.forensicInfo });
    const updatedRows = this.state.updatedRows.filter((r) =>
      String(r["message"]).includes(this.state.searchValue)
    );
    this.setState({ updatedRows });
  };

  handleSearchValue = (event) => {
    this.setState({ searchValue: event.target.value });
  };

  handleDateChange = (date, label) => {
    if (label === "from-date") {
      const filteredRows = this.state.updatedRows.filter((r) =>
        this.compareDateTimes(
          r["date"],
          r["timestamp"],
          date,
          this.state.selectedToDate
        )
      );

      this.setState({
        selectedFromDate: date,
        dateFilteredRows: filteredRows,
      });
    } else {
      const filteredRows = this.state.updatedRows.filter((r) =>
        this.compareDateTimes(
          r["date"],
          r["timestamp"],
          this.state.selectedFromDate,
          date
        )
      );

      this.setState({
        selectedToDate: date,
        dateFilteredRows: filteredRows,
      });
    }
  };

  compareDateTimes = (date, time, dateTime1, dateTime2) => {
    const date1 = new Date(dateTime1);
    const date2 = new Date(dateTime2);

    let rowDate = new Date(date);

    const meridianSplit = String(time).split(" ");

    const justTime = meridianSplit[0].split(":");

    if (meridianSplit[1] == "PM") {
      justTime[0] = parseInt(justTime[0]) + 12 + "";
    }

    rowDate.setHours(justTime[0]);
    rowDate.setMinutes(justTime[1]);
    rowDate.setSeconds(justTime[2]);
    return rowDate > date1 && rowDate < date2;
  };

  render() {
    const { sortColumn, dateFilteredRows, currentPage, forensicInfo } =
      this.state;
    const sorted = _.orderBy(
      dateFilteredRows,
      [sortColumn.path],
      [sortColumn.order]
    );

    const paginatedMovies = paginate(sorted, currentPage, 30);
    return (
      <>
        <h2 style={{ paddingTop: "4rem" }}>Forensic App</h2>
        <div class="input-group mb-3" style={{ paddingTop: "1rem" }}>
          <input
            type="file"
            class="form-control"
            placeholder=""
            aria-label="Example text with button addon"
            aria-describedby="upload-file"
            onChange={this.changeHandler.bind(this)}
          />
        </div>

        {forensicInfo[0] && (
          <Row>
            <Col>
              <Picker
                label="from-date"
                onDateChange={this.handleDateChange}
                selectedDate={this.state.selectedFromDate}
              />
            </Col>
            <Col>
              <Picker
                label="to-date"
                onDateChange={this.handleDateChange}
                selectedDate={this.state.selectedToDate}
              />
            </Col>
            <Col>
              <InputGroup className="mb-3">
                <FormControl
                  placeholder="Search"
                  aria-label="Search"
                  aria-describedby="search"
                  onChange={this.handleSearchValue}
                />
                <Button
                  variant="outline-secondary"
                  id="search"
                  onClick={this.handleSearch}
                >
                  Search
                </Button>
              </InputGroup>
            </Col>
          </Row>
        )}

        <Table striped bordered hover>
          <thead>
            {forensicInfo[0] && (
              <tr>
                <th onClick={() => this.handleSort("date")}>Date</th>
                <th onClick={() => this.handleSort("timestamp")}>Timestamp</th>
                <th onClick={() => this.handleSort("process-id")}>
                  Process ID
                </th>
                <th onClick={() => this.handleSort("application-id")}>
                  Application ID
                </th>
                <th onClick={() => this.handleSort("message")}>Message</th>
              </tr>
            )}
          </thead>
          <tbody>{paginatedMovies.map(this.printRow)}</tbody>
        </Table>
        <AppPagination
          itemsCount={sorted.length}
          pageSize={30}
          currentPage={currentPage}
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
