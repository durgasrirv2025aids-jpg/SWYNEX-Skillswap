import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Zap, Users, BookOpen, Star, ChevronRight, GraduationCap, RefreshCw } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    { icon: <Users size={24} />, title: 'Find Learning Partners', desc: 'Discover students who have exactly the skills you want to learn.', color: 'from-blue-500 to-indigo-500' },
    { icon: <BookOpen size={24} />, title: 'Share Your Knowledge', desc: 'Teach skills you know and get access to skills you need.', color: 'from-emerald-500 to-teal-500' },
    { icon: <RefreshCw size={24} />, title: 'Skill Exchange', desc: 'Mutual matching ensures both students benefit from every connection.', color: 'from-orange-500 to-red-500' },
    { icon: <Star size={24} />, title: 'Build Connections', desc: 'Grow your network of motivated learners and skilled teachers.', color: 'from-purple-500 to-pink-500' },
  ];

  const steps = [
    { step: '01', title: 'Create Your Profile', desc: 'Sign up and tell us who you are — your college, department, and a short bio.' },
    { step: '02', title: 'Add Your Skills', desc: 'List skills you can teach and skills you want to learn.' },
    { step: '03', title: 'Find Matches', desc: 'SkillSwap automatically finds students whose skills are a perfect match for yours.' },
    { step: '04', title: 'Connect & Learn', desc: 'Send exchange requests, accept matches, and start learning together.' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <Zap size={16} className="text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">SkillSwap</span>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <a href="#about" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">About</a>
            <a href="#how" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">How It Works</a>
            <a href="#features" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Features</a>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors px-3 py-2">
              Log In
            </Link>
            <Link to="/register" className="text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 pt-20 pb-28">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-blue-200 rounded-full blur-3xl opacity-30" />
        <div className="absolute bottom-10 left-10 w-56 h-56 bg-indigo-200 rounded-full blur-3xl opacity-30" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
            <Zap size={14} /> Student Skill Exchange Platform
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight tracking-tight">
            Share Your Skills.{' '}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Learn Something New.
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Connect with fellow students, exchange knowledge, and grow together through collaborative learning.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3.5 rounded-xl font-semibold text-base transition-all shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40"
            >
              Start Exchanging Skills <ArrowRight size={18} />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 px-6 py-3.5 rounded-xl font-semibold text-base transition-colors"
            >
              Sign In to Your Account
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-16 flex flex-wrap justify-center gap-10">
            {[
              { n: '500+', label: 'Students' },
              { n: '200+', label: 'Skills Available' },
              { n: '1,000+', label: 'Skill Exchanges' },
            ].map(({ n, label }) => (
              <div key={label} className="text-center">
                <div className="text-3xl font-bold text-gray-900">{n}</div>
                <div className="text-sm text-gray-500 mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                What is <span className="text-blue-600">SkillSwap</span>?
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                SkillSwap is a student-to-student learning platform where you can exchange skills with peers at your college. 
                Instead of paying for courses, leverage the talent already in your community.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed mb-8">
                If you know Java and want to learn Python, SkillSwap finds a student who knows Python and wants to learn Java — a perfect exchange!
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl">
                  <GraduationCap size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">Peer Learning</p>
                    <p className="text-xs text-gray-500 mt-0.5">Learn from students who have practical experience</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-indigo-50 rounded-xl">
                  <Star size={20} className="text-indigo-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">Free Forever</p>
                    <p className="text-xs text-gray-500 mt-0.5">No cost — just mutual skill exchange</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Visual */}
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8">
                <div className="bg-white rounded-2xl shadow-sm p-5 mb-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-sm">AS</div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">Student A</p>
                      <p className="text-xs text-gray-400">CS — Year 2</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    <span className="bg-emerald-100 text-emerald-700 text-xs px-2.5 py-1 rounded-full font-medium">Can Teach: Java, HTML</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="bg-blue-100 text-blue-700 text-xs px-2.5 py-1 rounded-full font-medium">Wants: Python, React</span>
                  </div>
                </div>

                <div className="flex items-center justify-center my-3">
                  <div className="flex items-center gap-2 bg-white rounded-full px-4 py-1.5 shadow-sm">
                    <RefreshCw size={14} className="text-blue-600" />
                    <span className="text-xs font-semibold text-blue-600">Skill Exchange Match!</span>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center text-white font-bold text-sm">BS</div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">Student B</p>
                      <p className="text-xs text-gray-400">ECE — Year 3</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    <span className="bg-emerald-100 text-emerald-700 text-xs px-2.5 py-1 rounded-full font-medium">Can Teach: Python, React</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="bg-blue-100 text-blue-700 text-xs px-2.5 py-1 rounded-full font-medium">Wants: Java, HTML</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how" className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">Get started in four simple steps and begin exchanging skills today</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map(({ step, title, desc }) => (
              <div key={step} className="relative bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="text-5xl font-black text-blue-100 leading-none mb-4">{step}</div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Everything You Need</h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">Powerful features to make skill exchange seamless and rewarding</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(({ icon, title, desc, color }) => (
              <div key={title} className="group bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                <div className={`w-12 h-12 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center text-white mb-5`}>
                  {icon}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-indigo-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Ready to Start Exchanging Skills?</h2>
          <p className="text-blue-100 text-lg mb-10 max-w-xl mx-auto">
            Join hundreds of students who are already learning and teaching on SkillSwap.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 bg-white text-blue-600 hover:bg-blue-50 px-7 py-3.5 rounded-xl font-semibold text-base transition-colors shadow-lg"
            >
              Create Free Account <ArrowRight size={18} />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 border-2 border-white/40 text-white hover:border-white/70 px-7 py-3.5 rounded-xl font-semibold text-base transition-colors"
            >
              I Already Have an Account
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <Zap size={14} className="text-white" />
              </div>
              <span className="font-bold text-white">SkillSwap</span>
            </div>
            <p className="text-sm">&copy; 2026 SkillSwap. All rights reserved.</p>
            <div className="flex gap-6 text-sm">
              <Link to="/login" className="hover:text-white transition-colors">Log In</Link>
              <Link to="/register" className="hover:text-white transition-colors">Register</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

