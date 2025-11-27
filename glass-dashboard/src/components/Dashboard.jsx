import React from 'react';
import { Container, Navbar, Nav, Button, Row, Col } from 'react-bootstrap';
import { Routes, Route, NavLink, useNavigate, Navigate } from 'react-router-dom';
import Calculator from './Calculator';
import TodoList from './TodoList';
import Calendar from './Calendar';
import Diary from './Diary';
import Translator from './Translator';
import Board from './Board';
import DashboardHome from './DashboardHome';
import { LayoutDashboard, Calculator as CalcIcon, CheckSquare, Calendar as CalIcon, Book, Languages, Menu, Clipboard } from 'lucide-react';

import { useAuth } from '../context/AuthContext';

function Dashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="vh-100 d-flex flex-column bg-light overflow-hidden">
      {/* Fixed Header */}
      <Navbar bg="white" expand="lg" className="border-bottom shadow-sm flex-shrink-0" collapseOnSelect>
        <Container>
          <Navbar.Brand as={NavLink} to="/dashboard" className="d-flex align-items-center gap-2 text-primary fw-bold">
            <LayoutDashboard />
            <span>My App</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav">
            <Menu size={24} />
          </Navbar.Toggle>
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto" variant="pills">
              <Nav.Item>
                <Nav.Link as={NavLink} to="/dashboard" end className="d-flex align-items-center gap-2">
                  <LayoutDashboard size={16} /> Dashboard
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link as={NavLink} to="/calculator" className="d-flex align-items-center gap-2">
                  <CalcIcon size={16} /> Calculator
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link as={NavLink} to="/todo" className="d-flex align-items-center gap-2">
                  <CheckSquare size={16} /> To-Do
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link as={NavLink} to="/calendar" className="d-flex align-items-center gap-2">
                  <CalIcon size={16} /> Calendar
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link as={NavLink} to="/diary" className="d-flex align-items-center gap-2">
                  <Book size={16} /> Diary
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link as={NavLink} to="/translator" className="d-flex align-items-center gap-2">
                  <Languages size={16} /> Translator
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link as={NavLink} to="/board" className="d-flex align-items-center gap-2">
                  <Clipboard size={16} /> Board
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
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardHome />} />
            <Route path="/calculator" element={
              <Row className="justify-content-center">
                <Col md={8} lg={6}>
                  <Calculator />
                </Col>
              </Row>
            } />
            <Route path="/todo" element={
              <Row className="justify-content-center">
                <Col md={8} lg={6}>
                  <TodoList />
                </Col>
              </Row>
            } />
            <Route path="/calendar" element={
              <Row className="justify-content-center">
                <Col md={8} lg={6}>
                  <Calendar />
                </Col>
              </Row>
            } />
            <Route path="/diary" element={
              <Row className="justify-content-center">
                <Col md={10} lg={8}>
                  <Diary />
                </Col>
              </Row>
            } />
            <Route path="/translator" element={
              <Row className="justify-content-center">
                <Col md={8} lg={6}>
                  <Translator />
                </Col>
              </Row>
            } />
            <Route path="/board" element={
              <Row className="justify-content-center">
                <Col md={10} lg={8}>
                  <Board />
                </Col>
              </Row>
            } />
          </Routes>
        </Container>
      </div>

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
