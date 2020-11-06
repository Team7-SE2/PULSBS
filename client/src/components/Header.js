import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { NavLink } from 'react-router-dom';

const Header = (props) => {

  return (
    

        <Navbar bg="warning" variant="light" expand="sm" fixed="top">

          <Navbar.Brand >
            <svg className="bi bi-check-all" width="30" height="30" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M12.354 3.646a.5.5 0 010 .708l-7 7a.5.5 0 01-.708 0l-3.5-3.5a.5.5 0 11.708-.708L5 10.293l6.646-6.647a.5.5 0 01.708 0z" clipRule="evenodd" />
              <path d="M6.25 8.043l-.896-.897a.5.5 0 10-.708.708l.897.896.707-.707zm1 2.414l.896.897a.5.5 0 00.708 0l7-7a.5.5 0 00-.708-.708L8.5 10.293l-.543-.543-.707.707z" />
            </svg>
          Post Office
        </Navbar.Brand>

          <Nav className="mr-auto">
            
              <Nav.Link as={NavLink} to="/employee"  > Employee page</Nav.Link>
            
              <Nav.Link as={NavLink} to="/public" > User page </Nav.Link>


          </Nav>


          
        </Navbar>
      

  );
}

export default Header;
