import React from 'react';
import Header from "./components/Header";
import Login from "./components/Login"
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Redirect, Route } from 'react-router-dom';
import { Switch } from 'react-router';
import { withRouter } from 'react-router-dom';
import StudentList from "./components/StudentList";
import ListCourses from "./components/ListCourses";
import ContactTracingReport from "./components/ContactTracingReport";
import API from './api/api.js';
import { AuthContext } from "./auth/AuthContext";
import HomeCalendar from "./components/HomeCalendar.js";
import Aside from "./components/Aside.js";
import Card from "react-bootstrap/Card";
import "./App.css";
import CourseLectures from './components/CourseLectures';
import moment from 'moment';
import TeacherStatistics from './components/TeacherStatistics';
import UploadLists from './components/UploadLists';
import SupportOfficerListCourses from './components/SupportOfficerListCourses'
import SupportOfficerListLectures from './components/SupportOfficerListLectures'
import SupportOfficerLecturesRules from './components/SupportOfficerLecturesRules';
import PastLectures from './components/PastLectures';

function parseQuery(str) {
  if (typeof str != "string" || str.length == 0) return {};
  var q = str.split("?");
  if (q[1]) {
    var s = q[1].split("&");
    var s_length = s.length;
    var bit, query = {}, first, second;
    for (var i = 0; i < s_length; i++) {
      bit = s[i].split("=");
      first = decodeURIComponent(bit[0]);
      if (first.length == 0) continue;
      second = decodeURIComponent(bit[1]);
      if (typeof query[first] == "undefined") query[first] = second;
      else if (query[first] instanceof Array) query[first].push(second);
      else query[first] = [query[first], second];
    }
    return query;
  }
  return {};
}
parseQuery(document.URL);

const options = {
  scales: {
    yAxes: [
      {
        ticks: {
          beginAtZero: true,
          precision: 0
        },
      },
    ],
    xAxes: [
      {
        ticks: {
          beginAtZero: true,
          precision: 0
        },
      },
    ],
  },
}
const optionsBarChart = {
  scales: {
    yAxes: [
      {
        ticks: {
          beginAtZero: true,
          precision: 0
        },
        stacked: true
      },
    ],
    xAxes: [
      {
        ticks: {
          beginAtZero: true,
          precision: 0
        },
        stacked: true
      }
    ]
  },
}
class App extends React.Component {

  constructor(props) {
    super(props);
    let course = { subjectID: " " };
    let lecture = {};

    this.state = {
      authUser: null,
      info_user: { role_id: "" },
      login_error: null,
      courses: [],
      lectures: [],
      students: [],
      logged: false,
      course: course,
      lecture: lecture,
      bookedLectures: null
    }
    this.initialState = { ...this.state };



  }

  userLogin = (username, password) => {

    API.userLogin(username, password).then(
      (userObj) => {
        const info = {
          ID_User: userObj.id,
          nome: userObj.name,
          role_id: userObj.role_id,
          email: userObj.email

        };
        this.setState({ logged: true });
        this.setState({ loginError: false });
        this.setState({ info_user: info });
        this.setState({ authUser: info });
        this.setState({ ID_User: info.ID_User })
        this.setState({ statisticsGroupBy: 'days' })
        this.setState({ startFilterDate: moment().add(-7, "days").startOf("day") })
        this.setState({ endFilterDate: moment().endOf("day") })



        if (info.role_id === 5) {
          this.loadInitialDataStudent();
          this.props.history.push("/student");
        }
        if (info.role_id === 4) {
          this.loadInitialDataTeacher();

        }
        if (info.role_id === 3) {
          this.setState({ statisticsSubject: 'All' })
          this.loadInitialSubjects();
        }

        if (info.role_id === 2) {
          //this.loadInitialSubjects();
          API.getSubjects()
            .then((courses) => {
              this.setState({ courses: courses })
              this.props.history.push("/supportOfficer");
            })
        }

      }
    ).catch((err) => {

      this.setState({ loginError: true })
      this.handleErrors(err);
    });
  }

  userLogout = () => {

    API.userLogout().then(() => {
      this.resetState();
      this.setState(this.initialState);

      this.props.history.push("/login");


    });
  }

  showStudentsLectures = (course) => {
    API.getStudentCourseLectures(course.id)
      .then((lectures) => {
        this.setState({ course: course });
        this.setState({ lectures: lectures.filter((s) => moment(s.date).isAfter(moment().add("days", 1).set("hours", 0).set("minutes", 0).set("seconds", 0))) });
        this.props.history.push("/student/courses/" + course.subjectID + "/lectures");
        console.log("AGGIORNATA LISTA LEZIONI")

      })
      .catch((err) => {
        this.handleErrors(err);
      });
  }

  showTeachersLectures = (course) => {
    API.getStudentCourseLectures(course.id)
      .then((lectures) => {
        //this.setState({ course: course });
        this.setState({ course: course, lectures: lectures.filter((s) => moment(s.date).isAfter(moment())) });
        this.props.history.push("/teacher/courses/" + course.subjectID + "/lectures");

      })
      .catch((err) => {
        this.handleErrors(err);
      });
  }

  showPastLectures = (course) => {
    API.getStudentCourseLectures(course.id)
      .then((lectures) => {
        //this.setState({ course: course });
        this.setState({ course: course, lectures: lectures.filter((s) => moment(s.date).isSameOrBefore(moment())) });
        this.props.history.push("/teacher/courses/" + course.subjectID + "/PastLectures");

      })
      .catch((err) => {
        this.handleErrors(err);
      });
  }


  showCourseLectures = (course) => {
    API.getStudentCourseLectures(course.id)
      .then((lectures) => {
        console.log(lectures)
        //this.setState({ course: course });
        this.setState({ course: course, lectures: lectures.filter((s) => moment(s.date).isAfter(moment())) });
        this.props.history.push("/supportOfficer/courseSchedule/" + course.subjectID + "/lectures");

      })
      .catch((err) => {
        this.handleErrors(err);
      });
  }

  showCourseLecturesSchedule = (course) => {
    API.getStudentCourseLectures(course.id)
      .then((lectures) => {
        //this.setState({ course: course });
        console.log("LECTURES: " + lectures.length)
        this.setState({ course: course, lectures: lectures.filter((s) => moment(s.date).isAfter(moment())) });
        this.props.history.push("/supportOfficer/courseSchedule/" + course.subjectID + "/lectureSchedule");

      })
      .catch((err) => {
        this.handleErrors(err);
      });
  }

  getStudentsList = (lecture) => {
    API.getStudentListforLecture(lecture.id)
      .then((students) => {
        this.setState({ students: students, lecture: lecture });
        this.props.history.push("/teacher/lectures/" + lecture.id + "/students");

      })
      .catch((err) => {
        this.handleErrors(err);
      });

  }

  getListStudentsPast = (lecture) => {
    API.getStudentListforLecture(lecture.id)
      .then((students) => {
        this.setState({ students: students, lecture: lecture });
        this.props.history.push("/teacher/PastLectures/" + lecture.id + "/students");

      })
      .catch((err) => {
        this.handleErrors(err);
      });

  }

  setStateDate = (type, date) => {

    if (type === "startDate") {

      this.setState({ startFilterDate: moment(date) })

    } else if (type === "endDate") {

      this.setState({ endFilterDate: moment(date) })

    }

  }

  loadInitialDataStudent = () => {


    API.getStudentCourses(this.state.info_user.ID_User)
      .then((courses) => {
        this.setState({ courses: courses })
      }
      ).catch((err) => {
        this.handleErrors(err);
      });
    API.getBookedLectures(this.state.info_user.ID_User)
      .then((bookedLectures) => {
        const myBookedLectures = [];
        bookedLectures.forEach(elem => {
          if (elem.user_id === this.state.info_user.ID_User)
            myBookedLectures.push(elem);
        });
        this.setState({ bookedLectures: myBookedLectures });
      })
      .catch((err) => {
        this.handleErrors(err);
        console.log("Errore in getBookedLectures");
      });
  }

  loadInitialDataTeacher = () => {

    API.getTeacherSubjects(this.state.info_user.ID_User)
      .then((courses) => {
        this.setState({ courses: courses })
        this.props.history.push("/teacher");
      });
  }

  loadInitialSubjects = () => {

    API.getSubjects()
      .then((subjects) => {
        this.setState({ subjects: subjects })
        this.setState({ statisticsSubject: 'All' })
        this.props.history.push("/bookingManager");
      })
  }


  handleErrors(err) {
    this.setState({ logged: false });
    this.props.history.push("/login");
  }


  bookLecture = (LectureID, LectureWaiting) => {
    console.log("****************************" + LectureWaiting);
    API.bookLecture(this.state.authUser.ID_User, LectureID, this.state.info_user.email, LectureWaiting)
      .then(() => {


        this.loadInitialDataStudent();

      })
      .catch((err) => {
        this.handleErrors(err);
      });
  }

  changePresence = (studentID, LectureID, present) => {

    API.putPresence(studentID, LectureID, present)
      .then(() => {
        API.getStudentListforLecture(LectureID)
      .then((students) => {
        this.setState({ students: students});
        this.props.history.push("/teacher/PastLectures/" + this.state.lecture.id + "/students");

      })
      .catch((err) => {
        this.handleErrors(err);
      });
    });
  }

  deleteBookedLecture = (LectureID, course) => {
    API.deleteBookedLecture(this.state.authUser.ID_User, LectureID)
      .then(() => {
        this.showStudentsLectures(course);
        this.loadInitialDataStudent();

      })
      .catch((err) => {
        this.handleErrors(err);
      });
  }

  putCourseLectureSchedule = (subject_id, old_day, old_duration, new_day, new_hour, new_duration) => {

    API.putCourseLectureSchedule(subject_id, old_day, old_duration, new_day, new_hour, new_duration)
      .then(() => {
        this.showCourseLecturesSchedule(this.state.course)
        /*API.getStudentCourseLectures(subject_id)
          .then((lectures) => {
            console.log("LETTURE:_ " + JSON.stringify(lectures.filter((s) => moment(s.date).isAfter(moment()))))
            this.setState({ lectures: lectures.filter((s) => moment(s.date).isAfter(moment())) });
            //this.props.history.push("/supportOfficer/courseSchedule/" + subject_id + "/lectureSchedule");
          })
          .catch((err) => {
            this.handleErrors(err);
          });*/
      })
  }

  deleteLecture = (lecture) => {
    API.deleteLecture(lecture.id)
      .then(() => {
        //this.loadInitialDataTeacher();
        API.getStudentCourseLectures(lecture.subject_id)
          .then((lectures) => {
            this.setState({ lectures: lectures.filter((s) => moment(s.date).isAfter(moment())) });
          });
      })
      .catch((err) => {
        console.log("errore")
      })
  }

  switchRoute = (path) => {
    this.props.history.push(path);
  }

  onStatisticGroupByChange = (e) => {

    this.setState({ statisticsGroupBy: e.target.value })
  }

  onStatisticSubjectChange = (e) => {
    console.log("filter subject: " + e.target.value)
    this.setState({ statisticsSubject: e.target.value })
  }

  turnOnRemote = (lecture) => {
    API.turnOnRemote(lecture.id)
      .then(() => {
        //this.loadInitialDataTeacher();
        API.getStudentCourseLectures(lecture.subject_id)
          .then((lectures) => {
            this.setState({ lectures: lectures.filter((s) => moment(s.date).isAfter(moment())) });
          });

      })
      .catch(() => {
        console.log("Errore put");
      });
  }

  //questa funzione restituisce un array col dataset pronto per il grafico
  getDataGrouped = (data, groupBy, startDate, endDate, type) => {

    //groupBy deve essere 'hours','days','months'
    //data deve essere un array e avere il campo created_at (o un campo creato ad hoc timestamp)

    var start = moment(startDate).startOf(groupBy)
    var end = moment(endDate).startOf(groupBy)
    var numSpans = end.diff(start, groupBy);
    var res = []
    for (let i = 0; i <= numSpans; i++) {
      res[i] = 0;
    }
    data.forEach((d) => {
      var index;
      if (type == 'bookings')
        index = moment(d.lecture.date).startOf(groupBy).diff(start, groupBy);
      else {
        if (d.date)
          index = moment(d.date).startOf(groupBy).diff(start, groupBy);
        else
          index = moment(d.created_at).startOf(groupBy).diff(start, groupBy);
      }
      if (!res[index])
        res[index] = 0;
      res[index]++;
    })


    return res;
  }

  getTimeSpans = (groupBy, startDate, endDate) => {

    //groupBy deve essere 'hours','days','months'

    var start = moment(startDate).startOf(groupBy)
    var end = moment(endDate).startOf(groupBy)
    var numSpans = end.diff(start, groupBy);
    var res = [];
    var formatString = '';
    switch (groupBy) {
      case 'hours': { formatString = 'll:HH:mm' } break;
      case 'days': { formatString = 'll' } break;
      case 'weeks': { formatString = 'll' } break;
      case 'months': { formatString = 'MMMM' } break;
      default: { formatString = 'lll' } break;
    }
    for (var i = 0; i <= numSpans; i++) {
      if (groupBy == 'weeks')
        res[i] = start.clone().add(i, groupBy).format(formatString) + ' - ' + start.clone().add(i, groupBy).endOf(groupBy).format(formatString);
      else
        res[i] = start.clone().add(i, groupBy).format(formatString);
    }


    return res;
  }

  generateData = () => {

    let get = parseQuery(document.URL);
    let startDate = moment(this.state.startFilterDate).toDate();
    let endDate = moment(this.state.endFilterDate).toDate();

    let statistics = {
      studentsBookings: 0,
      numberOfLessons: 0,
      numberOfLessonsCancelled: 0,
      numberOfLessonsRemote: 0,
      numberOfLessonPresence: 0
    }
    let courseLecturesParams = {
      startDate: startDate,//moment().add(-3, "days").toISOString(),
      endDate: endDate, //moment().toISOString()
    }

    if (this.state.info_user.role_id != 3)
      courseLecturesParams.teacher_id = this.state.authUser.ID_User;

    if (get.subjectId)
      courseLecturesParams.subject_id = get.subjectId;

    if (this.state.info_user.role_id == 3 && this.state.statisticsSubject != 'All')
      courseLecturesParams.subject_id = this.state.statisticsSubject;

    API.getCourseLectures(courseLecturesParams)
      .then((lectures) => {

        var lecturesFiltered = lectures.filter((a) => {
          return !a.deleted_at;
        });
        var lecturesCanceled = lectures.filter((a) => {
          return a.deleted_at;
        });
        var lecturesInPresence = lecturesFiltered.filter((a) => {
          return !a.remote;
        });
        var lecturesRemote = lecturesFiltered.filter((a) => {
          return a.remote;
        });

        statistics.numberOfLessons = lectures.length;

        lectures.forEach((elem) => {
          //statistics.studentsCounts += elem.studentsCount;
          if (elem.deleted_at != null) statistics.numberOfLessonsCancelled++;
          else {
            if (elem.remote) statistics.numberOfLessonsRemote++;
            else statistics.numberOfLessonPresence++;
          }
        });

        this.setState({
          lectureData: {
            labels: this.getTimeSpans(this.state.statisticsGroupBy, startDate, endDate),
            datasets: [
              {
                label: 'Lectures In Presence',
                data: this.getDataGrouped(lecturesInPresence, this.state.statisticsGroupBy, startDate, endDate),
                fill: false,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
              },
              {
                label: 'Lectures Remote',
                data: this.getDataGrouped(lecturesRemote, this.state.statisticsGroupBy, startDate, endDate),
                fill: false,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
              },
              {
                label: 'Lectures Canceled',
                data: this.getDataGrouped(lecturesCanceled, this.state.statisticsGroupBy, startDate, endDate),
                fill: false,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
              },
            ],

          },
          //statistics: statistics
        })


      })
      .catch((err) => {
        console.log("err: " + JSON.stringify(err))
      })

    API.getStatisticsBookings(courseLecturesParams)
      .then((bookings) => {
        statistics.studentsBookings = bookings.length;

        bookings.sort((a, b) => {
          return moment(a.lecture.date).unix() - moment(b.lecture.date).unix()
        })
        this.setState({
          bookingsData: {
            labels: this.getTimeSpans(this.state.statisticsGroupBy, startDate, endDate),
            datasets: [
              {
                label: 'Bookings',
                data: this.getDataGrouped(bookings, this.state.statisticsGroupBy, startDate, endDate, "bookings"),
                fill: false,
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgba(255, 99, 132, 0.2)',
                lineTension: 0,
              }
            ]
          }
        })

        var bookingsPerLectureObj = {};
        var bookingsPerLectureData = [];
        var bookingsPerLectureLabels = [];

        var attendancePerLectureObj = {};
        var attendancePerLectureData = [];

        bookings.forEach((booking) => {
          if (booking.lecture && booking.lecture.date && booking.lecture.subject && booking.lecture.subject.subjectID) {
            if (!bookingsPerLectureObj[booking.lecture.date])
              bookingsPerLectureObj[booking.lecture.date] = { count: 0, subjectID: booking.lecture.subject.subjectID }

            if (!attendancePerLectureObj[booking.lecture.date])
              attendancePerLectureObj[booking.lecture.date] = { count: 0, subjectID: booking.lecture.subject.subjectID }

            if (booking.present)
              attendancePerLectureObj[booking.lecture.date].count++;
            bookingsPerLectureObj[booking.lecture.date].count++;

          }
        })
        Object.keys(bookingsPerLectureObj).forEach((k) => {
          bookingsPerLectureData.push(bookingsPerLectureObj[k].count);
          attendancePerLectureData.push(attendancePerLectureObj[k].count);          
          bookingsPerLectureLabels.push(bookingsPerLectureObj[k].subjectID + ' - ' + moment(k).format("lll"));
        })

        this.setState({
          bookingsLectureData: {
            labels: bookingsPerLectureLabels,
            datasets: [
              {
                label: 'Bookings',
                data: bookingsPerLectureData,
                fill: false,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
                order: 1
              },
              {
                label: 'Attendances',
                data: attendancePerLectureData,
                fill: false,
                // borderColor: '#EC932F',
                // backgroundColor: '#EC932F',
                // pointBorderColor: '#EC932F',
                // pointBackgroundColor: '#EC932F',
                // pointHoverBackgroundColor: '#EC932F',
                // pointHoverBorderColor: '#EC932F',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                //borderColor: 'rgba(54, 162, 235, 1)',
                type: "line",
                lineTension: 0,
                order: 2
                //borderWidth: 1,
              }
            ]
          },
          statistics: statistics
        })
      })
      .catch((err) => {
        console.log(err);
      })
  }

  resetState = () => {
    this.setState({
      statistics: {},
      lectureData: { labels: [], datasets: [] },
      bookingsData: { labels: [], datasets: [] },
      bookingsLectureData: { labels: [], datasets: [] }
    })
  }



  render() {

    const value = {
      authUser: this.state.authUser,
      authErr: this.state.authErr,
      loginUser: this.login
    }

    return (
      <AuthContext.Provider value={value}>

        <Container className="backgroundPages" style={{ maxWidth: '100%', overflowX: 'hidden', padding: '0px' }}>
          <Row className="vheight-100">
            {this.state.logged ? <Col sm={2}>
              <div style={{ position: "fixed", height: '100%', zIndex: 9999 }}>
                <Aside
                  courses={this.state.courses}
                  //image={image}
                  collapsed={false}
                  rtl={false}
                  toggled={false}
                  handleToggleSidebar={false}
                  style={{ height: '100%' }}
                  userLogout={this.userLogout}
                  role_id={this.state.info_user.role_id}
                  logged={this.state.logged}
                  resetState={this.resetState}
                />
              </div>
            </Col> : <></>}

            <Col >
              {this.state.logged ? <Header userLogout={this.userLogout} role_id={this.state.info_user.role_id} logged={this.state.logged} /> : <></>}

              <Switch>

                <Route exact path="/">
                  {this.state.logged ? <Redirect to="/" /> : <Redirect to="/login" />}

                </Route>

                <Route path="/login">
                  <Container fluid className="backgroundLogin">
                    <Login userLogin={this.userLogin} loginError={this.state.loginError} />
                  </Container>
                </Route>

                <Route exact path="/bookingManager">
                  {this.state.logged ? <Redirect to="/bookingManager" /> : <Redirect to="/login" />}
                  <TeacherStatistics title={(this.state.statisticsSubject == 'All') ? 'OVERALL STATISTICS' : (this.state.subjects ? this.state.subjects.find((el) => { return (el.id == this.state.statisticsSubject) }) : 'OVERALL STATISTICS').description + ' Statistics'} subjects={this.state.subjects} statisticsSubject={this.state.statisticsSubject} statisticsGroupBy={this.state.statisticsGroupBy} onStatisticGroupByChange={this.onStatisticGroupByChange} onStatisticSubjectChange={this.onStatisticSubjectChange} setStateDate={this.setStateDate} generateData={this.generateData} statistics={this.state.statistics} lectureData={this.state.lectureData} optionsBarChart={optionsBarChart} bookingsData={this.state.bookingsData} bookingsLectureData={this.state.bookingsLectureData} options={options}></TeacherStatistics>
                </Route>

                <Route exact path="/bookingManager/contactTracingReport">
                    <Row>
                      <Col sm={8} style={{ paddingLeft: "50px" }}><h3 style={{ color: "white" }}>CONTACT TRACING REPORT</h3></Col>
                    </Row>
                    <Row >
                      <Col sm={1}></Col>
                      <Col sm={10} className="below-nav">
                        <Card>
                          <Card.Header className="text-center">
                            <h3>Contact Tracing Report</h3>
                          </Card.Header>
                          <Card.Body style={{ alignSelf: "center" }} >
                            {/* qui ci metto il form dove segnalo la positività di un paziente */}
                            <ContactTracingReport />
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>
                    
                </Route>

                <Route exact path="/supportOfficer">
                  {!this.state.logged && <Redirect to="/login" />}
                  <Row>
                      <Col sm={8} style={{ paddingLeft: "50px" }}><h3 style={{ color: "white" }}>UPLOAD CSV</h3></Col>
                  </Row>
                  <UploadLists />
                </Route>

                <Route exact path="/supportOfficer/courseSchedule">
                  {!this.state.logged && <Redirect to="/login" />}
                  <Row>
                      <Col sm={8} style={{ paddingLeft: "50px" }}><h3 style={{ color: "white" }}>COURSE SCHEDULE</h3></Col>
                  </Row>
                  <Container fluid>
                    <Row >
                      <Col sm={1}></Col>
                      <Col sm={10} className="below-nav">
                        <Card>
                          <Card.Header className="text-center">
                            <h3>All Courses schedule</h3>
                          </Card.Header>
                          <Card.Body>
                            <SupportOfficerListCourses courses={this.state.courses} showLectures={this.showCourseLectures} showLecturesSchedule={this.showCourseLecturesSchedule} role_id={this.state.info_user.role_id} />
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>
                  </Container>
                </Route>
                <Route exact path={"/supportOfficer/courseSchedule/" + this.state.course.subjectID + "/lectureSchedule"}>
                  {!this.state.logged && <Redirect to="/login" />}
                  <Row>
                      <Col sm={8} style={{ paddingLeft: "50px" }}><h3 style={{ color: "white" }}>COURSE SCHEDULE</h3></Col>
                  </Row>
                  <Container fluid>
                    <Row >
                      <Col sm={1}></Col>
                      <Col sm={10} className="below-nav">
                        <Card>
                          <Card.Header className="text-center">
                            <h3>"{this.state.course.description}" schedule</h3>
                          </Card.Header>
                          <Card.Body>
                            <SupportOfficerListLectures course_id={this.state.course.id} lectures={this.state.lectures} showLectures={this.showCourseLectures} putCourseLectureSchedule={this.putCourseLectureSchedule} role_id={this.state.info_user.role_id} />
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>
                  </Container>
                </Route>
                <Route exact path={"/supportOfficer/courseSchedule/" + this.state.course.subjectID + "/lectures"}>
                  <Row>
                      <Col sm={8} style={{ paddingLeft: "50px" }}><h3 style={{ color: "white" }}>COURSE SCHEDULE</h3></Col>
                  </Row>
                  <Container fluid>
                    <Row >
                      <Col sm={1} className="below-nav" />
                      <Col sm={10} className="below-nav">
                        <CourseLectures turnOnRemote={this.turnOnRemote} role_id={this.state.info_user.role_id} lectures={this.state.lectures} course={this.state.course} />
                      </Col>
                      <Col sm={1} className="below-nav" />

                    </Row>
                  </Container>

                </Route>

                <Route exact path={"/supportOfficer/lectures"}>
                  <Row>
                      <Col sm={8} style={{ paddingLeft: "50px" }}><h3 style={{ color: "white" }}>UPDATE BOOKABLE LECTURES</h3></Col>
                  </Row>
                  <Container fluid>
                    <Row >
                      <Col sm={1} className="below-nav" />
                      <Col sm={10} className="below-nav">
                        <SupportOfficerLecturesRules />
                      </Col>
                      <Col sm={1} className="below-nav" />

                    </Row>
                  </Container>

                </Route>

                <Route exact path="/student">
                  {this.state.logged ? <Redirect to="/student" /> : <Redirect to="/login" />}
                  <Container fluid>
                    <Row>
                      <Col sm={8} style={{ paddingLeft: "50px" }}><h3 style={{ color: "white" }}>TEACHING LOAD</h3></Col>
                    </Row>
                    <Row /* style={{paddingTop: '5%'}}*/>
                      <Col sm={2}></Col>
                      <Col sm={8} className="below-nav">
                        <Card>
                          <Card.Header className="text-center">
                            <h3>My teaching load</h3>
                          </Card.Header>
                          <Card.Body>
                            <ListCourses courses={this.state.courses} showLectures={this.showStudentsLectures} role_id={this.state.info_user.role_id} />
                          </Card.Body>
                        </Card>
                      </Col>
                      <Col sm={2}></Col>
                      <Col sm={1}></Col>
                      <Col sm={10} className="below-nav">
                        <Card>
                          <Card.Header className="text-center">
                            <h3>Available Lectures Calendar</h3>
                          </Card.Header>
                          <Card.Body>
                            <HomeCalendar userId={this.state.ID_User} isStudent={true}></HomeCalendar>
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>

                  </Container>

                </Route>

                <Route exact path="/student/calendar">
                  <Container fluid>
                    <Row>
                      <Col sm={8} style={{ paddingLeft: "50px" }}><h3 style={{ color: "white" }}>MY BOOKINGS</h3></Col>
                    </Row>
                    <Row >
                      <Col sm={1}></Col>
                      <Col sm={10} className="below-nav">
                        <Card>
                          <Card.Header className="text-center">
                            <h3>My Bookings Calendar</h3>
                          </Card.Header>
                          <Card.Body>
                            <HomeCalendar userId={this.state.ID_User} isMyCalendar={true} isStudent={true}></HomeCalendar>
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>
                  </Container>
                </Route>

                <Route exact path={"/student/courses/" + this.state.course.subjectID + "/lectures"}>
                  <Container fluid>
                    <Row >
                      <Col sm={3} className="below-nav" />
                      <Col sm={6} className="below-nav">
                        <CourseLectures studentID={this.state.info_user.ID} role_id={this.state.info_user.role_id} lectures={this.state.lectures} course={this.state.course} bookLecture={this.bookLecture} deleteBookedLecture={this.deleteBookedLecture} bookedLectures={this.state.bookedLectures} deleteLecture={this.deleteLecture} showStudentsLectures={this.showStudentsLectures} />
                      </Col>
                      <Col sm={3} className="below-nav" />

                    </Row>
                  </Container>

                </Route>


                <Route exact path="/teacher">
                  {this.state.logged ? <Redirect to="/teacher" /> : <Redirect to="/login" />}
                  
                    <Row>
                      <Col sm={8} style={{ paddingLeft: "50px" }}><h3 style={{ color: "white" }}>MY COURSES</h3></Col>
                    </Row>
                    <Row >
                      <Col sm={1}></Col>
                      <Col sm={10} className="below-nav">
                        <Card>
                          <Card.Header className="text-center">
                            <h3>My Courses</h3>
                          </Card.Header>
                          <Card.Body>
                            <ListCourses courses={this.state.courses} showLectures={this.showTeachersLectures} role_id={this.state.info_user.role_id} showPastLectures={this.showPastLectures} />
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>
                    <Row >
                      <Col sm={1}></Col>
                      <Col sm={10} className="below-nav">
                        <Card>
                          <Card.Header className="text-center">
                            <h3>Lectures Calendar</h3>
                          </Card.Header>
                          <Card.Body>
                            <HomeCalendar userId={this.state.ID_User} isStudent={false}></HomeCalendar>
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>
                </Route>
                <Route exact path={"/teacher/courses/" + this.state.course.subjectID + "/lectures"}>
                  <Container fluid>
                    <Row >
                      <Col sm={1} className="below-nav" />
                      <Col sm={10} className="below-nav">
                        <CourseLectures turnOnRemote={this.turnOnRemote} role_id={this.state.info_user.role_id} lectures={this.state.lectures} course={this.state.course} getListStudents={this.getStudentsList} deleteLecture={this.deleteLecture} />
                      </Col>
                      <Col sm={1} className="below-nav" />

                    </Row>
                  </Container>

                </Route>

                <Route exact path={"/teacher/courses/" + this.state.course.subjectID + "/PastLectures"}>
                  <Container fluid>
                    <Row >
                      <Col sm={1} className="below-nav" />
                      <Col sm={10} className="below-nav">
                       <PastLectures lectures={this.state.lectures} course={this.state.course} getListStudentsPast={this.getListStudentsPast} />
                      </Col>
                      <Col sm={1} className="below-nav" />

                    </Row>
                  </Container>

                </Route>


                <Route exact path={"/teacher/PastLectures/" + this.state.lecture.id + "/students"}>
                  <Container fluid>
                    <Row >
                      <Col sm={3} className="below-nav" />
                      <Col sm={6} className="below-nav">
                        <StudentList switchRoute={this.switchRoute} students={this.state.students} course={this.state.course} lecture={this.state.lecture} role_id={this.state.info_user.role_id} recordPresence ={true}  changePresence={this.changePresence}/>
                      </Col>
                      <Col sm={3} className="below-nav" />

                    </Row>
                  </Container>

                </Route>


                <Route exact path={"/teacher/lectures/" + this.state.lecture.id + "/students"}>
                  <Container fluid>
                    <Row >
                      <Col sm={3} className="below-nav" />
                      <Col sm={6} className="below-nav">
                        <StudentList switchRoute={this.switchRoute} students={this.state.students} course={this.state.course} lecture={this.state.lecture} role_id={this.state.info_user.role_id} recordPresence ={false} />
                      </Col>
                      <Col sm={3} className="below-nav" />

                    </Row>
                  </Container>

                </Route>


                {this.state.info_user.role_id == 4 ?
                  <>
                    <Route exact path={"/teacher/statistics/overall"}>
                      <TeacherStatistics title="OVERALL" statisticsGroupBy={this.state.statisticsGroupBy} onStatisticGroupByChange={this.onStatisticGroupByChange} setStateDate={this.setStateDate} generateData={this.generateData} statistics={this.state.statistics} lectureData={this.state.lectureData} optionsBarChart={optionsBarChart} bookingsData={this.state.bookingsData} bookingsLectureData={this.state.bookingsLectureData} options={options}></TeacherStatistics>
                    </Route>
                    {this.state.courses.map((course) => <Route exact path={"/teacher/statistics/" + course.subjectID}>
                      <TeacherStatistics title={course.description.toUpperCase()} statisticsGroupBy={this.state.statisticsGroupBy} onStatisticGroupByChange={this.onStatisticGroupByChange} setStateDate={this.setStateDate} generateData={this.generateData} statistics={this.state.statistics} lectureData={this.state.lectureData} optionsBarChart={optionsBarChart} bookingsData={this.state.bookingsData} bookingsLectureData={this.state.bookingsLectureData} options={options}></TeacherStatistics>
                    </Route>)}
                  </> : <Redirect to="/login" />}

              </Switch>

            </Col>
          </Row>
        </Container >
      </AuthContext.Provider >

    );
  }
}

export default withRouter(App);