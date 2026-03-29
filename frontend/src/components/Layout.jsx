import React, { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from './Sidebar';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Menu, Cpu } from 'lucide-react';

const cn = (...inputs) => twMerge(clsx(inputs));

const Layout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, loading } = useAuth();

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
    </div>
  );

  if (!user && !['/', '/login', '/register'].includes(window.location.pathname)) return <Navigate to="/login" replace />;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row relative">
      {/* Mobile Header Component */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white/80 backdrop-blur-md border-b border-slate-200 z-30 sticky top-0 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white">
            <Cpu size={16} />
          </div>
          <span className="text-lg font-black tracking-tighter text-slate-900">
            Exam<span className="text-brand-600">Core</span>
          </span>
        </div>
        <button 
          onClick={() => setMobileMenuOpen(true)} 
          className="p-2 bg-white rounded-lg shadow-sm border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
        >
          <Menu size={24} />
        </button>
      </div>

      <Sidebar 
        collapsed={collapsed} 
        setCollapsed={setCollapsed} 
        mobileMenuOpen={mobileMenuOpen} 
        setMobileMenuOpen={setMobileMenuOpen} 
      />
      
      <main className={cn(
        "flex-1 transition-all duration-500 ease-in-out p-4 sm:p-6 md:p-8 w-full max-w-[100vw] overflow-x-hidden",
        collapsed ? "md:ml-32" : "md:ml-80"
      )}>
        <div className="max-w-[1600px] mx-auto animate-in fade-in duration-700">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
