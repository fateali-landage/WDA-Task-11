import { useState } from 'react';
import api from '../services/api';

export default function CreatePost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const submit = async () => {
    await api.post('/posts', { title, content });
    alert('Post created');
  };

  return (
    <>
      <input value={title} onChange={e => setTitle(e.target.value)} />
      <textarea value={content} onChange={e => setContent(e.target.value)} />
      <button onClick={submit}>Publish</button>
    </>
  );
}
