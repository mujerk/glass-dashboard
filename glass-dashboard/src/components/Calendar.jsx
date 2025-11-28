import React, { useState, useEffect } from 'react';
import { Card, Button, Row, Col, Modal, Form } from 'react-bootstrap';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Calendar = () => {
   const [currentDate, setCurrentDate] = useState(new Date());
   const [events, setEvents] = useState([]);
   const API_URL = '/api/events';

   // Selection State
   const [isDragging, setIsDragging] = useState(false);
   const [selectionStart, setSelectionStart] = useState(null);
   const [selectionEnd, setSelectionEnd] = useState(null);

   // Modal State
   const [showModal, setShowModal] = useState(false);
   const [newEventTitle, setNewEventTitle] = useState('');
   const [newEventColor, setNewEventColor] = useState('#0d6efd'); // Default blue

   useEffect(() => {
      fetchEvents();
   }, []);

   const fetchEvents = async () => {
      try {
         const response = await fetch(API_URL, { credentials: 'include' });
         if (response.ok) {
            const data = await response.json();
            if (Array.isArray(data)) {
               setEvents(data);
            } else {
               setEvents([]);
            }
         }
      } catch (error) {
         console.error('Error fetching events:', error);
      }
   };

   const getDaysInMonth = (date) => {
      return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
   };

   const getFirstDayOfMonth = (date) => {
      return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
   };

   const prevMonth = () => {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
   };

   const nextMonth = () => {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
   };

   const daysInMonth = getDaysInMonth(currentDate);
   const firstDay = getFirstDayOfMonth(currentDate);
   const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
   const blanks = Array.from({ length: firstDay }, (_, i) => i);

   // --- Drag & Drop Logic ---

   const handleMouseDown = (day) => {
      setIsDragging(true);
      setSelectionStart(day);
      setSelectionEnd(day);
   };

   const handleMouseEnter = (day) => {
      if (isDragging) {
         setSelectionEnd(day);
      }
   };

   const handleMouseUp = () => {
      if (isDragging) {
         setIsDragging(false);
         setShowModal(true);
      }
   };

   // Helper to check if a day is in the current selection range
   const isSelected = (day) => {
      if (selectionStart === null || selectionEnd === null) return false;
      const start = Math.min(selectionStart, selectionEnd);
      const end = Math.max(selectionStart, selectionEnd);
      return day >= start && day <= end;
   };

   // --- Event Logic ---

   const handleSaveEvent = async () => {
      if (!newEventTitle.trim() || selectionStart === null || selectionEnd === null) return;

      const startDay = Math.min(selectionStart, selectionEnd);
      const endDay = Math.max(selectionStart, selectionEnd);

      // Construct date strings (YYYY-MM-DD) for simplicity
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth(); // 0-indexed

      // Create actual Date objects to handle month overflow if needed (though here we stick to current month view)
      // For this simple version, we'll store events attached to the specific month/year context or just full date strings
      // Note: Month is 0-indexed in JS Date, but we need 1-indexed for ISO string if building manually, 
      // but here we use Date object to get ISO string.
      // We need to be careful with timezones. Using local time components to build the string is safer for "date only".

      const formatDate = (y, m, d) => {
         const mm = String(m + 1).padStart(2, '0');
         const dd = String(d).padStart(2, '0');
         return `${y}-${mm}-${dd}`;
      };

      const startDate = formatDate(year, month, startDay);
      const endDate = formatDate(year, month, endDay);

      try {
         const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
               title: newEventTitle,
               startDate: startDate,
               endDate: endDate,
               color: newEventColor
            }),
            credentials: 'include'
         });
         if (response.ok) {
            const newEvent = await response.json();
            setEvents([...events, newEvent]);
            setShowModal(false);
            setNewEventTitle('');
            setSelectionStart(null);
            setSelectionEnd(null);
         }
      } catch (error) {
         console.error('Error saving event:', error);
      }
   };

   const handleCloseModal = () => {
      setShowModal(false);
      setSelectionStart(null);
      setSelectionEnd(null);
   };

   // Check if a day has an event
   const getEventsForDay = (day) => {
      // Construct date string for the day being rendered
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const mm = String(month + 1).padStart(2, '0');
      const dd = String(day).padStart(2, '0');
      const targetDate = `${year}-${mm}-${dd}`;

      return events.filter(event => {
         return targetDate >= event.startDate && targetDate <= event.endDate;
      });
   };

   const isToday = (day) => {
      const today = new Date();
      return (
         day === today.getDate() &&
         currentDate.getMonth() === today.getMonth() &&
         currentDate.getFullYear() === today.getFullYear()
      );
   };

   return (
      <Card className="h-100 shadow-sm" onMouseUp={handleMouseUp}> {/* Catch mouse up anywhere on card */}
         <Card.Header className="bg-white border-bottom-0 pt-4 pb-2 d-flex align-items-center justify-content-between">
            <h5 className="mb-0 fw-bold text-secondary">
               {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </h5>
            <div className="d-flex gap-1">
               <Button variant="light" size="sm" className="rounded-circle p-1" onClick={prevMonth}>
                  <ChevronLeft size={20} />
               </Button>
               <Button variant="light" size="sm" className="rounded-circle p-1" onClick={nextMonth}>
                  <ChevronRight size={20} />
               </Button>
            </div>
         </Card.Header>
         <Card.Body className="p-2">
            <Row className="text-center mb-2 text-muted small fw-bold g-0">
               {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <Col key={day} className="p-0">{day}</Col>
               ))}
            </Row>

            <div className="d-flex flex-wrap">
               {blanks.map(blank => (
                  <div key={`blank-${blank}`} style={{ width: '14.28%', height: '80px' }} />
               ))}
               {days.map(day => {
                  const dayEvents = getEventsForDay(day);
                  const selected = isSelected(day);

                  return (
                     <div
                        key={day}
                        style={{ width: '14.28%', height: '80px' }}
                        className="p-1"
                        onMouseDown={() => handleMouseDown(day)}
                        onMouseEnter={() => handleMouseEnter(day)}
                     >
                        <div
                           className={`w-100 h-100 d-flex flex-column rounded border small position-relative overflow-hidden
                    ${selected ? 'bg-primary bg-opacity-25 border-primary' : 'border-light hover-bg-light'}
                    ${isToday(day) ? 'border-primary border-2' : ''}
                  `}
                           style={{ cursor: 'pointer', transition: 'background-color 0.1s', userSelect: 'none' }}
                        >
                           <span className={`ms-1 mt-1 fw-bold ${isToday(day) ? 'text-primary' : 'text-secondary'}`}>
                              {day}
                           </span>

                           {/* Event Bars */}
                           <div className="d-flex flex-column gap-1 px-1 mt-1 overflow-hidden">
                              {dayEvents.map(event => (
                                 <div
                                    key={event.id}
                                    className="rounded px-1 text-white text-truncate"
                                    style={{ backgroundColor: event.color, fontSize: '0.65rem', height: '16px', lineHeight: '16px' }}
                                    title={event.title}
                                 >
                                    {event.title}
                                 </div>
                              ))}
                           </div>
                        </div>
                     </div>
                  );
               })}
            </div>
         </Card.Body>

         {/* Add Event Modal */}
         <Modal show={showModal} onHide={handleCloseModal} centered>
            <Modal.Header closeButton>
               <Modal.Title>Add Event</Modal.Title>
            </Modal.Header>
            <Modal.Body>
               <p className="text-muted mb-3">
                  Date Range: {currentDate.getFullYear()}-{currentDate.getMonth() + 1}-{Math.min(selectionStart || 0, selectionEnd || 0)} to {Math.min(selectionStart || 0, selectionEnd || 0) !== Math.max(selectionStart || 0, selectionEnd || 0) ? `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${Math.max(selectionStart || 0, selectionEnd || 0)}` : ''}
               </p>
               <Form>
                  <Form.Group className="mb-3">
                     <Form.Label>Event Title</Form.Label>
                     <Form.Control
                        type="text"
                        placeholder="Meeting, Vacation, etc."
                        value={newEventTitle}
                        onChange={(e) => setNewEventTitle(e.target.value)}
                        onKeyDown={(e) => {
                           if (e.key === 'Enter') {
                              e.preventDefault();
                              handleSaveEvent();
                           }
                        }}
                        autoFocus
                     />
                  </Form.Group>
                  <Form.Group className="mb-3">
                     <Form.Label>Color</Form.Label>
                     <Form.Control
                        type="color"
                        value={newEventColor}
                        onChange={(e) => setNewEventColor(e.target.value)}
                        title="Choose your color"
                     />
                  </Form.Group>
               </Form>
            </Modal.Body>
            <Modal.Footer>
               <Button variant="secondary" onClick={handleCloseModal}>
                  Cancel
               </Button>
               <Button variant="primary" onClick={handleSaveEvent}>
                  Save Event
               </Button>
            </Modal.Footer>
         </Modal>
      </Card>
   );
};

export default Calendar;
