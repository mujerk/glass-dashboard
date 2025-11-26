import React, { useState, useEffect } from 'react';
import { Card, Form, Button, ListGroup, InputGroup } from 'react-bootstrap';
import { Trash2, Check, Plus } from 'lucide-react';

const TodoList = () => {
   const [todos, setTodos] = useState([]);
   const [input, setInput] = useState('');
   const API_URL = 'http://localhost:8080/api/todos';

   useEffect(() => {
      fetchTodos();
   }, []);

   const fetchTodos = async () => {
      try {
         const response = await fetch(API_URL, { credentials: 'include' });
         if (response.ok) {
            const data = await response.json();
            if (Array.isArray(data)) {
               setTodos(data);
            } else {
               setTodos([]);
            }
         }
      } catch (error) {
         console.error('Error fetching todos:', error);
      }
   };

   const addTodo = async (e) => {
      e.preventDefault();
      if (!input.trim()) return;

      try {
         const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: input, completed: false }),
            credentials: 'include'
         });
         if (response.ok) {
            const newTodo = await response.json();
            setTodos([...todos, newTodo]);
            setInput('');
         }
      } catch (error) {
         console.error('Error adding todo:', error);
      }
   };

   const toggleTodo = async (id) => {
      const todoToUpdate = todos.find(t => t.id === id);
      if (!todoToUpdate) return;

      try {
         const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...todoToUpdate, completed: !todoToUpdate.completed }),
            credentials: 'include'
         });
         if (response.ok) {
            const updatedTodo = await response.json();
            setTodos(todos.map(todo => todo.id === id ? updatedTodo : todo));
         }
      } catch (error) {
         console.error('Error updating todo:', error);
      }
   };

   const deleteTodo = async (id) => {
      try {
         const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
            credentials: 'include'
         });
         if (response.ok) {
            setTodos(todos.filter(todo => todo.id !== id));
         }
      } catch (error) {
         console.error('Error deleting todo:', error);
      }
   };

   return (
      <Card className="h-100 shadow-sm">
         <Card.Header className="bg-white border-bottom-0 pt-4 pb-0">
            <h5 className="mb-0 fw-bold text-secondary">To-Do List</h5>
         </Card.Header>
         <Card.Body className="d-flex flex-column">
            <Form onSubmit={addTodo} className="mb-3">
               <InputGroup>
                  <Form.Control
                     type="text"
                     placeholder="Add a task..."
                     value={input}
                     onChange={(e) => setInput(e.target.value)}
                  />
                  <Button variant="success" type="submit">
                     <Plus size={20} />
                  </Button>
               </InputGroup>
            </Form>

            <div className="flex-grow-1 overflow-auto custom-scrollbar" style={{ maxHeight: '400px' }}>
               <ListGroup variant="flush">
                  {todos.map(todo => (
                     <ListGroup.Item
                        key={todo.id}
                        className={`d-flex align-items-center justify-content-between px-2 py-3 border-bottom ${todo.completed ? 'bg-light text-muted' : ''}`}
                     >
                        <div className="d-flex align-items-center gap-3 text-truncate">
                           <Button
                              variant={todo.completed ? "success" : "outline-secondary"}
                              size="sm"
                              className="rounded-circle p-0 d-flex align-items-center justify-content-center"
                              style={{ width: '24px', height: '24px' }}
                              onClick={() => toggleTodo(todo.id)}
                           >
                              {todo.completed && <Check size={14} />}
                           </Button>
                           <span className={`text-truncate ${todo.completed ? 'text-decoration-line-through' : ''}`}>
                              {todo.text}
                           </span>
                        </div>
                        <Button variant="link" className="text-danger p-0 ms-2" onClick={() => deleteTodo(todo.id)}>
                           <Trash2 size={18} />
                        </Button>
                     </ListGroup.Item>
                  ))}
                  {todos.length === 0 && (
                     <div className="text-center text-muted py-5">
                        No tasks yet. Add one above!
                     </div>
                  )}
               </ListGroup>
            </div>
         </Card.Body>
      </Card>
   );
};

export default TodoList;
