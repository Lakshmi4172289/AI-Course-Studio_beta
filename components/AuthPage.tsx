import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { GlassCard } from './GlassCard';

interface AuthPageProps {
  onLogin: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setIsLoading(true);

    if (window.aistudio) {
      try {
        await window.aistudio.openSelectKey();
        // Assuming success as per guidelines to avoid race condition
        onLogin();
      } catch (e) {
        console.error("API Key selection failed or cancelled", e);
        setIsLoading(false);
      }
      return;
    }

    // Simulate network delay for a smoother user experience if not in AI Studio
    setTimeout(() => {
      // Since we are using a hardcoded API key for this version, 
      // we proceed directly to the application.
      setIsLoading(false);
      onLogin();
    }, 1500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate email login
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLogin();
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden pt-20">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
         <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse" />
         <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s'}} />
      </div>

      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8 p-6 z-10 items-center">
        
        {/* Left Side - Text */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="hidden md:block space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-indigo-300 backdrop-blur-sm">
             <Sparkles className="w-4 h-4" />
             <span>Join 10,000+ Learners</span>
          </div>
          <h1 className="text-5xl font-bold leading-tight">
            {isLogin ? "Welcome back to" : "Start your journey with"} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              AI Course Studio
            </span>
          </h1>
          <p className="text-gray-400 text-lg max-w-md">
            Unlock university-grade courses generated instantly by AI. Master any skill with dual-video learning and adaptive quizzes.
          </p>
        </motion.div>

        {/* Right Side - Form */}
        <motion.div
           initial={{ opacity: 0, y: 50 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8, delay: 0.2 }}
        >
          <GlassCard className="p-8 md:p-10 w-full max-w-md mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">{isLogin ? "Sign In" : "Create Account"}</h2>
              <p className="text-sm text-gray-400">
                {isLogin ? "Use your Google account to access Gemini AI" : "Get started with your Google account"}
              </p>
            </div>

            {/* Google Button */}
            <button 
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full bg-white text-black font-semibold py-3 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-100 transition-colors mb-6 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-white/10"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
              )}
              {isLogin ? "Continue with Google" : "Sign up with Google"}
            </button>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-[#0a0a0a] text-gray-500">Or continue with email</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input 
                    type="email" 
                    placeholder="you@example.com"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input 
                    type="password" 
                    placeholder="••••••••"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={isLoading}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 group"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                  <>
                    {isLogin ? "Sign In" : "Create Account"}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-gray-400">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
              </span>
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="ml-2 text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
              >
                {isLogin ? "Sign up" : "Sign in"}
              </button>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
};