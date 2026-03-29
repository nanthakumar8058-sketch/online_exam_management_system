import React, { useState, useEffect } from 'react';
import { Building2, Plus, Trash2, Edit, Users, Search, GraduationCap, Briefcase, X, UserPlus, ArrowRight } from 'lucide-react';
import api from '../../api/axios';
import { toast } from 'react-hot-toast';

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [allMembers, setAllMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modals state
  const [showAddDeptModal, setShowAddDeptModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  
  // Selection state
  const [selectedDept, setSelectedDept] = useState(null);
  
  // Form forms
  const [deptForm, setDeptForm] = useState({ name: '', description: '' });
  const [memberForm, setMemberForm] = useState({ name: '', email: '', role: 'student', employeeId: '', registerNumber: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [deptRes, usersRes] = await Promise.all([
        api.get('/departments'),
        api.get('/organizations/me/users')
      ]);
      setDepartments(deptRes.data.data);
      setAllMembers(usersRes.data.data);
    } catch (err) {
      toast.error('Failed to load records.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeptSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        const res = await api.put(`/departments/${selectedDept._id}`, deptForm);
        setDepartments(departments.map(d => d._id === selectedDept._id ? res.data.data : d));
        setSelectedDept(res.data.data);
        toast.success('Department updated successfully.');
      } else {
        const res = await api.post('/departments', deptForm);
        setDepartments([...departments, res.data.data]);
        toast.success('Department created successfully.');
      }
      setShowAddDeptModal(false);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Operation failed');
    }
  };

  const handleDeptDelete = async (id) => {
    const deptMembers = allMembers.filter(m => m.department?._id === id);
    if (deptMembers.length > 0) {
      toast.error(`Cannot delete! Reassign the ${deptMembers.length} members first.`);
      return;
    }

    if (window.confirm('Are you sure you want to permanently delete this department?')) {
      try {
        await api.delete(`/departments/${id}`);
        setDepartments(departments.filter(d => d._id !== id));
        setSelectedDept(null);
        toast.success('Department removed.');
      } catch (err) {
        toast.error('Failed to delete department.');
      }
    }
  };

  const handleMemberSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = { ...memberForm, department: selectedDept._id };
      if (payload.role === 'staff' && !payload.employeeId) payload.employeeId = `EMP-${Math.floor(100000 + Math.random() * 900000)}`;
      if (payload.role === 'student' && !payload.registerNumber) payload.registerNumber = `STU-${Math.floor(100000 + Math.random() * 900000)}`;
      
      const res = await api.post('/organizations/me/users', payload);
      setAllMembers([res.data.data, ...allMembers]);
      toast.success('Member assigned to department successfully.');
      setShowAddMemberModal(false);
      setMemberForm({ name: '', email: '', role: 'student', employeeId: '', registerNumber: '' });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500 font-bold uppercase tracking-widest text-xs">Loading Overview...</div>;

  return (
    <div className="p-8 flex gap-8 relative max-w-[1600px] mx-auto min-h-[calc(100vh-4rem)]">
      
      {/* Left Column (Grid) */}
      <div className={`flex-1 transition-all duration-300 ${selectedDept ? 'lg:w-[40%] xl:w-[45%]' : 'w-full'}`}>
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Departments Directory</h1>
            <p className="text-slate-500 font-bold text-sm mt-1">Select a department to manage staff and students</p>
          </div>
          <button
            onClick={() => { setEditMode(false); setDeptForm({name:'', description:''}); setShowAddDeptModal(true); }}
            className="px-6 py-3 bg-slate-900 hover:bg-brand-600 text-white rounded-2xl font-bold flex items-center gap-2 transition shadow-lg active:scale-95"
          >
            <Plus size={20} />
            Add Department
          </button>
        </div>

        <div className={`grid gap-6 ${selectedDept ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'} items-start`}>
          {departments.map(dept => {
            const count = allMembers.filter(m => m.department?._id === dept._id).length;
            const isSelected = selectedDept?._id === dept._id;

            return (
              <div 
                key={dept._id} 
                onClick={() => setSelectedDept(dept)}
                className={`cursor-pointer overflow-hidden bg-white p-6 rounded-[28px] border-2 transition-all group ${
                  isSelected 
                  ? 'border-brand-500 shadow-xl shadow-brand-500/10 bg-brand-50/50' 
                  : 'border-slate-100 hover:border-slate-300 hover:shadow-lg'
                }`}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${isSelected ? 'bg-brand-600 text-white' : 'bg-slate-50 text-brand-600 group-hover:bg-slate-100'}`}>
                    <Building2 size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900 leading-tight">{dept.name}</h3>
                    <p className="text-xs font-bold text-slate-400 mt-1">{count} Linked Members</p>
                  </div>
                </div>
                <p className="text-slate-500 text-sm font-medium line-clamp-2">{dept.description || 'No description provided.'}</p>
              </div>
            );
          })}
        </div>

        {departments.length === 0 && (
          <div className="bg-white p-12 rounded-[40px] text-center border-2 border-dashed border-slate-200">
            <Building2 size={48} className="mx-auto text-slate-300 mb-6" />
            <h3 className="text-2xl font-black text-slate-900 mb-2">No Departments Configured</h3>
            <p className="text-slate-500 text-sm mb-6 max-w-sm mx-auto">Create departments to start organizing your staff and students logically.</p>
            <button onClick={() => { setEditMode(false); setDeptForm({name:'', description:''}); setShowAddDeptModal(true); }} className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold hover:bg-brand-600 transition shadow-lg">
              Initialize Directory
            </button>
          </div>
        )}
      </div>

      {/* Right Column (Detailed View Slide-over) */}
      {selectedDept && (
        <div className="hidden lg:flex w-[55%] flex-col bg-white rounded-[40px] shadow-2xl border-2 border-slate-100 overflow-hidden sticky top-8 max-h-[calc(100vh-6rem)] animate-in fade-in slide-in-from-right-8 duration-500">
          
          {/* Header Action Bar */}
          <div className="bg-slate-900 p-8 text-white flex justify-between items-start relative overflow-hidden">
            <div className="absolute top-[-10%] right-[-5%] w-[40%] h-full bg-white/5 rounded-full blur-[40px]"></div>
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full font-black text-[10px] uppercase tracking-widest mb-4 border border-white/10">
                <Users size={12} /> Detailed Insight
              </div>
              <h2 className="text-4xl font-black tracking-tight">{selectedDept.name}</h2>
              <p className="text-slate-300 font-medium mt-3 max-w-lg leading-relaxed text-sm">{selectedDept.description || 'No specialized description provided.'}</p>
            </div>
            
            <button onClick={() => setSelectedDept(null)} className="w-10 h-10 bg-white/10 hover:bg-white text-white hover:text-slate-900 rounded-full flex items-center justify-center transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="p-4 bg-slate-50 border-b border-slate-200 flex gap-2">
            <button 
              onClick={() => setShowAddMemberModal(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-brand-600 text-white rounded-xl font-bold text-sm shadow hover:bg-brand-700 transition"
            >
              <UserPlus size={16} /> Add Member
            </button>
            <button 
              onClick={() => { setEditMode(true); setDeptForm({ name: selectedDept.name, description: selectedDept.description }); setShowAddDeptModal(true); }}
              className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-100 transition shadow-sm"
            >
              <Edit size={16} /> Update Details
            </button>
            <button 
              onClick={() => handleDeptDelete(selectedDept._id)}
              className="ml-auto flex flex-col sm:flex-row items-center gap-2 px-5 py-2.5 bg-rose-50 text-rose-600 border border-rose-100 rounded-xl font-bold text-sm hover:bg-rose-100 transition"
            >
              <Trash2 size={16} /> Remove
            </button>
          </div>

          {/* Members List */}
          <div className="flex-1 overflow-y-auto p-8 bg-slate-50 space-y-8">
            {['staff', 'student'].map(role => {
              const members = allMembers.filter(m => m.department?._id === selectedDept._id && m.role === role);
              return (
                <div key={role} className="bg-white rounded-[24px] p-6 border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
                    <h3 className="font-black text-slate-900 text-lg uppercase tracking-tight flex items-center gap-3">
                      {role === 'staff' ? <Briefcase className="text-blue-500" size={20} /> : <GraduationCap className="text-emerald-500" size={20} />}
                      Assigned {role}s
                    </h3>
                    <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-black">{members.length} Total</span>
                  </div>

                  {members.length === 0 ? (
                    <div className="text-center py-6">
                      <p className="text-sm font-bold text-slate-400">No {role} assigned to this department yet.</p>
                    </div>
                  ) : (
                    <div className="grid gap-3">
                      {members.map(m => (
                        <div key={m._id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition border border-transparent hover:border-slate-200">
                          <div>
                            <p className="font-black text-slate-900 text-sm">{m.name}</p>
                            <p className="text-xs font-bold text-slate-500">{m.email}</p>
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-white px-3 py-1.5 rounded-lg border border-slate-200">
                            {m.employeeId || m.registerNumber}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Mobile Detailed View Drawer */}
      {selectedDept && (
        <div className="lg:hidden fixed inset-0 z-50 bg-white overflow-y-auto animate-in slide-in-from-bottom duration-300">
             {/* Same contents for mobile, adjusted slightly just to exist if user shrinks browser */}
             <div className="p-6 bg-slate-900 text-white flex justify-between items-center sticky top-0 z-10">
               <div>
                  <h2 className="text-2xl font-black">{selectedDept.name}</h2>
                  <p className="text-xs text-slate-400">{allMembers.filter(m => m.department?._id === selectedDept._id).length} Members</p>
               </div>
               <button onClick={() => setSelectedDept(null)} className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                 <X size={20} />
               </button>
             </div>
             <div className="flex gap-2 p-4 overflow-x-auto bg-slate-50 border-b">
                 <button onClick={() => setShowAddMemberModal(true)} className="whitespace-nowrap px-4 py-2 bg-brand-600 text-white font-bold text-xs rounded-xl shadow-sm">Add Member</button>
                 <button onClick={() => { setEditMode(true); setDeptForm({ name: selectedDept.name, description: selectedDept.description }); setShowAddDeptModal(true); }} className="whitespace-nowrap px-4 py-2 bg-white text-slate-800 font-bold text-xs border rounded-xl">Edit Dept</button>
                 <button onClick={() => handleDeptDelete(selectedDept._id)} className="whitespace-nowrap px-4 py-2 bg-rose-50 text-rose-600 font-bold text-xs border border-rose-100 rounded-xl">Delete</button>
             </div>
             <div className="p-4 space-y-4">
               {/* Mobile member listing */}
               {allMembers.filter(m => m.department?._id === selectedDept._id).map(m => (
                 <div key={m._id} className="p-4 border rounded-2xl bg-white shadow-sm">
                   <p className="font-bold text-slate-900">{m.name} <span className="text-[10px] uppercase text-slate-400 ml-2">{m.role}</span></p>
                   <p className="text-xs text-slate-500">{m.email}</p>
                 </div>
               ))}
             </div>
        </div>
      )}

      {/* Dept Modal */}
      {showAddDeptModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-[32px] p-8 max-w-md w-full shadow-2xl relative">
            <button onClick={() => setShowAddDeptModal(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-900 transition">
              <X size={20} />
            </button>
            <h2 className="text-3xl font-black text-slate-900 mb-6">{editMode ? 'Update Details' : 'New Department'}</h2>
            <form onSubmit={handleDeptSubmit} className="space-y-5">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Name</label>
                <input required type="text" value={deptForm.name} onChange={e => setDeptForm({ ...deptForm, name: e.target.value })} className="w-full mt-1 bg-slate-50 border-2 border-transparent rounded-2xl px-5 py-4 font-bold text-slate-900 focus:bg-white focus:border-brand-600 outline-none transition" placeholder="e.g. Science Dept" />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Description</label>
                <textarea value={deptForm.description} onChange={e => setDeptForm({ ...deptForm, description: e.target.value })} className="w-full mt-1 bg-slate-50 border-2 border-transparent rounded-2xl px-5 py-4 font-bold text-slate-900 focus:bg-white focus:border-brand-600 outline-none transition resize-none h-28" placeholder="Short description..." />
              </div>
              <button type="submit" className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-sm tracking-widest hover:bg-brand-600 transition shadow-xl mt-4">
                {editMode ? 'Save Changes' : 'Initialize'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add Member Modal */}
      {showAddMemberModal && selectedDept && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-[32px] p-8 max-w-lg w-full shadow-2xl relative overflow-hidden">
            <button onClick={() => setShowAddMemberModal(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-900 z-10 transition">
              <X size={20} />
            </button>
            <div className="mb-8 relative z-10 text-center">
               <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-50 text-brand-600 rounded-full font-black text-[10px] uppercase tracking-widest mb-4">
                 <Building2 size={14} /> Assigning to {selectedDept.name}
               </div>
               <h2 className="text-3xl font-black text-slate-900">Add Member</h2>
            </div>

            <form onSubmit={handleMemberSubmit} className="space-y-4 relative z-10">
               <div className="flex gap-2">
                 {['student', 'staff'].map(r => (
                    <button type="button" key={r} onClick={() => setMemberForm({...memberForm, role: r})} className={`flex-1 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition border-2 ${memberForm.role === r ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-500 border-slate-200'}`}>
                      {r}
                    </button>
                 ))}
               </div>
               
               <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Full Name</label>
                   <input required type="text" value={memberForm.name} onChange={e => setMemberForm({...memberForm, name: e.target.value})} className="w-full bg-slate-50 border-2 border-transparent rounded-2xl px-4 py-3 font-bold text-sm focus:border-brand-600 outline-none" placeholder="John Doe" />
                 </div>
                 <div>
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Email Address</label>
                   <input required type="email" value={memberForm.email} onChange={e => setMemberForm({...memberForm, email: e.target.value})} className="w-full bg-slate-50 border-2 border-transparent rounded-2xl px-4 py-3 font-bold text-sm focus:border-brand-600 outline-none" placeholder="john@example.com" />
                 </div>
               </div>

               {memberForm.role === 'staff' && (
                 <div className="animate-in fade-in slide-in-from-top-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Employee ID (Optional Auto-Gen)</label>
                   <input type="text" value={memberForm.employeeId} onChange={e => setMemberForm({...memberForm, employeeId: e.target.value})} className="w-full bg-slate-50 border-2 border-transparent rounded-2xl px-4 py-3 font-bold text-sm focus:border-brand-600 outline-none" placeholder="EMP-001" />
                 </div>
               )}
               {memberForm.role === 'student' && (
                 <div className="animate-in fade-in slide-in-from-top-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Registration No (Optional Auto-Gen)</label>
                   <input type="text" value={memberForm.registerNumber} onChange={e => setMemberForm({...memberForm, registerNumber: e.target.value})} className="w-full bg-slate-50 border-2 border-transparent rounded-2xl px-4 py-3 font-bold text-sm focus:border-brand-600 outline-none" placeholder="REG-1200" />
                 </div>
               )}

               <button type="submit" disabled={submitting} className="w-full py-4 mt-6 bg-brand-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-brand-600/20 active:scale-95 transition">
                 {submitting ? 'Generating Identity...' : 'Link to Department'}
               </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Departments;
