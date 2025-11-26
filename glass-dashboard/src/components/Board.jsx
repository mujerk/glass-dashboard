import React, { useState, useEffect } from 'react';
import { Table, Button, Pagination, Spinner, Alert } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import BoardEditor from './BoardEditor';
import BoardView from './BoardView';

const Board = () => {
   const { user } = useAuth();
   const [posts, setPosts] = useState([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);
   const [viewMode, setViewMode] = useState('list'); // list, write, edit, view
   const [selectedPost, setSelectedPost] = useState(null);
   const [currentPage, setCurrentPage] = useState(0);
   const [totalPages, setTotalPages] = useState(0);

   const API_URL = 'http://localhost:8080/api/board';

   useEffect(() => {
      fetchPosts(currentPage);
   }, [currentPage]);

   const fetchPosts = async (page) => {
      setLoading(true);
      try {
         const response = await fetch(`${API_URL}?page=${page}&size=10`, { credentials: 'include' });
         if (response.ok) {
            const data = await response.json();
            setPosts(data.content);
            setTotalPages(data.totalPages);
         } else {
            setError('Failed to fetch posts');
         }
      } catch (err) {
         setError('Error fetching posts');
         console.error(err);
      } finally {
         setLoading(false);
      }
   };

   const handleSave = async (postData) => {
      try {
         const method = viewMode === 'edit' ? 'PUT' : 'POST';
         const url = viewMode === 'edit' ? `${API_URL}/${selectedPost.id}` : API_URL;

         const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(postData),
            credentials: 'include'
         });

         if (response.ok) {
            fetchPosts(0); // Refresh list and go to first page
            setViewMode('list');
            setSelectedPost(null);
         } else {
            alert('Failed to save post');
         }
      } catch (err) {
         console.error('Error saving post:', err);
         alert('Error saving post');
      }
   };

   const handleDelete = async (id) => {
      if (!window.confirm('Are you sure you want to delete this post?')) return;

      try {
         const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
            credentials: 'include'
         });

         if (response.ok) {
            fetchPosts(currentPage);
            setViewMode('list');
            setSelectedPost(null);
         } else {
            alert('Failed to delete post');
         }
      } catch (err) {
         console.error('Error deleting post:', err);
         alert('Error deleting post');
      }
   };

   const handleView = async (id) => {
      setLoading(true);
      try {
         const response = await fetch(`${API_URL}/${id}`, { credentials: 'include' });
         if (response.ok) {
            const post = await response.json();
            setSelectedPost(post);
            setViewMode('view');
         }
      } catch (err) {
         console.error('Error fetching post details:', err);
      } finally {
         setLoading(false);
      }
   };

   if (loading && viewMode === 'list' && posts.length === 0) return <Spinner animation="border" />;

   return (
      <div className="board-container">
         {error && <Alert variant="danger">{error}</Alert>}

         {viewMode === 'list' && (
            <>
               <div className="d-flex justify-content-between align-items-center mb-3">
                  <h2>Bulletin Board</h2>
                  <Button onClick={() => setViewMode('write')}>Write New Post</Button>
               </div>
               <Table striped bordered hover className="glass-table">
                  <thead>
                     <tr>
                        <th>#</th>
                        <th>Title</th>
                        <th>Author</th>
                        <th>Date</th>
                        <th>Views</th>
                     </tr>
                  </thead>
                  <tbody>
                     {posts.map(post => (
                        <tr key={post.id} onClick={() => handleView(post.id)} style={{ cursor: 'pointer' }}>
                           <td>{post.id}</td>
                           <td>{post.title}</td>
                           <td>{post.author ? post.author.name : 'Unknown'}</td>
                           <td>{new Date(post.createdAt).toLocaleDateString()}</td>
                           <td>{post.viewCount}</td>
                        </tr>
                     ))}
                  </tbody>
               </Table>
               <Pagination className="justify-content-center">
                  {[...Array(totalPages).keys()].map(page => (
                     <Pagination.Item
                        key={page}
                        active={page === currentPage}
                        onClick={() => setCurrentPage(page)}
                     >
                        {page + 1}
                     </Pagination.Item>
                  ))}
               </Pagination>
            </>
         )}

         {(viewMode === 'write' || viewMode === 'edit') && (
            <BoardEditor
               onSave={handleSave}
               onCancel={() => setViewMode('list')}
               initialData={viewMode === 'edit' ? selectedPost : undefined}
            />
         )}

         {viewMode === 'view' && selectedPost && (
            <BoardView
               post={selectedPost}
               currentUser={user}
               onBack={() => setViewMode('list')}
               onEdit={(post) => { setSelectedPost(post); setViewMode('edit'); }}
               onDelete={handleDelete}
            />
         )}
      </div>
   );
};

export default Board;
