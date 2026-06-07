'use client'

import React from 'react'
import { motion } from 'framer-motion'
import confetti from 'canvas-confetti'
import { Button } from './ui/button'
import { ArrowRight, Mail, Sparkles, Terminal, Cpu, Layers } from 'lucide-react'

// Custom local SVG implementations of Github and Linkedin brand icons (since they were removed in Lucide v1.0)
const Github = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={props.className}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
)

const Linkedin = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={props.className}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
)

export default function Hero() {
  const triggerConfetti = () => {
    // Pink and cyan bioluminescent confetti colors
    const colors = ['#FAB7C9', '#E3F6FF', '#73E8FF', '#FF8EAF']
    
    // Left burst
    confetti({
      particleCount: 50,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: colors,
    })
    
    // Right burst
    confetti({
      particleCount: 50,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: colors,
    })
  }

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const navItems = ['About', 'Projects', 'Services', 'Contact']

  return (
    <div className="relative w-full min-h-screen flex flex-col selection:bg-[#FAB7C9] selection:text-[#000107]">
      {/* 1. Header/Navigation Bar */}
      <motion.header 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="fixed top-0 left-0 w-full glass-nav z-50 px-6 py-4 md:px-12 flex justify-between items-center"
      >
        <div 
          onClick={() => scrollToSection('hero')} 
          className="text-xl md:text-2xl font-space font-bold tracking-wider cursor-pointer text-[#E3F6FF] glow-hover-cyan"
        >
          Aayush Bhardwaj
        </div>
        
        <nav className="hidden md:flex gap-8 items-center pointer-events-auto">
          {navItems.map((item) => (
            <button
              key={item}
              onClick={() => scrollToSection(item.toLowerCase())}
              className="text-sm font-medium tracking-wide nav-link"
            >
              {item}
            </button>
          ))}
        </nav>
        
        {/* Mobile menu trigger button placeholder */}
        <div className="md:hidden">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-[#E3F6FF] pointer-events-auto"
            onClick={() => scrollToSection('contact')}
          >
            Contact
          </Button>
        </div>
      </motion.header>

      {/* 2. Hero Content (Main Section) */}
      <section 
        id="hero" 
        className="min-h-screen w-full flex flex-col justify-center items-center px-6 md:px-12 relative pt-20 pointer-events-none"
      >
        <div className="max-w-4xl text-center flex flex-col items-center relative z-10">
          {/* Subtle tag */}
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full glow-badge text-xs text-[#FAB7C9] mb-6 tracking-wider font-space"
          >
            <Sparkles className="size-3" /> INTRODUCING THE DIGITAL FRONTIER
          </motion.div>

          {/* Heading — rendered with text-shadow for readability over 3D canvas.
              The same text also exists in the 3D scene for spatial occlusion depth. */}
          <motion.h1 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="relative z-10 text-4xl md:text-7xl font-space font-extrabold tracking-tight mb-6 leading-[1.1] hero-headline"
          >
            <span className="text-white block md:inline">Elevating the Web.</span>{' '}
            <span className="text-gradient block md:inline">Defying Limits.</span>
          </motion.h1>

          {/* Subheading */}
          <motion.p 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="relative z-10 text-base md:text-xl text-[#E3F6FF]/75 max-w-2xl mb-10 leading-relaxed font-sans drop-shadow-[0_0_20px_rgba(0,0,0,0.55)]"
          >
            I'm <span className="text-white font-medium">Aayush Bhardwaj</span>. A Full-Stack Developer engineering scalable, high-performance digital experiences.
          </motion.p>

          {/* CTAs */}
          <motion.div 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 items-center justify-center pointer-events-auto relative z-40"
          >
            <Button
              onClick={() => {
                triggerConfetti();
                scrollToSection('about');
              }}
              size="lg"
              className="glass-button-primary text-white hover:text-white px-8 rounded-full flex items-center gap-2 group cursor-pointer"
            >
              Explore My Orbit
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Button>
            
            <Button
              onClick={() => scrollToSection('contact')}
              variant="outline"
              size="lg"
              className="glass-button-secondary text-[#E3F6FF] px-8 rounded-full cursor-pointer"
            >
              Initiate Contact
            </Button>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center z-10 pointer-events-auto">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ delay: 1.2, duration: 1 }}
            onClick={() => scrollToSection('about')}
            className="flex flex-col items-center gap-1 cursor-pointer group"
          >
            <span className="text-xs tracking-widest text-[#E3F6FF]/50 group-hover:text-[#E3F6FF] transition-colors">SCROLL DOWN</span>
            <div className="w-5 h-8 rounded-full border border-[#E3F6FF]/30 p-1 flex justify-center items-start">
              <motion.div 
                animate={{ y: [0, 12, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                className="w-1.5 h-1.5 rounded-full bg-[#FAB7C9]"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. About Section (Scroll Target) */}
      <section 
        id="about" 
        className="w-full min-h-screen py-32 px-6 md:px-12 flex flex-col justify-center items-center pointer-events-none"
      >
        <div className="max-w-4xl w-full">
          <h2 className="text-3xl md:text-4xl font-space font-extrabold text-center mb-16 text-white">
            About My Craft
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pointer-events-auto">
            {/* Main Bio Card */}
            <div className="glass-card rounded-2xl p-8 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div className="p-3 rounded-lg bg-white/5 border border-white/5 text-[#FAB7C9]">
                    <Terminal className="size-6" />
                  </div>
                </div>
                <h3 className="text-xl font-space font-bold mb-3 text-white">Full-Stack Engineer</h3>
                <p className="text-sm text-[#E3F6FF]/70 leading-relaxed">
                  I specialize in creating fluid, high-performance web applications that bridge code and art. With expertise spanning front-end rendering engines like Three.js and custom GLSL shaders, to robust, production-grade back-end architectures.
                </p>
              </div>
              <div className="mt-8 pt-6 border-t border-white/5 flex gap-4">
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full bg-white/5 border border-white/5 hover:bg-white/10 hover:border-[#FAB7C9]/35 text-[#E3F6FF] transition-all">
                  <Github className="size-5" />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full bg-white/5 border border-white/5 hover:bg-white/10 hover:border-[#E3F6FF]/35 text-[#E3F6FF] transition-all">
                  <Linkedin className="size-5" />
                </a>
              </div>
            </div>

            {/* Stack Card */}
            <div className="glass-card rounded-2xl p-8 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div className="p-3 rounded-lg bg-white/5 border border-white/5 text-[#E3F6FF]">
                    <Cpu className="size-6" />
                  </div>
                </div>
                <h3 className="text-xl font-space font-bold mb-3 text-white">Tech Stack</h3>
                <div className="flex flex-wrap gap-2">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-[#E3F6FF]/70">React / Next.js</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-[#E3F6FF]/70">Three.js / WebGL</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-[#E3F6FF]/70">TypeScript</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-[#E3F6FF]/70">Node.js</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-[#E3F6FF]/70">PostgreSQL</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-[#E3F6FF]/70">GraphQL</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Projects Section */}
      <section 
        id="projects" 
        className="w-full min-h-screen py-32 px-6 md:px-12 flex flex-col justify-center items-center pointer-events-none"
      >
        <div className="max-w-4xl w-full">
          <h2 className="text-3xl md:text-4xl font-space font-extrabold text-center mb-16 text-white">
            Curated Creations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pointer-events-auto">
            {/* Project 1 */}
            <div className="glass-card rounded-2xl p-8 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div className="p-3 rounded-lg bg-white/5 border border-white/5 text-[#FAB7C9]">
                    <Layers className="size-6" />
                  </div>
                  <span className="text-xs text-[#E3F6FF]/40 tracking-wider font-space">2026</span>
                </div>
                <h3 className="text-xl font-space font-bold mb-3 text-white">Bioluminescent Shader Sandbox</h3>
                <p className="text-sm text-[#E3F6FF]/70 leading-relaxed">
                  An interactive, web-based playground for writing and rendering GLSL shaders that simulate natural bioluminescence patterns in real-time.
                </p>
              </div>
              <div className="mt-8 pt-6 border-t border-white/5 flex gap-2">
                <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-[#E3F6FF]/70">R3F</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-[#E3F6FF]/70">GLSL</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-[#E3F6FF]/70">TypeScript</span>
              </div>
            </div>

            {/* Project 2 */}
            <div className="glass-card rounded-2xl p-8 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div className="p-3 rounded-lg bg-white/5 border border-white/5 text-[#E3F6FF]">
                    <Terminal className="size-6" />
                  </div>
                  <span className="text-xs text-[#E3F6FF]/40 tracking-wider font-space">2026</span>
                </div>
                <h3 className="text-xl font-space font-bold mb-3 text-white">Scalable FaaS Orchestrator</h3>
                <p className="text-sm text-[#E3F6FF]/70 leading-relaxed">
                  A high-throughput serverless function coordinator utilizing event streams and low-latency clustering to scale up to 10k concurrent tasks.
                </p>
              </div>
              <div className="mt-8 pt-6 border-t border-white/5 flex gap-2">
                <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-[#E3F6FF]/70">Go</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-[#E3F6FF]/70">Redis</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-[#E3F6FF]/70">Kubernetes</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Services Section */}
      <section 
        id="services" 
        className="w-full min-h-screen py-32 px-6 md:px-12 flex flex-col justify-center items-center pointer-events-none"
      >
        <div className="max-w-4xl w-full">
          <h2 className="text-3xl md:text-4xl font-space font-extrabold text-center mb-16 text-white">
            Technical Capabilities
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pointer-events-auto">
            <div className="glass-card rounded-2xl p-8 text-center flex flex-col items-center">
              <span className="text-2xl mb-4">✨</span>
              <h3 className="font-space font-bold mb-2 text-white text-lg">Creative Engineering</h3>
              <p className="text-xs text-[#E3F6FF]/60 leading-relaxed">
                Building immersive 3D portals, interactive simulations, and responsive animations using WebGL and R3F.
              </p>
            </div>
            <div className="glass-card rounded-2xl p-8 text-center flex flex-col items-center">
              <span className="text-2xl mb-4">⚡</span>
              <h3 className="font-space font-bold mb-2 text-white text-lg">Full-Stack Development</h3>
              <p className="text-xs text-[#E3F6FF]/60 leading-relaxed">
                Structuring clean, maintainable APIs and state management for scalable database integrations.
              </p>
            </div>
            <div className="glass-card rounded-2xl p-8 text-center flex flex-col items-center">
              <span className="text-2xl mb-4">🚀</span>
              <h3 className="font-space font-bold mb-2 text-white text-lg">Performance Audit</h3>
              <p className="text-xs text-[#E3F6FF]/60 leading-relaxed">
                Optimizing layout shifts, bundler output size, server response latency, and search engine parameters.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Contact Section */}
      <section 
        id="contact" 
        className="w-full min-h-screen py-32 px-6 md:px-12 flex flex-col justify-center items-center pointer-events-none"
      >
        <div className="max-w-xl w-full relative z-20 pointer-events-auto">
          <div className="mx-auto w-full bg-[#000107]/70 backdrop-blur-2xl border border-white/10 rounded-2xl p-12 shadow-[0_0_80px_rgba(0,0,0,0.3)] text-center">
            <h2 className="text-3xl md:text-5xl font-space font-extrabold text-white mb-6">
              Initiate Contact
            </h2>
            <p className="text-sm md:text-base text-[#E3F6FF]/85 mb-10 leading-relaxed">
              Interested in starting a project or exploring a partnership? Drop an email or message through my social endpoints.
            </p>

            <div className="flex flex-col gap-6 justify-center items-center max-w-md mx-auto">
              <a 
                href="mailto:aayush@example.com" 
                className="inline-flex items-center gap-3 text-lg text-[#E3F6FF] hover:text-[#FAB7C9] transition-colors font-medium"
              >
                <Mail className="size-5" /> aayush@example.com
              </a>
              
              <div className="w-full h-px bg-white/10 my-2" />
              
              <div className="flex gap-6 justify-center items-center">
                <a 
                  href="https://github.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-xs text-[#E3F6FF]/70 hover:text-[#E3F6FF] tracking-wider uppercase font-space transition-colors"
                >
                  Github
                </a>
                <span className="text-white/20">•</span>
                <a 
                  href="https://linkedin.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-xs text-[#E3F6FF]/70 hover:text-[#E3F6FF] tracking-wider uppercase font-space transition-colors"
                >
                  LinkedIn
                </a>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer info */}
        <div className="mt-32 text-xs text-[#E3F6FF]/30 tracking-widest font-space uppercase">
          © {new Date().getFullYear()} Aayush Bhardwaj. ALL ORBITS ALIGNED.
        </div>
      </section>
    </div>
  )
}
