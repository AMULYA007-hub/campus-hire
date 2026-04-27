import React, { useEffect, useState } from 'react';
import { getStudents, addStudent, deleteStudent } from '../services/api';

function Student() {
  const [students, setStudents] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [branch, setBranch] = useState('');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    const res = await getStudents();
    setStudents(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addStudent({ name, email, branch });
    setName('');
    setEmail('');
    setBranch('');
    fetchStudents();
  };

  const handleDelete = async (id) => {
    await deleteStudent(id);
    fetchStudents();
  };

  return (
    <div>
      <h2>Students</h2>

      <form onSubmit={handleSubmit}>
        <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input placeholder="Branch" value={branch} onChange={(e) => setBranch(e.target.value)} />
        <button type="submit">Add</button>
      </form>

      <ul>
        {students.map((s) => (
          <li key={s.id}>
            {s.name} - {s.email} ({s.branch})
            <button onClick={() => handleDelete(s.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Student;