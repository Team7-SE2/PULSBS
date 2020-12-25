import React, { useState } from 'react'
import Paper from '@material-ui/core/Paper';
import Button from "react-bootstrap/Button";
import moment from 'moment';
import { SortingState, PagingState, SearchState, FilteringState, IntegratedFiltering, IntegratedPaging, IntegratedSorting } from '@devexpress/dx-react-grid';
import { Grid, Table, TableHeaderRow, TableFilterRow, PagingPanel, Toolbar, SearchPanel } from '@devexpress/dx-react-grid-material-ui';
import Modal from "react-bootstrap/Modal"
import Form from "react-bootstrap/Form";
import TimePickerComponent from './TimePickerComponent';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {FaCog } from 'react-icons/fa';

class SupportOfficerListLectures extends React.Component {

  constructor(props) {
    super(props);
    
    const weekDays = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ] 

    let scheduled = [];

    // prepare scheduledLectures
    for(let i = 0; i < props.lectures.length; i++){

      let lec = props.lectures[i];
      let index = moment(new Date(lec.date)).day();

      // find the lecture inside the array
      let arrayIndex = scheduled.findIndex(x => x.lectureDay === weekDays[index] && x.beginHour === moment(lec.date).format("HH:mm") && x.duration === lec.duration)

      if(arrayIndex >= 0)
        scheduled[arrayIndex].scheduledLectures ++;
      else{
        scheduled.push({
          scheduledLectures : 1,
          lectureDay : weekDays[index],
          beginHour: moment(lec.date).format("HH:mm"),
          endHour: moment(lec.date).add(lec.duration, 'hours').format("HH:mm"),
          duration: lec.duration
        })
      }

    }
    let finalScheduled = scheduled.map((lec) => {
    
      return {
        lectureDay: lec.lectureDay,
        beginHour: lec.beginHour,
        endHour: lec.endHour,
        scheduledLectures: lec.scheduledLectures,
        changeSchedule: <div style = {{textAlign : "center"}}> 
        
          <Button key={lec.lectureDay} variant="primary" onClick={(e) => this.confirm(lec.lectureDay, lec.beginHour, e)} type="submit"><FaCog size={20}></FaCog></Button>
  
        </div>,
      }
  
    });
    
    this.state = {
      course_id: props.course_id,
      lectures: props.lectures,
      showLectures : props.showLectures,
      showLectureSchedule: props.showLectureSchedule,
      role_id: props.role_id,
      show: false,
      scheduledLectures: finalScheduled,
      test: [],
      columns: [
        { name: 'lectureDay', title: 'Lecture Day' },
        { name: 'beginHour', title: 'Begin Hour' },
        { name: 'endHour', title: 'End Hour' },
        { name: 'scheduledLectures', title: 'Scheduled Lectures' },
        { name: 'changeSchedule', title: 'Change Schedule' }
      ],
      pageSizes: [5, 10, 15, 0],
      dayOfWeek: '',
      newBeginHour: moment().format("HH:mm"),
      newDay: 'Monday'
        
    };
  }
  
  confirm = (dayOfWeek, beginHour, event) => {

    event.preventDefault();
    this.showModal(dayOfWeek, beginHour);
    
  }

  setNewBeginHour = (e) => {
    console.log(e)
      this.setState({
        newBeginHour: moment(e).format("HH:mm")
      })


  }

  setNewDay = (day) => {

    this.setState({newDay: day.target.value})

  }

  showModal = (dayOfWeek, beginHour) => {
    this.setState({ show: true, dayOfWeek: dayOfWeek, beginHour: beginHour });
  };

  confirmModal = () => {
    console.log(this.state.course_id, this.state.dayOfWeek+":"+this.state.beginHour, this.state.newDay, this.state.newBeginHour)
    this.props.putCourseLectureSchedule(this.state.course_id, this.state.dayOfWeek+" "+this.state.beginHour, this.state.newDay, this.state.newBeginHour)
    this.setState({ show: false, name: '', surname: '', role_id: null});
  };

  hideModal = () => {
    this.setState({ show: false, name: '', surname: '', role_id: null});
  };

  /*onStatisticGroupByChange = (e) => {
  
    this.setState({ statisticsGroupBy: e.target.value })

  }*/
  /*const test = scheduledLectures.map((lec) => {
    
    return {
      lectureDay: lec.lectureDay,
      beginHour: lec.beginHour,
      endHour: lec.endHour,
      scheduledLectures: lec.scheduledLectures,
      changeSchedule: <div style = {{textAlign : "center"}}> 
      
        <Button variant="primary">Change Schedule</Button>

      </div>,
    }

  })*/


  render(){
    
    /*const [pageSizes] = useState([5, 10, 15, 0]);

    const [columns] = useState(
      [
          { name: 'lectureDay', title: 'Lecture Day' },
          { name: 'beginHour', title: 'Begin Hour' },
          { name: 'endHour', title: 'End Hour' },
          { name: 'scheduledLectures', title: 'Scheduled Lectures' },
          { name: 'changeSchedule', title: 'Change Schedule' }
      ]
    );
    const [integratedSortingColumnExtensions] = useState([
      //{ columnName: 'changeSchedule', compare: compareKey },
    ]);

    const [sortingStateColumnExtensions] = useState([
      { columnName: 'changeSchedule', sortingEnabled: false }
    ]);

    const [filteringStateColumnExtensions] = useState([
      { columnName: 'changeSchedule', filteringEnabled: false },
      { columnName: 'scheduleCourse', filteringEnabled: false },
    ]);*/
    return (
      <>
      
      <Paper>
        <Grid
          rows={this.state.scheduledLectures}
          columns={this.state.columns}
        >
          <SearchState/>
          <PagingState
            defaultCurrentPage={0}
            defaultPageSize={5}
            //pageSize={10}
          />
          
          <IntegratedPaging />
          <Table />
          <TableHeaderRow/>
          <PagingPanel pageSizes={this.state.pageSizes}/>
        </Grid>
      </Paper>
  
  
      <Modal show={this.state.show} handleClose={this.hideModal} backdrop="static" keyboard={false}  aria-labelledby="contained-modal-title-vcenter" centered>
          <Modal.Header >
              <Modal.Title>"{this.state.dayOfWeek}" lecture schedule </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row>
              <Col sm={1}></Col>
              <Col sm={4}>

                <Form.Group controlId="exampleForm.StartDay">
                  <Form.Label className="titleStatisticsCard">NEW DAY OF WEEK: </Form.Label>
                    <Form.Control defaultValue="Monday" as="select" onChange={this.setNewDay} custom>
                      <option>Monday</option>
                      <option>Tuesday</option>
                      <option>Wednesday</option>
                      <option>Thursday</option>
                      <option>Friday</option>
                      <option>Saturday</option>
                      <option>Sunday</option>
                    </Form.Control>
                </Form.Group>

              </Col>
              <Col sm={2}></Col>
              <Col sm={4}>

                <Form.Group controlId="exampleForm.StartDay">
                  <Form.Label className="titleStatisticsCard">NEW STARTING HOUR: </Form.Label>
                  <TimePickerComponent type="startDate" setStateDate={this.setNewBeginHour} ></TimePickerComponent>
                </Form.Group>

              </Col>
              <Col sm={1}></Col>
            </Row>
              { /*(this.state.name && this.state.role_id ==5) ?
              <> Do you want to confirm that <b> {this.state.name} {this.state.surname} </b> (SSN : <b>{this.state.SSN}</b>)  contracted Covid-19? </>
              :
              <> Student ID is not correct! Please retry with another student ID </>*/
              }
          </Modal.Body>
          <Modal.Footer>
                <Button variant="success" onClick={() => {this.confirmModal();}} > Confirm </Button>
                <Button variant="danger" onClick={() => {this.hideModal();}} > Go Back </Button>
          </Modal.Footer>
      </Modal>
  
      </>
    );
  }
  
}

export default SupportOfficerListLectures;