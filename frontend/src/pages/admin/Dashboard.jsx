import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { Users, FileText, CheckCircle, BarChart3, Clock, ArrowUpRight, TrendingUp, Activity, ShieldCheck, Building2, ChevronRight } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ users: 0, exams: 0, results: 0, organizations: 0 });
  const [recentOrgs, setRecentOrgs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const results = await Promise.allSettled([
          api.get('/admin/users'),
          api.get('/exams'),
          api.get('/results'),
          api.get('/organizations') // Fetch organizations
        ]);

        const [u, e, r, o] = results.map(res => res.status === 'fulfilled' ? res.value : { data: {} });

        setStats({
          users: u.data?.count || u.data?.data?.length || 0,
          exams: e.data?.count || e.data?.data?.length || 0,
          results: r.data?.count || r.data?.data?.length || 0,
          organizations: o.data?.count || o.data?.data?.length || 0
        });

        if (o.data?.data) {
          setRecentOrgs(o.data.data.slice(0, 5));
        }
      } catch (err) {
        console.error('Failed to fetch stats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    { name: 'Total Users', value: stats.users, icon: Users, gradient: 'from-indigo-600 to-blue-600', trend: '+12.5%' },
    { name: 'Total Organizations', value: stats.organizations, icon: Building2, gradient: 'from-purple-600 to-pink-600', trend: '+5' },
    { name: 'Active Exams', value: stats.exams, icon: FileText, gradient: 'from-brand-600 to-indigo-600', trend: '+2' },
    { name: 'Tests Completed', value: stats.results, icon: CheckCircle, gradient: 'from-emerald-600 to-teal-600', trend: '+24%' },
  ];

  const quickActions = [
    { title: 'Manage Users', desc: 'Approve or remove platform users', icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50', link: '/admin/users' },
    { title: 'Organizations', desc: 'Review organization access', icon: Building2, color: 'text-purple-600', bg: 'bg-purple-50', link: '/admin/organizations' },
    { title: 'Exam Bank', desc: 'View global exam records', icon: FileText, color: 'text-brand-600', bg: 'bg-brand-50', link: '/admin/exams' },
    { title: 'System Logs', desc: 'Monitor platform activity', icon: Activity, color: 'text-slate-600', bg: 'bg-slate-100', link: '#' },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter italic uppercase">Admin Dashboard</h1>
          <p className="text-slate-500 font-black text-[10px] uppercase tracking-[0.4em]">Platform statistics and overview</p>
        </div>
        <div className="flex items-center gap-3 bg-white/50 backdrop-blur-md p-1.5 rounded-2xl border border-white/40 shadow-sm">
          <div className="px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold shadow-lg flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
            System Online
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <div key={i} className="glass-premium p-8 rounded-[36px] overflow-hidden group hover:-translate-y-1 transition-all">
            <div className="flex justify-between items-start mb-6">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${card.gradient} flex items-center justify-center text-white shadow-xl shadow-current/20 group-hover:scale-110 transition-transform`}>
                <card.icon size={28} />
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">{card.trend}</span>
              </div>
            </div>
            <h3 className="text-slate-400 text-sm font-bold uppercase tracking-widest">{card.name}</h3>
            <p className="text-4xl font-black text-slate-900 mt-2 tracking-tighter">
              {loading ? <span className="text-slate-300">...</span> : card.value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Recent Organizations</h2>
            <Link to="/admin/organizations" className="text-brand-600 text-sm font-semibold hover:text-brand-700 flex items-center gap-1">
              View All <ChevronRight size={16} />
            </Link>
          </div>
          
          <div className="glass-premium rounded-[32px] overflow-hidden">
            {loading ? (
              <div className="p-8 text-center text-slate-500 font-medium">Loading organizations...</div>
            ) : recentOrgs.length > 0 ? (
              <div className="divide-y divide-slate-100/50">
                {recentOrgs.map((org, i) => (
                  <div key={i} className="p-6 flex items-center justify-between hover:bg-white/40 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 font-bold uppercase text-lg border border-slate-200">
                        {org.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900">{org.name}</h4>
                        <p className="text-xs text-slate-500">Contact: {org.contactEmail}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        org.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : 
                        org.status === 'pending' ? 'bg-amber-100 text-amber-700' : 
                        'bg-red-100 text-red-700'
                      }`}>
                        {org.status || 'Pending'}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">
                        {new Date(org.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-slate-500 font-medium">No organizations found.</div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-900">Quick Actions</h2>
          <div className="grid grid-cols-1 gap-4">
            {quickActions.map((action, i) => (
              <Link key={i} to={action.link} className={`glass-premium p-6 rounded-3xl flex items-center gap-5 hover:-translate-y-1 transition-all group border-l-4 border-transparent hover:border-brand-500`}>
                <div className={`w-12 h-12 rounded-2xl ${action.bg} ${action.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <action.icon size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">{action.title}</h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">{action.desc}</p>
                </div>
              </Link>
            ))}
          </div>
          
          <div className="glass-premium p-6 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 text-white mt-8 relative overflow-hidden">
            <ShieldCheck size={120} className="absolute -right-6 -bottom-6 text-white/5" />
            <h3 className="font-bold text-lg mb-2 relative z-10">System Status</h3>
            <p className="text-sm text-slate-300 relative z-10 mb-4">All services are running normally with no reported issues. API latency is optimal.</p>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400 relative z-10">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              All Systems Operational
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default AdminDashboard;
