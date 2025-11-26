import React, { useState } from 'react';
import { Container, Navbar, Nav, Tab, Row, Col, Button } from 'react-bootstrap';
import Calculator from './Calculator';
import TodoList from './TodoList';
import Calendar from './Calendar';
import Diary from './Diary';
import Translator from './Translator';
import { LayoutDashboard, Calculator as CalcIcon, CheckSquare, Calendar as CalIcon, Book, Languages, Menu } from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [key, setKey] = useState('dashboard');

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="vh-100 d-flex flex-column bg-light overflow-hidden">
      <Tab.Container id="dashboard-tabs" activeKey={key} onSelect={(k) => setKey(k)}>
        {/* Fixed Header */}
        <Navbar bg="white" expand="lg" className="border-bottom shadow-sm flex-shrink-0" collapseOnSelect>
          <Container>
            <Navbar.Brand href="#home" className="d-flex align-items-center gap-2 text-primary fw-bold" onClick={() => setKey('dashboard')}>
              <LayoutDashboard />
              <span>My App</span>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav">
              <Menu size={24} />
            </Navbar.Toggle>
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="ms-auto" variant="pills" onSelect={(selectedKey) => setKey(selectedKey)}>
                <Nav.Item>
                  <Nav.Link eventKey="dashboard" className="d-flex align-items-center gap-2">
                    <LayoutDashboard size={16} /> Dashboard
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="calculator" className="d-flex align-items-center gap-2">
                    <CalcIcon size={16} /> Calculator
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="todo" className="d-flex align-items-center gap-2">
                    <CheckSquare size={16} /> To-Do
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="calendar" className="d-flex align-items-center gap-2">
                    <CalIcon size={16} /> Calendar
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="diary" className="d-flex align-items-center gap-2">
                    <Book size={16} /> Diary
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="translator" className="d-flex align-items-center gap-2">
                    <Languages size={16} /> Translator
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Button variant="link" className="nav-link text-danger" onClick={handleLogout}>
                    Logout
                  </Button>
                </Nav.Item>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        {/* Scrollable Content Area */}
        <div className="flex-grow-1 overflow-auto py-4">
          <Container>
            <Tab.Content>
              <Tab.Pane eventKey="dashboard">
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
              </Tab.Pane>
              <Tab.Pane eventKey="calculator">
                <Row className="justify-content-center">
                  <Col md={8} lg={6}>
                    <Calculator />
                  </Col>
                </Row>
              </Tab.Pane>
              <Tab.Pane eventKey="todo">
                <Row className="justify-content-center">
                  <Col md={8} lg={6}>
                    <TodoList />
                  </Col>
                </Row>
              </Tab.Pane>
              <Tab.Pane eventKey="calendar">
                <Row className="justify-content-center">
                  <Col md={8} lg={6}>
                    <Calendar />
                  </Col>
                </Row>
              </Tab.Pane>
              <Tab.Pane eventKey="diary">
                <Row className="justify-content-center">
                  <Col md={10} lg={8}>
                    <Diary />
                  </Col>
                </Row>
              </Tab.Pane>
              <Tab.Pane eventKey="translator">
                <Row className="justify-content-center">
                  <Col md={8} lg={6}>
                    <Translator />
                  </Col>
                </Row>
              </Tab.Pane>
            </Tab.Content>
          </Container>
        </div>
      </Tab.Container>

      {/* Fixed Footer */}
      <footer className="py-3 text-center text-secondary text-sm border-top bg-white flex-shrink-0">
        <Container>
          <p className="mb-0">© 2024 My App. Built with React Bootstrap.</p>
        </Container>
      </footer>
    </div>
  );
}

export default Dashboard;
