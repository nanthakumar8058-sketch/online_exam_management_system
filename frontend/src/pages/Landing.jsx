import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, BookOpen, Activity, CheckCircle, ArrowRight, Star, Cpu, Lock, Globe, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Landing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const features = [
    {
      title: 'High Security',
      desc: 'Advanced protection with multi-layer role verification.',
      icon: Shield,
      gradient: 'from-blue-600 to-indigo-600'
    },
    {
      title: 'Smart Monitoring',
      desc: 'Real-time proctoring with intelligent tab-switch tracking.',
      icon: Activity,
      gradient: 'from-rose-500 to-orange-500'
    },
    {
      title: 'Dynamic Questioning',
      desc: 'Randomized question delivery with rich media support.',
      icon: BookOpen,
      gradient: 'from-emerald-500 to-teal-500'
    },
    {
      title: 'Analytics Engine',
      desc: 'Performance review and automated grading.',
      icon: CheckCircle,
      gradient: 'from-amber-500 to-orange-600'
    }
  ];

  return (
    <div className="min-h-screen selection:bg-brand-600 selection:text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-premium border-b border-white/20">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-slate-900 flex items-center justify-center text-white shadow-xl rotate-3">
              <Cpu size={20} className="animate-pulse" />
            </div>
            <span className="text-2xl font-black tracking-tight text-slate-900">
              Exam<span className="text-brand-600">Core</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-10">
            {['Features', 'Security', 'Enterprise'].map(item => (
              <a key={item} href="#" className="text-sm font-bold text-slate-600 hover:text-brand-600 transition-colors uppercase tracking-widest">{item}</a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <button
                onClick={() => navigate(user.role === 'admin' ? '/admin' : user.role === 'staff' ? '/staff' : '/student')}
                className="btn-premium"
              >
                Go to Dashboard
                <ArrowRight size={18} />
              </button>
            ) : (
              <>
                <button onClick={() => navigate('/login')} className="btn-premium">Sign In</button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-44 pb-32 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/50 backdrop-blur-md rounded-full border border-white/40 shadow-sm mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span className="text-xs font-black uppercase tracking-widest text-slate-600">Smart Proctoring</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-black text-slate-900 leading-[0.9] tracking-tighter mb-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            Better Online <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-indigo-500 to-blue-600">Exams</span> For Everyone.
          </h1>

          <p className="max-w-2xl text-xl text-slate-500 font-medium leading-relaxed mb-12 animate-in fade-in slide-in-from-bottom-10 delay-200 duration-1000">
            A simple and secure online exam platform. Built for fairness and a smooth experience.
          </p>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-5xl mt-8 animate-in fade-in slide-in-from-bottom-12 delay-300 duration-1000">
            {[
              { role: 'student', title: 'Student', icon: BookOpen, color: 'from-emerald-500 to-teal-500' },
              { role: 'staff', title: 'Staff Portal', icon: ShieldCheck, color: 'from-blue-500 to-indigo-500' },
              { role: 'org', title: 'Organization', icon: Globe, color: 'from-amber-500 to-orange-500' },
              { role: 'admin', title: 'System Admin', icon: Lock, color: 'from-rose-500 to-red-600' }
            ].map(portal => (
              <button
                key={portal.role}
                onClick={() => navigate(`/login?role=${portal.role}`)}
                className="group relative overflow-hidden rounded-3xl glass-premium p-8 border hover:border-brand-500/50 transition-all hover:-translate-y-2 hover:shadow-2xl hover:shadow-brand-500/10 flex flex-col items-center gap-4 bg-white/40"
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${portal.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                  <portal.icon size={28} />
                </div>
                <span className="font-black text-slate-800 tracking-tight text-sm md:text-base uppercase">{portal.title}</span>
              </button>
            ))}
          </div>

          <div className="mt-12 flex items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-12 delay-500 duration-1000">
            <button
                onClick={() => navigate('/register-organization')}
                className="px-6 py-3 bg-white/50 backdrop-blur-md border-2 border-slate-200/50 text-slate-700 rounded-xl font-black text-sm uppercase tracking-widest transition-all hover:bg-white hover:border-brand-600 hover:text-brand-600 shadow-sm flex items-center gap-3"
              >
                🏛️ Register Organization <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* Floating Demo Image */}
        <div className="max-w-6xl mx-auto mt-24 relative px-4 animate-in fade-in zoom-in-95 delay-500 duration-1000">
          <div className="absolute -top-12 -left-12 w-64 h-64 bg-brand-600/10 rounded-full blur-[100px]"></div>
          <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-indigo-600/10 rounded-full blur-[100px]"></div>
          <div className="glass-premium p-3 rounded-[32px] shadow-2xl border-white relative overflow-hidden group">
            <img
              src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
              className="rounded-2xl w-full transform group-hover:scale-105 transition-transform duration-700"
              alt="Platform"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent"></div>
          </div>
        </div>
      </section>

      {/* Grid Section */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((f, i) => (
              <div key={i} className="glass-card p-6 rounded-3xl group">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${f.gradient} flex items-center justify-center text-white mb-6 shadow-lg shadow-current/30 group-hover:scale-110 transition-transform`}>
                  <f.icon size={26} />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-4">{f.title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-slate-100 bg-white/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex flex-col gap-4 items-center md:items-start">
            <div className="flex items-center gap-2">
              <Cpu size={20} className="text-brand-600" />
              <span className="font-black text-xl tracking-tighter">ExamCore</span>
            </div>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Enterprise Ready. Academic Approved.</p>
          </div>

          <div className="flex gap-12">
            {[
              { label: 'Platform', items: ['Features', 'Proctoring', 'Pricing'] },
              { label: 'Company', items: ['About', 'Security', 'Contact'] }
            ].map(col => (
              <div key={col.label} className="space-y-4 text-center md:text-left">
                <h4 className="font-black text-xs uppercase tracking-widest text-slate-900">{col.label}</h4>
                <ul className="space-y-2">
                  {col.items.map(item => (
                    <li key={item}><a href="#" className="text-sm font-bold text-slate-500 hover:text-brand-600 transition-colors">{item}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-20 pt-10 border-t border-slate-100 text-center">
          <p className="text-xs font-black text-slate-300 uppercase tracking-[0.2em]">© 2026 ExamCore Systems. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
