const db = require("../models/index")
const request = require('supertest')
const app = require('../app');
const moment = require('moment');

test('check if the model bookings is correctly istantiated', () => {
    expect(db['bookings']).not.toBeNull();
})
test('check if the model users is correctly istantiated', () => {
    expect(db['users']).not.toBeNull();
})
test('check if the model lectures is correctly istantiated', () => {
    expect(db['lectures']).not.toBeNull();
})



describe('API test', function () {

    //==================== LOGIN =============================
    it('LOGIN NOK', function (done) {
        request(app)
        .post('/api/login')
        .send({ password: "123"})
        .set('Accept', 'application/json')
        .expect(500, done);
    })
    it('LOGIN NOK 2', function (done) {
        request(app)
        .post('/api/login')
        .send({ email: "prova2@prova.it",password: "123"})
        .set('Accept', 'application/json')
        .expect(404, done);
    })
    it('LOGIN NOK 3', function (done) {
        request(app)
        .post('/api/login')
        .send({ email: "prova@prova.it", password: "125"})
        .set('Accept', 'application/json')
        .expect(404, done);
    })
    it('LOGIN OK', function (done) {
        request(app)
        .post('/api/login')
        .send({ email: "prova@prova.it", password: "123"})
        .set('Accept', 'application/json')
        .expect(200, done);
    })
    it('PUT lectures', function (done) {
        request(app)
        .put('/api/lectures/2')
        .send({ date: moment().add(1,"hours").toDate()})
        .set('Accept', 'application/json')
        .expect(200, done);
    })
    
    

    //==================== users API test ====================
    it('POST users', function (done) {
        request(app)
            .post('/api/users')
            .send({ name: "name_prova", surname: "surname_prova", id: 1 })
            .set('Accept', 'application/json')
            .expect(201, done);
    });
    it('GET users', function (done) {
        request(app)
            .get('/api/users')
            .set('Accept', 'application/json')
            .expect(200, done);
    });
    it('GET/:id users', function (done) {
        request(app)
            .get('/api/users/1')
            .set('Accept', 'application/json')
            .expect(200, done);
    });

    //==================== lectures API test ====================

    it('POST lectures', function (done) {
        request(app)
            .post('/api/lectures')
            .send({ duration: 1.5, id: 1 , subject_id:1, date: moment().add(1,"hours").toDate(), remote: 1})
            .set('Accept', 'application/json')
            .expect(201, done);
    });
    it('PUT lectures remote', function (done) {
        request(app)
        .put('/api/lectures/2')
        .send({ remote: true})
        .set('Accept', 'application/json')
        .expect(200, done);
    })
    
    it('GET lectures', function (done) {
        request(app)
            .get('/api/lectures')
            .set('Accept', 'application/json')
            .expect(200, done);
    });
    it('GET lectures deleted', function (done) {
        request(app)
            .get('/api/lectures/includeDeleted')
            .set('Accept', 'application/json')
            .expect(200, done);
    });
    it('GET lectures deleted startDate end Date', function (done) {
        request(app)
            .get('/api/lectures/includeDeleted?startDate=2020-05-11&endDate=2021-01-22&teacher_id=2')
            .set('Accept', 'application/json')
            .expect(200, done);
    });
    it('GET/:id lectures', function (done) {
        request(app)
            .get('/api/lectures/1')
            .set('Accept', 'application/json')
            .expect(200, done);
    });
    it('GET users/:userID FAIL', function (done) {
        request(app)
            .get('/api/lectures/users/A')
            .set('Accept', 'application/json')
            .expect(500, done);
    });
    it('GET users/:userID ', function (done) {
        request(app)
            .get('/api/lectures/users/5?startDate=2020-05-11&endDate=2021-01-22')
            .set('Accept', 'application/json')
            .expect(200, done);
    });

    //==================== bookings API test ====================

    it('POST bookings', function (done) {
        request(app)
            .post('/api/bookings/student')
            .send({ user_id: 1, lecture_id: 1, email:"prova@prova.it" })
            .set('Accept', 'application/json')
            .expect(201, done);
    });
    it('POST bookings 2', function (done) {
        request(app)
            .post('/api/bookings/student')
            .send({ user_id: 1, lecture_id: 2, email:"prova@prova.it" })
            .set('Accept', 'application/json')
            .expect(201, done);
    });
    it('POST bookings 3', function (done) {
        request(app)
            .post('/api/bookings/student')
            .send({ user_id: 1, lecture_id: 15, email:"prova@prova.it" })
            .set('Accept', 'application/json')
            .expect(201, done);
    });
    it('POST bookings FAIL', function (done) {
        request(app)
            .post('/api/bookings/student')
            .send({ user_id: 2, lecture_id: 2})
            .set('Accept', 'application/json')
            .expect(500, done);
    });
    it('POST bookings FAIL 2', function (done) {
        try {
            request(app)
            .post('/api/bookings/student')
            .send({ user_id: 5, lecture_id: 2, email:"prova@prova.it"})
            .set('Accept', 'application/json')
            .expect(500,done);
        } catch (error) {
            expect(error).not.toBeNull();
        }
        
    });
    it('GET bookings', function (done) {
        request(app)
            .get('/api/bookings')
            .set('Accept', 'application/json')
            .expect(200, done);
    });

    it('GET bookings excludedLecturesCanceled', function (done) {
        request(app)
            .get('/api/bookings/excludeLecturesCanceled')
            .set('Accept', 'application/json')
            .expect(200, done);
    });   
    it('GET/:id bookings', function (done) {
        request(app)
            .get('/api/bookings/students/1/lectures/1')
            .set('Accept', 'application/json')
            .expect(200, done);
    });

    //==================== teaching_loads API test ====================

    it('POST teaching_loads', function (done) {
        request(app)
            .post('/api/teaching_loads')
            .send({ user_id: 1, subject_id: 1 })
            .set('Accept', 'application/json')
            .expect(201, done);
    });
    it('GET teaching_loads', function (done) {
        request(app)
            .get('/api/teaching_loads')
            .set('Accept', 'application/json')
            .expect(200, done);
    });
    it('GET/:id teaching_loads', function (done) {
        request(app)
            .get('/api/teaching_loads/students/1/subjects/1')
            .set('Accept', 'application/json')
            .expect(200, done);
    });
    it('GET/:id teaching_loads 2', function (done) {
        request(app)
            .get('/api/teaching_loads/students/2')
            .set('Accept', 'application/json')
            .expect(200, done);
    });
    it('GET/:id teaching_loads 3', function (done) {
        request(app)
            .get('/api/teaching_loads/students/2/lectures')
            .set('Accept', 'application/json')
            .expect(200, done);
    });
    it('GET/:id teaching_loads FAIL', function (done) {
        request(app)
            .get('/api/teaching_loads/students/0')
            .set('Accept', 'application/json')
            .expect(500, done);
    });
    it('GET/:id teaching_loads FAIL 2', function (done) {
        request(app)
            .get('/api/teaching_loads/students/0/lectures')
            .set('Accept', 'application/json')
            .expect(500, done);
    });
    it('GET/:id teaching_loads FAIL 3', function (done) {
        request(app)
            .get('/api/teaching_loads/students/5')
            .set('Accept', 'application/json')
            .expect(200, done);
    });
    it('GET/:id teaching_loads FAIL 4', function (done) {
        request(app)
            .get('/api/teaching_loads/students/5/lectures')
            .set('Accept', 'application/json')
            .expect(200, done);
    });
    it('GET/:id teaching_loads FAIL 5', function (done) {
        request(app)
            .get('/api/teaching_loads/students/A')
            .set('Accept', 'application/json')
            .expect(500, done);
    });
    it('GET/:id teaching_loads FAIL 6', function (done) {
        request(app)
            .get('/api/teaching_loads/students/A/lectures')
            .set('Accept', 'application/json')
            .expect(500, done);
    });
    //=================== Statistics test =====================
    it('GET statistics with params', function (done) {
        request(app)
            .get('/api/bookings/statistics?startDate=2020-11-28&endDate=2020-11-12&subject_id=1&teacher_id=2')
            .set('Accept', 'application/json')
            .expect(200, done);
    });
    it('GET statistics', function (done) {
        request(app)
            .get('/api/bookings/statistics')
            .set('Accept', 'application/json')
            .expect(200, done);
    });
  
    //==================== teachers API test ====================

    it('GET teachers', function (done) {
        request(app)
            .get('/api/teachers')
            .set('Accept', 'application/json')
            .expect(200, done);
    });

    it('GET teachers/nextLecture', function (done) {
        request(app)
            .get('/api/teachers/2/nextLecture')
            .set('Accept', 'application/json')
            .expect(200, done);
    });

    it('GET teachers/nextLecture FAIL', function (done) {
        request(app)
            .get('/api/teachers/0/nextLecture')
            .set('Accept', 'application/json')
            .expect(500, done);
    });

    it('GET teachers/nextLecture FAIL 2', function (done) {
        request(app)
            .get('/api/teachers/1/nextLecture')
            .set('Accept', 'application/json')
            .expect(500, done);
    });

    //==================== students API test ====================

    it('GET students', function (done) {
        request(app)
            .get('/api/students')
            .set('Accept', 'application/json')
            .expect(200, done);
    });

    //==================== DELETE API test ====================

    it('DELETE bookings', function (done) {
        request(app)
            .del('/api/bookings/students/1/lectures/1')
            .set('Accept', 'application/json')
            .expect(200, done);
    });
    it('DELETE bookings', function (done) {
        request(app)
            .del('/api/bookings/students/1/lectures/2')
            .set('Accept', 'application/json')
            .expect(200, done);
    });
    it('DELETE bookings', function (done) {
        request(app)
            .del('/api/bookings/students/1/lectures/15')
            .set('Accept', 'application/json')
            .expect(200, done);
    });
    it('DELETE teaching_loads', function (done) {
        request(app)
            .del('/api/teaching_loads/students/1/subjects/1')
            .set('Accept', 'application/json')
            .expect(200, done);
    });
    it('DELETE lectures', function (done) {
        request(app)
            .del('/api/lectures/1')
            .set('Accept', 'application/json')
            .expect(200, done);

    });
    it('DELETE users', function (done) {
        request(app)
            .del('/api/users/1')
            .set('Accept', 'application/json')
            .expect(200, done);

    });

});
