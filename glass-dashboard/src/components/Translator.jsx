import React, { useState } from 'react';
import { Card, Form, Button, InputGroup, Collapse } from 'react-bootstrap';
import { Search, Plus } from 'lucide-react';

const initialDictionary = {
   'hello': '안녕하세요',
   'world': '세상',
   'love': '사랑',
   'computer': '컴퓨터',
   'glass': '유리',
   'water': '물',
   'fire': '불',
   'sky': '하늘',
   'earth': '지구',
   'moon': '달',
   'sun': '태양',
   'star': '별',
   'friend': '친구',
   'family': '가족',
   'school': '학교',
   'work': '일',
   'money': '돈',
   'time': '시간',
   'day': '일 (하루)',
   'night': '밤',
   '안녕하세요': 'Hello',
   '세상': 'World',
   '사랑': 'Love',
   '컴퓨터': 'Computer',
   '감사합니다': 'Thank you',
   '미안합니다': 'Sorry'
};

const Translator = () => {
   const [dictionary, setDictionary] = useState(() => {
      const saved = localStorage.getItem('glass-dictionary');
      return saved ? { ...initialDictionary, ...JSON.parse(saved) } : initialDictionary;
   });
   const [input, setInput] = useState('');
   const [result, setResult] = useState('');
   const [isAdding, setIsAdding] = useState(false);
   const [newWord, setNewWord] = useState({ key: '', value: '' });

   const handleSearch = (e) => {
      e.preventDefault();
      if (!input.trim()) return;

      const term = input.toLowerCase().trim();
      const translation = dictionary[term];

      if (translation) {
         setResult(translation);
      } else {
         setResult('Word not found in local dictionary.');
      }
   };

   const handleAddWord = () => {
      if (!newWord.key || !newWord.value) return;

      const updatedDict = {
         ...dictionary,
         [newWord.key.toLowerCase()]: newWord.value,
         [newWord.value.toLowerCase()]: newWord.key // Bi-directional
      };

      setDictionary(updatedDict);
      localStorage.setItem('glass-dictionary', JSON.stringify(updatedDict));
      setIsAdding(false);
      setNewWord({ key: '', value: '' });
      alert('Word added!');
   };

   return (
      <Card className="h-100 shadow-sm">
         <Card.Header className="bg-white border-bottom-0 pt-4 pb-0">
            <h5 className="mb-0 fw-bold text-secondary">Local Translator</h5>
         </Card.Header>
         <Card.Body className="d-flex flex-column">
            <Form onSubmit={handleSearch} className="mb-4">
               <InputGroup>
                  <Form.Control
                     type="text"
                     placeholder="Enter word (En/Ko)..."
                     value={input}
                     onChange={(e) => setInput(e.target.value)}
                  />
                  <Button variant="primary" type="submit">
                     <Search size={20} />
                  </Button>
               </InputGroup>
            </Form>

            <div className="bg-light p-4 rounded border d-flex align-items-center justify-content-center mb-4" style={{ minHeight: '120px' }}>
               <p className="fs-5 fw-medium text-center mb-0 text-dark">
                  {result || <span className="text-muted">Translation will appear here</span>}
               </p>
            </div>

            <div className="mt-auto">
               <Button
                  variant="link"
                  className="text-decoration-none p-0 mb-2 d-flex align-items-center gap-1"
                  onClick={() => setIsAdding(!isAdding)}
               >
                  <Plus size={16} /> Add new word
               </Button>

               <Collapse in={isAdding}>
                  <div className="bg-light p-3 rounded border">
                     <Form.Group className="mb-2">
                        <Form.Control
                           size="sm"
                           placeholder="Word (e.g., Apple)"
                           value={newWord.key}
                           onChange={e => setNewWord({ ...newWord, key: e.target.value })}
                           className="mb-2"
                        />
                        <Form.Control
                           size="sm"
                           placeholder="Translation (e.g., 사과)"
                           value={newWord.value}
                           onChange={e => setNewWord({ ...newWord, value: e.target.value })}
                           className="mb-2"
                        />
                        <Button variant="success" size="sm" className="w-100" onClick={handleAddWord}>
                           Save to Dictionary
                        </Button>
                     </Form.Group>
                  </div>
               </Collapse>
            </div>
         </Card.Body>
      </Card>
   );
};

export default Translator;
