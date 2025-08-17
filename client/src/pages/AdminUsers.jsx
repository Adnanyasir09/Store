import React, { useEffect, useState, useCallback } from 'react';
import { api } from '../api';
import Table from '../components/Table';

export default function AdminUsers() {
  const [data, setData] = useState({ items: [], total: 0 });
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortDir, setSortDir] = useState('ASC');

  const [form, setForm] = useState({ name:'', email:'', address:'', password:'', role:'USER' });
  const [msg, setMsg] = useState('');

  const load = useCallback(async () => {
    const res = await api.adminListUsers({ search, role, sortBy, sortDir });
    setData(res);
  }, [search, role, sortBy, sortDir]);

  useEffect(() => { load(); }, [load]);

  const onSort = (col, dir) => { setSortBy(col); setSortDir(dir); };

  const createUser = async (e) => {
    e.preventDefault();
    setMsg('');
    try {
      await api.adminCreateUser(form);
      setForm({ name:'', email:'', address:'', password:'', role:'USER' });
      setMsg('User created');
      load();
    } catch (e) { setMsg(e.message); }
  };

  return (
    <div style={{maxWidth:1100, margin:'2rem auto'}}>
      <h2>Users</h2>
      <div style={{marginBottom:12, display:'flex', gap:8}}>
        <input placeholder="Search name/email/address" value={search} onChange={e=>setSearch(e.target.value)} />
        <select value={role} onChange={e=>setRole(e.target.value)}>
          <option value="">All Roles</option>
          <option>ADMIN</option>
          <option>USER</option>
          <option>OWNER</option>
        </select>
      </div>
      <Table
        columns={[
          { key:'name', title:'Name' },
          { key:'email', title:'Email' },
          { key:'address', title:'Address' },
          { key:'role', title:'Role' }
        ]}
        rows={data.items}
        sortBy={sortBy}
        sortDir={sortDir}
        onSort={onSort}
      />

      <h3 style={{marginTop:32}}>Add New User</h3>
      {msg && <p>{msg}</p>}
      <form onSubmit={createUser} style={{display:'grid', gap:8, maxWidth:600}}>
        <input placeholder="Name (20-60)" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} required />
        <input placeholder="Email" type="email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} required />
        <input placeholder="Address (max 400)" value={form.address} onChange={e=>setForm({...form, address:e.target.value})} />
        <input placeholder="Password (8-16; 1 uppercase & special)" type="password" value={form.password} onChange={e=>setForm({...form, password:e.target.value})} required />
        <select value={form.role} onChange={e=>setForm({...form, role:e.target.value})}>
          <option value="USER">USER</option>
          <option value="OWNER">OWNER</option>
          <option value="ADMIN">ADMIN</option>
        </select>
        <button type="submit">Create</button>
      </form>
    </div>
  );
}
