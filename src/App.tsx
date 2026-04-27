import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { MapPin, Phone, Clock, Star, Quote, Menu, X, ArrowRight, Instagram, Facebook, Utensils } from 'lucide-react';

const MENU_ITEMS = [
  { name: "Paneer Lababdar", price: "₹280", desc: "Rich tomato gravy with soft cottage cheese", icon: "🥘" },
  { name: "Dal Makhani", price: "₹240", desc: "Slow-cooked black lentils with butter and cream", icon: "🍲" },
  { name: "Veg Spring Roll", price: "₹200", desc: "Crispy rolls stuffed with fresh spiced veggies", icon: "🌯" },
  { name: "Baramati Kofta", price: "₹260", desc: "Delicate veg dumplings in royal cashew curry", icon: "🧆" },
  { name: "Soya Chaap", price: "₹220", desc: "Tandoori roasted soya chunks with mint chutney", icon: "🍢" },
  { name: "Hot Sizzling Brownie", price: "₹250", desc: "Warm chocolate brownie on a sizzler with ice cream", icon: "🧁" },
];

const REVIEWS = [
  { name: "Amit Sharma", text: "Best vegetarian fine dining in Bhusawal. The ambience is breathtaking and the Dal Makhani is to die for.", stars: 5 },
  { name: "Priya Patil", text: "Excellent pure veg restaurant! We loved the Baramati Kofta and the royal Indian decor.", stars: 5 },
  { name: "Rahul Deshmukh", text: "Great service and premium feel. Worth every penny for those special family occasions.", stars: 4 },
];

const AMBIENCE_IMAGES = [
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&q=80"
];

// --- Subcomponents ---

const LotusMandala = () => {
  return (
    <motion.svg 
      viewBox="0 0 100 100" 
      className="w-full h-full text-gold opacity-30 drop-shadow-[0_0_15px_rgba(197,160,89,0.5)]"
      animate={{ rotate: 360 }}
      transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
    >
      <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="0.5" />
      <circle cx="50" cy="50" r="41" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="1 2" />
      <g transform="translate(50, 50)">
        {[...Array(12)].map((_, i) => (
          <motion.path 
            key={i}
            d="M 0 -15 C 20 -35, 25 -45, 0 -48 C -25 -45, -20 -35, 0 -15 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.8"
            transform={`rotate(${i * 30})`}
          />
        ))}
        {[...Array(8)].map((_, i) => (
          <motion.path 
            key={i + 12}
            d="M 0 -5 C 10 -20, 15 -30, 0 -35 C -15 -30, -10 -20, 0 -5 Z"
            fill="currentColor"
            opacity="0.1"
            stroke="currentColor"
            strokeWidth="0.5"
            transform={`rotate(${i * 45 + 22.5})`}
          />
        ))}
      </g>
      <circle cx="50" cy="50" r="8" fill="currentColor" opacity="0.6" />
    </motion.svg>
  )
}

const Reveal = ({ children, delay = 0, className = "" }: { children: React.ReactNode, delay?: number, className?: string, key?: React.Key }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay, ease: [0.25, 0.25, 0, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

const TiltCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Smooth 3D tilt math limits rotation to ±15deg
    const rX = ((mouseY / height) - 0.5) * -30;
    const rY = ((mouseX / width) - 0.5) * 30;

    setRotateX(rX);
    setRotateY(rY);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { setRotateX(0); setRotateY(0); }}
      animate={{ rotateX, rotateY }}
      transition={{ type: 'spring', stiffness: 400, damping: 40 }}
      style={{ transformStyle: 'preserve-3d', perspective: 1200 }}
      className={`relative rounded-2xl glass ${className}`}
    >
      <div 
        style={{ transform: 'translateZ(60px)', transformStyle: 'preserve-3d' }} 
        className="h-full w-full pointer-events-none"
      >
        {children}
      </div>
    </motion.div>
  );
};

// --- Main App ---

export default function App() {
  const [navOpen, setNavOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);

  return (
    <div className="min-h-screen mesh-bg relative selection:bg-saffron selection:text-white">
      <div className="noise-overlay"></div>
      
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-black/40 backdrop-blur-md border-b border-gold/30 transition-all">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-display font-bold text-2xl text-gold tracking-widest leading-none">MANTRA</span>
            <span className="text-[10px] uppercase tracking-[0.3em] opacity-80 text-ivy">The Food Studio</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-xs font-semibold uppercase tracking-wider">
            {['About', 'Menu', 'Gallery', 'Reviews'].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="text-ivy hover:text-gold transition-colors">
                {item}
              </a>
            ))}
            <a href="https://www.zomato.com/" target="_blank" rel="noopener noreferrer" className="bg-gradient-to-r from-gold to-saffron text-black font-bold px-5 py-2 rounded-sm gold-glow">
              Order Online
            </a>
          </div>

          <button onClick={() => setNavOpen(!navOpen)} className="md:hidden text-gold">
            {navOpen ? <X /> : <Menu />}
          </button>
        </div>
        
        {/* Mobile Nav */}
        {navOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="md:hidden bg-black/60 border-t border-gold/20 px-6 py-4 flex flex-col gap-4"
          >
            {['About', 'Menu', 'Gallery', 'Reviews', 'Reserve'].map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase()}`} 
                onClick={() => setNavOpen(false)}
                className="text-ivy hover:text-gold text-lg font-display tracking-widest uppercase"
              >
                {item}
              </a>
            ))}
            <a 
              href="https://www.zomato.com/"
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gold hover:text-white text-lg font-display tracking-widest uppercase mt-4 border-t border-gold/20 pt-4"
            >
              Order Online
            </a>
          </motion.div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <motion.div style={{ y: heroY }} className="w-full h-full flex items-center justify-center opacity-30">
            <div className="w-[120vw] h-[120vw] md:w-[90vw] md:h-[90vw] max-w-[1000px] max-h-[1000px] absolute">
              <LotusMandala />
            </div>
          </motion.div>
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto space-y-6">
          <Reveal delay={0.2}>
            <div className="inline-flex items-center px-4 py-1.5 bg-white/10 rounded-full border border-white/20 mb-4">
              <span className="text-gold text-sm font-bold flex items-center gap-1"><Star className="w-3.5 h-3.5 fill-gold" /> 4.3</span>
              <span className="mx-3 w-1.5 h-1.5 bg-white/30 rounded-full"></span>
              <span className="text-[11px] text-white/60 font-semibold tracking-widest uppercase">573 Reviews</span>
            </div>
          </Reveal>
          
          <Reveal delay={0.3}>
            <h1 className="text-7xl md:text-8xl lg:text-9xl font-bold text-ivy drop-shadow-2xl font-display leading-tight">
              मंत्रा <span className="text-gold">The Food</span><br/>Studio
            </h1>
          </Reveal>
          
          <Reveal delay={0.4}>
            <p className="text-lg md:text-xl text-saffron font-medium tracking-wide italic mt-2">
              Pure Vegetarian Elegance • Bhusawal
            </p>
          </Reveal>
          
          <Reveal delay={0.5}>
            <p className="text-sm md:text-base text-white/70 leading-relaxed max-w-md mx-auto mt-6">
              Experience the intersection of ancient temple aesthetics and modern fine dining.
              Crafting artisanal pure-veg experiences since inception on Yawal Road.
            </p>
          </Reveal>
          
          <Reveal delay={0.6}>
            <div className="pt-8 flex flex-col md:flex-row items-center justify-center gap-6">
              <a href="tel:+917030577001" className="px-8 py-4 bg-transparent border-2 border-gold text-gold font-bold text-sm tracking-widest hover:bg-gold hover:text-black transition-all shadow-[0_0_20px_rgba(212,175,55,0.1)] inline-block">
                RESERVE A TABLE
              </a>
              <div className="text-xs opacity-60 font-mono text-center md:text-left">
                Open until 11:00 PM<br/>Yawal Road, Bhusawal
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <Reveal>
              <div className="space-y-8">
                <div className="inline-block border-b-2 border-saffron pb-2">
                  <h3 className="text-4xl md:text-5xl font-display font-bold text-ivy">A Pure Veg<br/>Philosophy</h3>
                </div>
                <p className="text-lg text-ivy/80 leading-relaxed font-sans font-light">
                  Located in the heart of Bhusawal near Tapi Steel, Mantra The Food Studio weaves together the rich heritage of Indian culinary traditions with a modern fine dining experience. Every dish is a testament to purity, crafted without meat or eggs, honoring the sacred sattvic balance.
                </p>
                <div className="flex items-center gap-4 text-saffron font-semibold">
                  <span>Price Range: ₹200–400 per person</span>
                  <div className="w-12 h-[1px] bg-saffron/50"></div>
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="relative rounded-t-full rounded-b-2xl overflow-hidden glass p-4 border-2 border-gold/30">
                <img 
                  src={AMBIENCE_IMAGES[0]} 
                  alt="Mantra Restaurant Ambience" 
                  className="w-full h-[500px] object-cover rounded-t-full rounded-b-xl opacity-90"
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section id="menu" className="py-24 px-6 relative">
        <div className="absolute inset-0 z-0 opacity-5 pointer-events-none">
           <LotusMandala />
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <Reveal>
            <div className="text-center mb-16">
              <h3 className="text-5xl font-display font-bold gold-text mb-2">Signature Curations</h3>
              <p className="text-saffron italic opacity-80">A glimpse into our royal kitchen</p>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {MENU_ITEMS.map((item, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <TiltCard className="p-6 h-full transition-colors pointer-events-auto">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-3xl filter drop-shadow-md">{item.icon}</span>
                  </div>
                  <h4 className="text-xl font-display font-bold mb-1 text-gold">{item.name}</h4>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs text-white/50 italic font-sans">{item.desc.substring(0,25)}...</span>
                    <span className="font-sans text-sm font-bold text-ivy">{item.price}</span>
                  </div>
                  <p className="text-ivy/70 text-sm leading-relaxed pb-4">{item.desc}</p>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Ambience Gallery Section */}
      <section id="gallery" className="py-24 px-6 relative bg-white/5 border-y border-gold/10">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <div className="text-center mb-16">
              <h3 className="text-5xl font-display font-bold text-ivy mb-2">The Ambience</h3>
              <p className="text-saffron italic opacity-80">Where Temple Carvings meet Modern Elegance</p>
            </div>
          </Reveal>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 auto-rows-[200px] md:auto-rows-[300px]">
            {AMBIENCE_IMAGES.slice(1).map((src, i) => (
              <Reveal 
                key={i} 
                delay={i * 0.1}
                className={i === 0 || i === 3 ? "col-span-2 row-span-2" : "col-span-1 row-span-1"}
              >
                <div className="w-full h-full relative group overflow-hidden rounded-2xl glass border-gold/20">
                  <img src={src} alt={`Ambience ${i}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-burgundy/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                    <Star className="text-gold w-6 h-6" />
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section id="reviews" className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <div className="flex flex-col items-center mb-16 text-center text-ivy">
              <Star className="text-gold w-10 h-10 mb-4" />
              <h3 className="text-5xl font-display font-bold">Voices of Delight</h3>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-8">
            {REVIEWS.map((review, i) => (
              <Reveal key={i} delay={i * 0.1} className="h-full">
                {/* Parchment Review style from Design HTML */}
                <div className="p-6 bg-saffron/10 border border-saffron/40 rounded-lg backdrop-blur-md h-full flex flex-col justify-between shadow-2xl">
                  <div>
                    <div className="text-[10px] font-bold text-saffron uppercase mb-3 flex items-center justify-between">
                      <span>Parchment Review</span>
                      <div className="flex gap-1">
                        {[...Array(review.stars)].map((_, j) => (
                          <Star key={j} className="w-3 h-3 fill-gold text-gold" />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm italic leading-snug font-display text-ivy/90">
                      "{review.text}"
                    </p>
                  </div>
                  <div className="mt-4 text-[11px] font-bold text-gold">— {review.name}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Reserve & Visit Section */}
      <section id="reserve" className="py-24 px-6 relative">
        <div className="max-w-5xl mx-auto glass rounded-xl p-8 md:p-12 border border-gold/20 shadow-[0_0_50px_rgba(212,175,55,0.05)] overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-saffron/5 rounded-full blur-3xl"></div>
          
          <div className="grid md:grid-cols-2 gap-12 relative z-10">
            <Reveal>
              <div className="space-y-8">
                <h3 className="text-4xl md:text-5xl font-display font-bold text-ivy">Reserve Your Table</h3>
                <p className="text-ivy/60 font-sans font-light">Join us for an unforgettable dining experience. Perfect for family dinners and special celebrations.</p>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-ivy/90">
                    <Phone className="text-gold w-5 h-5 flex-shrink-0" />
                    <span className="font-mono text-sm tracking-widest">070305 77001</span>
                  </div>
                  <div className="flex items-center gap-4 text-ivy/90">
                    <MapPin className="text-gold w-5 h-5 flex-shrink-0" />
                    <span className="text-sm font-light">Yawal Road, near Tapi Steel, Anil Nagar, Bhusawal, Maharashtra 425201</span>
                  </div>
                  <div className="flex items-center gap-4 text-ivy/90">
                    <Clock className="text-gold w-5 h-5 flex-shrink-0" />
                    <span className="text-sm font-light">Open Daily until 11:00 PM</span>
                  </div>
                </div>

                <div className="pt-4">
                  <a href="tel:+917030577001" className="px-8 py-3 bg-gradient-to-r from-gold to-saffron text-black font-bold text-sm tracking-widest hover:scale-105 transition-transform shadow-[0_0_15px_rgba(212,175,55,0.4)] flex items-center justify-center gap-2 group w-full md:w-auto rounded-sm">
                    CALL TO RESERVE
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.2} className="h-full min-h-[300px]">
              {/* Map Embed */}
              <div className="w-full h-full min-h-[300px] rounded-xl overflow-hidden border border-gold/40 shadow-2xl relative group bg-black/40">
                <iframe 
                  src="https://maps.google.com/maps?q=Mantra%20The%20Food%20Studio%2C%20Bhusawal&t=&z=15&ie=UTF8&iwloc=&output=embed" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0, position: 'absolute', inset: 0 }} 
                  allowFullScreen 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Mantra The Food Studio Location"
                ></iframe>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Footer (Dark Section style based on Design) */}
      <section className="px-8 py-6 bg-[#140101] border-t border-gold/20 flex flex-col md:flex-row justify-between items-center gap-6 z-20 relative">
        <div className="flex flex-col md:flex-row md:space-x-12 gap-6">
          <div className="flex flex-col items-center md:items-start">
            <span className="text-[10px] text-gold uppercase tracking-tighter mb-1">Location</span>
            <span className="text-[11px] text-white/60">Yawal Road, Near Tapi Steel, Anil Nagar, Bhusawal, Maharashtra 425201</span>
          </div>
          <div className="flex flex-col items-center md:items-start">
            <span className="text-[10px] text-gold uppercase tracking-tighter mb-1">Contact</span>
            <span className="text-[11px] text-white/60 font-mono">+91 70305 77001</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-6">
           <div className="flex -space-x-2">
             <div className="w-8 h-8 rounded-full border border-black bg-gray-800 overflow-hidden"><img src="https://i.pravatar.cc/32?u=1" alt="Avatar" /></div>
             <div className="w-8 h-8 rounded-full border border-black bg-gray-800 overflow-hidden"><img src="https://i.pravatar.cc/32?u=2" alt="Avatar" /></div>
             <div className="w-8 h-8 rounded-full border border-black bg-gold flex items-center justify-center text-[10px] font-bold text-black">+5k</div>
           </div>
           <span className="text-xs italic opacity-70 font-sans hidden md:block">"The best Veg Sizzlers in North Maharashtra"</span>
        </div>

        <div className="flex space-x-4 opacity-40">
           <a href="#" className="w-6 h-6 border border-white rounded-full flex items-center justify-center text-[10px] hover:text-gold hover:border-gold transition-colors"><Instagram className="w-3 h-3" /></a>
           <a href="#" className="w-6 h-6 border border-white rounded-full flex items-center justify-center text-[10px] hover:text-gold hover:border-gold transition-colors"><Facebook className="w-3 h-3" /></a>
        </div>
      </section>
    </div>
  );
}
