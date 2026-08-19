"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "./Button";
import { useAuth } from "@/components/auth/AuthProvider";
import { usePWA } from "@/hooks/usePWA";
import { BookOpen, Bot, LayoutDashboard, LogIn, LogOut, Menu, Smartphone, User, X } from "lucide-react";

export const Navbar: React.FC = () => {
  const { user, profile, signOut, loading } = useAuth();
  const { isInstallable, installPWA } = usePWA();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const logoUrl = "https://cdn.phototourl.com/free/2026-08-19-1adf156d-26c7-446d-acbb-a6e0dd3e3b01.png";

  return (
    <header className="sticky top-0 z-50 bg-white/85 backdrop-blur-md border-b border-slate-200/80 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform duration-200 bg-teal-50 border border-teal-100 flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logoUrl}
              alt="Amauta Logo"
              className="w-full h-full object-contain p-0.5"
            />
          </div>
          <div>
            <span className="text-xl font-extrabold bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-600 bg-clip-text text-transparent">
              Amauta
            </span>
            <span className="hidden sm:inline-block ml-2 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
              Sabiduría & STEM
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/cursos"
            className="text-sm font-medium text-slate-700 hover:text-teal-600 transition-colors flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4 text-teal-600" /> Cursos
          </Link>
          <Link
            href="/tutor"
            className="text-sm font-medium text-slate-700 hover:text-teal-600 transition-colors flex items-center gap-2"
          >
            <Bot className="w-4 h-4 text-emerald-600" /> Amauta Tutor
          </Link>
          {user && (
            <Link
              href="/dashboard"
              className="text-sm font-medium text-slate-700 hover:text-teal-600 transition-colors flex items-center gap-2"
            >
              <LayoutDashboard className="w-4 h-4 text-teal-600" /> Panel
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
              className="gap-2 border-teal-300 text-teal-700 hover:bg-teal-50"
            >
              <Smartphone className="w-4 h-4" /> Instalar App
            </Button>
          )}

          {!loading && user ? (
            <div className="flex items-center gap-3">
              <Link href="/dashboard" className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl hover:border-teal-300 transition-colors">
                <div className="w-6 h-6 rounded-full bg-teal-600 text-white flex items-center justify-center text-xs font-bold shadow-sm">
                  {profile?.fullName ? profile.fullName.charAt(0).toUpperCase() : <User className="w-3.5 h-3.5" />}
                </div>
                <span className="text-xs font-medium text-slate-800 max-w-[120px] truncate">
                  {profile?.fullName || user.email?.split("@")[0]}
                </span>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={signOut}
                title="Cerrar Sesión"
                className="text-slate-500 hover:text-red-600 p-2"
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
          className="md:hidden p-2 text-slate-600 hover:text-slate-900 focus:outline-none"
          aria-label="Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-3 shadow-lg">
          <Link
            href="/cursos"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-slate-800 hover:text-teal-600 font-medium flex items-center gap-3"
          >
            <BookOpen className="w-5 h-5 text-teal-600" /> Cursos
          </Link>
          <Link
            href="/tutor"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-slate-800 hover:text-teal-600 font-medium flex items-center gap-3"
          >
            <Bot className="w-5 h-5 text-emerald-600" /> Amauta Tutor
          </Link>
          {user && (
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-slate-800 hover:text-teal-600 font-medium flex items-center gap-3"
            >
              <LayoutDashboard className="w-5 h-5 text-teal-600" /> Dashboard
            </Link>
          )}

          {isInstallable && (
            <Button
              variant="outline"
              size="md"
              onClick={installPWA}
              className="w-full justify-center gap-2 mt-2 border-teal-300 text-teal-700"
            >
              <Smartphone className="w-4 h-4" /> Instalar como PWA
            </Button>
          )}

          <div className="pt-3 border-t border-slate-200">
            {user ? (
              <div className="space-y-2">
                <div className="text-xs text-slate-500 px-1 truncate">
                  Conectado como <strong className="text-slate-800">{user.email}</strong>
                </div>
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    signOut();
                  }}
                  className="w-full justify-center gap-2 text-red-600 border-red-200 hover:bg-red-50"
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
