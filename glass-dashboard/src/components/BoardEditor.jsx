import React, { useState, useRef, useMemo, Suspense } from 'react';
// import JoditEditor from 'jodit-react'; // Remove static import
import { Form, Button, Card, Spinner } from 'react-bootstrap';

// Lazy load JoditEditor
const JoditEditor = React.lazy(() => import('jodit-react'));

const BoardEditor = ({ onSave, onCancel, initialData = { title: '', content: '' } }) => {
   const editor = useRef(null);
   const [title, setTitle] = useState(initialData.title);
   const [content, setContent] = useState(initialData.content);

   const config = useMemo(() => ({
      readonly: false,
      placeholder: 'Start typing...',
      height: 300,
      buttons: [
         'bold', 'italic', 'underline', 'strikethrough', '|',
         'ul', 'ol', '|',
         'font', 'fontsize', 'brush', 'paragraph', '|',
         'image', 'table', 'link', '|',
         'align', 'undo', 'redo', '|',
         'hr', 'eraser', 'copyformat', '|',
         'fullsize', 'selectall', 'print', 'about'
      ]
   }), []);

   const handleSubmit = (e) => {
      e.preventDefault();
      onSave({ title, content });
   };

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
               <Suspense fallback={<Spinner animation="border" />}>
                  <JoditEditor
                     ref={editor}
                     value={content}
                     config={config}
                     tabIndex={1} // tabIndex of textarea
                     onBlur={newContent => setContent(newContent)} // preferred to use only this option to update the content for performance reasons
                     onChange={newContent => { }}
                  />
               </Suspense>
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
