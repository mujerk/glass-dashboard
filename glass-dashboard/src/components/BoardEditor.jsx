import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Form, Button, Card } from 'react-bootstrap';

const BoardEditor = ({ onSave, onCancel, initialData = { title: '', content: '' } }) => {
   const [title, setTitle] = useState(initialData.title);
   const [content, setContent] = useState(initialData.content);

   const handleSubmit = (e) => {
      e.preventDefault();
      onSave({ title, content });
   };

   const modules = {
      toolbar: [
         [{ 'header': [1, 2, false] }],
         ['bold', 'italic', 'underline', 'strike', 'blockquote'],
         [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
         ['link', 'image'],
         ['clean']
      ],
   };

   const formats = [
      'header',
      'bold', 'italic', 'underline', 'strike', 'blockquote',
      'list', 'bullet', 'indent',
      'link', 'image'
   ];

   return (
      <Card className="glass-card p-4">
         <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
               <Form.Label>Title</Form.Label>
               <Form.Control
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter title"
                  required
                  className="glass-input"
               />
            </Form.Group>

            <Form.Group className="mb-3">
               <Form.Label>Content</Form.Label>
               <ReactQuill
                  theme="snow"
                  value={content}
                  onChange={setContent}
                  modules={modules}
                  formats={formats}
                  style={{ height: '300px', marginBottom: '50px' }}
               />
            </Form.Group>

            <div className="d-flex justify-content-end gap-2 mt-5">
               <Button variant="secondary" onClick={onCancel}>Cancel</Button>
               <Button variant="primary" type="submit">Save</Button>
            </div>
         </Form>
      </Card>
   );
};

export default BoardEditor;
