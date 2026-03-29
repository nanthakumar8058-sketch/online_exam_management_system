import React, { useState, useEffect } from 'react';
import { Building2, Plus, Trash2, Edit } from 'lucide-react';
import api from '../../api/axios';
import { toast } from 'react-hot-toast';

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const { data } = await api.get('/departments');
      setDepartments(data.data);
    } catch (err) {
      toast.error('Failed to load departments');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await api.put(`/departments/${currentId}`, formData);
        toast.success('Department updated');
      } else {
        await api.post('/departments', formData);
        toast.success('Department created');
      }
      setShowModal(false);
      fetchDepartments();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      try {
        await api.delete(`/departments/${id}`);
        toast.success('Department deleted');
        fetchDepartments();
      } catch (err) {
        toast.error('Failed to delete department');
      }
    }
  };

  const openAddModal = () => {
    setEditMode(false);
    setFormData({ name: '', description: '' });
    setShowModal(true);
  };

  const openEditModal = (dept) => {
    setEditMode(true);
    setCurrentId(dept._id);
    setFormData({ name: dept.name, description: dept.description });
    setShowModal(true);
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Departments</h1>
          <p className="text-slate-500 font-medium">Manage organization departments</p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-brand-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-brand-700 transition"
        >
          <Plus size={20} />
          Add Department
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map(dept => (
          <div key={dept._id} className="glass-premium p-6 rounded-3xl border border-white/40 shadow-xl flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-brand-600 flex items-center justify-center mb-4">
                <Building2 size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900">{dept.name}</h3>
              <p className="text-slate-500 mt-2 line-clamp-2">{dept.description || 'No description provided'}</p>
            </div>
            <div className="mt-6 flex gap-2">
              <button
                onClick={() => openEditModal(dept)}
                className="flex-1 bg-slate-100 text-slate-700 py-2 rounded-xl font-semibold hover:bg-slate-200 transition text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(dept._id)}
                className="flex-1 bg-red-50 text-red-600 py-2 rounded-xl font-semibold hover:bg-red-100 transition text-sm flex items-center justify-center"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {departments.length === 0 && (
        <div className="glass p-12 rounded-3xl text-center">
          <Building2 size={48} className="mx-auto text-slate-300 mb-4" />
          <h3 className="text-lg justify-center font-bold text-slate-900 mb-2">No Departments Yet</h3>
          <p className="text-slate-500 mb-6">Create your first department to start organizing members.</p>
          <button onClick={openAddModal} className="bg-brand-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-brand-700 transition inline-block">
            Create Department
          </button>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[32px] p-8 max-w-md w-full shadow-2xl">
            <h2 className="text-2xl font-black text-slate-900 mb-6">
              {editMode ? 'Edit Department' : 'New Department'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-2">Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full mt-1 bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-3 font-bold text-slate-900 focus:outline-none focus:border-brand-600 focus:bg-white transition-all focus:ring-4 focus:ring-brand-600/10"
                  placeholder="e.g. Computer Science"
                />
              </div>
              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full mt-1 bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-3 font-bold text-slate-900 focus:outline-none focus:border-brand-600 focus:bg-white transition-all focus:ring-4 focus:ring-brand-600/10 min-h-[100px]"
                  placeholder="Optional description"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 px-4 bg-slate-100 text-slate-500 rounded-2xl font-bold hover:bg-slate-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 bg-brand-600 text-white rounded-2xl font-bold hover:bg-brand-700 transition shadow-xl shadow-brand-600/20"
                >
                  {editMode ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Departments;
