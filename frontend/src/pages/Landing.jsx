import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Cpu, User, Building, ShieldCheck, GraduationCap, X, LogIn, UserPlus } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showOrgModal, setShowOrgModal] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between selection:bg-brand-600 selection:text-white font-sans">
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-slate-900 flex items-center justify-center text-white shadow-md">
              <Cpu size={20} />
            </div>
            <span className="text-2xl font-black text-slate-900">
              Exam<span className="text-brand-600">Core</span>
            </span>
          </div>

          <div>
            {user ? (
              <button
                onClick={() => navigate(user.role === 'admin' ? '/admin' : user.role === 'staff' ? '/staff' : '/student')}
                className="px-6 py-2 bg-slate-900 text-white font-bold rounded-lg shadow hover:bg-slate-800 transition"
              >
                Go to Dashboard
              </button>
            ) : (
              <button 
                onClick={() => navigate('/login')} 
                className="px-6 py-2 bg-brand-600 text-white font-bold rounded-lg shadow hover:bg-brand-700 transition"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20">
        <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-6 drop-shadow-sm tracking-tighter">
          Enterprise Assessment Platform
        </h1>
        <p className="max-w-2xl text-lg text-slate-500 font-medium mb-16 leading-relaxed">
          The unified architecture for creating, managing, and enforcing secure digital examinations. Select your access protocol below.
        </p>

        {/* Login Portals Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-5xl">
          
          {/* Student */}
          <div
            onClick={() => navigate('/login?role=student')}
            className="cursor-pointer group bg-white rounded-2xl p-6 border-2 border-slate-100 hover:border-emerald-500 hover:shadow-xl transition-all flex flex-col items-center text-center"
          >
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <GraduationCap size={28} />
            </div>
            <span className="font-bold text-xl text-slate-800">Student</span>
            <p className="text-sm text-slate-500 mt-2">Take your exams and view your results.</p>
          </div>

          {/* Staff */}
          <div
            onClick={() => navigate('/login?role=staff')}
            className="cursor-pointer group bg-white rounded-2xl p-6 border-2 border-slate-100 hover:border-blue-500 hover:shadow-xl transition-all flex flex-col items-center text-center"
          >
            <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <User size={28} />
            </div>
            <span className="font-bold text-xl text-slate-800">Staff</span>
            <p className="text-sm text-slate-500 mt-2">Create questions, manage exams, and monitor students.</p>
          </div>

          {/* Organization */}
          <div 
            onClick={() => setShowOrgModal(true)}
            className="cursor-pointer group bg-white rounded-2xl p-6 border-2 border-slate-100 hover:border-orange-500 hover:shadow-xl transition-all flex flex-col items-center text-center"
          >
            <div className="w-16 h-16 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center mb-4 group-hover:bg-orange-600 group-hover:text-white transition-colors">
              <Building size={28} />
            </div>
            <span className="font-bold text-xl text-slate-800">Organization</span>
            <p className="text-sm text-slate-500 mt-2">Manage your staff members and students directly.</p>
          </div>

          {/* Admin */}
          <div
            onClick={() => navigate('/login?role=admin')}
            className="cursor-pointer group bg-white rounded-2xl p-6 border-2 border-slate-100 hover:border-rose-500 hover:shadow-xl transition-all flex flex-col items-center text-center"
          >
            <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mb-4 group-hover:bg-rose-600 group-hover:text-white transition-colors">
              <ShieldCheck size={28} />
            </div>
            <span className="font-bold text-xl text-slate-800">Admin</span>
            <p className="text-sm text-slate-500 mt-2">System administrator setup and oversight.</p>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-white border-t border-slate-200 text-center">
        <p className="text-sm text-slate-400 font-bold">© {new Date().getFullYear()} ExamCore. All rights reserved.</p>
      </footer>

      {/* Org Options Modal */}
      {showOrgModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[32px] p-8 max-w-sm w-full shadow-2xl relative animate-in zoom-in-95 duration-300">
            <button onClick={() => setShowOrgModal(false)} className="absolute top-6 right-6 w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-900 hover:text-white transition-all">
              <X size={20} />
            </button>
            
            <div className="text-center mb-8 mt-2">
              <div className="w-20 h-20 bg-orange-50 text-brand-600 rounded-[24px] flex items-center justify-center mx-auto mb-6 rotate-3">
                <Building size={40} />
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Organization Portal</h2>
              <p className="text-sm text-slate-500 font-medium mt-2 px-4">Log in to manage your institution or register a new one.</p>
            </div>
            
            <div className="flex flex-col gap-4">
              <button 
                onClick={() => navigate('/login?role=org')} 
                className="w-full flex items-center justify-center gap-3 py-4 bg-white border-2 border-slate-200 hover:border-brand-600 hover:bg-brand-50 text-slate-800 font-bold rounded-2xl transition hover:shadow-md group"
              >
                <LogIn size={20} className="text-brand-600 group-hover:-translate-x-1 transition-transform" /> Sign In securely
              </button>
              <button 
                onClick={() => navigate('/register-organization')} 
                className="w-full flex items-center justify-center gap-3 py-4 bg-brand-600 text-white font-bold rounded-2xl hover:bg-brand-700 transition shadow-lg shadow-brand-600/20 group"
              >
                <UserPlus size={20} className="group-hover:translate-x-1 transition-transform" /> Create an Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Landing;
