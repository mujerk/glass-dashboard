import React, { useState } from 'react';
import { Card, Button, Row, Col } from 'react-bootstrap';

const Calculator = () => {
   const [display, setDisplay] = useState('0');
   const [equation, setEquation] = useState('');

   const handleNumber = (num) => {
      setDisplay(display === '0' ? num : display + num);
      setEquation(equation + num);
   };

   const handleOperator = (op) => {
      setDisplay('0');
      setEquation(equation + ' ' + op + ' ');
   };

   const calculate = () => {
      try {
         // eslint-disable-next-line no-eval
         const result = eval(equation);
         setDisplay(String(result));
         setEquation(String(result));
      } catch (error) {
         setDisplay('Error');
         setEquation('');
      }
   };

   const clear = () => {
      setDisplay('0');
      setEquation('');
   };

   const buttons = [
      '7', '8', '9', '/',
      '4', '5', '6', '*',
      '1', '2', '3', '-',
      '0', '.', '=', '+'
   ];

   return (
      <Card className="h-100 shadow-sm">
         <Card.Header className="bg-white border-bottom-0 pt-4 pb-0">
            <h5 className="mb-0 fw-bold text-secondary">Calculator</h5>
         </Card.Header>
         <Card.Body className="d-flex flex-column">
            <div className="bg-light p-3 rounded mb-3 text-end border">
               <div className="text-muted small" style={{ minHeight: '1.5rem' }}>{equation}</div>
               <div className="fs-2 fw-bold text-dark">{display}</div>
            </div>

            <Row className="g-2 flex-grow-1">
               <Col xs={12}>
                  <Button variant="danger" className="w-100 mb-2" onClick={clear}>Clear</Button>
               </Col>
               {buttons.map((btn) => (
                  <Col xs={3} key={btn}>
                     <Button
                        variant={
                           btn === '=' ? 'primary' :
                              ['+', '-', '*', '/'].includes(btn) ? 'secondary' : 'light'
                        }
                        className={`w-100 h-100 fw-bold ${!['=', '+', '-', '*', '/'].includes(btn) ? 'border' : ''}`}
                        onClick={() => {
                           if (btn === '=') calculate();
                           else if (['+', '-', '*', '/'].includes(btn)) handleOperator(btn);
                           else handleNumber(btn);
                        }}
                     >
                        {btn}
                     </Button>
                  </Col>
               ))}
            </Row>
         </Card.Body>
      </Card>
   );
};

export default Calculator;
