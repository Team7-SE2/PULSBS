import React from 'react';
import Card from "react-bootstrap/Card";
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Form from "react-bootstrap/Form";
import DatePickerComponent from './DatePickerComponent';
import Button from "react-bootstrap/Button";
import StatisticsComponet from './StatisticsComponent';
import { Line, Bar, HorizontalBar } from 'react-chartjs-2'


const TeacherStatistics = (props) => {
    let { title, statisticsGroupBy, onStatisticGroupByChange, setStateDate, generateData, statistics, lectureData, optionsBarChart, bookingsData, bookingsLectureData, options } = props;
    return <>
        
        <Row>
                        <Col sm={8} style={{ paddingLeft: "50px" }}><h3 style={{ color: "white" }}>{title}</h3></Col>
                      </Row>

                      <br />

                      <Row>
                        <Col sm={1}></Col>
                        <Col sm={10}>
                          <Card>
                            <Card.Body>
                              <Form>
                                <Row>
                                  <Col sm={2}>
                                    <Form.Group controlId="exampleForm.GroupBy">
                                      <Form.Label>Group By</Form.Label>
                                      <br />
                                      <Form.Control defaultValue="days" value={statisticsGroupBy} as="select" onChange={onStatisticGroupByChange} custom>
                                        <option>hours</option>
                                        <option>days</option>
                                        <option>weeks</option>
                                        <option>months</option>
                                      </Form.Control>
                                    </Form.Group>
                                  </Col>
                                  <Col sm={1}></Col>
                                  <Col sm={3}>
                                    <Form.Group controlId="exampleForm.StartDay">
                                      <Form.Label>Start day : </Form.Label>
                                      <DatePickerComponent type="startDate" setStateDate={setStateDate} ></DatePickerComponent>
                                    </Form.Group>                                  </Col>
                                  <Col sm={3}>
                                    <Form.Group controlId="exampleForm.EndDay">
                                      <Form.Label>End day : </Form.Label>
                                      <DatePickerComponent type="endDate" setStateDate={setStateDate}></DatePickerComponent>
                                    </Form.Group>                                  </Col>
                                  <Col sm={1}></Col>
                                  <Col sm={1} style={{ alignSelf: "center" }}>
                                    <Button variant="primary" onClick={generateData} >Generate</Button>
                                  </Col>
                                </Row>
                              </Form>
                            </Card.Body>
                          </Card>
                        </Col>
                      </Row>

                      <br />

                      <Row>
                        <StatisticsComponet statistics={statistics} />
                      </Row>

                      <br />

                      <Row>
                        <Col sm={1}></Col>
                        <Col sm={10}>
                          <Card>
                            <Card.Header className="text-center">
                              <h3 className='title'>Number of Lectures</h3>
                            </Card.Header>
                            <Card.Body>
                              <Bar data={lectureData} options={optionsBarChart} />
                            </Card.Body>
                          </Card>
                        </Col>
                      </Row>

                      <br />

                      <Row>
                        <Col sm={1}></Col>
                        <Col sm={10}>
                          <Card>
                            <Card.Header className="text-center">
                              <h3 className='title'>Number of Bookings</h3>
                            </Card.Header>
                            <Card.Body>
                              <Line data={bookingsData} options={options} />
                            </Card.Body>
                          </Card>
                        </Col>
                      </Row>

                      <br />

                      <Row>
                        <Col sm={1}></Col>
                        <Col sm={10}>
                          <Card>
                            <Card.Header className="text-center">
                              <h3 className='title'>Number of Bookings per Lecture</h3>
                            </Card.Header>
                            <Card.Body>
                              <Bar data={bookingsLectureData} options={options} />
                            </Card.Body>
                          </Card>
                        </Col>
                      </Row>

                      <br />
    </>

}

export default TeacherStatistics;