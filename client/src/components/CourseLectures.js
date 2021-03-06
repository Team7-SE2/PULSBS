import React, { useState } from 'react'
import moment from 'moment';
import Button from "react-bootstrap/Button";
import PaperInsideCard from './PaperInsideCard';
import { FaUsers, FaTrashAlt, FaTv } from 'react-icons/fa';
import Modal from "react-bootstrap/Modal"

const CourseLectures = (props) => {
    const [show, setShow] = useState(false);
    const [remote, setRemote] = useState(false);
    const [queue, setQueue] = useState(false);
    const [lecture, setLecture] = useState(null);

    const handleClose = () => { setShow(false); setRemote(false); }
    const handleShow = (lect) => { setLecture(lect); setShow(true); }
    const handleShowRemote = (l) => { setLecture(l); setRemote(true); setShow(true); }
    const handleShowQueue = (l) => { setLecture(l); setQueue(true); setShow(true);}

    let {lectures, course, bookLecture, deleteBookedLecture, bookedLectures, role_id, getListStudents, deleteLecture, turnOnRemote } = props;
    function checkPrenotation(bookedLectures2, lectureID) {

        return bookedLectures2.find((bl) => parseInt(bl.lecture_id) === parseInt(lectureID));

    }

    const compareDate = (a, b) => {

        const millisA = new Date(a).getTime();
        const millisB = new Date(b).getTime();

        return millisA - millisB;

    };

    const [integratedSortingColumnExtensions] = useState([
        { columnName: 'lectureDate', compare: compareDate }

    ]);

    const weekDays = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
    ]

    const [columns] = useState(
        role_id === 4 ?
            [
                //{ name: 'id', title: 'ID'},
                { name: 'lectureDate', title: 'Lecture Date' },
                { name: 'View list of students', title: 'View list of students' },
                { name: 'Switch to remote', title: 'Switch to remote' },
                { name: 'Delete the lecture', title: 'Delete the lecture' }
            ]
            : role_id === 5 ?
            [{ name: 'lectureDate', title: 'Lecture Date' },
            { name: 'book', title: ' ' }]
            :
            [
                { name: 'lectureDate', title: 'Lecture Date' },
                { name: 'lectureDay', title: 'Lecture Day' },
                { name: 'lectureDuration', title: 'Lecture Duration' }
            ]
    );

    const [sortingStateColumnExtensions] = useState([
        { columnName: 'Delete the lecture', sortingEnabled: false },
        { columnName: 'Switch to remote', sortingEnabled: false },
        { columnName: 'View list of students', sortingEnabled: false }
    ]);

    console.log("lectures: " + lectures)

    const test = lectures.sort((a,b) =>{return moment(a.date).unix() - moment(b.date).unix()}).filter(function (l) {
        {if (role_id == 5) return (!l.remote)
         else /*if (role_id == 4)*/ return l;}
    }).map((lec) => {

        if (role_id == 4) {
            return {
                id: lec.id,
                lectureDate: lec.deleted_at == null ?
                    <div style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"
                    }}>
                        {moment(new Date(lec.date)).format("LLL")}
                    </div>
                    :
                    <div style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        textDecoration: "line-through red"
                    }}>
                        {moment(new Date(lec.date)).format("LLL")}
                    </div>
                ,
                'View list of students': <div style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                }}>
                    {lec.deleted_at == null ? <Button onClick={() => getListStudents(lec)} ><FaUsers size={20} > </FaUsers></Button> : <Button disabled><FaUsers size={20} > </FaUsers></Button>}
                </div>,
                'Switch to remote':
                    <div style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"
                    }}>
                        {lec.deleted_at == null && moment(lec.date).isAfter(moment().add(30, 'minutes')) ? <Button disabled={lec.remote} onClick={() => { handleShowRemote(lec) }}> <FaTv size={20}></FaTv></Button> : <Button disabled> <FaTv size={20}></FaTv></Button>}
                    </div>,
                'Delete the lecture': <div style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                }}>
                    {(lec.deleted_at == null && moment(lec.date).isAfter(moment().add(1, 'hours'))) ? <Button variant="danger" onClick={() => { handleShow(lec) }}><FaTrashAlt size={20} ></FaTrashAlt></Button> : <Button disabled variant="danger"><FaTrashAlt size={20} ></FaTrashAlt></Button>}

                </div>
            }
        }

        else if (role_id == 5) {
            console.log("LECTURE: " + JSON.stringify(lec))
            return {
                id: lec.id,
                lectureDate: moment(new Date(lec.date)).format("LLL"),
                book: <div style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                }}>
                    {lec.deleted_at == null ? checkPrenotation(bookedLectures, lec.id) ? <Button variant="danger" onClick={() => {deleteBookedLecture(lec.id, course); }}> {(lec.full && bookedLectures.find((item)=> item.lecture_id == lec.id).waiting == true)/*&& lec.lecture_bookings.find((item)=>item.id == studentID).bookings.waiting ==true */ ? "LEAVE THE WAITING LIST" : "UNBOOK"} </Button> : <Button variant= {lec.full ? "warning" : "success"} onClick={() => {if(lec.full) {handleShowQueue(lec);} else {bookLecture(lec.id, 0);}} /*bookLecture(lec.id)*/}> {lec.full ? "ADD ME IN WAITING LIST" : "BOOK"} </Button> : <h5 style={{ color: "red", fontWeight: "bold" }}>Canceled</h5>}
                </div>,
            }
        }

        else if (role_id == 2) {
            return {
                id: lec.id,
                lectureDate: moment(new Date(lec.date)).format("LLL"),
                lectureDay: weekDays[moment(new Date(lec.date)).day()],
                lectureDuration: lec.duration + " hours",
            }
        }
    })


    return (
        <>
            <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false} remote={remote} lecture={lecture} queue = {queue}  aria-labelledby="contained-modal-title-vcenter"
      centered>
                <Modal.Header closeButton>
                    <Modal.Title>Pay attention </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    { queue ? 
                        <> The room is full! Do you want to be added in a waiting list? </>
                     :
                     remote ? <>
                        Do you want really switch this lecture in remote? <br></br> You can't go back</>
                        : <> Do you want really delete this lecture?<br></br> You can't go back </>
                    }
                </Modal.Body>
                <Modal.Footer>

                    { queue ?
                    <Button variant="success" onClick={() => {bookLecture(lecture.id, 1); handleClose();}} > YES </Button>
                    :
                        remote 
                        ?
                            <Button variant="danger" onClick={() => {turnOnRemote(lecture); handleClose();}} > Switch </Button>
                        :
                            <Button variant="danger" onClick={() =>  {deleteLecture(lecture);handleClose();}} >Delete</Button>
                    }
                    
                    { queue ? 
                    <Button variant="danger" onClick={handleClose} >NO</Button>
                    :
                    <Button variant="success"onClick={handleClose} >Go back</Button>
                     }
                </Modal.Footer>
            </Modal>

            <PaperInsideCard
                CardHeader={course.description + " lectures"}
                columns={columns}
                sortingStateColumnExtensions={sortingStateColumnExtensions}
                integratedSortingColumnExtensions={integratedSortingColumnExtensions}
                test={test}


            ></PaperInsideCard>
        </>
    );
}






export default CourseLectures;