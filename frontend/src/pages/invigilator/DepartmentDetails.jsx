import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { Users, FileText, Building2, ArrowLeft, Clock, Zap } from 'lucide-react';
import { toast } from 'react-hot-toast';

const StaffDepartmentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState({ department: null, exams: [], students: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDepartmentDetails();
  }, [id]);

  const fetchDepartmentDetails = async () => {
    try {
      const res = await api.get(`/departments/${id}/details`);
      setData(res.data.data);
    } catch (err) {
      toast.error('Failed to load department details');
      navigate('/staff/departments');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-500 font-bold uppercase tracking-widest text-xs animate-pulse">Loading Department...</div>;
  }

  const { department, exams, students } = data;

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/staff/departments')} className="w-12 h-12 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-600 hover:text-brand-600 hover:border-brand-200 transition-all group">
            <ArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          </button>
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter italic uppercase">{department?.name}</h1>
            <p className="text-slate-500 font-black text-[10px] uppercase tracking-[0.4em] flex items-center gap-2 mt-2">
              <Building2 size={12} /> {department?.description || 'Department Directory'}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Exams Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
                <FileText size={20} />
              </div>
              Assigned Exams
            </h2>
            <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold">{exams.length}</span>
          </div>

          <div className="glass-premium rounded-[32px] overflow-hidden border border-white/40 shadow-xl">
            {exams.length === 0 ? (
              <div className="p-12 text-center">
                <FileText size={40} className="mx-auto text-slate-300 mb-4" />
                <p className="text-slate-500 font-medium text-sm">No exams assigned to this department yet.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {exams.map(exam => {
                  const date = new Date(exam.scheduledDate);
                  const isPast = date < new Date();
                  return (
                    <div key={exam._id} className="p-6 flex items-start justify-between hover:bg-white/40 transition-colors">
                      <div>
                        <h4 className="font-bold text-slate-900">{exam.name}</h4>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-md flex items-center gap-1.5">
                            <Clock size={12} /> {exam.duration}m
                          </span>
                          <span className="text-xs text-brand-600 font-semibold">{exam.subject}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest ${isPast ? 'bg-slate-100 text-slate-500' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'}`}>
                          {isPast ? 'Completed' : 'Upcoming'}
                        </span>
                        <span className="text-xs text-slate-400 font-semibold">{date.toLocaleDateString()}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Students Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Users size={20} />
              </div>
              Enrolled Students
            </h2>
            <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold">{students.length}</span>
          </div>

          <div className="glass-premium rounded-[32px] overflow-hidden border border-white/40 shadow-xl">
           {students.length === 0 ? (
              <div className="p-12 text-center">
                <Users size={40} className="mx-auto text-slate-300 mb-4" />
                <p className="text-slate-500 font-medium text-sm">No students assigned to this department yet.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
                {students.map(student => (
                  <div key={student._id} className="p-6 flex items-center gap-4 hover:bg-white/40 transition-colors">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-400 font-black uppercase text-lg border border-slate-200 shadow-inner flex items-center justify-center">
                      {student.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-slate-900 truncate">{student.name}</h4>
                      <p className="text-xs text-slate-500 truncate">{student.email}</p>
                    </div>
                    {student.registerNumber && (
                      <div className="px-2 py-1 bg-slate-100 border border-slate-200 text-slate-500 text-[10px] font-black tracking-widest uppercase rounded">
                        {student.registerNumber}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffDepartmentDetails;
