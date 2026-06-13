import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Home,
  Search,
  ChefHat,
  ShoppingCart,
  Clock,
  Star,
  Plus,
  X,
  Heart,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  Zap,
  CheckSquare,
  Square,
  Leaf,
  TrendingDown,
  RefreshCw,
  MoreVertical,
  Flame,
  Users,
  Package,
  ArrowRight,
  Bell,
} from "lucide-react";

/* MARKER-MAKE-KIT-INVOKED */

// ─── image constants ────────────────────────────────────────────────────────
const IMG = {
  poha: "https://images.unsplash.com/photo-1592457711340-2412dc07b733?w=400&h=300&fit=crop&auto=format",
  palak: "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&h=300&fit=crop&auto=format",
  tandoori: "https://images.unsplash.com/photo-1617692855027-33b14f061079?w=400&h=300&fit=crop&auto=format",
  dal: "https://images.unsplash.com/photo-1680993032090-1ef7ea9b51e5?w=400&h=300&fit=crop&auto=format",
  upma: "https://images.unsplash.com/photo-1665660710687-b44c50751054?w=400&h=300&fit=crop&auto=format",
  spices: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=300&fit=crop&auto=format",
};

// ─── data ────────────────────────────────────────────────────────────────────
const TODAY_MEALS = [
  { id: "poha",     label: "Breakfast", title: "Poha with Peanuts & Kanda",          time: "10", rating: "4.8", cal: 280, serves: 2, img: IMG.poha,     cookSteps: ["poha","palak","tandoori","dal","upma"] },
  { id: "palak",    label: "Lunch",     title: "Palak Paneer with Tawa Roti",         time: "20", rating: "4.6", cal: 420, serves: 2, img: IMG.palak,    cookSteps: ["palak","tandoori","poha","dal","upma"] },
  { id: "tandoori", label: "Dinner",    title: "Tandoori Chicken Tacos (Soya Fusion)",time: "15", rating: "4.7", cal: 380, serves: 2, img: IMG.tandoori, cookSteps: ["tandoori","palak","poha","dal","upma"] },
];

const QUICK_MEALS = [
  { id: "dal",  title: "Dal Tadka with Jeera Rice",            time: "18", rating: "4.9", img: IMG.dal,  desc: "Comfort in a bowl — the ultimate Indian weeknight dinner. Rich, golden, perfectly spiced." },
  { id: "upma", title: "Upma with Cashews & Curry Leaves",     time: "12", rating: "4.5", img: IMG.upma, desc: "South Indian classic, on the table before your delivery app even loads." },
];

const PACKS = [
  { id: "warrior", title: "Weekday Warrior Pack", count: 3, img: IMG.spices, tag: "Budget Friendly",  meals: TODAY_MEALS },
  { id: "zero",    title: "Zero-Waste Week Pack", count: 5, img: IMG.palak,  tag: "Zero Waste",      meals: TODAY_MEALS },
  { id: "quick",   title: "15-Min Blitz Pack",    count: 4, img: IMG.poha,   tag: "Speed Cooking",   meals: [...TODAY_MEALS].reverse() },
];

const COOK_STEPS = [
  { img: IMG.spices,   text: "Toast 1 tsp mustard seeds and 1 tsp cumin in 1 tbsp oil over medium heat until they begin to pop — about 30 seconds. This is the tempering base that defines the entire dish." },
  { img: IMG.poha,     text: "Add 1 large red onion, thinly sliced. Cook 4–5 minutes until soft and translucent, stirring often. Season lightly with salt to speed up the process." },
  { img: IMG.dal,      text: "Add 1 green chilli, slit lengthwise, and a small handful of fresh curry leaves. Stir for 30 seconds — the curry leaves will crackle and perfume the oil beautifully." },
  { img: IMG.upma,     text: "Rinse 2 cups of poha under cold water in a sieve. Shake well — you want it damp but not waterlogged. Let it sit for 2 minutes to soften evenly." },
  { img: IMG.palak,    text: "Add the poha to the pan. Fold gently until every flake is coated in the tempered oil. Add ½ tsp turmeric, salt to taste, and 1 tsp sugar. Toss to combine." },
  { img: IMG.tandoori, text: "Add ¼ cup roasted peanuts. Squeeze half a lemon over the top and toss again. Serve immediately, garnished with fresh coriander and thin slices of raw onion." },
];

type Screen = "home" | "cook" | "grocery";
type HomeTab = "timeline" | "packs" | "sidekick";

// ─── tiny primitives ──────────────────────────────────────────────────────────

function Pill({ children, yellow }: { children: React.ReactNode; yellow?: boolean }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 3,
      padding: "3px 8px", borderRadius: 99,
      background: yellow ? "#FFD200" : "#F0F0F0",
      fontSize: 11, fontWeight: 600,
      color: yellow ? "#1A1A1A" : "#555",
    }}>
      {children}
    </span>
  );
}

function SectionHeader({ title, onSeeAll }: { title: string; onSeeAll?: () => void }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, paddingInline: 18 }}>
      <h2 style={{ fontSize: 19, fontWeight: 800, color: "#1A1A1A", margin: 0, letterSpacing: "-0.02em" }}>{title}</h2>
      {onSeeAll && (
        <button onClick={onSeeAll} style={{ fontSize: 13, color: "#888", fontWeight: 600, background: "none", border: "none", cursor: "pointer", padding: 0 }}>
          See all <ChevronRight size={12} style={{ display: "inline", verticalAlign: "middle" }} />
        </button>
      )}
    </div>
  );
}

// ─── RecipeCard (horizontal scroll item) ─────────────────────────────────────

function RecipeCard({
  label, title, time, rating, img, onClick,
}: {
  label: string; title: string; time: string; rating: string; img: string; onClick?: () => void;
}) {
  const [liked, setLiked] = useState(false);
  return (
    <div
      onClick={onClick}
      style={{
        width: 158, flexShrink: 0,
        background: "#fff", borderRadius: 16,
        overflow: "hidden",
        boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
        cursor: "pointer",
      }}
    >
      {/* photo */}
      <div style={{ height: 118, position: "relative", background: "#F0F0F0", overflow: "hidden" }}>
        <img src={img} alt={title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        {/* meal badge */}
        <span style={{
          position: "absolute", top: 8, left: 8,
          padding: "3px 9px", borderRadius: 99,
          background: "#FFD200", fontSize: 10, fontWeight: 700, color: "#1A1A1A",
        }}>
          {label}
        </span>
        {/* heart */}
        <button
          onClick={(e) => { e.stopPropagation(); setLiked(v => !v); }}
          style={{
            position: "absolute", top: 8, right: 8,
            width: 27, height: 27, borderRadius: 99,
            background: "rgba(255,255,255,0.88)",
            border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
          }}
        >
          <Heart size={13} color={liked ? "#ff4d4d" : "#999"} fill={liked ? "#ff4d4d" : "none"} />
        </button>
      </div>

      {/* info */}
      <div style={{ padding: "10px 11px 13px" }}>
        <p style={{ fontSize: 12, fontWeight: 700, color: "#1A1A1A", margin: "0 0 7px", lineHeight: 1.35, minHeight: 32 }}>
          {title}
        </p>
        <div style={{ display: "flex", gap: 5 }}>
          <Pill><Clock size={9} strokeWidth={2.5} /> {time}m</Pill>
          <Pill><Star size={9} strokeWidth={2.5} fill="#FFD200" color="#FFD200" /> {rating}</Pill>
        </div>
      </div>
    </div>
  );
}

// ─── FeaturedCard (wide, carousel) ────────────────────────────────────────────

function FeaturedCard({ title, desc, time, rating, img, index, total }: {
  title: string; desc: string; time: string; rating: string; img: string; index: number; total: number;
}) {
  return (
    <div style={{
      borderRadius: 18, overflow: "hidden", flexShrink: 0,
      width: "calc(100vw - 52px)", maxWidth: 378,
      background: "#fff",
      boxShadow: "0 4px 20px rgba(0,0,0,0.09)",
      position: "relative",
    }}>
      {/* photo */}
      <div style={{ height: 190, background: "#F0F0F0", position: "relative", overflow: "hidden" }}>
        <img src={img} alt={title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        {/* gradient overlay */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 55%)",
        }} />
        {/* title on photo */}
        <div style={{ position: "absolute", bottom: 12, left: 14, right: 14 }}>
          <p style={{ fontSize: 15, fontWeight: 800, color: "#fff", margin: "0 0 6px", lineHeight: 1.3 }}>{title}</p>
          <div style={{ display: "flex", gap: 6 }}>
            <span style={{ padding: "3px 9px", borderRadius: 99, background: "rgba(255,255,255,0.18)", fontSize: 11, fontWeight: 600, color: "#fff", backdropFilter: "blur(6px)" }}>
              <Clock size={9} style={{ display: "inline", verticalAlign: "middle", marginRight: 3 }} />{time}m
            </span>
            <span style={{ padding: "3px 9px", borderRadius: 99, background: "#FFD200", fontSize: 11, fontWeight: 700, color: "#1A1A1A" }}>
              <Star size={9} style={{ display: "inline", verticalAlign: "middle", marginRight: 3 }} fill="#1A1A1A" color="#1A1A1A" />{rating}
            </span>
          </div>
        </div>
      </div>
      {/* desc */}
      <div style={{ padding: "12px 14px 14px" }}>
        <p style={{ fontSize: 12, color: "#555", margin: 0, lineHeight: 1.6 }}>{desc}</p>
      </div>
      {/* dots */}
      <div style={{ position: "absolute", top: 10, right: 12, display: "flex", gap: 4 }}>
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} style={{ width: i === index ? 14 : 5, height: 5, borderRadius: 99, background: i === index ? "#FFD200" : "rgba(255,255,255,0.5)", transition: "width 0.2s" }} />
        ))}
      </div>
    </div>
  );
}

// ─── PackCard ─────────────────────────────────────────────────────────────────

function PackCard({ title, count, img, tag, onClick }: {
  title: string; count: number; img: string; tag: string; onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      style={{
        borderRadius: 16, overflow: "hidden", flexShrink: 0,
        width: 158, background: "#fff",
        boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
        cursor: "pointer",
      }}
    >
      <div style={{ height: 100, background: "#F0F0F0", position: "relative", overflow: "hidden" }}>
        <img src={img} alt={title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 55%)",
        }} />
        <span style={{ position: "absolute", bottom: 8, left: 8, fontSize: 10, fontWeight: 700, color: "#fff", opacity: 0.9 }}>
          {count} recipes
        </span>
      </div>
      <div style={{ padding: "10px 11px 13px" }}>
        <p style={{ fontSize: 12, fontWeight: 700, color: "#1A1A1A", margin: "0 0 6px", lineHeight: 1.35 }}>{title}</p>
        <Pill yellow>{tag}</Pill>
      </div>
    </div>
  );
}

// ─── RecipeDetailSheet ────────────────────────────────────────────────────────

function RecipeDetailSheet({
  pack, onClose, onCook,
}: {
  pack: typeof PACKS[0];
  onClose: () => void;
  onCook: () => void;
}) {
  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", damping: 28, stiffness: 300 }}
      style={{
        position: "absolute", inset: 0, background: "#fff", zIndex: 60,
        display: "flex", flexDirection: "column", overflow: "hidden",
      }}
    >
      {/* hero */}
      <div style={{ height: 220, background: "#F0F0F0", position: "relative", flexShrink: 0, overflow: "hidden" }}>
        <img src={pack.img} alt={pack.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 50%)" }} />
        {/* close */}
        <button
          onClick={onClose}
          style={{
            position: "absolute", top: 14, right: 14,
            width: 32, height: 32, borderRadius: 99,
            background: "rgba(255,255,255,0.88)", border: "none",
            display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
          }}
        >
          <X size={15} color="#1A1A1A" />
        </button>
        {/* tag */}
        <div style={{ position: "absolute", bottom: 14, left: 16 }}>
          <span style={{ padding: "4px 11px", borderRadius: 99, background: "#FFD200", fontSize: 11, fontWeight: 700, color: "#1A1A1A" }}>
            {pack.tag}
          </span>
        </div>
      </div>

      {/* content */}
      <div style={{ flex: 1, overflowY: "auto", padding: "18px 18px 100px" }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: "#1A1A1A", margin: "0 0 5px", letterSpacing: "-0.02em" }}>{pack.title}</h2>
        <div style={{ display: "flex", gap: 8, marginBottom: 22 }}>
          <Pill><Package size={9} /> {pack.count} Meals</Pill>
          <Pill>₹420 / day</Pill>
          <Pill><Leaf size={9} color="#22c55e" /> Zero Waste</Pill>
        </div>

        {/* recipe list */}
        <div style={{ display: "flex", flexDirection: "column", gap: 1, borderRadius: 14, overflow: "hidden", border: "1px solid #EAEAEA" }}>
          {pack.meals.map((m, i) => (
            <div key={m.id} style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "12px 14px",
              background: "#fff",
              borderBottom: i < pack.meals.length - 1 ? "1px solid #F5F5F5" : "none",
            }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, overflow: "hidden", flexShrink: 0, background: "#F0F0F0" }}>
                <img src={m.img} alt={m.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: "#1A1A1A", margin: "0 0 4px", lineHeight: 1.3 }}>{m.title}</p>
                <div style={{ display: "flex", gap: 5 }}>
                  <Pill><Clock size={9} /> {m.time}m</Pill>
                  <Pill><Users size={9} /> {m.serves}</Pill>
                  <Pill><Flame size={9} /> {m.cal}</Pill>
                </div>
              </div>
              <ChevronRight size={15} color="#CCC" />
            </div>
          ))}
        </div>

        {/* ingredient teaser */}
        <div style={{ marginTop: 18, padding: "14px 16px", background: "#FFFBEB", borderRadius: 12, border: "1px solid #FFD200" }}>
          <p style={{ fontSize: 11, fontWeight: 800, color: "#1A1A1A", margin: "0 0 4px", letterSpacing: "0.04em", textTransform: "uppercase" }}>
            Ingredients consolidated
          </p>
          <p style={{ fontSize: 12, color: "#555", margin: 0, lineHeight: 1.6 }}>
            Poha · Basmati Rice · Red Onions · Palak · Paneer · Chicken / Soya · Curry Leaves · Mustard Seeds · Turmeric
          </p>
        </div>
      </div>

      {/* CTA */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "14px 18px 28px", background: "#fff", borderTop: "1px solid #EAEAEA" }}>
        <button
          onClick={onCook}
          style={{
            width: "100%", padding: "15px 0",
            borderRadius: 14, border: "none",
            background: "#FFD200", color: "#1A1A1A",
            fontSize: 15, fontWeight: 800, cursor: "pointer",
            letterSpacing: "-0.01em",
            boxShadow: "0 4px 20px rgba(255,210,0,0.35)",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          }}
        >
          <Zap size={16} /> GO TO COOK MODE
        </button>
      </div>
    </motion.div>
  );
}

// ─── HomeScreen ────────────────────────────────────────────────────────────────

function HomeScreen({
  onOpenPack, onCookMeal,
}: {
  onOpenPack: (pack: typeof PACKS[0]) => void;
  onCookMeal: (mealId: string) => void;
}) {
  const [tab, setTab] = useState<HomeTab>("timeline");
  const [featuredIdx, setFeaturedIdx] = useState(0);
  const featuredRef = useRef<HTMLDivElement>(null);

  const TOP_TABS: { id: HomeTab; label: string }[] = [
    { id: "timeline", label: "Timeline" },
    { id: "packs",    label: "Packs" },
    { id: "sidekick", label: "Sidekick AI" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflowY: "auto" }}>
      {/* header */}
      <div style={{ padding: "16px 18px 0", background: "#F9F9F9", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <div>
            <p style={{ fontSize: 12, color: "#888", margin: 0, fontWeight: 500 }}>Good morning, Chef 👋</p>
            <div style={{ display: "flex", alignItems: "center", gap: 7, marginTop: 2 }}>
              <h1 style={{ fontSize: 22, fontWeight: 800, color: "#1A1A1A", margin: 0, letterSpacing: "-0.03em" }}>
                Sidekick AI
              </h1>
              <span style={{
                padding: "3px 9px", borderRadius: 99, background: "#FFD200",
                fontSize: 9, fontWeight: 800, color: "#1A1A1A", letterSpacing: "0.08em", textTransform: "uppercase",
              }}>
                Indian Edition
              </span>
            </div>
          </div>
          <button style={{ width: 38, height: 38, borderRadius: 12, background: "#fff", border: "1px solid #EAEAEA", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <Bell size={17} color="#555" />
          </button>
        </div>

        {/* top tabs */}
        <div style={{ display: "flex", gap: 6, marginBottom: 0, paddingBottom: 14, borderBottom: "1px solid #EAEAEA" }}>
          {TOP_TABS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              style={{
                padding: "7px 14px", borderRadius: 99, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 700,
                background: tab === id ? "#1A1A1A" : "#EFEFEF",
                color: tab === id ? "#fff" : "#666",
                transition: "all 0.15s",
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* tab content */}
      <div style={{ flex: 1, overflowY: "auto", paddingBottom: 20 }}>
        <AnimatePresence mode="wait">
          {tab === "timeline" && (
            <motion.div key="timeline" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>

              {/* Day context banner */}
              <div style={{ margin: "16px 18px 22px", background: "#FFD200", borderRadius: 16, padding: "14px 16px", display: "flex", gap: 12, alignItems: "flex-start", boxShadow: "0 4px 18px rgba(255,210,0,0.28)" }}>
                <div style={{ width: 34, height: 34, borderRadius: 10, background: "#1A1A1A", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Zap size={15} color="#FFD200" />
                </div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 800, color: "#1A1A1A", margin: "0 0 3px" }}>Day Context: Hectic Workday</p>
                  <p style={{ fontSize: 11, color: "#1A1A1A", opacity: 0.68, margin: 0, lineHeight: 1.5 }}>AI has auto-optimised your plan for the fastest 15-minute prep variations.</p>
                </div>
              </div>

              {/* Today's B/L/D */}
              <SectionHeader title="Today's B · L · D" onSeeAll={() => {}} />
              <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingInline: 18, paddingBottom: 4, scrollSnapType: "x mandatory" }}
                className="hide-scrollbar">
                {TODAY_MEALS.map((m) => (
                  <div key={m.id} style={{ scrollSnapAlign: "start" }}>
                    <RecipeCard label={m.label} title={m.title} time={m.time} rating={m.rating} img={m.img} onClick={() => onCookMeal(m.id)} />
                  </div>
                ))}
              </div>

              {/* 15 min prep wins */}
              <div style={{ margin: "26px 0 0" }}>
                <SectionHeader title="15 Min Prep Wins" />
                {/* featured carousel */}
                <div
                  ref={featuredRef}
                  onScroll={(e) => {
                    const el = e.currentTarget;
                    const idx = Math.round(el.scrollLeft / (el.scrollWidth / QUICK_MEALS.length));
                    setFeaturedIdx(Math.max(0, Math.min(idx, QUICK_MEALS.length - 1)));
                  }}
                  style={{ display: "flex", gap: 12, overflowX: "auto", paddingInline: 18, scrollSnapType: "x mandatory" }}
                  className="hide-scrollbar"
                >
                  {QUICK_MEALS.map((m, i) => (
                    <div key={m.id} style={{ scrollSnapAlign: "start", flexShrink: 0 }}>
                      <FeaturedCard title={m.title} desc={m.desc} time={m.time} rating={m.rating} img={m.img} index={i} total={QUICK_MEALS.length} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Packs */}
              <div style={{ marginTop: 26 }}>
                <SectionHeader title="AI Meal Packs" onSeeAll={() => setTab("packs")} />
                <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingInline: 18 }} className="hide-scrollbar">
                  {PACKS.map((p) => (
                    <PackCard key={p.id} title={p.title} count={p.count} img={p.img} tag={p.tag} onClick={() => onOpenPack(p)} />
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {tab === "packs" && (
            <motion.div key="packs" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
              <div style={{ padding: "16px 18px 0" }}>
                <p style={{ fontSize: 12, color: "#888", margin: "0 0 14px" }}>Curated meal packs — all ingredients consolidated, zero waste guaranteed.</p>
              </div>
              {PACKS.map((p) => (
                <div key={p.id} onClick={() => onOpenPack(p)} style={{ margin: "0 18px 14px", borderRadius: 18, overflow: "hidden", background: "#fff", boxShadow: "0 2px 12px rgba(0,0,0,0.07)", cursor: "pointer" }}>
                  <div style={{ height: 140, background: "#F0F0F0", position: "relative", overflow: "hidden" }}>
                    <img src={p.img} alt={p.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 55%)" }} />
                    <span style={{ position: "absolute", top: 10, left: 12, padding: "4px 11px", borderRadius: 99, background: "#FFD200", fontSize: 11, fontWeight: 700, color: "#1A1A1A" }}>{p.tag}</span>
                    <span style={{ position: "absolute", bottom: 10, left: 12, fontSize: 18, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>{p.title}</span>
                  </div>
                  <div style={{ padding: "12px 14px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <Pill><Package size={9} /> {p.count} meals</Pill>
                      <Pill><Leaf size={9} color="#22c55e" /> Zero Waste</Pill>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 700, color: "#1A1A1A" }}>
                      View <ArrowRight size={13} />
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {tab === "sidekick" && (
            <motion.div key="sidekick" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
              <div style={{ padding: "16px 18px" }}>
                {/* AI insights */}
                {[
                  { label: "Prep Time Saved", val: "47 min/day", sub: "vs manual planning", color: "#FFD200" },
                  { label: "Budget Efficiency", val: "₹420/day", sub: "↑ 35% optimised" , color: "#22c55e" },
                  { label: "Nutrition Score",   val: "84 / 100", sub: "Balanced macros",   color: "#3b82f6" },
                  { label: "Waste Reduction",   val: "0 g wasted", sub: "Across 3 days",  color: "#a855f7" },
                ].map((item) => (
                  <div key={item.label} style={{ background: "#fff", borderRadius: 14, padding: "14px 16px", marginBottom: 10, display: "flex", alignItems: "center", gap: 14, boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>
                    <div style={{ width: 4, height: 40, borderRadius: 99, background: item.color, flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 12, fontWeight: 600, color: "#1A1A1A", margin: 0 }}>{item.label}</p>
                      <p style={{ fontSize: 11, color: "#888", margin: "2px 0 0" }}>{item.sub}</p>
                    </div>
                    <span style={{ fontSize: 16, fontWeight: 800, color: "#1A1A1A", fontFamily: "'DM Mono', monospace" }}>{item.val}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── CookScreen ───────────────────────────────────────────────────────────────

function CookScreen({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(true);

  const current = COOK_STEPS[step];
  const total = COOK_STEPS.length;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "#fff" }}>
      {/* photo (top ~46% of screen) */}
      <div style={{ position: "relative", height: "46%", flexShrink: 0, background: "#111", overflow: "hidden" }}>
        <AnimatePresence mode="wait">
          <motion.img
            key={step}
            src={current.img}
            alt={`Step ${step + 1}`}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.3 }}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </AnimatePresence>

        {/* gradient */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, transparent 40%, rgba(0,0,0,0.3) 100%)" }} />

        {/* step counter top-left */}
        <div style={{ position: "absolute", top: 16, left: 18 }}>
          <span style={{ fontSize: 34, fontWeight: 800, color: "#fff", letterSpacing: "-0.04em", lineHeight: 1 }}>
            {step + 1}
          </span>
          <span style={{ fontSize: 16, fontWeight: 600, color: "rgba(255,255,255,0.6)", marginLeft: 3 }}>
            /{total}
          </span>
        </div>

        {/* close top-right */}
        <button
          onClick={onClose}
          style={{ position: "absolute", top: 16, right: 16, width: 32, height: 32, borderRadius: 99, background: "rgba(0,0,0,0.35)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
        >
          <X size={15} color="#fff" />
        </button>

        {/* progress bar */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, background: "rgba(255,255,255,0.2)" }}>
          <div style={{ height: "100%", width: `${((step + 1) / total) * 100}%`, background: "#FFD200", transition: "width 0.3s" }} />
        </div>
      </div>

      {/* bottom panel */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "0 18px" }}>
        {/* controls */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, padding: "16px 0 14px", borderBottom: "1px solid #F0F0F0" }}>
          {/* back */}
          <button
            onClick={() => setStep(s => Math.max(0, s - 1))}
            disabled={step === 0}
            style={{ width: 40, height: 40, borderRadius: 99, border: "1.5px solid #E0E0E0", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: step === 0 ? "not-allowed" : "pointer", opacity: step === 0 ? 0.4 : 1 }}
          >
            <ChevronLeft size={18} color="#1A1A1A" />
          </button>

          {/* play/pause */}
          <button
            onClick={() => setPlaying(v => !v)}
            style={{ width: 40, height: 40, borderRadius: 99, border: "1.5px solid #E0E0E0", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
          >
            {playing ? <Pause size={16} color="#1A1A1A" /> : <Play size={16} color="#1A1A1A" />}
          </button>

          {/* view recipe CTA */}
          <button style={{ padding: "10px 20px", borderRadius: 99, border: "none", background: "#FFD200", fontSize: 12, fontWeight: 800, color: "#1A1A1A", cursor: "pointer", letterSpacing: "0.01em" }}>
            VIEW RECIPE
          </button>

          {/* next */}
          <button
            onClick={() => setStep(s => Math.min(total - 1, s + 1))}
            disabled={step === total - 1}
            style={{ width: 40, height: 40, borderRadius: 99, border: "1.5px solid #E0E0E0", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: step === total - 1 ? "not-allowed" : "pointer", opacity: step === total - 1 ? 0.4 : 1 }}
          >
            <ChevronRight size={18} color="#1A1A1A" />
          </button>
        </div>

        {/* step thumbnails */}
        <div style={{ display: "flex", gap: 8, paddingBlock: 14, justifyContent: "center", borderBottom: "1px solid #F0F0F0" }}>
          {COOK_STEPS.map((s, i) => (
            <button
              key={i}
              onClick={() => setStep(i)}
              style={{
                width: i === step ? 38 : 32,
                height: i === step ? 38 : 32,
                borderRadius: 99,
                overflow: "hidden",
                flexShrink: 0,
                border: i === step ? "2.5px solid #FFD200" : "2.5px solid transparent",
                cursor: "pointer",
                padding: 0,
                transition: "all 0.18s",
                boxShadow: i === step ? "0 0 0 2px rgba(255,210,0,0.4)" : "none",
              }}
            >
              <img src={s.img} alt={`step ${i + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </button>
          ))}
        </div>

        {/* instruction text */}
        <div style={{ flex: 1, overflowY: "auto", paddingTop: 14 }}>
          <AnimatePresence mode="wait">
            <motion.p
              key={step}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              style={{ fontSize: 15, color: "#222", lineHeight: 1.7, margin: 0, fontWeight: 400 }}
            >
              {current.text}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// ─── GroceryScreen ────────────────────────────────────────────────────────────

type GItem = { label: string; checked: boolean };
type GSection = { category: string; color: string; items: GItem[] };

const INITIAL_GROCERY: GSection[] = [
  { category: "Grains & Legumes", color: "#FFD200", items: [
    { label: "Basmati Rice (1 kg)", checked: false },
    { label: "Tur Dal (500 g)", checked: false },
    { label: "Poha (500 g)", checked: true },
  ]},
  { category: "Fresh Produce", color: "#22c55e", items: [
    { label: "Red Onions (3 kg)", checked: false },
    { label: "Curry Leaves (2 bunches)", checked: true },
    { label: "Fresh Palak (2 bunches)", checked: false },
    { label: "Lemons (3)", checked: false },
  ]},
  { category: "Dairy & Proteins", color: "#3b82f6", items: [
    { label: "Fresh Paneer (400 g)", checked: false },
    { label: "Chicken Breast or Soya Chunks (1 kg)", checked: false },
  ]},
];

function GroceryScreen() {
  const [sections, setSections] = useState<GSection[]>(INITIAL_GROCERY);

  const toggle = (si: number, ii: number) => {
    setSections(prev => prev.map((sec, s) => s !== si ? sec : {
      ...sec,
      items: sec.items.map((item, i) => i !== ii ? item : { ...item, checked: !item.checked }),
    }));
  };

  const total = sections.reduce((a, s) => a + s.items.length, 0);
  const done  = sections.reduce((a, s) => a + s.items.filter(i => i.checked).length, 0);
  const pct   = Math.round((done / total) * 100);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflowY: "auto" }}>
      {/* header */}
      <div style={{ padding: "20px 18px 0", flexShrink: 0 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: "#1A1A1A", margin: "0 0 3px", letterSpacing: "-0.03em" }}>Shopping List</h1>
        <p style={{ fontSize: 12, color: "#888", margin: "0 0 14px", fontWeight: 500 }}>Zero-Waste Engine · 3-day plan</p>
        {/* progress */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
          <div style={{ flex: 1, height: 5, borderRadius: 99, background: "#EBEBEB", overflow: "hidden" }}>
            <motion.div animate={{ width: `${pct}%` }} transition={{ duration: 0.35 }} style={{ height: "100%", borderRadius: 99, background: "#FFD200" }} />
          </div>
          <span style={{ fontSize: 11, fontWeight: 700, color: "#1A1A1A", fontFamily: "'DM Mono', monospace" }}>{done}/{total}</span>
        </div>
      </div>

      {/* sections */}
      <div style={{ flex: 1, overflowY: "auto", padding: "0 18px 30px" }}>
        {sections.map((sec, si) => (
          <div key={sec.category} style={{ background: "#fff", borderRadius: 16, marginBottom: 12, overflow: "hidden", boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>
            {/* section header */}
            <div style={{ padding: "11px 16px", background: "#FAFAFA", borderBottom: "1px solid #F0F0F0", display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: 3, background: sec.color, flexShrink: 0 }} />
              <span style={{ fontSize: 10, fontWeight: 800, color: "#1A1A1A", letterSpacing: "0.06em", textTransform: "uppercase" }}>{sec.category}</span>
              <span style={{ marginLeft: "auto", fontSize: 10, fontWeight: 700, color: "#888", fontFamily: "'DM Mono', monospace" }}>
                {sec.items.filter(i => i.checked).length}/{sec.items.length}
              </span>
            </div>
            {/* items */}
            {sec.items.map((item, ii) => (
              <button
                key={item.label}
                onClick={() => toggle(si, ii)}
                style={{
                  width: "100%", display: "flex", alignItems: "center", gap: 12,
                  padding: "12px 16px", background: item.checked ? "#FFFEF5" : "#fff",
                  border: "none", borderBottom: ii < sec.items.length - 1 ? "1px solid #F5F5F5" : "none",
                  cursor: "pointer", textAlign: "left", transition: "background 0.12s",
                }}
              >
                {item.checked
                  ? <CheckSquare size={17} color={sec.color} strokeWidth={2.5} />
                  : <Square size={17} color="#CCCCCC" strokeWidth={1.8} />
                }
                <span style={{ fontSize: 13, fontWeight: 500, color: item.checked ? "#BBBBBB" : "#1A1A1A", textDecoration: item.checked ? "line-through" : "none", transition: "all 0.15s" }}>
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        ))}

        {/* footer */}
        <div style={{ background: "#FFFBEB", border: "1px solid #FFD200", borderRadius: 14, padding: "14px 16px", display: "flex", gap: 10, alignItems: "flex-start" }}>
          <Leaf size={15} color="#16a34a" style={{ marginTop: 1, flexShrink: 0 }} />
          <div>
            <p style={{ fontSize: 12, fontWeight: 800, color: "#1A1A1A", margin: "0 0 4px" }}>100% fresh produce utilised across 3 days</p>
            <p style={{ fontSize: 11, color: "#555", margin: 0, lineHeight: 1.55 }}>
              <strong style={{ color: "#1A1A1A" }}>35% saved</strong> vs buying individual recipes. Zero food waste guaranteed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── BottomNav ────────────────────────────────────────────────────────────────

const NAV = [
  { id: "home",    icon: Home,         label: "Explore" },
  { id: "search",  icon: Search,       label: "Search"  },
  { id: "cook",    icon: ChefHat,      label: "Cook"    },
  { id: "grocery", icon: ShoppingCart, label: "Cart"    },
] as const;

function BottomNav({ active, onChange }: { active: Screen; onChange: (s: Screen) => void }) {
  return (
    <div style={{
      position: "absolute", bottom: 0, left: 0, right: 0,
      background: "#fff", borderTop: "1px solid #EAEAEA",
      display: "flex", zIndex: 50, paddingBottom: 8,
    }}>
      {NAV.map(({ id, icon: Icon, label }) => {
        const isActive = active === id || (id === "home" && active === "home");
        const isClickable = id === "home" || id === "cook" || id === "grocery";
        return (
          <button
            key={id}
            onClick={() => isClickable && onChange(id as Screen)}
            style={{
              flex: 1, paddingTop: 10, paddingBottom: 6,
              display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
              background: "none", border: "none",
              cursor: isClickable ? "pointer" : "default",
              opacity: !isClickable && !isActive ? 0.4 : 1,
            }}
          >
            <Icon size={22} color={isActive ? "#FFD200" : "#AAAAAA"} strokeWidth={isActive ? 2.5 : 1.8} />
            <span style={{ fontSize: 10, fontWeight: isActive ? 700 : 500, color: isActive ? "#1A1A1A" : "#AAAAAA" }}>
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [screen, setScreen] = useState<Screen>("home");
  const [activePack, setActivePack] = useState<typeof PACKS[0] | null>(null);

  const handleCookMeal = (_mealId: string) => setScreen("cook");
  const handleOpenPack = (pack: typeof PACKS[0]) => setActivePack(pack);

  return (
    <>
      {/* hide scrollbars globally */}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        * { box-sizing: border-box; }
        body { margin: 0; background: #E0E0E0; font-family: 'Inter', system-ui, sans-serif; }
      `}</style>

      {/* outer centering wrapper */}
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "flex-start", justifyContent: "center", paddingTop: "clamp(0px, 3vw, 40px)", paddingBottom: 0, background: "#D8D8D8" }}>
        {/* phone shell */}
        <div style={{
          width: "100%", maxWidth: 430,
          height: "100vh",
          background: "#F9F9F9",
          position: "relative",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 0 60px rgba(0,0,0,0.18)",
        }}>
          {/* main content area (leaves room for bottom nav) */}
          <div style={{ flex: 1, overflow: "hidden", paddingBottom: 65 }}>
            <AnimatePresence mode="wait">
              {screen === "home" && (
                <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} style={{ height: "100%" }}>
                  <HomeScreen onOpenPack={handleOpenPack} onCookMeal={handleCookMeal} />
                </motion.div>
              )}
              {screen === "cook" && (
                <motion.div key="cook" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} style={{ height: "100%" }}>
                  <CookScreen onClose={() => setScreen("home")} />
                </motion.div>
              )}
              {screen === "grocery" && (
                <motion.div key="grocery" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} style={{ height: "100%" }}>
                  <GroceryScreen />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* bottom nav */}
          <BottomNav active={screen} onChange={setScreen} />

          {/* pack detail sheet */}
          <AnimatePresence>
            {activePack && (
              <RecipeDetailSheet
                pack={activePack}
                onClose={() => setActivePack(null)}
                onCook={() => { setActivePack(null); setScreen("cook"); }}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
