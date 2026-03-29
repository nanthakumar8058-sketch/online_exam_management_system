import React, { useState, useEffect } from 'react';
import { Building2 } from 'lucide-react';
import api from '../../api/axios';
import { toast } from 'react-hot-toast';

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <div className="p-8 text-center text-slate-500 font-bold uppercase tracking-widest text-xs">Loading Departments...</div>;

  return (
    <div className="p-8 animate-in fade-in duration-700">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight italic uppercase">Departments Directory</h1>
          <p className="text-slate-500 font-black text-[10px] uppercase tracking-[0.4em] mt-1">View organization departments and their details</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map(dept => (
          <div key={dept._id} className="glass-premium p-6 rounded-3xl border border-white/40 shadow-xl flex flex-col justify-between hover:-translate-y-1 transition-transform cursor-pointer">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-brand-600 flex items-center justify-center mb-4 shadow-inner">
                <Building2 size={24} />
              </div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">{dept.name}</h3>
              <p className="text-slate-500 mt-2 line-clamp-2 text-sm font-medium">{dept.description || 'No description provided'}</p>
            </div>
            
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Created: {new Date(dept.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>

      {departments.length === 0 && (
        <div className="glass p-12 rounded-[40px] text-center border-2 border-dashed border-slate-200">
          <Building2 size={48} className="mx-auto text-slate-300 mb-6" />
          <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">No Departments Yet</h3>
          <p className="text-slate-500 text-sm font-medium">There are currently no departments configured for this organization.</p>
        </div>
      )}
    </div>
  );
};

export default Departments;
