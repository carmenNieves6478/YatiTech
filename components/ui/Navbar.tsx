"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "./Button";
import { useAuth } from "@/components/auth/AuthProvider";
import { usePWA } from "@/hooks/usePWA";
import { BookOpen, Bot, LayoutDashboard, LogIn, LogOut, Menu, Smartphone, User, X } from "lucide-react";

export const Navbar: React.FC = () => {
  const { user, profile, signOut, loading } = useAuth();
  const { isInstallable, installPWA } = usePWA();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-200">
            <Image
              src="/icon.png"
              alt="Ayme Logo"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <span className="text-xl font-extrabold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              YatiTech
            </span>
            <span className="hidden sm:inline-block ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              Sabiduría + STEM
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/cursos"
            className="text-sm font-medium text-slate-300 hover:text-indigo-400 transition-colors flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4" /> Cursos
          </Link>
          <Link
            href="/tutor"
            className="text-sm font-medium text-slate-300 hover:text-indigo-400 transition-colors flex items-center gap-2"
          >
            <Bot className="w-4 h-4 text-purple-400" /> Yati Tutor
          </Link>
          {user && (
            <Link
              href="/dashboard"
              className="text-sm font-medium text-slate-300 hover:text-indigo-400 transition-colors flex items-center gap-2"
            >
              <LayoutDashboard className="w-4 h-4" /> Panel
            </Link>
          )}
        </nav>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-3">
          {isInstallable && (
            <Button
              variant="outline"
              size="sm"
              onClick={installPWA}
              className="gap-2 border-indigo-500/40 text-indigo-300 hover:bg-indigo-500/20"
            >
              <Smartphone className="w-4 h-4" /> Instalar App
            </Button>
          )}

          {!loading && user ? (
            <div className="flex items-center gap-3">
              <Link href="/dashboard" className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl hover:border-slate-700 transition-colors">
                <div className="w-6 h-6 rounded-full bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 flex items-center justify-center text-xs font-bold">
                  {profile?.fullName ? profile.fullName.charAt(0).toUpperCase() : <User className="w-3.5 h-3.5" />}
                </div>
                <span className="text-xs font-medium text-slate-200 max-w-[120px] truncate">
                  {profile?.fullName || user.email?.split("@")[0]}
                </span>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={signOut}
                title="Cerrar Sesión"
                className="text-slate-400 hover:text-red-400 p-2"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          ) : !loading ? (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Ingresar
                </Button>
              </Link>
              <Link href="/registro">
                <Button variant="primary" size="sm" className="gap-2">
                  <LogIn className="w-4 h-4" /> Registrarse
                </Button>
              </Link>
            </div>
          ) : null}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-slate-400 hover:text-white focus:outline-none"
          aria-label="Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 pt-3 pb-6 space-y-3">
          <Link
            href="/cursos"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-slate-200 hover:text-indigo-400 font-medium flex items-center gap-3"
          >
            <BookOpen className="w-5 h-5 text-indigo-400" /> Cursos
          </Link>
          <Link
            href="/tutor"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-slate-200 hover:text-indigo-400 font-medium flex items-center gap-3"
          >
            <Bot className="w-5 h-5 text-purple-400" /> Yati Tutor
          </Link>
          {user && (
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-slate-200 hover:text-indigo-400 font-medium flex items-center gap-3"
            >
              <LayoutDashboard className="w-5 h-5 text-indigo-400" /> Dashboard
            </Link>
          )}

          {isInstallable && (
            <Button
              variant="outline"
              size="md"
              onClick={installPWA}
              className="w-full justify-center gap-2 mt-2"
            >
              <Smartphone className="w-4 h-4" /> Instalar como PWA
            </Button>
          )}

          <div className="pt-3 border-t border-slate-800">
            {user ? (
              <div className="space-y-2">
                <div className="text-xs text-slate-400 px-1 truncate">
                  Conectado como <strong className="text-slate-200">{user.email}</strong>
                </div>
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    signOut();
                  }}
                  className="w-full justify-center gap-2 text-red-400 border-red-900/40 hover:bg-red-950/40"
                >
                  <LogOut className="w-4 h-4" /> Cerrar Sesión
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="secondary" className="w-full">
                    Ingresar
                  </Button>
                </Link>
                <Link href="/registro" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="primary" className="w-full">
                    Registrarse
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
