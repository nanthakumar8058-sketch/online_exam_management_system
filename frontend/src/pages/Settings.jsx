import React, { useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { User, Lock, Save, ShieldCheck, Fingerprint, RefreshCcw, Mail, Phone, Calendar, BookOpen, Briefcase, Hash } from 'lucide-react';
import { toast } from 'react-hot-toast';

const Settings = () => {
    const { user, updateUser } = useAuth();
    const [loading, setLoading] = useState(false);
    
    // Safely parse DOB
    let initialDob = '';
    if (user?.dateOfBirth) {
        try {
            initialDob = new Date(user.dateOfBirth).toISOString().split('T')[0];
        } catch(e) {
            initialDob = '';
        }
    }

    const [profileData, setProfileData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        dateOfBirth: initialDob,
        yearOfStudy: user?.yearOfStudy || '',
        yearOfExperience: user?.yearOfExperience || ''
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.put('/auth/updatedetails', profileData);
            updateUser(res.data.data);
            toast.success('Professional Identity Updated', {
                style: { borderRadius: '16px', background: '#0f172a', color: '#fff' }
            });
        } catch (err) {
            toast.error(err.response?.data?.error || 'Update Failed');
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            return toast.error('Passwords do not match');
        }
        setLoading(true);
        try {
            const payload = {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            };

            await api.put('/auth/updatepassword', payload);
            toast.success('Access Key Secured');
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            toast.error(err.response?.data?.error || 'Security Breach - Failed');
        } finally {
            setLoading(false);
        }
    };

    const isStudent = user?.role === 'student';
    const isStaff = user?.role === 'staff';

    return (
        <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in duration-700 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-900 rounded-[40px] p-10 relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-600/20 rounded-full blur-3xl -mr-20 -mt-20"></div>
                <div className="flex items-center gap-6 relative z-10">
                    <div className="w-24 h-24 rounded-[32px] bg-white/10 flex items-center justify-center text-brand-400 shadow-inner rotate-3 border border-white/10 backdrop-blur-md">
                        {isStudent ? <BookOpen size={48} /> : isStaff ? <Briefcase size={48} /> : <ShieldCheck size={48} /> }
                    </div>
                    <div>
                        <h1 className="text-4xl font-black text-white tracking-tighter uppercase">{user?.name}</h1>
                        <p className="text-brand-400 font-black text-xs uppercase tracking-[0.4em] mt-2">
                            {isStudent ? 'Registered Student' : isStaff ? 'Faculty Member' : 'System Administrator'}
                        </p>
                    </div>
                </div>
                
                {/* ID Badge Display (Read Only) */}
                <div className="relative z-10 bg-white/10 border border-white/20 rounded-3xl p-6 backdrop-blur-md min-w-[250px]">
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-4 border-b border-white/10 pb-2">Digital ID Card</p>
                    <div className="space-y-3">
                        {isStudent && (
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-400 font-bold flex items-center gap-2"><Hash size={14} /> Register No</span>
                                <span className="text-white font-black">{user?.registerNumber || 'PENDING'}</span>
                            </div>
                        )}
                        {isStaff && (
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-400 font-bold flex items-center gap-2"><Hash size={14} /> Employee ID</span>
                                <span className="text-white font-black">{user?.employeeId || 'PENDING'}</span>
                            </div>
                        )}
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-400 font-bold flex items-center gap-2"><Mail size={14} /> Domain</span>
                            <span className="text-white font-black truncate max-w-[120px]" title={user?.email}>{user?.email?.split('@')[1] || 'Internal'}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Professional Profile Form */}
                <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-50 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform"></div>
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100 group-hover:bg-brand-50 group-hover:text-brand-600 transition-colors">
                            <User size={24} />
                        </div>
                        <h2 className="text-2xl font-black uppercase tracking-tighter text-slate-900">Bio Data</h2>
                    </div>

                    <form onSubmit={handleUpdateProfile} className="space-y-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Legal Name</label>
                                <div className="relative">
                                    <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="text"
                                        className="w-full bg-slate-50 border-2 border-transparent rounded-[20px] py-3.5 pl-11 pr-4 focus:bg-white focus:border-brand-600 outline-none transition-all font-bold text-slate-900 text-sm"
                                        value={profileData.name}
                                        onChange={e => setProfileData({ ...profileData, name: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Coordinates</label>
                                <div className="relative">
                                    <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="email"
                                        className="w-full bg-slate-50 border-2 border-transparent rounded-[20px] py-3.5 pl-11 pr-4 focus:bg-white focus:border-brand-600 outline-none transition-all font-bold text-slate-900 text-sm"
                                        value={profileData.email}
                                        onChange={e => setProfileData({ ...profileData, email: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Direct Phone Line</label>
                                <div className="relative">
                                    <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="tel"
                                        placeholder="+1 (555) 000-0000"
                                        className="w-full bg-slate-50 border-2 border-transparent rounded-[20px] py-3.5 pl-11 pr-4 focus:bg-white focus:border-brand-600 outline-none transition-all font-bold text-slate-900 text-sm"
                                        value={profileData.phone}
                                        onChange={e => setProfileData({ ...profileData, phone: e.target.value })}
                                    />
                                </div>
                            </div>
                            
                            {isStudent && (
                                <>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Date of Birth</label>
                                        <div className="relative">
                                            <Calendar size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                            <input
                                                type="date"
                                                className="w-full bg-slate-50 border-2 border-transparent rounded-[20px] py-3.5 pl-11 pr-4 focus:bg-white focus:border-brand-600 outline-none transition-all font-bold text-slate-600 text-sm"
                                                value={profileData.dateOfBirth}
                                                onChange={e => setProfileData({ ...profileData, dateOfBirth: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1 sm:col-span-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Current Year of Study</label>
                                        <div className="relative">
                                            <BookOpen size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                            <select
                                                className="w-full bg-slate-50 border-2 border-transparent rounded-[20px] py-3.5 pl-11 pr-4 focus:bg-white focus:border-brand-600 outline-none transition-all font-bold text-slate-900 text-sm appearance-none"
                                                value={profileData.yearOfStudy}
                                                onChange={e => setProfileData({ ...profileData, yearOfStudy: e.target.value })}
                                            >
                                                <option value="">Select Year...</option>
                                                <option value="First Year">First Year (Freshman)</option>
                                                <option value="Second Year">Second Year (Sophomore)</option>
                                                <option value="Third Year">Third Year (Junior)</option>
                                                <option value="Fourth Year">Fourth Year (Senior)</option>
                                                <option value="Postgraduate">Postgraduate / Masters</option>
                                            </select>
                                        </div>
                                    </div>
                                </>
                            )}

                            {isStaff && (
                                <div className="space-y-1 sm:col-span-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Years of Experience</label>
                                    <div className="relative">
                                        <Briefcase size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="number"
                                            min="0"
                                            max="50"
                                            placeholder="e.g. 5"
                                            className="w-full bg-slate-50 border-2 border-transparent rounded-[20px] py-3.5 pl-11 pr-4 focus:bg-white focus:border-brand-600 outline-none transition-all font-bold text-slate-900 text-sm"
                                            value={profileData.yearOfExperience}
                                            onChange={e => setProfileData({ ...profileData, yearOfExperience: e.target.value })}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 mt-4 bg-slate-900 text-white rounded-[20px] font-black text-xs uppercase tracking-widest hover:bg-brand-600 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 shadow-xl"
                        >
                            <Save size={18} /> Update Professional Record
                        </button>
                    </form>
                </div>

                {/* Password Section */}
                <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-xl space-y-8 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform"></div>
                    <div className="flex items-center gap-4 mb-2 relative z-10">
                        <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100 group-hover:bg-slate-900 group-hover:text-white transition-colors shadow-sm">
                            <Lock size={24} />
                        </div>
                        <h2 className="text-2xl font-black uppercase tracking-tighter text-slate-900">Security</h2>
                    </div>

                    <form onSubmit={handleChangePassword} className="space-y-5 relative z-10">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Current Protocol Key</label>
                            <input
                                type="password"
                                className="w-full bg-slate-50 border-2 border-transparent rounded-[20px] py-3.5 px-5 focus:bg-white focus:border-slate-400 outline-none transition-all font-bold text-slate-900 text-sm"
                                value={passwordData.currentPassword}
                                onChange={e => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">New Protocol Key</label>
                            <input
                                type="password"
                                className="w-full bg-slate-50 border-2 border-transparent rounded-[20px] py-3.5 px-5 focus:bg-white focus:border-brand-600 outline-none transition-all font-bold text-slate-900 text-sm"
                                value={passwordData.newPassword}
                                onChange={e => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Verify Protocol Key</label>
                            <input
                                type="password"
                                className="w-full bg-slate-50 border-2 border-transparent rounded-[20px] py-3.5 px-5 focus:bg-white focus:border-brand-600 outline-none transition-all font-bold text-slate-900 text-sm"
                                value={passwordData.confirmPassword}
                                onChange={e => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 mt-4 text-slate-700 bg-slate-100 rounded-[20px] font-black text-xs uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                        >
                            <RefreshCcw size={18} /> Cycle Credentials
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Settings;
