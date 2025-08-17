import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const nameOk = (s) => s.length >= 3 && s.length <= 60;

const addrOk = (s) => !s || s.length <= 400;
const passOk = (s) => /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/.test(s);

export default function Signup() {
  const { signup } = useContext(AuthContext);
  const nav = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', address: '', password: '' });
  const [err, setErr] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    if (!nameOk(form.name)) return setErr('Name must be 20-60 chars.');
    if (!addrOk(form.address)) return setErr('Address max 400 chars.');
    if (!passOk(form.password)) return setErr('Password 8-16, 1 uppercase & 1 special char required.');
    try {
      await signup(form);
      nav('/');
    } catch (e) {
      setErr(e.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Sign Up <span className="text-blue-600">(Normal User)</span>
        </h2>

        {err && <p className="text-red-500 text-sm text-center mb-4">{err}</p>}

        <form onSubmit={submit} className="space-y-5">
          {/* Name */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Name</label>
            <input
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="Enter your full name"
            />
            <small className="text-gray-500 text-xs">Min 20, Max 60 chars.</small>
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Email</label>
            <input
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              type="email"
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="Enter your email"
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Address</label>
            <textarea
              value={form.address}
              onChange={e => setForm({ ...form, address: e.target.value })}
              maxLength={400}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none resize-none"
              rows="3"
              placeholder="Enter your address (optional)"
            />
            <small className="text-gray-500 text-xs">Max 400 chars.</small>
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Password</label>
            <input
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              type="password"
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="Enter a strong password"
            />
            <small className="text-gray-500 text-xs">
              8-16 chars with at least 1 uppercase & 1 special char.
            </small>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition duration-200"
          >
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
}
