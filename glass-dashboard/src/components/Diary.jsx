import React, { useState, useEffect } from 'react';
import { Card, Form, Button, ListGroup } from 'react-bootstrap';
import { Save, Trash2 } from 'lucide-react';

const Diary = () => {
   const [entries, setEntries] = useState([]);
   const [content, setContent] = useState('');
   const API_URL = '/api/diary';

   useEffect(() => {
      fetchEntries();
   }, []);

   const fetchEntries = async () => {
      try {
         const response = await fetch(API_URL, { credentials: 'include' });
         if (response.ok) {
            const data = await response.json();
            if (Array.isArray(data)) {
               // Sort by date descending
               const sorted = data.sort((a, b) => new Date(b.date) - new Date(a.date));
               setEntries(sorted);
            } else {
               setEntries([]);
            }
         }
      } catch (error) {
         console.error('Error fetching diary entries:', error);
      }
   };

   const saveEntry = async () => {
      if (!content.trim()) return;

      try {
         const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: content, date: new Date().toISOString() }),
            credentials: 'include'
         });
         if (response.ok) {
            const newEntry = await response.json();
            setEntries([newEntry, ...entries]);
            setContent('');
         }
      } catch (error) {
         console.error('Error saving diary entry:', error);
      }
   };

   const deleteEntry = async (id) => {
      try {
         const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
            credentials: 'include'
         });
         if (response.ok) {
            setEntries(entries.filter(entry => entry.id !== id));
         }
      } catch (error) {
         console.error('Error deleting diary entry:', error);
      }
   };

   return (
      <Card className="h-100 shadow-sm">
         <Card.Header className="bg-white border-bottom-0 pt-4 pb-0">
            <h5 className="mb-0 fw-bold text-secondary">Diary</h5>
         </Card.Header>
         <Card.Body className="d-flex flex-column">
            <Form.Group className="mb-3">
               <Form.Control
                  as="textarea"
                  rows={4}
                  placeholder="Write your thoughts..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="mb-2"
                  style={{ resize: 'none' }}
               />
               <Button variant="purple" className="w-100 d-flex align-items-center justify-content-center gap-2" onClick={saveEntry} style={{ backgroundColor: '#6f42c1', color: 'white' }}>
                  <Save size={18} /> Save Entry
               </Button>
            </Form.Group>

            <div className="flex-grow-1 overflow-auto custom-scrollbar" style={{ maxHeight: '400px' }}>
               {entries.map(entry => (
                  <Card key={entry.id} className="mb-3 border bg-light">
                     <Card.Body className="p-3">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                           <small className="text-muted">{new Date(entry.date).toLocaleString()}</small>
                           <Button variant="link" className="text-danger p-0" size="sm" onClick={() => deleteEntry(entry.id)}>
                              <Trash2 size={14} />
                           </Button>
                        </div>
                        <Card.Text className="mb-0 text-dark" style={{ whiteSpace: 'pre-wrap' }}>
                           {entry.content}
                        </Card.Text>
                     </Card.Body>
                  </Card>
               ))}
               {entries.length === 0 && (
                  <div className="text-center text-muted py-5">
                     No entries yet. Start writing!
                  </div>
               )}
            </div>
         </Card.Body>
      </Card>
   );
};

export default Diary;
