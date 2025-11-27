import React from 'react';
import { Row, Col } from 'react-bootstrap';
import Calculator from './Calculator';
import TodoList from './TodoList';
import Calendar from './Calendar';

const DashboardHome = () => {
   return (
      <Row className="g-4">
         <Col lg={4} md={6}>
            <div className="h-100"><Calculator /></div>
         </Col>
         <Col lg={4} md={6}>
            <div className="h-100"><TodoList /></div>
         </Col>
         <Col lg={4} md={6}>
            <div className="h-100"><Calendar /></div>
         </Col>
      </Row>
   );
};

export default DashboardHome;
