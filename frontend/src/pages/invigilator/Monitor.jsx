import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { Activity, ShieldAlert, User, Clock, AlertTriangle, Send, Cpu, Layout, Eye, ShieldCheck, Zap, Terminal, Wifi, Globe, Maximize2, Camera, Loader2, ArrowLeft, BookOpen, Layers } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../../api/axios';

const StaffMonitor = () => {
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [alerts, setAlerts] = useState([]);
  const [activeSessions, setActiveSessions] = useState([]);
  const [socket, setSocket] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString('en-US', { hour12: false }));
  
  const [fullscreenStudentId, setFullscreenStudentId] = useState(null);
  const fullscreenStudent = fullscreenStudentId ? activeSessions.find(s => s.id === fullscreenStudentId) : null;

  const selectedExamRef = useRef(null);

  useEffect(() => {
    selectedExamRef.current = selectedExam;
    // Clear sessions and alerts when switching exams
    if (selectedExam) {
        setActiveSessions([]);
        setAlerts([]);
    }
  }, [selectedExam]);

  useEffect(() => {
    const timer = setInterval(() => {
        setCurrentTime(new Date().toLocaleTimeString('en-US', { hour12: false }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const { data } = await api.get('/exams');
        const activeExams = data.data.filter(e => {
            const endDate = new Date(new Date(e.scheduledDate).getTime() + e.duration * 60000);
            return e.status !== 'completed' && new Date() <= endDate;
        });
        setExams(activeExams);
      } catch (err) {
        toast.error('Failed to load active exams');
      } finally {
        setLoading(false);
      }
    };
    fetchExams();

    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    newSocket.on('connect', () => {
      newSocket.emit('join-monitoring');
    });

    newSocket.on('student-alert', (data) => {
      if (selectedExamRef.current) {
        const isMatch = (data.examId && selectedExamRef.current._id === data.examId) || 
                        (data.examName && selectedExamRef.current.name === data.examName);
        if (!isMatch) return;
      }

      setAlerts(prev => [data, ...prev].slice(0, 50));
      setActiveSessions(prev => prev.map(s => s.id === data.studentName ? { ...s, status: 'warning' } : s));
      toast(`Integrity Breach: ${data.studentName}`, {
        icon: '⚠️',
        style: {
          borderRadius: '16px',
          background: '#0f172a',
          color: '#fff',
          fontWeight: 'bold'
        }
      });
    });

    newSocket.on('video-frame', (data) => {
      if (selectedExamRef.current) {
        const isMatch = (data.examId && selectedExamRef.current._id === data.examId) || 
                        (data.examName && selectedExamRef.current.name === data.examName);
        if (!isMatch) return;
      }

      setActiveSessions(prev => {
        const exists = prev.find(s => s.id === data.studentId);
        if (exists) {
          return prev.map(s => s.id === data.studentId ? { ...s, frame: data.frame, time: new Date(data.timestamp).toLocaleTimeString() } : s);
        } else {
          return [...prev, { id: data.studentId, email: data.studentEmail, exam: data.examName, time: new Date(data.timestamp).toLocaleTimeString(), frame: data.frame, status: 'normal' }];
        }
      });
    });

    return () => newSocket.close();
  }, []);

  return (
    <div className="space-y-10 animate-in fade-in duration-700 min-h-[90vh] flex flex-col">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-900 rounded-[40px] p-10 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-rose-600/20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
        <div className="flex items-center gap-6 relative z-10">
          <div className="w-20 h-20 rounded-[32px] bg-white/10 flex items-center justify-center text-rose-500 shadow-inner rotate-3 border border-white/10 backdrop-blur-md">
            <ShieldAlert size={40} className="animate-pulse" />
          </div>
          <div>
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">CCTV Security Grid</h1>
            <p className="text-rose-400 font-black text-xs uppercase tracking-[0.4em] mt-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span> Live Global Feed
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6 relative z-10">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Global Server Time</span>
            <span className="text-xl font-black text-white tabular-nums tracking-wider">{currentTime} GMT</span>
          </div>
          <div className="h-12 w-[1px] bg-white/10"></div>
          <div className="flex items-center gap-3 bg-black/40 p-2 rounded-2xl border border-white/10 backdrop-blur-xl">
            <div className="px-5 py-3 bg-white/10 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-inner flex items-center gap-2">
              <Globe size={14} className="text-brand-400" /> System Live
            </div>
            <div className="px-5 py-3 text-emerald-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
              <Wifi size={14} /> Encrypted
            </div>
          </div>
        </div>
      </div>

      {!selectedExam ? (
        <div className="flex-1 p-8 bg-white rounded-[40px] shadow-sm border border-slate-100 flex flex-col items-center justify-center animate-in slide-in-from-bottom-8 duration-500">
            <div className="text-center max-w-lg mx-auto mb-10">
                <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-[32px] flex items-center justify-center mx-auto mb-6">
                    <Layers size={48} />
                </div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic mb-3">Select Active Target</h2>
                <p className="text-slate-500 font-medium">To initiate the live CCTV proctoring matrix, please select an ongoing exam to monitor from the available active sessions below.</p>
            </div>
            
            <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full py-10 flex items-center justify-center text-slate-400 font-bold uppercase tracking-widest text-xs gap-3">
                        <Loader2 className="animate-spin" size={16} /> Loading Exams...
                    </div>
                ) : exams.length === 0 ? (
                    <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-200 rounded-[32px] bg-slate-50 text-slate-400 text-sm font-bold uppercase tracking-widest">
                        No Active Exams Found
                    </div>
                ) : (
                    exams.map(exam => (
                        <button
                            key={exam._id}
                            onClick={() => setSelectedExam(exam)}
                            className="text-left bg-white p-6 rounded-[24px] border-2 border-slate-100 hover:border-brand-500 hover:shadow-xl hover:shadow-brand-600/10 transition-all group flex flex-col justify-between min-h-[160px]"
                        >
                            <div>
                                <h3 className="font-black text-xl text-slate-900 tracking-tight leading-tight mb-1 group-hover:text-brand-600 transition-colors">
                                    {exam.name}
                                </h3>
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 bg-slate-100 px-3 py-1 rounded-md inline-block mb-4">
                                    {exam.subject}
                                </span>
                            </div>
                            <div className="flex items-center justify-between mt-auto">
                                <span className="text-[10px] uppercase font-black tracking-widest text-emerald-500 flex items-center gap-1.5 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">
                                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span> Active Session
                                </span>
                                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-brand-600 group-hover:text-white transition-all transform group-hover:translate-x-1">
                                    <ArrowLeft size={14} className="rotate-180" />
                                </div>
                            </div>
                        </button>
                    ))
                )}
            </div>
        </div>
      ) : (
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 flex-1 animate-in slide-in-from-right-8 duration-500">
        
        {/* Main CCTV Grid */}
        <div className="xl:col-span-3 space-y-6 flex flex-col">
            <div className="flex items-center justify-between px-2 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => setSelectedExam(null)}
                        className="w-10 h-10 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-slate-900 hover:text-white transition-all focus:outline-none"
                    >
                        <ArrowLeft size={18} />
                    </button>
                    <div>
                        <h3 className="font-black text-slate-900 flex items-center gap-3 text-xl uppercase tracking-tighter italic">
                            {selectedExam.name}
                        </h3>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Monitoring Port</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-[10px] font-black bg-brand-50 text-brand-600 px-5 py-2.5 rounded-xl uppercase tracking-[0.2em] border border-brand-100">
                        {activeSessions.length} Streams Acquired
                    </span>
                </div>
            </div>

            {activeSessions.length === 0 ? (
                <div className="flex-1 min-h-[500px] flex flex-col items-center justify-center text-slate-400 bg-white/50 border-2 border-dashed border-slate-200 rounded-[48px] p-20 text-center">
                    <Camera size={64} className="mb-6 opacity-20" />
                    <h2 className="text-2xl font-black uppercase tracking-tighter text-slate-800 mb-2 italic">Awaiting Feeds</h2>
                    <p className="text-xs font-bold uppercase tracking-widest">No students are currently broadcasting their matrix grids.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 auto-rows-max">
                    {activeSessions.map((student) => (
                        <div key={student.id} className={`group relative bg-[#0a0a0a] rounded-[32px] overflow-hidden border-2 shadow-2xl transition-all ${student.status === 'warning' ? 'border-rose-500 shadow-rose-900/40' : 'border-slate-800 hover:border-brand-500'}`}>
                            
                            {/* The Live Video Feed */}
                            <div className="aspect-video relative bg-black flex items-center justify-center">
                                {student.frame ? (
                                    <img src={student.frame} alt="Student Feed" className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
                                ) : (
                                    <div className="flex flex-col items-center justify-center text-slate-600">
                                        <Loader2 className="animate-spin mb-2" size={24} /> 
                                        <span className="text-[10px] uppercase tracking-widest font-black">Connecting...</span>
                                    </div>
                                )}
                                
                                {/* Overlay Gradient for Readability */}
                                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/90 to-transparent pointer-events-none"></div>
                                
                                {/* Status Badge */}
                                <div className="absolute top-4 right-4 flex gap-2">
                                    {student.status === 'warning' && (
                                        <span className="px-3 py-1 bg-rose-500/90 text-white text-[9px] font-black uppercase tracking-widest rounded-lg flex items-center gap-1 animate-pulse backdrop-blur-md">
                                            <AlertTriangle size={10} /> Violation
                                        </span>
                                    )}
                                    <span className={`w-3 h-3 rounded-full border-2 border-black shadow-lg ${student.status === 'warning' ? 'bg-rose-500 animate-ping' : 'bg-emerald-500'}`}></span>
                                </div>

                                {/* Student Info Overlay */}
                                <div className="absolute bottom-4 left-4 right-4 text-left pointer-events-none">
                                    <h4 className="font-black text-white text-lg tracking-tighter uppercase italic truncate drop-shadow-md">
                                        {student.email?.split('@')[0] || student.email}
                                    </h4>
                                    <p className="text-[9px] text-brand-400 font-bold uppercase tracking-[0.2em] truncate drop-shadow-md">
                                        {student.exam}
                                    </p>
                                </div>
                            </div>
                            
                            {/* Control Bar */}
                            <div className="p-4 bg-slate-900 flex items-center justify-between border-t border-white/5">
                                <div className="flex items-center gap-2 text-slate-400">
                                    <Activity size={14} className={student.status === 'warning' ? 'text-rose-500' : 'text-emerald-500'} />
                                    <span className="text-[10px] font-black uppercase tracking-widest">
                                        {student.time}
                                    </span>
                                </div>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => setFullscreenStudentId(student.id)}
                                        className="h-8 w-8 rounded-xl bg-white/5 text-slate-300 flex items-center justify-center hover:bg-brand-600 hover:text-white transition-colors"
                                        title="Expand Feed"
                                    >
                                        <Maximize2 size={14} />
                                    </button>
                                </div>
                            </div>

                        </div>
                    ))}
                </div>
            )}
        </div>

        {/* Security Alerts Sidebar */}
        <div className="bg-white rounded-[48px] p-8 border border-slate-100 shadow-xl flex flex-col relative overflow-hidden h-fit max-h-[1000px]">
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-50 rounded-full -mr-16 -mt-16 pointer-events-none"></div>
            
            <div className="flex items-center justify-between mb-8 relative z-10">
              <h3 className="font-black text-slate-900 flex items-center gap-3 text-xl uppercase tracking-tighter italic">
                <Terminal className="text-rose-600" /> Event Logs
              </h3>
              <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-black text-xs">
                {alerts.length}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-4 relative z-10 custom-scrollbar">
              {alerts.length === 0 ? (
                <div className="py-20 flex flex-col items-center justify-center text-slate-400 text-center gap-4">
                  <ShieldCheck size={40} className="text-emerald-400 opacity-50" />
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70 leading-relaxed">System Secure<br/>No Anomalies Detected</p>
                </div>
              ) : (
                alerts.map((alert, idx) => (
                  <div key={idx} className="bg-slate-50 p-6 rounded-[24px] border border-slate-200 group hover:border-rose-300 hover:bg-rose-50/30 transition-all">
                    <div className="flex items-center gap-2 text-rose-500 mb-3 bg-white px-3 py-1 rounded-full border border-rose-100 w-fit shadow-sm">
                      <AlertTriangle size={12} />
                      <span className="text-[9px] font-black uppercase tracking-[0.2em]">{alert.type}</span>
                    </div>
                    <p className="text-slate-900 font-black text-sm italic tracking-tighter leading-none mb-1 truncate" title={alert.studentName}>
                      {alert.studentName?.split('@')[0]}
                    </p>
                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-4">
                      {alert.violationCount ? `Strike ${alert.violationCount}` : 'Security Event Logged'}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                      <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                        <Clock size={10} /> {new Date(alert.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
        </div>
        </div>
      )}

      {/* PROFESSIONAL FOCUS MODE OVERLAY */}
      {fullscreenStudent && (
        <div className="fixed inset-0 z-[999] bg-black/95 backdrop-blur-xl flex flex-col p-6 animate-in fade-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-brand-600 rounded-[20px] flex items-center justify-center text-white font-black text-xl shadow-lg border border-white/10">
                        {fullscreenStudent.email?.[0]?.toUpperCase()}
                    </div>
                    <div>
                        <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic">{fullscreenStudent.email}</h2>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-400">Live Secure Stream • Frame {fullscreenStudent.time}</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                   {fullscreenStudent.status === 'warning' && (
                       <div className="px-6 py-3 bg-rose-500/20 border border-rose-500/50 rounded-xl text-rose-500 font-black text-xs uppercase tracking-widest flex items-center gap-2 animate-pulse">
                           <AlertTriangle size={18} /> Active Breach Detected
                       </div>
                   )}
                   <button 
                       onClick={() => setFullscreenStudentId(null)}
                       className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-[20px] font-black text-xs uppercase tracking-widest transition-all focus:outline-none backdrop-blur-md border border-white/10"
                   >
                       Exit Focus Mode
                   </button>
                </div>
            </div>
            
            <div className="flex-1 relative bg-[#0a0a0a] rounded-[40px] border border-white/10 overflow-hidden flex items-center justify-center shadow-2xl">
                {fullscreenStudent.frame ? (
                   <img src={fullscreenStudent.frame} alt="Student Feed" className="w-full h-full object-contain" />
                ) : (
                   <div className="flex flex-col items-center justify-center text-slate-500 gap-4">
                       <Loader2 size={48} className="animate-spin" />
                       <span className="text-sm font-black uppercase tracking-[0.2em]">Acquiring Feed...</span>
                   </div>
                )}
            </div>
        </div>
      )}
    </div>
  );
};

export default StaffMonitor;
