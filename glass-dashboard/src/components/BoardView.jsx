import React from 'react';
import { Button, Card } from 'react-bootstrap';

const BoardView = ({ post, onBack, onEdit, onDelete, currentUser }) => {
   const isAuthor = currentUser && post.author && currentUser.username === post.author.username;

   return (
      <Card className="glass-card p-4">
         <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>{post.title}</h2>
            <div>
               <span className="me-3 text-muted">By {post.author ? post.author.name : 'Unknown'}</span>
               <span className="text-muted">{new Date(post.createdAt).toLocaleDateString()}</span>
            </div>
         </div>

         <div className="board-content mb-5" dangerouslySetInnerHTML={{ __html: post.content }} />

         <div className="d-flex justify-content-between">
            <Button variant="secondary" onClick={onBack}>Back to List</Button>
            {isAuthor && (
               <div className="d-flex gap-2">
                  <Button variant="warning" onClick={() => onEdit(post)}>Edit</Button>
                  <Button variant="danger" onClick={() => onDelete(post.id)}>Delete</Button>
               </div>
            )}
         </div>
      </Card>
   );
};

export default BoardView;
