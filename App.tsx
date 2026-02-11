
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, Play, CheckCircle, Brain, 
  ChevronRight, Sparkles, LayoutGrid, 
  Video, FileText, MonitorPlay, List, Star, MessageCircle,
  GraduationCap, LogOut, User as UserIcon, Bot, Plus, Trash2, ArrowLeft, ExternalLink as ExternalLinkIcon, Loader2, GripHorizontal,
  Image as ImageIcon, Upload, Maximize2, Minimize2, ArrowRight
} from 'lucide-react';
import { GlassCard } from './components/GlassCard';
import { AuthPage } from './components/AuthPage';
import { generateCourseSyllabus, generateChapterContent } from './services/geminiService';
import { Course, Chapter, UserReview, UserProfile } from './types';

// GSAP Declaration for TypeScript
declare global {
  interface Window {
    gsap: any;
    ScrollTrigger: any;
    // aistudio is assumed to be declared in the environment
  }
}

// --- Components ---

const Navbar = ({ 
  user, 
  onHome, 
  onSignIn, 
  onSignOut 
}: { 
  user: UserProfile | null, 
  onHome: () => void, 
  onSignIn: () => void, 
  onSignOut: () => void 
}) => (
  <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-black/50 backdrop-blur-md border-b border-white/5">
    <div className="max-w-7xl mx-auto flex justify-between items-center">
      <div className="flex items-center gap-3 cursor-pointer" onClick={onHome}>
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
          <Bot className="text-white w-6 h-6" />
        </div>
        <span className="font-bold text-xl tracking-tight">AI Course <span className="text-blue-400">Studio</span></span>
      </div>
      <div className="flex items-center gap-4">
        <button className="hidden md:block text-sm text-gray-400 hover:text-white transition-colors">Pricing</button>
        {user ? (
          <div className="flex items-center gap-3">
             <div className="text-right hidden sm:block">
                <p className="text-sm font-bold">{user.name}</p>
                <p className="text-xs text-indigo-400">Free Plan</p>
             </div>
             <button 
               onClick={onSignOut}
               className="w-8 h-8 rounded-full bg-indigo-600/20 border border-indigo-500/50 flex items-center justify-center text-xs font-bold text-indigo-300 hover:bg-red-500/20 hover:text-red-300 hover:border-red-500/50 transition-all"
               title="Sign Out"
             >
               {user.avatar}
             </button>
          </div>
        ) : (
          <button 
            onClick={onSignIn}
            className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-medium transition-all"
          >
            Sign In
          </button>
        )}
      </div>
    </div>
  </nav>
);

const LandingPage = ({ onStart }: { onStart: () => void }) => {
  const heroTextRef = useRef<HTMLHeadingElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // GSAP Animations
    if (window.gsap && window.ScrollTrigger) {
      window.gsap.registerPlugin(window.ScrollTrigger);
      
      const tl = window.gsap.timeline();
      
      // Hero Text Stagger
      window.gsap.from(heroTextRef.current, {
        y: 100,
        opacity: 0,
        duration: 1.2,
        ease: "power4.out",
        delay: 0.2
      });

      // Feature Cards Scroll Trigger
      if (cardsRef.current) {
         window.gsap.from(cardsRef.current.children, {
          scrollTrigger: {
            trigger: cardsRef.current,
            start: "top 85%",
          },
          y: 80,
          opacity: 0,
          duration: 1,
          stagger: 0.15,
          ease: "elastic.out(1, 0.75)"
        });
      }
    }
  }, []);

  const reviews: UserReview[] = [
    { id: '1', name: "Aarav Patel", role: "CS Senior, IIT Kharagpur", avatar: "AP", content: "The depth of the generated courses rivals my actual university lectures. The dual-video approach clarifies complex algorithms perfectly.", rating: 5 },
    { id: '2', name: "Priya Sharma", role: "M.Tech, IIT Bombay", avatar: "PS", content: "I used this to fast-track my understanding of Distributed Systems. The smart notes saved me hours of documentation reading.", rating: 5 },
    { id: '3', name: "Rohan Das", role: "SDE II @ Google (Ex-IITD)", avatar: "RD", content: "Finally, an AI that understands context. The quizzes aren't just memory tests; they actually test your reasoning.", rating: 5 },
    { id: '4', name: "Sarah Jenkins", role: "Product Manager, Netflix", avatar: "SJ", content: "I needed to understand high-level system architecture quickly. This tool broke it down into digestible pieces without oversimplifying.", rating: 5 },
    { id: '5', name: "David Chen", role: "Self-Taught Developer", avatar: "DC", content: "The generated roadmaps are insane. It literally built a 4-week curriculum for me to learn Rust from scratch.", rating: 5 },
    { id: '6', name: "Elena Rodriguez", role: "UX Designer, Spotify", avatar: "ER", content: "I used the studio to learn React Native. The dual-video feature helps so much when one explanation doesn't click.", rating: 5 },
    { id: '7', name: "Michael Chang", role: "Data Scientist", avatar: "MC", content: "Best platform for rapid upskilling. The syllabus generation is spot on for advanced topics like NLP and Transformers.", rating: 5 },
  ];

  return (
    <div className="pt-24 pb-20 px-6 max-w-7xl mx-auto overflow-hidden">
      {/* Hero Section */}
      <div className="text-center mb-32 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px] -z-10" />
        
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-indigo-300 mb-8 backdrop-blur-sm">
          <Sparkles className="w-4 h-4" />
          <span>AI-Powered Learning Revolution</span>
        </div>
        
        <h1 ref={heroTextRef} className="text-6xl md:text-8xl font-bold tracking-tight mb-8 leading-[1.1]">
          Master Any Skill <br />
          <span className="text-gradient">In Minutes.</span>
        </h1>
        
        <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
          Generate university-grade courses instantly. Dual-source video learning, structured notes, and adaptive quizzes tailored just for you.
        </p>
        
        <button 
          onClick={onStart}
          className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-indigo-600 font-pj rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 hover:bg-indigo-500"
        >
          Start Learning Now
          <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          <div className="absolute -inset-3 rounded-xl bg-indigo-400 opacity-20 group-hover:opacity-40 blur-lg transition-opacity duration-200" />
        </button>
      </div>

      {/* Features Grid */}
      <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
        {[
          { icon: Video, title: "Dual-Source Video", desc: "Every chapter gets two perspectives. Primary lesson plus an alternative explanation for complete understanding." },
          { icon: FileText, title: "Smart Structured Notes", desc: "AI synthesizes concepts, code examples, and common mistakes into clean, human-readable Markdown." },
          { icon: Brain, title: "Adaptive Quizzes", desc: "Test your knowledge after every chapter with AI-generated reasoning and instant feedback." },
          { icon: LayoutGrid, title: "Dynamic Syllabus", desc: "Courses scale to fit the topic complexity, generating as many chapters as needed to master the subject." },
          { icon: GraduationCap, title: "University Grade", desc: "Curriculum designed to match top-tier university standards, focusing on depth and practical application." },
          { icon: MessageCircle, title: "Instant Answers", desc: "Get real-time clarifications and external resource links for every single concept." },
        ].map((feature, i) => (
          <GlassCard key={i} className="h-full" hoverEffect>
            <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center mb-6">
              <feature.icon className="w-6 h-6 text-indigo-400" />
            </div>
            <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
            <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
          </GlassCard>
        ))}
      </div>

      {/* Reviews - Sliding Marquee */}
      <div className="mb-32 relative w-full left-1/2 -translate-x-1/2 max-w-[100vw]">
        <h2 className="text-3xl font-bold text-center mb-12">Trusted by Top Learners</h2>
        
        {/* Gradient Masks */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#020617] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#020617] to-transparent z-10 pointer-events-none" />

        <div className="overflow-hidden flex">
          <motion.div 
            className="flex gap-6 w-max px-6"
            animate={{ x: "-50%" }}
            transition={{ 
              duration: 60, 
              ease: "linear", 
              repeat: Infinity 
            }}
          >
            {/* Duplicate the reviews array to create a seamless loop */}
            {[...reviews, ...reviews].map((review, i) => (
              <GlassCard key={`${review.id}-${i}`} className="w-[400px] shrink-0" hoverEffect>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center font-bold text-sm">
                    {review.avatar}
                  </div>
                  <div>
                    <h4 className="font-bold">{review.name}</h4>
                    <p className="text-xs text-indigo-300">{review.role}</p>
                  </div>
                </div>
                <div className="flex gap-1 mb-3">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                  ))}
                </div>
                <p className="text-gray-400 text-sm italic">"{review.content}"</p>
              </GlassCard>
            ))}
          </motion.div>
        </div>
      </div>

      {/* FAQ */}
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {[
            { q: "How does the AI generate the syllabus?", a: "We use Google's advanced Gemini models to analyze the topic and structure a learning path similar to university curriculums." },
            { q: "Are the videos created by AI?", a: "No. We believe in human instruction. The AI curates the best existing YouTube tutorials for each specific chapter." },
            { q: "Can I use this for advanced topics?", a: "Absolutely. The system scales the depth based on the topic. Try asking for 'Advanced Quantum Mechanics'!" },
            { q: "Is it free to use?", a: "Currently in beta, yes! We are testing our dual-video instructional engine." }
          ].map((item, i) => (
            <GlassCard key={i} className="cursor-pointer hover:bg-white/5 transition-colors">
              <h3 className="font-bold text-lg mb-2 flex items-center gap-2 text-indigo-200">
                <MessageCircle className="w-4 h-4 text-indigo-400" /> {item.q}
              </h3>
              <p className="text-gray-400 pl-6 leading-relaxed">{item.a}</p>
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  );
};

const Dashboard = ({ courses, onCreateNew, onSelectCourse }: { 
  courses: Course[], 
  onCreateNew: () => void,
  onSelectCourse: (c: Course) => void
}) => (
  <div className="pt-24 px-6 max-w-7xl mx-auto">
    <div className="flex justify-between items-center mb-12">
      <h2 className="text-3xl font-bold">Your Learning Path</h2>
      <button onClick={onCreateNew} className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2">
        <Sparkles className="w-4 h-4" />
        New Course
      </button>
    </div>

    {courses.length === 0 ? (
      <div className="text-center py-20 opacity-50">
        <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-500" />
        <p className="text-xl">No courses yet. Start your journey!</p>
      </div>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map(course => {
          const progress = Math.round((course.completedChapters / course.totalChapters) * 100) || 0;
          
          return (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <GlassCard 
                onClick={() => onSelectCourse(course)}
                hoverEffect
                className="h-64 flex flex-col justify-between cursor-pointer relative overflow-hidden group"
              >
                {/* Dynamic Background with Cover Image */}
                {course.coverImage && (
                    <>
                      <div 
                        className="absolute inset-0 z-0 transition-transform duration-700 group-hover:scale-110 opacity-40"
                        style={{ 
                            background: course.coverImage.startsWith('http') || course.coverImage.startsWith('data:') 
                                ? `url(${course.coverImage}) center/cover no-repeat` 
                                : course.coverImage 
                        }}
                      />
                      <div className="absolute inset-0 z-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                    </>
                 )}

                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <span className="bg-indigo-500/20 text-indigo-300 text-xs px-2 py-1 rounded border border-indigo-500/30 backdrop-blur-md">
                        University Grade
                      </span>
                      <span className="text-xs text-gray-400 backdrop-blur-md px-2 py-1 rounded bg-black/20">{new Date(course.createdAt).toLocaleDateString()}</span>
                    </div>
                    <h3 className="text-2xl font-bold mb-2 line-clamp-2 text-shadow-sm">{course.title}</h3>
                    <p className="text-sm text-gray-300 line-clamp-2 text-shadow-sm">{course.description}</p>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-xs mb-2 text-gray-300">
                      <span>Progress</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-800/50 rounded-full overflow-hidden backdrop-blur-sm">
                      <motion.div 
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>
    )}
  </div>
);

// --- UPDATED COURSE CREATOR (VISUAL ROADMAP + COVER IMAGE) ---
type CreatorStep = 'input' | 'generating' | 'review';

const CourseCreator = ({ 
  onGenerate, 
  onClose 
}: { 
  onGenerate: (course: Course) => void, 
  onClose: () => void 
}) => {
  const [step, setStep] = useState<CreatorStep>('input');
  const [topic, setTopic] = useState("");
  const [loadingMsg, setLoadingMsg] = useState("Analyzing request...");
  const [draftCourse, setDraftCourse] = useState<Partial<Course> | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (step === 'generating') {
      const msgs = ["Consulting Gemini AI...", "Structuring Knowledge...", "Curating Videos...", "Finalizing Roadmap..."];
      let i = 0;
      const interval = setInterval(() => {
        setLoadingMsg(msgs[i % msgs.length]);
        i++;
      }, 1500);
      return () => clearInterval(interval);
    }
  }, [step]);

  const handleInitialGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setStep('generating');
    try {
      const courseData = await generateCourseSyllabus(topic);
      setDraftCourse(courseData);
      setStep('review');
    } catch (err) {
      alert("Failed to generate roadmap. Please try again.");
      setStep('input');
    }
  };

  const handleUpdateChapter = (idx: number, newVal: string) => {
    if (!draftCourse || !draftCourse.chapters) return;
    const newChapters = [...draftCourse.chapters];
    newChapters[idx] = { ...newChapters[idx], title: newVal };
    setDraftCourse({ ...draftCourse, chapters: newChapters });
  };

  const handleDeleteChapter = (idx: number) => {
    if (!draftCourse || !draftCourse.chapters) return;
    const newChapters = draftCourse.chapters.filter((_, i) => i !== idx);
    setDraftCourse({ ...draftCourse, chapters: newChapters });
  };

  const handleAddChapter = () => {
    if (!draftCourse || !draftCourse.chapters) return;
    const newChapter: Chapter = {
      id: `${draftCourse.id}-ch-new-${Date.now()}`,
      title: "New Specific Module",
      order: draftCourse.chapters.length + 1,
      isCompleted: false,
      content_md: "",
      videoId_1: "",
      videoId_2: "",
      external_links: [],
      quiz: []
    };
    setDraftCourse({ ...draftCourse, chapters: [...draftCourse.chapters, newChapter] });
  };

  const handleFinalize = () => {
    if (!draftCourse || !draftCourse.chapters) return;
    const finalCourse: Course = {
      ...draftCourse,
      totalChapters: draftCourse.chapters.length,
      createdAt: new Date(),
      completedChapters: 0,
    } as Course;
    onGenerate(finalCourse);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl px-4">
      <GlassCard className="w-full max-w-4xl p-0 overflow-hidden flex flex-col max-h-[95vh]">
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5 z-10 relative">
           <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
             <ArrowLeft className="w-5 h-5" />
           </button>
           <h2 className="text-lg font-bold">Course Creator Studio</h2>
           <div className="w-9" /> 
        </div>

        <div className="flex-1 overflow-y-auto relative custom-scrollbar bg-[#050505]">
          {step === 'input' && (
            <motion.div initial={{opacity: 0}} animate={{opacity: 1}} className="p-8 h-full flex flex-col justify-center">
              <h1 className="text-3xl font-bold mb-2 text-center">What do you want to master?</h1>
              <p className="text-center text-gray-400 mb-8">Enter any topic—coding, history, physics—and we'll build a specific deep-dive curriculum.</p>
              
              <form onSubmit={handleInitialGenerate} className="space-y-6 max-w-md mx-auto w-full">
                <input
                  autoFocus
                  type="text"
                  placeholder="e.g. LLM Fine-tuning, Roman Republic Architecture..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-lg focus:outline-none focus:border-indigo-500 transition-colors text-center placeholder-gray-600"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                />
                <button 
                  type="submit"
                  disabled={!topic}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-4 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-5 h-5" />
                  Generate Roadmap
                </button>
              </form>
            </motion.div>
          )}

          {step === 'generating' && (
             <div className="flex flex-col items-center justify-center h-full py-12">
                <div className="relative mb-8">
                  <div className="absolute inset-0 bg-indigo-500 blur-xl opacity-20 animate-pulse"></div>
                  <Loader2 className="w-16 h-16 text-indigo-400 animate-spin relative z-10" />
                </div>
                <h3 className="text-2xl font-bold mb-2 animate-pulse">{loadingMsg}</h3>
                <p className="text-gray-500 text-sm text-center px-8">This generates a high-fidelity roadmap using university-grade pedagogical standards.</p>
             </div>
          )}

          {step === 'review' && draftCourse && (
            <motion.div initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} className="p-8">
               <div className="text-center mb-10">
                 <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">{draftCourse.title}</h2>
                 <p className="text-gray-400 text-sm mt-3 max-w-xl mx-auto italic">"{draftCourse.description}"</p>
               </div>

               {/* Course Cover Selection */}
               <div className="mb-12 p-6 bg-white/5 rounded-2xl border border-white/10 max-w-3xl mx-auto shadow-inner">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-4">Course Branding</label>
                    <div className="flex flex-col sm:flex-row gap-8 items-center">
                        {/* Preview */}
                        <div 
                            className="w-full sm:w-48 h-32 rounded-xl border border-white/10 flex items-center justify-center overflow-hidden relative bg-black/40 shrink-0 shadow-lg shadow-black"
                            style={{ 
                                background: (!draftCourse.coverImage || draftCourse.coverImage.startsWith('data:')) ? undefined : draftCourse.coverImage 
                            }}
                        >
                            {draftCourse.coverImage?.startsWith('data:') ? (
                                <img src={draftCourse.coverImage} alt="Cover" className="w-full h-full object-cover" />
                            ) : !draftCourse.coverImage ? (
                                <ImageIcon className="w-10 h-10 text-gray-700" />
                            ) : null}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                        </div>

                        <div className="flex-1 space-y-6 w-full">
                             {/* Upload */}
                             <div className="flex flex-wrap items-center gap-4">
                                 <button 
                                    onClick={() => fileInputRef.current?.click()}
                                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-md shadow-indigo-900/40"
                                 >
                                    <Upload className="w-3 h-3" /> Upload Cover Image
                                 </button>
                                 <input 
                                    type="file" 
                                    ref={fileInputRef} 
                                    className="hidden" 
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if(file) {
                                             const reader = new FileReader();
                                             reader.onload = (ev) => {
                                                 setDraftCourse({...draftCourse, coverImage: ev.target?.result as string});
                                             }
                                             reader.readAsDataURL(file);
                                        }
                                    }}
                                 />
                             </div>
                             
                             {/* Presets */}
                             <div className="space-y-3">
                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">Color Presets</p>
                                <div className="flex gap-3">
                                    {[
                                        "linear-gradient(to right, #4f46e5, #9333ea)", 
                                        "linear-gradient(to right, #2563eb, #06b6d4)", 
                                        "linear-gradient(to right, #db2777, #f472b6)", 
                                        "linear-gradient(to right, #059669, #10b981)", 
                                        "linear-gradient(to right, #ea580c, #f97316)"
                                    ].map((grad, i) => (
                                        <button 
                                            key={i}
                                            className="w-10 h-10 rounded-full border-2 border-transparent hover:border-white hover:scale-110 transition-all shadow-xl"
                                            style={{ background: grad }}
                                            onClick={() => setDraftCourse({...draftCourse, coverImage: grad})}
                                            title="Use Gradient"
                                        />
                                    ))}
                                    <button 
                                        onClick={() => setDraftCourse({...draftCourse, coverImage: undefined})}
                                        className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/50 transition-all bg-white/5"
                                        title="Remove Cover"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                             </div>
                        </div>
                    </div>
               </div>

               {/* DIAGRAMMATIC ROADMAP */}
               <div className="relative max-w-3xl mx-auto py-12 px-4">
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest text-center mb-12">Visual Learning Path</h3>
                  
                  {/* The Vertical Spine */}
                  <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-indigo-500/0 via-indigo-500/40 to-indigo-500/0 hidden md:block" />

                  <div className="space-y-12 relative">
                    {/* START */}
                    <div className="flex justify-center relative z-10">
                        <div className="px-6 py-2 rounded-full bg-indigo-600/20 border border-indigo-500/40 text-indigo-400 font-bold text-sm flex items-center gap-2 shadow-lg shadow-indigo-900/20">
                            <Play className="w-3 h-3 fill-indigo-400" /> Start Mastering {topic}
                        </div>
                    </div>

                    {draftCourse.chapters?.map((ch, idx) => {
                        const isEven = idx % 2 === 0;
                        return (
                            <div key={ch.id} className={`flex flex-col md:flex-row items-center gap-8 ${isEven ? 'md:flex-row-reverse' : ''}`}>
                                {/* Content Side */}
                                <div className="flex-1 w-full">
                                    <GlassCard className="group hover:border-indigo-500/50 transition-all duration-500 p-0 overflow-hidden shadow-2xl">
                                        <div className="p-1 bg-white/5 flex items-center justify-between px-4 border-b border-white/5">
                                            <span className="text-[10px] font-mono text-indigo-500/60 font-bold">MODULE {idx + 1}</span>
                                            <button 
                                                onClick={() => handleDeleteChapter(idx)}
                                                className="p-1.5 text-gray-700 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                        <div className="p-5">
                                            <input 
                                                className="w-full bg-transparent text-lg font-bold text-white focus:outline-none focus:text-indigo-300 transition-colors placeholder-gray-700"
                                                value={ch.title}
                                                onChange={(e) => handleUpdateChapter(idx, e.target.value)}
                                                placeholder="Specific Module Title..."
                                            />
                                        </div>
                                    </GlassCard>
                                </div>

                                {/* Central Node */}
                                <div className="relative flex items-center justify-center shrink-0">
                                    <div className="w-10 h-10 rounded-full bg-[#050505] border-4 border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.4)] flex items-center justify-center text-xs font-bold text-indigo-400 z-10">
                                        {idx + 1}
                                    </div>
                                    {/* Horizontal connection line for desktop */}
                                    <div className={`absolute top-1/2 -translate-y-1/2 w-8 h-[2px] bg-indigo-500/40 hidden md:block ${isEven ? '-left-8' : '-right-8'}`} />
                                </div>

                                {/* Empty Side for Balance */}
                                <div className="flex-1 hidden md:block" />
                            </div>
                        );
                    })}

                    {/* ADD MODULE */}
                    <div className="flex justify-center relative z-10 pt-4">
                        <button 
                            onClick={handleAddChapter}
                            className="group flex items-center gap-3 px-6 py-4 rounded-2xl bg-white/5 border border-dashed border-white/20 hover:border-indigo-500/50 hover:bg-white/10 transition-all"
                        >
                            <div className="w-8 h-8 rounded-full bg-indigo-600/10 flex items-center justify-center border border-indigo-500/30 group-hover:bg-indigo-600/20">
                                <Plus className="w-4 h-4 text-indigo-400" />
                            </div>
                            <span className="text-sm font-bold text-gray-500 group-hover:text-indigo-300">Add Specific Chapter</span>
                        </button>
                    </div>

                    {/* END GOAL */}
                    <div className="flex justify-center relative z-10">
                        <div className="px-8 py-3 rounded-full bg-emerald-600/20 border border-emerald-500/40 text-emerald-400 font-bold text-sm flex items-center gap-2 shadow-lg shadow-emerald-900/20">
                            <GraduationCap className="w-4 h-4" /> Certification & Goal Reached
                        </div>
                    </div>
                  </div>
               </div>
            </motion.div>
          )}
        </div>
        
        {step === 'review' && (
           <div className="p-6 border-t border-white/10 bg-[#050505] flex flex-col sm:flex-row gap-4 z-10 relative">
              <button 
                 onClick={() => setStep('input')}
                 className="flex-1 py-4 rounded-xl border border-white/10 hover:bg-white/5 transition-colors font-bold text-gray-400"
              >
                Discard Path
              </button>
              <button 
                 onClick={handleFinalize}
                 className="flex-[2] bg-gradient-to-r from-indigo-600 to-emerald-600 hover:from-indigo-500 hover:to-emerald-500 text-white font-bold py-4 rounded-xl transition-all shadow-2xl shadow-indigo-500/20 text-lg flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-5 h-5" />
                Launch Deep-Dive Course
              </button>
           </div>
        )}
      </GlassCard>
    </div>
  );
};

// --- RESIZABLE CINEMA MODE COURSE PLAYER ---
const CoursePlayer = ({ course, onBack, onCompleteChapter }: { 
  course: Course, 
  onBack: () => void,
  onCompleteChapter: (chapterId: string) => void
}) => {
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'notes' | 'resources' | 'quiz'>('notes');
  const [videoSource, setVideoSource] = useState<'primary' | 'alternative'>('primary');
  const [chapterData, setChapterData] = useState<Record<string, Partial<Chapter>>>({});
  const [loadingChapter, setLoadingChapter] = useState(false);
  
  // Resizable Height Control for Cinema Mode
  const [videoHeight, setVideoHeight] = useState(50); // percentage 20-80
  const isResizing = useRef(false);
  const playerContainerRef = useRef<HTMLDivElement>(null);

  const [showConfetti, setShowConfetti] = useState(false);
  const activeChapter = course.chapters[activeChapterIndex];
  const currentChapterDetails = chapterData[activeChapter.id];

  useEffect(() => {
    const fetchContent = async () => {
      if (!chapterData[activeChapter.id]) {
        setLoadingChapter(true);
        const data = await generateChapterContent(activeChapter.title, course.title);
        setChapterData(prev => ({ ...prev, [activeChapter.id]: data }));
        setLoadingChapter(false);
      }
    };
    fetchContent();
  }, [activeChapter, course.title, chapterData]);

  const handleComplete = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
    onCompleteChapter(activeChapter.id);
  };

  // RESIZE LOGIC
  const startResizing = () => {
    isResizing.current = true;
    document.body.style.cursor = 'row-resize';
  };

  const stopResizing = () => {
    isResizing.current = false;
    document.body.style.cursor = 'default';
  };

  const resize = (e: MouseEvent) => {
    if (!isResizing.current || !playerContainerRef.current) return;
    const containerRect = playerContainerRef.current.getBoundingClientRect();
    const relativeY = e.clientY - containerRect.top;
    const heightPercent = (relativeY / containerRect.height) * 100;
    
    if (heightPercent > 20 && heightPercent < 80) {
      setVideoHeight(heightPercent);
    }
  };

  useEffect(() => {
    window.addEventListener('mousemove', resize);
    window.addEventListener('mouseup', stopResizing);
    return () => {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
    };
  }, []);

  return (
    <div className="pt-20 h-screen flex flex-col md:flex-row overflow-hidden bg-[#020617]">
      {/* Sidebar - Fixed Width */}
      <div className="w-full md:w-80 border-r border-white/5 bg-black/40 flex flex-col h-full overflow-y-auto shrink-0 z-20 scrollbar-hide">
        <div className="p-6 border-b border-white/5">
          <button onClick={onBack} className="text-gray-500 hover:text-white text-xs font-bold flex items-center gap-1 mb-6 transition-colors">
            <ArrowLeft className="w-3 h-3" /> DASHBOARD
          </button>
          <h2 className="font-bold text-lg leading-tight text-white mb-3 line-clamp-2">{course.title}</h2>
          <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest mb-4">Course Progress</p>
          <div className="h-1.5 bg-white/5 rounded-full w-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full transition-all duration-1000"
              style={{ width: `${(course.completedChapters / course.totalChapters) * 100}%` }}
            />
          </div>
          <p className="text-[10px] text-gray-500 mt-2 text-right font-bold">
            {course.completedChapters} / {course.totalChapters} MODULES DONE
          </p>
        </div>
        <div className="flex-1 pb-10">
          {course.chapters.map((ch, idx) => (
            <button
              key={ch.id}
              onClick={() => setActiveChapterIndex(idx)}
              className={`w-full text-left px-6 py-4 border-b border-white/5 flex items-center gap-4 hover:bg-white/5 transition-all ${idx === activeChapterIndex ? 'bg-indigo-600/10 border-l-4 border-l-indigo-500' : 'border-l-4 border-l-transparent opacity-60'}`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 transition-all ${ch.isCompleted ? 'bg-emerald-500 text-black' : 'bg-white/5 text-gray-400 border border-white/10'}`}>
                {ch.isCompleted ? <CheckCircle className="w-4 h-4" /> : idx + 1}
              </div>
              <span className={`text-xs font-bold leading-tight ${idx === activeChapterIndex ? 'text-white' : 'text-gray-400'}`}>
                {ch.title}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Cinema Stage (Split-Pane) */}
      <div ref={playerContainerRef} className="flex-1 flex flex-col h-full relative overflow-hidden">
        {showConfetti && (
          <div className="absolute inset-0 z-50 pointer-events-none flex items-center justify-center">
            <h1 className="text-8xl animate-bounce">🏆</h1>
          </div>
        )}

        {/* Video Portion */}
        <div style={{ height: `${videoHeight}%` }} className="w-full bg-black relative shrink-0 transition-[height] duration-75 ease-out shadow-2xl">
          {loadingChapter ? (
            <div className="absolute inset-0 flex items-center justify-center flex-col gap-6">
               <div className="relative">
                 <div className="absolute inset-0 bg-indigo-500 blur-2xl opacity-20 animate-pulse"></div>
                 <Loader2 className="w-12 h-12 text-indigo-500 animate-spin relative z-10" />
               </div>
               <div className="text-center space-y-2">
                <p className="text-indigo-400 text-sm font-bold tracking-widest animate-pulse">GENERATING DEEP-DIVE CONTENT</p>
                <p className="text-gray-600 text-xs">AI is curating the best human instruction for this module...</p>
               </div>
            </div>
          ) : (
            <iframe 
              src={`https://www.youtube.com/embed/${videoSource === 'primary' ? currentChapterDetails?.videoId_1 : currentChapterDetails?.videoId_2}?rel=0&autoplay=0`}
              title="Course Player"
              className="w-full h-full object-contain bg-black"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )}
          
          {/* Dual Video UI */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-xl rounded-2xl p-1.5 flex gap-1.5 border border-white/10 shadow-2xl z-10">
            <button 
              onClick={() => setVideoSource('primary')}
              className={`relative px-6 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${videoSource === 'primary' ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
            >
              {videoSource === 'primary' && (
                <motion.div layoutId="cinema-pill" className="absolute inset-0 bg-indigo-600 rounded-xl" transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} />
              )}
              <span className="relative z-10 flex items-center gap-2"><MonitorPlay className="w-3.5 h-3.5"/> Perspective A</span>
            </button>
            <button 
              onClick={() => setVideoSource('alternative')}
              className={`relative px-6 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${videoSource === 'alternative' ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
            >
              {videoSource === 'alternative' && (
                <motion.div layoutId="cinema-pill" className="absolute inset-0 bg-purple-600 rounded-xl" transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} />
              )}
              <span className="relative z-10 flex items-center gap-2"><LayoutGrid className="w-3.5 h-3.5"/> Perspective B</span>
            </button>
          </div>
        </div>

        {/* DRAG HANDLE BAR */}
        <div 
          onMouseDown={startResizing}
          className="h-1.5 bg-[#0a0a0a] hover:bg-indigo-600/40 cursor-row-resize flex items-center justify-center shrink-0 z-30 transition-colors border-y border-white/5 active:bg-indigo-600"
        >
           <GripHorizontal className="w-4 h-4 text-gray-700" />
        </div>

        {/* Content Portion */}
        <div className="flex-1 flex flex-col min-h-0 bg-[#020617]">
          {/* Tabs UI */}
          <div className="px-8 border-b border-white/5 bg-black/40 shrink-0 sticky top-0 z-20">
            <div className="flex gap-10">
              {[
                { id: 'notes', label: 'DEEP NOTES', icon: FileText },
                { id: 'resources', label: 'RESOURCES', icon: BookOpen },
                { id: 'quiz', label: 'EVALUATION', icon: Brain }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-5 text-[10px] font-black uppercase tracking-[0.2em] border-b-2 transition-all flex items-center gap-3 ${activeTab === tab.id ? 'border-indigo-500 text-indigo-400 opacity-100' : 'border-transparent text-gray-600 hover:text-white opacity-50'}`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto p-10 scrollbar-hide">
            <AnimatePresence mode="wait">
              {activeTab === 'notes' && (
                <motion.div 
                  key="notes"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="max-w-4xl mx-auto"
                >
                  {loadingChapter ? (
                    <div className="space-y-6 animate-pulse">
                      <div className="h-8 bg-white/5 rounded-xl w-1/3"></div>
                      <div className="h-4 bg-white/5 rounded-xl w-full"></div>
                      <div className="h-4 bg-white/5 rounded-xl w-5/6"></div>
                      <div className="h-64 bg-white/5 rounded-2xl w-full"></div>
                    </div>
                  ) : (
                    <div className="prose prose-invert max-w-none prose-headings:text-white prose-p:text-gray-400 prose-p:leading-loose prose-li:text-gray-400 prose-strong:text-indigo-300">
                        <div dangerouslySetInnerHTML={{ 
                        __html: (currentChapterDetails?.content_md || "")
                            .replace(/^## (.*$)/gim, '<h2 class="text-3xl font-black mt-16 mb-8 text-white uppercase tracking-tight">$1</h2>')
                            .replace(/^# (.*$)/gim, '<h1 class="text-4xl font-black mb-10 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">$1</h1>')
                            .replace(/```(.*?)\n([\s\S]*?)```/gm, '<pre class="bg-black/80 rounded-2xl p-6 border border-white/10 font-mono text-sm overflow-x-auto my-10"><code>$2</code></pre>')
                        }} />
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'resources' && (
                <motion.div 
                   key="resources"
                   initial={{ opacity: 0, scale: 0.98 }}
                   animate={{ opacity: 1, scale: 1 }}
                   exit={{ opacity: 0, scale: 0.98 }}
                   className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6"
                >
                  {currentChapterDetails?.external_links?.map((link, i) => (
                    <GlassCard key={i} className="hover:border-indigo-500/50 transition-all flex flex-col justify-between h-48 group">
                      <div>
                        <div className="flex justify-between items-center mb-4">
                           <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 text-[9px] font-black tracking-widest uppercase">{link.type || 'Source'}</span>
                           <ExternalLinkIcon className="w-4 h-4 text-gray-700 group-hover:text-white transition-colors" />
                        </div>
                        <h4 className="font-bold text-base leading-tight group-hover:text-indigo-300 transition-colors">{link.title}</h4>
                      </div>
                      
                      <a 
                        href={link.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-white flex items-center gap-2 mt-auto pt-4 border-t border-white/5"
                      >
                        Launch Source <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                      </a>
                    </GlassCard>
                  ))}
                  {(!currentChapterDetails?.external_links || currentChapterDetails.external_links.length === 0) && !loadingChapter && (
                    <div className="col-span-3 text-center py-20 opacity-30">
                       <Bot className="w-16 h-16 mx-auto mb-6" />
                       <p className="font-bold tracking-widest">NO EXTERNAL ASSETS FOUND</p>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'quiz' && (
                <motion.div
                   key="quiz"
                   initial={{ opacity: 0, x: 20 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, x: -20 }}
                   className="max-w-3xl mx-auto space-y-12 pb-20"
                >
                    <div className="text-center space-y-2 mb-16">
                        <h3 className="text-2xl font-black">Knowledge Verification</h3>
                        <p className="text-gray-500 text-sm font-medium italic">Complete all 5 queries to demonstrate module mastery.</p>
                    </div>

                   {currentChapterDetails?.quiz?.map((q, i) => (
                     <GlassCard key={i} className="border-l-4 border-l-indigo-600">
                       <h4 className="font-bold text-lg mb-8 leading-relaxed">
                         <span className="text-indigo-500 font-black mr-4 text-sm tracking-tighter">0{i+1}.</span> {q.question}
                       </h4>
                       <div className="grid grid-cols-1 gap-3">
                         {q.options.map((opt, optIdx) => (
                           <button 
                             key={optIdx}
                             className="w-full text-left p-5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-indigo-500/30 transition-all text-sm font-medium"
                             onClick={(e) => {
                               // Reset logic for feedback
                               const btns = e.currentTarget.parentElement?.querySelectorAll('button');
                               btns?.forEach(b => b.classList.remove("border-emerald-500", "bg-emerald-500/10", "border-red-500", "bg-red-500/10", "text-emerald-300", "text-red-300"));
                               
                               if (optIdx === q.correctAnswer) {
                                 e.currentTarget.classList.add("bg-emerald-500/10", "border-emerald-500", "text-emerald-300");
                               } else {
                                 e.currentTarget.classList.add("bg-red-500/10", "border-red-500", "text-red-300");
                               }
                             }}
                           >
                             <div className="flex items-center gap-4">
                                <span className="w-6 h-6 rounded-lg bg-black/40 flex items-center justify-center text-[10px] font-bold text-gray-500">{String.fromCharCode(65 + optIdx)}</span>
                                {opt}
                             </div>
                           </button>
                         ))}
                       </div>
                       <details className="mt-8 group cursor-pointer">
                         <summary className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600 hover:text-indigo-400 transition-colors list-none flex items-center gap-2">
                           View Reasoning Artifact
                         </summary>
                         <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 p-6 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 text-indigo-300 text-sm leading-relaxed">
                            <Sparkles className="w-4 h-4 mb-2" />
                           {q.explanation}
                         </motion.div>
                       </details>
                     </GlassCard>
                   ))}
                   
                   {!activeChapter.isCompleted && (
                     <div className="pt-10 flex justify-center">
                       <button 
                         onClick={handleComplete}
                         className="px-10 py-5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm uppercase tracking-[0.2em] rounded-2xl shadow-2xl shadow-emerald-900/40 transition-all transform hover:scale-105 active:scale-95 flex items-center gap-3"
                       >
                         <CheckCircle className="w-5 h-5" />
                         Unlock Module Completion
                       </button>
                     </div>
                   )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [view, setView] = useState<'landing' | 'auth' | 'dashboard' | 'course'>('landing');
  const [courses, setCourses] = useState<Course[]>([]);
  const [activeCourse, setActiveCourse] = useState<Course | null>(null);
  const [showCreator, setShowCreator] = useState(false);
  
  // Auth State
  const [user, setUser] = useState<UserProfile | null>(null);

  // Check for existing API Key session on mount
  useEffect(() => {
    const checkAuth = async () => {
      if (window.aistudio) {
        try {
          const hasKey = await window.aistudio.hasSelectedApiKey();
          if (hasKey) {
            handleLogin(); 
          }
        } catch (e) {
          console.log("No active session found");
        }
      }
    };
    checkAuth();
  }, []);

  const Background = () => (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
      <div className="orb w-[600px] h-[600px] bg-indigo-900/20 top-[-200px] left-[-200px] animate-pulse" style={{ animationDuration: '15s' }} />
      <div className="orb w-[500px] h-[500px] bg-purple-900/20 bottom-[-100px] right-[-100px] animate-pulse" style={{ animationDuration: '12s' }} />
      <div className="orb w-[400px] h-[400px] bg-blue-900/10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
    </div>
  );

  const handleLogin = () => {
    setUser({
      id: 'user_123',
      name: 'Senior Architect',
      email: 'architect@coursecraft.ai',
      avatar: 'SA'
    });
    setView(prev => prev === 'auth' ? 'dashboard' : prev);
  };

  const handleSignOut = () => {
    setUser(null);
    setView('landing');
  };

  const handleStartLearning = () => {
    if (user) setView('dashboard');
    else setView('auth');
  };

  const handleFinalizeCourse = (newCourse: Course) => {
    setCourses([newCourse, ...courses]);
    setShowCreator(false);
  };

  const handleCompleteChapter = (chapterId: string) => {
    if (!activeCourse) return;
    
    const updatedChapters = activeCourse.chapters.map(ch => 
      ch.id === chapterId ? { ...ch, isCompleted: true } : ch
    );
    
    const completedCount = updatedChapters.filter(c => c.isCompleted).length;
    
    const updatedCourse = { 
      ...activeCourse, 
      chapters: updatedChapters,
      completedChapters: completedCount 
    };

    setActiveCourse(updatedCourse);
    setCourses(courses.map(c => c.id === activeCourse.id ? updatedCourse : c));
  };

  return (
    <div className="min-h-screen text-white font-sans selection:bg-indigo-500/30 bg-[#020617]">
      <Background />
      
      {view !== 'auth' && view !== 'course' && (
        <Navbar 
          user={user}
          onHome={() => setView('landing')} 
          onSignIn={() => setView('auth')}
          onSignOut={handleSignOut}
        />
      )}

      {view === 'landing' && (
        <LandingPage onStart={handleStartLearning} />
      )}

      {view === 'auth' && (
        <AuthPage onLogin={handleLogin} />
      )}

      {view === 'dashboard' && (
        <Dashboard 
          courses={courses} 
          onCreateNew={() => setShowCreator(true)}
          onSelectCourse={(c) => { setActiveCourse(c); setView('course'); }}
        />
      )}

      {view === 'course' && activeCourse && (
        <CoursePlayer 
          course={activeCourse} 
          onBack={() => setView('dashboard')}
          onCompleteChapter={handleCompleteChapter}
        />
      )}

      {showCreator && (
        <CourseCreator 
          onGenerate={handleFinalizeCourse} 
          onClose={() => setShowCreator(false)}
        />
      )}
    </div>
  );
}
