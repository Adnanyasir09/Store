import React, { useState } from 'react';
import { api } from '../api';

export default function ChangePassword() {
  const [currentPassword, setC] = useState('');
  const [newPassword, setN] = useState('');
  const [msg, setMsg] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setMsg('');
    try {
      await api.changePassword(currentPassword, newPassword);
      setMsg('Password updated');
      setC(''); setN('');
    } catch (e) { setMsg(e.message); }
  };

  return (
    <div style={{maxWidth:420, margin:'2rem auto'}}>
      <h2>Change Password</h2>
      {msg && <p>{msg}</p>}
      <form onSubmit={submit}>
        <label>Current Password</label>
        <input value={currentPassword} onChange={e=>setC(e.target.value)} type="password" required />
        <label>New Password</label>
        <input value={newPassword} onChange={e=>setN(e.target.value)} type="password" required />
        <small>8-16 chars, 1 uppercase & 1 special char.</small>
        <button type="submit" style={{marginTop:12}}>Update</button>
      </form>
    </div>
  );
}
