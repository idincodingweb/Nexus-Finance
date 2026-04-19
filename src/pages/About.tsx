import { motion } from "framer-motion";
import { Code2, Database, Sparkles, Zap, Terminal, Smartphone } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// JEBRED! Ini link foto lo sebagai Developer Masterpiece
const DEVELOPER_PHOTO = "https://drive.google.com/thumbnail?id=13fXcB10QDpPuhrTEKo286YOyiq_bnXgO&sz=w800";

const highlights = [
  { icon: Smartphone, title: "Mobile Built", desc: "Dikoding 100% via Termux di Smartphone" },
  { icon: Terminal, title: "Fullstack GAS", desc: "Google Apps Script sebagai Core API" },
  { icon: Code2, title: "Modern Tech", desc: "React + TypeScript + Tailwind CSS" },
];

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header Minimalist */}
      <header className="relative overflow-hidden bg-slate-900 py-16 md:py-24">
        <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:30px_30px]" />
        </div>
        
        <div className="container relative mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 mb-6 shadow-lg shadow-blue-900/40">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-4xl font-black tracking-tight text-white md:text-6xl">Meet The Maker</h1>
            <p className="text-slate-400 mt-4 text-lg font-medium">Di balik layar pengembangan Nexus Finance</p>
          </motion.div>
        </div>
      </header>

      <div className="container mx-auto -mt-20 max-w-3xl space-y-8 px-4 pb-24">
        {/* DEVELOPER PROFILE CARD - ANTI MENYON */}
        <motion.section
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="rounded-[45px] bg-card p-10 text-center shadow-2xl border border-border/50 relative overflow-hidden"
        >
          <div className="relative z-10">
            <div className="mx-auto w-36 h-36 md:w-44 md:h-44 rounded-full border-[6px] border-blue-600 p-1 bg-background shadow-2xl mb-8">
                <Avatar className="h-full w-full border-none rounded-full overflow-hidden">
                    <AvatarImage 
                        src={DEVELOPER_PHOTO} 
                        alt="Idin Iskandar"
                        className="object-cover aspect-square" // KUNCINYA DI SINI SENIOR!
                    />
                    <AvatarFallback className="bg-slate-100 text-3xl font-black text-blue-600">II</AvatarFallback>
                </Avatar>
            </div>
            
            <h2 className="text-3xl font-black tracking-tighter text-foreground md:text-4xl">
                Idin Iskandar, S.Kom
            </h2>
            <p className="mt-2 text-sm font-bold uppercase tracking-[0.3em] text-blue-600">
                Software Engineer & Cloud Architect
            </p>
            
            <div className="mx-auto mt-8 h-1 w-16 rounded-full bg-slate-200 dark:bg-slate-800" />
            
            <p className="mt-8 text-base md:text-lg leading-relaxed text-muted-foreground font-medium italic">
                "Mendedikasikan diri untuk membuktikan bahwa batasan perangkat bukan penghalang untuk melahirkan karya digital yang berkelas."
            </p>
          </div>
        </motion.section>

        {/* THE STORY - REWRITTEN CONTENT */}
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-[40px] bg-slate-900 p-8 md:p-12 text-white shadow-xl relative overflow-hidden"
        >
          {/* Decorative background for story */}
          <div className="absolute top-0 right-0 p-10 opacity-5">
             <Terminal className="w-40 h-40" />
          </div>

          <div className="flex items-center gap-2 mb-6">
             <div className="h-2 w-8 bg-blue-500 rounded-full" />
             <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">The Journey</span>
          </div>
          
          <h3 className="text-2xl font-black leading-tight md:text-3xl mb-8">
            Kenapa saya membangun sistem ini?
          </h3>
          
          <div className="space-y-6 text-slate-300 leading-relaxed text-base md:text-lg">
            <p>
              Proyek <span className="text-white font-bold">Nexus Finance</span> lahir dari sebuah tantangan teknis yang ambisius: Membangun ekosistem aplikasi keuangan yang modern, aman, dan <i>multi-user</i>, namun dikerjakan sepenuhnya di atas perangkat <b>Smartphone</b>.
            </p>
            <p>
              Melalui lingkungan <b>Termux</b>, saya meracik arsitektur yang menggabungkan kecepatan <b>React JS</b> di sisi antarmuka dan fleksibilitas <b>Google Apps Script</b> sebagai mesin pengolah data (API).
            </p>
            <p>
              Hasilnya bukan sekadar aplikasi pencatat uang, melainkan sebuah demonstrasi bahwa dengan pemahaman logika yang kuat, kita bisa mengubah alat komunikasi harian menjadi mesin produksi perangkat lunak yang mumpuni.
            </p>
          </div>
        </motion.article>

        {/* Core Philosophy Highlights */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {highlights.map((h, i) => (
            <motion.div
              key={h.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + (i * 0.1) }}
              className="rounded-3xl bg-card p-6 border border-border/50 text-center hover:border-blue-500/50 transition-all"
            >
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 mb-4">
                <h.icon className="h-6 w-6" />
              </div>
              <p className="text-xs font-black text-foreground uppercase tracking-tighter">{h.title}</p>
              <p className="mt-2 text-[11px] text-muted-foreground leading-relaxed font-medium">{h.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="pt-12 text-center">
            <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.4em] opacity-50">
                Nexus Finance v3.0 • Product by Idin Iskandar
            </p>
        </div>
      </div>
    </div>
  );
};

export default About;