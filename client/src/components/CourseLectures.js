import React, { useState} from 'react'
import moment from 'moment';
import Button from "react-bootstrap/Button";
import PaperInsideCard from './PaperInsideCard';
import { FaUsers, FaTrashAlt} from 'react-icons/fa';
import Nav from 'react-bootstrap/Nav';

const CourseLectures = (props) => {
  
    let { lectures, course, bookLecture, deleteBookedLecture, bookedLectures, role_id, getListStudents, deleteLecture  } = props;
  
    function checkPrenotation (bookedLectures2, lectureID){

        console.log(bookedLectures2);
        return bookedLectures2.find((bl) => bl.lecture_id===lectureID); 

    }

    const compareDate = (a, b) => {

        console.log(a,b)
        const millisA = new Date(a).getTime();
        const millisB = new Date(b).getTime();
    
        return millisA - millisB;
    
    };
    
    const [integratedSortingColumnExtensions] = useState([
        { columnName: 'lectureDate', compare: compareDate },
        { columnName: 'View list of students'},
        { columnName: 'Delete the lecture'},
    ]);
    
   

    const [columns] = useState(
        role_id === 4 ?
        [
        //{ name: 'id', title: 'ID'},
        { name: 'lectureDate',title: 'Lecture Date'},
        { name: 'View list of students', title: 'View list of students' },
        { name: 'Delete the lecture', title: 'Delete the lecture' }
        ]
        :
        [ { name: 'lectureDate',title: 'Lecture Date'},
           { name: 'book',title: ' '}]
    );
    
    const [sortingStateColumnExtensions] = useState([
        { columnName: ' ', sortingEnabled: false },
    ]);

    const test = lectures.map((lecture) => {
        console.log("lecture deleted at" + lecture.deleted_at)
        

        if(role_id == 4){
        return {
        id: lecture.id,
        lectureDate: moment(new Date(lecture.date)).format("LLL"),
        'View list of students':   <div style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center"
                        }}>
                       { lecture.deleted_at == null ? <Button ><FaUsers size={20} onClick={() => getListStudents(lecture)}> </FaUsers></Button> : <Button disabled><FaUsers size={20} > </FaUsers></Button>}
                    </div>,
        'Delete the lecture':   <div style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center"
                        }}>
                        { lecture.deleted_at == null ? <Button variant="danger"><FaTrashAlt size={20} onClick={() => {deleteLecture(lecture)}}></FaTrashAlt></Button> : <Button disabled variant="danger"><FaTrashAlt size={20} ></FaTrashAlt></Button>}
                    </div>

        
        }
    }

    if(role_id ==5){
        return{
            id: lecture.id,
            lectureDate: moment(new Date(lecture.date)).format("LLL"),
            book:   <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            }}>
            {checkPrenotation(bookedLectures, lecture.id) ? <Button variant="danger" onClick={() => deleteBookedLecture(lecture.id)}> UNBOOK </Button>: <Button variant="success" onClick={() => bookLecture(lecture.id)}> BOOK </Button>}
             </div>,
        }
    }
    })


    return (
        <>
        <PaperInsideCard
        CardHeader = {course.description + " lectures"}
        columns = {columns}
        sortingStateColumnExtensions = {sortingStateColumnExtensions}
        integratedSortingColumnExtensions = {integratedSortingColumnExtensions}
        test = {test}
        
        
        ></PaperInsideCard>
        </>
    );
}

export default CourseLectures;