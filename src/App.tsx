/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, useScroll, useTransform, useSpring, useMotionValue, useVelocity } from "motion/react";
import { useEffect, useRef, useState, createContext, useContext, ReactNode, MouseEvent as ReactMouseEvent } from "react";
import { ArrowUpRight, Github, Linkedin, Mail, Twitter } from "lucide-react";

// --- Context for Cursor ---
const CursorContext = createContext<{
  cursorType: string;
  setCursorType: (type: string) => void;
}>({ cursorType: "default", setCursorType: () => {} });

// --- Components ---

const GrainOverlay = () => (
  <div className="grain-overlay" aria-hidden="true">
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <filter id="noiseFilter">
        <feTurbulence 
          type="fractalNoise" 
          baseFrequency="0.65" 
          numOctaves="3" 
          stitchTiles="stitch" 
        />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#noiseFilter)" />
    </svg>
    <motion.div 
      animate={{ 
        x: [0, 10, -5, 0],
        y: [0, -5, 10, 0]
      }}
      transition={{ duration: 0.2, repeat: Infinity, ease: "linear" }}
      className="absolute inset-0 bg-transparent"
    />
  </div>
);

const CustomCursor = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const { cursorType } = useContext(CursorContext);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  const variants = {
    default: {
      width: 8,
      height: 8,
      backgroundColor: "#C0FF00",
      x: -4,
      y: -4,
    },
    hover: {
      width: 100,
      height: 100,
      backgroundColor: "#C0FF00",
      mixBlendMode: "difference" as const,
      x: -50,
      y: -50,
    },
    project: {
      width: 140,
      height: 140,
      backgroundColor: "#FFFFFF",
      mixBlendMode: "difference" as const,
      x: -70,
      y: -70,
    }
  };

  const springConfig = { damping: 30, stiffness: 300, mass: 0.5 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  return (
    <motion.div
      className="fixed pointer-events-none z-[10000] rounded-full flex flex-col items-center justify-center text-[10px] font-mono font-bold text-black overflow-hidden"
      animate={cursorType}
      variants={variants}
      style={{
        left: springX,
        top: springY,
      }}
    >
      {cursorType === "project" && (
        <motion.span 
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="tracking-widest"
        >
          EXPLORE
        </motion.span>
      )}
    </motion.div>
  );
};

const MagneticElement = ({ children, onHoverChange, className }: { children: ReactNode, onHoverChange?: (hover: boolean) => void, className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e: ReactMouseEvent) => {
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current!.getBoundingClientRect();
    const x = clientX - (left + width / 2);
    const y = clientY - (top + height / 2);
    setPosition({ x: x * 0.4, y: y * 0.4 });
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
    onHoverChange?.(false);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      onMouseEnter={() => onHoverChange?.(true)}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const Nav = () => {
  const { setCursorType } = useContext(CursorContext);
  return (
    <nav className="fixed top-0 left-0 w-full p-12 flex justify-between items-start z-50 pointer-events-none">
      <div className="font-mono text-[10px] tracking-widest uppercase pointer-events-auto cursor-none group flex items-center gap-4" 
           onMouseEnter={() => setCursorType("hover")} 
           onMouseLeave={() => setCursorType("default")}>
        <div className="w-2 h-2 bg-accent rounded-full group-hover:scale-150 transition-transform" />
        KINETIC.SYSTEMS // 2024
      </div>
      <div className="flex gap-12 pointer-events-auto">
        {["WORK", "STUDIO", "INFO"].map((item) => (
          <button 
            key={item}
            className="font-mono text-[10px] tracking-widest uppercase hover:text-accent transition-colors mix-blend-difference"
            onMouseEnter={() => setCursorType("hover")}
            onMouseLeave={() => setCursorType("default")}
          >
            {item}
          </button>
        ))}
      </div>
    </nav>
  );
};

const SectionHero = () => {
  return (
    <section className="h-screen w-screen flex flex-col justify-center items-center p-8 relative overflow-hidden shrink-0">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center flex flex-col items-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 0.3, y: 0 }}
          className="font-mono text-[10px] tracking-widest mb-4"
        >
          [ CREATIVE TECHNOLOGIST ]
        </motion.div>
        
        <div className="relative">
          <motion.h1 
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, ease: [0.33, 1, 0.68, 1] }}
            className="text-[25vw] leading-[0.7] font-black tracking-[-0.08em]"
          >
            SHAPING
          </motion.h1>
          <motion.div 
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.5, duration: 1, ease: "circOut" }}
            className="absolute top-1/2 -translate-y-1/2 left-0 w-full h-[0.02em] bg-accent origin-left"
          />
        </div>
        
        <motion.h1 
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.1, ease: [0.33, 1, 0.68, 1] }}
          className="text-[25vw] leading-[0.7] font-black tracking-[-0.08em] text-transparent"
          style={{ WebkitTextStroke: "2px rgba(255,255,255,0.2)" }}
        >
          MOTION
        </motion.h1>
      </div>

      <div className="absolute bottom-12 left-12 grid grid-cols-2 gap-24 w-[calc(100%-6rem)]">
        <div className="font-mono text-[9px] tracking-tight max-w-[240px] opacity-40 uppercase leading-loose">
          Explorations in digital materiality. building environments that respond to human presence. No defaults. No templates.
        </div>
        <div className="flex justify-end items-end font-mono text-[9px] tracking-widest opacity-40 uppercase">
          [ SCROLL TO EXPLORE ]
        </div>
      </div>
    </section>
  );
};

const Project = ({ title, year, category, index }: { title: string, year: string, category: string, index: number }) => {
  const { setCursorType } = useContext(CursorContext);
  return (
    <motion.div 
      className="group relative w-[70vw] h-[60vh] bg-white/5 border border-white/5 shrink-0 flex flex-col justify-between p-12 overflow-hidden cursor-none"
      onMouseEnter={() => setCursorType("project")}
      onMouseLeave={() => setCursorType("default")}
      initial={{ opacity: 0, x: 100 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1, duration: 0.8, ease: "circOut" }}
    >
      <div className="flex justify-between items-start border-b border-white/10 pb-8">
        <span className="font-mono text-[10px] opacity-50">[{year}]</span>
        <span className="font-mono text-[10px] opacity-50 tracking-widest">{category}</span>
      </div>
      
      <div className="relative z-10">
        <motion.div 
          whileHover={{ x: 20 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          <h3 className="text-[12vw] font-black leading-none mb-4 group-hover:text-accent transition-colors">{title}</h3>
        </motion.div>
        <p className="font-mono text-[10px] opacity-50 max-w-[400px] uppercase leading-relaxed">
          High-fidelity prototype for a digital gallery space using three.js and custom shaders. Focused on fluidity and tactile response.
        </p>
      </div>

      <div className="absolute right-0 top-1/2 -translate-y-1/2 p-12 opacity-0 group-hover:opacity-100 transition-all duration-700 blur-sm group-hover:blur-none">
        <ArrowUpRight size={120} strokeWidth={0.5} className="text-accent" />
      </div>

      {/* Decorative Index */}
      <div className="absolute bottom-12 right-12 font-mono text-[64px] font-black opacity-5 leading-none">
        0{index + 1}
      </div>

      <div className="absolute inset-0 bg-accent/0 group-hover:bg-accent/[0.02] transition-colors duration-500" />
    </motion.div>
  );
};

const SectionWork = () => {
  return (
    <section className="h-screen flex items-center gap-12 px-[10vw] shrink-0">
      <Project title="VOID" year="24" category="EXPERIMENT" index={0} />
      <Project title="NEOS" year="24" category="WEBGL" index={1} />
      <Project title="CRUX" year="23" category="TOOLING" index={2} />
      <Project title="SYNC" year="23" category="PLATFORM" index={3} />
    </section>
  );
};

const SectionAbout = () => {
  return (
    <section className="h-screen w-screen shrink-0 flex flex-col justify-center px-[10vw] relative">
       <div className="absolute top-0 right-0 p-24 font-black text-[20vw] opacity-[0.02] leading-none select-none pointer-events-none">
        ABOUT
      </div>
      <div className="grid grid-cols-12 gap-12 items-end relative z-10">
        <div className="col-span-12 lg:col-span-7">
          <h2 className="text-[10vw] leading-[0.8] font-black mb-16 tracking-tighter">
            CODE IS<br/>MATTER.
          </h2>
          <div className="font-mono text-xl leading-relaxed max-w-3xl opacity-80 mb-12">
            Independent developer and designer currently exploring the intersection of digital sculpture and web performance. 
            I believe the web doesn't have to be flat.
          </div>
          
          <div className="flex gap-4">
            {["Strategy", "Development", "Art Direction", "R&D"].map((tag) => (
              <span key={tag} className="px-4 py-2 border border-white/20 font-mono text-[9px] uppercase tracking-widest hover:bg-white hover:text-black transition-colors">
                {tag}
              </span>
            ))}
          </div>
        </div>
        
        <div className="col-span-12 lg:col-span-5 border-l border-white/10 pl-12 space-y-12">
          <div>
            <div className="font-mono text-[9px] uppercase opacity-40 mb-4 tracking-widest font-bold text-accent">Capabilities</div>
            <p className="font-mono text-xs leading-loose uppercase">
              Creative Engineering<br/>
              Custom Shader Development<br/>
              Architectural Visualization<br/>
              System Design & Scaling
            </p>
          </div>
          <div>
            <div className="font-mono text-[9px] uppercase opacity-40 mb-4 tracking-widest font-bold text-accent">Philosophy</div>
            <p className="font-mono text-xs leading-loose uppercase">
              Beauty in brutality.<br/>
              Efficiency in motion.<br/>
              Digital physicalism.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  const { setCursorType } = useContext(CursorContext);
  return (
    <section className="h-screen w-screen shrink-0 flex flex-col justify-between p-12 bg-accent text-noir relative overflow-hidden">
      <motion.div 
        animate={{ 
          x: [0, 100, 0],
          rotate: [0, 5, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute -top-[10vw] -left-[10vw] text-[40vw] font-black opacity-10 select-none pointer-events-none"
      >
        HELLO
      </motion.div>

      <div className="flex flex-col lg:flex-row justify-between items-start relative z-10">
        <div className="text-[12vw] font-black leading-[0.8] tracking-tighter">
          HAVE AN<br/>IDEA?
        </div>
        
        <div className="mt-12 lg:mt-0 flex flex-col gap-8">
           <MagneticElement onHoverChange={(h) => setCursorType(h ? "hover" : "default")}>
            <button className="px-12 py-6 border-2 border-noir font-mono font-bold tracking-widest uppercase hover:bg-noir hover:text-accent transition-all text-sm group flex items-center gap-4">
              Send Message <ArrowUpRight className="group-hover:rotate-45 transition-transform" />
            </button>
          </MagneticElement>
          
          <div className="mt-4 space-y-2">
            <div className="font-mono text-[10px] uppercase font-bold">Inquiries</div>
            <div className="font-mono text-lg underline">shubham@kinetic.sys</div>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-end border-t border-noir/20 pt-12 relative z-10">
        <div className="flex gap-12 font-mono text-[10px] uppercase font-bold">
          {["Github", "Twitter", "Linkedin", "Layers"].map(social => (
            <button key={social} onMouseEnter={() => setCursorType("hover")} onMouseLeave={() => setCursorType("default")} className="hover:underline">
              {social}
            </button>
          ))}
        </div>
        <div className="font-mono text-[10px] uppercase font-medium">
          LOC // 28.6139° N, 77.2090° E
        </div>
      </div>
    </section>
  );
};

// --- Main Application ---

export default function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [cursorType, setCursorType] = useState("default");

  const { scrollYProgress } = useScroll({
    target: containerRef,
  });

  const scrollVelocity = useVelocity(scrollYProgress);
  const skew = useTransform(scrollVelocity, [-1, 1], [-5, 5]);
  const skewSpring = useSpring(skew, { damping: 20, stiffness: 100 });

  // Map vertical scroll progress to horizontal movement
  // We have 4 sections, each 100vw, SectionWork is dynamic though
  // Total width is roughly 400vw + Work gap
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-78%"]);
  const smoothX = useSpring(x, { damping: 15, stiffness: 60, mass: 0.5 });

  return (
    <CursorContext.Provider value={{ cursorType, setCursorType }}>
      <main className="relative bg-noir selection:bg-accent selection:text-noir text-white">
        <GrainOverlay />
        <CustomCursor />
        <Nav />

        {/* Scroll Container for Vertical to Horizontal Mapping */}
        <div className="h-[600vh] relative" ref={containerRef}>
          <div className="sticky top-0 h-screen overflow-hidden">
            <motion.div 
              style={{ x: smoothX, skewX: skewSpring }}
              className="flex h-full w-max cursor-none"
            >
              <SectionHero />
              <SectionWork />
              <SectionAbout />
              <Footer />
            </motion.div>
          </div>
        </div>
      </main>
    </CursorContext.Provider>
  );
}
