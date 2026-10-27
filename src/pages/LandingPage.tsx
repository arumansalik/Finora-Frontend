import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, type Variants } from "motion/react";
import {
  ArrowDownRight, ArrowRight, ArrowUpRight, BarChart3, Check, ChevronDown,
  ChevronRight, CircleDollarSign, CreditCard, Fingerprint, Landmark, LockKeyhole,
  Menu, PieChart, ShieldCheck, Sparkles, TrendingUp, Wallet, X, Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import "./LandingPage.css";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] as const } },
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };

const features = [
  { icon: Wallet, label: "SPENDING", title: "Know where it goes.", body: "See your spending in one calm, clear view. Find the patterns that matter without building another spreadsheet.", tone: "violet" },
  { icon: PieChart, label: "BUDGETS", title: "Make room for what matters.", body: "Set flexible category limits, track progress as you go, and adjust when real life changes the plan.", tone: "mint" },
  { icon: TrendingUp, label: "GOALS", title: "Small steps add up.", body: "Turn a big savings goal into a practical monthly target and watch your progress grow over time.", tone: "blue" },
  { icon: Sparkles, label: "INSIGHTS", title: "Get the useful picture.", body: "Understand trends across your money and find thoughtful next steps, without jargon or judgment.", tone: "pink" },
];
const faqs = [
  ["What is Finora?", "Finora is a personal finance workspace designed to help you understand your spending, plan budgets, and keep savings goals in view."],
  ["Do I need to connect a bank account?", "You can start by organizing your finances manually. If account connections are available in your region, you can choose to connect them from your account settings."],
  ["Is the dashboard on this page showing real data?", "No. The numbers in this landing page preview are illustrative sample values. Your account data appears only after you sign in and add or connect your information."],
  ["Can I use Finora on my phone?", "The experience is designed to work across desktop, tablet, and mobile screens, so you can check in wherever you are."],
];
const initial = { balance: 84250, income: 52000, expenses: 31400 };
function useCountUp(target: number, duration = 850) {
  const [value, setValue] = useState(0);
  const current = useRef(0);
  useEffect(() => {
    const from = current.current;
    const started = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const progress = Math.min((now - started) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const next = Math.round(from + (target - from) * eased);
      current.current = next;
      setValue(next);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, duration]);
  return value;
}
function Count({ value, prefix = "₹" }: { value: number; prefix?: string }) {
  const count = useCountUp(value);
  return <>{prefix}{count.toLocaleString("en-IN")}</>;
}
function ProductPreview() {
  const [range, setRange] = useState("This month");
  const [snapshot, setSnapshot] = useState(initial);
  const reduceMotion = useReducedMotion();
  useEffect(() => {
    const timer = window.setInterval(() => {
      setSnapshot((current) => ({
        balance: Math.max(12000, current.balance + (Math.random() > .48 ? 1 : -1) * (180 + Math.round(Math.random() * 620))),
        income: Math.max(30000, current.income + (Math.random() > .68 ? 1 : -1) * (90 + Math.round(Math.random() * 210))),
        expenses: Math.max(8000, current.expenses + (Math.random() > .5 ? 1 : -1) * (110 + Math.round(Math.random() * 260))),
      }));
    }, 1450);
    return () => window.clearInterval(timer);
  }, []);
  const bars = range === "This month" ? [31, 44, 38, 55, 46, 66, 52, 72, 61, 83, 70, 94] : [42, 35, 56, 48, 63, 53, 75, 58, 70, 62, 86, 74];
  return (
    <motion.div className="lp-dashboard-wrap" initial={{ opacity: 0, y: 30, rotate: 1.5 }} animate={{ opacity: 1, y: 0, rotate: 0 }} transition={{ duration: .9, delay: .18, ease: "easeOut" }}>
      <div className="lp-dashboard-glow" />
      <div className="lp-dashboard">
        <div className="lp-dash-top">
          <div className="lp-dash-brand"><span className="lp-mark mini"><CircleDollarSign size={15}/></span><b>finora</b></div>
          <div className="lp-live"><i /> Sample dashboard</div>
          <button className="lp-period" onClick={() => setRange(range === "This month" ? "Last month" : "This month")}>{range}<ChevronDown size={13}/></button>
        </div>
        <div className="lp-dash-body">
          <div className="lp-dash-heading"><div><span className="lp-overline">YOUR OVERVIEW</span><h3>Your money, in focus.</h3><p>A simple snapshot of {range.toLowerCase()}.</p></div><div className="lp-avatar">A</div></div>
          <div className="lp-metrics">
            <div className="lp-metric lp-metric-featured"><span><Wallet size={15}/> Total balance</span><strong><Count value={snapshot.balance}/></strong><small className="lp-positive"><ArrowUpRight size={13}/> +8.2% <em>sample trend</em></small></div>
            <div className="lp-metric"><span><TrendingUp size={15}/> Income</span><strong><Count value={snapshot.income}/></strong><small>Money coming in</small></div>
            <div className="lp-metric"><span><CreditCard size={15}/> Spending</span><strong><Count value={snapshot.expenses}/></strong><small>Money going out</small></div>
          </div>
          <div className="lp-dash-panels">
            <div className="lp-chart-panel"><div className="lp-panel-head"><div><b>Cash flow</b><small>Income and spending over time</small></div><BarChart3 size={17}/></div><div className="lp-chart"><div className="lp-chart-grid"><i/><i/><i/><i/></div><div className="lp-bars" key={range}>{bars.map((h,i)=><motion.i key={i} initial={{ scaleY: reduceMotion ? 1 : 0 }} animate={{ scaleY: 1 }} transition={{ duration: .65, delay: .25+i*.04 }} style={{ height: `${h}%` }} className={i===11?"active":""}/>)}</div></div><div className="lp-chart-labels"><span>Week 1</span><span>Week 2</span><span>Week 3</span><span>Week 4</span></div></div>
            <div className="lp-mix-panel"><div className="lp-panel-head"><div><b>Spending mix</b><small>Where it went</small></div><PieChart size={16}/></div><div className="lp-donut"><div><small>MONTHLY</small><b>₹31.4k</b></div></div><div className="lp-legend"><span><i/> Home <b>45%</b></span><span><i/> Food <b>30%</b></span><span><i/> Other <b>25%</b></span></div></div>
          </div>
          <div className="lp-recent">
            <div className="lp-recent-head"><b>Recent activity</b><button onClick={() => setRange(range === "This month" ? "Last month" : "This month")}>Explore another month <ArrowRight size={12}/></button></div>
            <div className="lp-activity-row"><span className="lp-activity-icon home"><Landmark size={14}/></span><span><b>Home & bills</b><small>Rent · Today</small></span><strong>−₹12,000</strong><i>PAID</i></div>
            <div className="lp-activity-row"><span className="lp-activity-icon paid"><ArrowDownRight size={14}/></span><span><b>Monthly pay</b><small>Income · Yesterday</small></span><strong className="credit">+₹48,000</strong><i>INCOME</i></div>
          </div>
          <div className="lp-demo-foot"><i/> Preview values update for demonstration <span>Sample data</span></div>
        </div>
      </div>
      <motion.div className="lp-float-card lp-float-a" animate={reduceMotion ? {} : { y: [0,-9,0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}><span className="lp-float-icon mint"><TrendingUp size={17}/></span><div><small>Goal progress</small><b>One step closer</b></div><ArrowUpRight size={16}/></motion.div>
      <motion.div className="lp-float-card lp-float-b" animate={reduceMotion ? {} : { y: [0,8,0] }} transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}><span className="lp-float-icon violet"><ShieldCheck size={17}/></span><div><small>Your finances</small><b>All in one view</b></div><Sparkles size={15}/></motion.div>
    </motion.div>
  );
}


function GoalPlanner() {
  const [monthlySave, setMonthlySave] = useState(6000);
  const target = 100000;
  const saved = 32000;
  const months = Math.ceil((target - saved) / monthlySave);
  const projected = new Date();
  projected.setMonth(projected.getMonth() + months);
  const dateLabel = projected.toLocaleDateString("en-IN", { month: "long", year: "numeric" });
  return (
    <section className="lp-goal-section" id="goal-planner">
      <div className="lp-container lp-goal-grid">
        <motion.div className="lp-goal-copy" initial="hidden" whileInView="show" viewport={{ once: true, amount: .25 }} variants={stagger}>
          <motion.span className="lp-kicker" variants={fadeUp}>MAKE A GOAL FEEL DOABLE</motion.span>
          <motion.h2 variants={fadeUp}>Big plans become<br/><span>small next steps.</span></motion.h2>
          <motion.p variants={fadeUp}>Try a sample savings plan. Move the monthly amount and see how your timeline changes. Your real plan can flex as life changes.</motion.p>
          <motion.div className="lp-goal-chips" variants={fadeUp}><span><Check size={13}/> Pick a target</span><span><Check size={13}/> Find your pace</span><span><Check size={13}/> Adjust anytime</span></motion.div>
        </motion.div>
        <motion.div className="lp-goal-widget" initial={{ opacity: 0, y: 25, scale: .97 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true, amount: .2 }} transition={{ duration: .65 }}>
          <div className="lp-goal-widget-head"><span className="lp-goal-badge"><Sparkles size={15}/></span><div><b>Build a savings timeline</b><small>Interactive sample planner</small></div><span className="lp-budget-tag">DEMO</span></div>
          <div className="lp-goal-target"><small>YOUR SAMPLE GOAL</small><strong>₹1,00,000</strong><span>Travel fund</span></div>
          <div className="lp-goal-progress-label"><span>Already saved <b>₹32,000</b></span><span>32%</span></div>
          <div className="lp-goal-track"><motion.i initial={{ width: 0 }} whileInView={{ width: "32%" }} viewport={{ once: true }} transition={{ duration: 1, ease: "easeOut" }}/></div>
          <label className="lp-goal-slider-label" htmlFor="monthly-save">I can set aside each month <b>₹{monthlySave.toLocaleString("en-IN")}</b></label>
          <input id="monthly-save" className="lp-goal-slider" type="range" min="2000" max="20000" step="500" value={monthlySave} onChange={(event) => setMonthlySave(Number(event.target.value))} aria-label="Monthly savings amount" />
          <div className="lp-goal-range"><span>₹2,000</span><span>₹20,000</span></div>
          <motion.div className="lp-goal-result" key={months} initial={{ opacity: .45, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .3 }}><span className="lp-result-icon"><TrendingUp size={17}/></span><span><small>At this pace, you could reach it in</small><b>{months} months <i>· around {dateLabel}</i></b></span><ArrowRight size={16}/></motion.div>
          <small className="lp-goal-disclaimer">Illustrative estimate. No interest or investment returns included.</small>
        </motion.div>
      </div>
    </section>
  );
}

function MoneyCheckIn() {
  const [view, setView] = useState<"week" | "month" | "goals">("week");
  const data = {
    week: { label: "THIS WEEK", headline: "Your week, in a nutshell.", note: "A quick check-in can help you spot little changes early.", rows: [["Home & bills", "₹4,200", 68], ["Food & coffee", "₹1,850", 46], ["Getting around", "₹920", 31]] },
    month: { label: "THIS MONTH", headline: "You’re finding your rhythm.", note: "A month-to-month view can make patterns easier to notice.", rows: [["Home & bills", "₹14,000", 76], ["Food & coffee", "₹6,300", 57], ["Just for you", "₹4,500", 39]] },
    goals: { label: "YOUR GOALS", headline: "Progress is progress.", note: "Keep your next milestone visible and celebrate each step.", rows: [["Rainy day fund", "68%", 68], ["Weekend away", "42%", 42], ["New laptop", "25%", 25]] },
  };
  const current = data[view];
  return (
    <section className="lp-checkin-section">
      <div className="lp-container lp-checkin-grid">
        <motion.div className="lp-checkin-card" initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: .25 }} transition={{ duration: .55 }}>
          <div className="lp-checkin-head"><div><span className="lp-overline">A FRIENDLY CHECK-IN</span><h3>Money, at a glance.</h3></div><span className="lp-checkin-icon"><BarChart3 size={18}/></span></div>
          <div className="lp-checkin-tabs" role="tablist" aria-label="Sample dashboard view">{([["week", "This week"], ["month", "This month"], ["goals", "Goals"]] as const).map(([id, label]) => <button key={id} role="tab" aria-selected={view === id} className={view === id ? "active" : ""} onClick={() => setView(id)}>{label}</button>)}</div>
          <motion.div className="lp-checkin-content" key={view} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .28 }}>
            <span className="lp-overline">{current.label}</span><h4>{current.headline}</h4><p>{current.note}</p>
            <div className="lp-checkin-rows">{current.rows.map(([label, amount, percent], index) => <div className="lp-checkin-row" key={label}><div><span>{label}</span><b>{amount}</b></div><div className="lp-checkin-track"><motion.i initial={{ width: 0 }} animate={{ width: `${percent}%` }} transition={{ duration: .55, delay: index * .08 }}/></div></div>)}</div>
          </motion.div>
          <div className="lp-checkin-foot"><span><i/> Sample dashboard</span><span>Tap a tab to explore</span></div>
        </motion.div>
        <motion.div className="lp-checkin-copy" initial="hidden" whileInView="show" viewport={{ once: true, amount: .25 }} variants={stagger}>
          <motion.span className="lp-kicker" variants={fadeUp}>A CLEARER VIEW, AT YOUR PACE</motion.span>
          <motion.h2 variants={fadeUp}>Check in without<br/><span>making it a chore.</span></motion.h2>
          <motion.p variants={fadeUp}>A useful money routine doesn’t need an hour or a perfect spreadsheet. A quick look can help you notice what’s working and decide what you want to do next.</motion.p>
          <motion.div className="lp-checkin-benefits" variants={fadeUp}><div><span>01</span><p><b>Start with one view</b><small>Check this week, this month, or a goal.</small></p></div><div><span>02</span><p><b>Notice the patterns</b><small>See your categories and progress clearly.</small></p></div><div><span>03</span><p><b>Choose your next step</b><small>Make a small adjustment when you need one.</small></p></div></motion.div>
        </motion.div>
      </div>
    </section>
  );
}

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const reduceMotion = useReducedMotion();
  const goTo = (id: string) => { document.getElementById(id)?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" }); setMenuOpen(false); };
  const openAuth = (path: string) => { window.location.href = path; };
  return (
    <main className="finora-landing">
      <div className="lp-atmosphere" aria-hidden="true"><div className="lp-orb one"/><div className="lp-orb two"/><div className="lp-grid"/></div>
      <header className="lp-nav"><div className="lp-nav-inner">
        <button className="lp-wordmark" onClick={() => window.scrollTo({top:0,behavior:reduceMotion?"auto":"smooth"})}><span className="lp-mark"><CircleDollarSign size={21}/></span><b>finora<span>.</span></b></button>
        <nav className="lp-links"><button onClick={()=>goTo("features")}>Features</button><button onClick={()=>goTo("how-it-works")}>How it works</button><button onClick={()=>goTo("security")}>Security</button><button onClick={()=>goTo("faq")}>FAQ</button></nav>
        <div className="lp-nav-actions"><button className="lp-login" onClick={()=>openAuth("/login")}>Log in</button><Button className="lp-button lp-button-small" onClick={()=>openAuth("/register")}>Get started <ArrowRight size={15}/></Button></div>
        <button className="lp-menu-toggle" aria-label={menuOpen?"Close menu":"Open menu"} aria-expanded={menuOpen} onClick={()=>setMenuOpen(!menuOpen)}>{menuOpen?<X/>:<Menu/>}</button>
      </div>{menuOpen&&<motion.nav className="lp-mobile-menu" initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}}>{[["Features","features"],["How it works","how-it-works"],["Security","security"],["FAQ","faq"]].map(([t,id])=><button key={id} onClick={()=>goTo(id)}>{t}<ArrowRight size={15}/></button>)}<button onClick={()=>openAuth("/login")}>Log in<ArrowRight size={15}/></button><Button className="lp-button" onClick={()=>openAuth("/register")}>Create your free account <ArrowRight size={15}/></Button></motion.nav>}</header>

      <section className="lp-hero"><div className="lp-container lp-hero-grid">
        <motion.div className="lp-hero-copy" initial="hidden" animate="show" variants={stagger}>
          <motion.div className="lp-pill" variants={fadeUp}><span className="lp-pulse"/> A calmer way to manage money <ChevronRight size={14}/></motion.div>
          <motion.h1 variants={fadeUp}>Make your money<br/><span>make more sense.</span></motion.h1>
          <motion.p className="lp-hero-text" variants={fadeUp}>See what’s coming in, understand what’s going out, and make a plan that works for real life. All in one clear, friendly space.</motion.p>
          <motion.div className="lp-hero-actions" variants={fadeUp}><Button className="lp-button lp-button-large" onClick={()=>openAuth("/register")}>Start building better habits <ArrowRight size={17}/></Button><button className="lp-quiet-link" onClick={()=>goTo("product-preview")}><span><BarChart3 size={16}/></span> Take a quick look</button></motion.div>
          <motion.div className="lp-proof" variants={fadeUp}><div className="lp-proof-icons"><span><Wallet size={14}/></span><span><TrendingUp size={14}/></span><span>₹</span></div><div><b>Less guesswork. More confidence.</b><small>A thoughtful starting point for your financial life.</small></div></motion.div>
        </motion.div>
        <div id="product-preview" className="lp-hero-visual"><ProductPreview/></div>
      </div><div className="lp-hero-bottom"><span/> A little more clarity can change the whole month <ArrowDownRight size={15}/></div></section>

      <div className="lp-marquee" aria-label="Finora tools"><div className="lp-marquee-track">{[0,1,2,3].map((n)=><div className="lp-marquee-set" key={n} aria-hidden={n!==0}>{["SPENDING CLARITY","FLEXIBLE BUDGETS","SAVINGS GOALS","USEFUL INSIGHTS","A PLAN THAT ADAPTS"].map((x)=><span key={x}><Sparkles size={14}/>{x}</span>)}</div>)}</div></div>

      <section className="lp-section" id="features"><div className="lp-container"><motion.div className="lp-section-intro" initial="hidden" whileInView="show" viewport={{once:true,amount:.25}} variants={stagger}><motion.span className="lp-kicker" variants={fadeUp}>A BETTER MONEY ROUTINE</motion.span><motion.h2 variants={fadeUp}>Your whole picture,<br/><span>without the overwhelm.</span></motion.h2><motion.p variants={fadeUp}>The everyday tools to help you feel more in control, wherever you’re starting from.</motion.p></motion.div>
        <motion.div className="lp-feature-grid" initial="hidden" whileInView="show" viewport={{once:true,amount:.15}} variants={stagger}>{features.map(({icon:Icon,label,title,body,tone},i)=><motion.article className={`lp-feature-card ${tone}`} key={title} variants={fadeUp} whileHover={reduceMotion?{}:{y:-7}} transition={{duration:.25}}><div className="lp-feature-top"><span className="lp-feature-icon"><Icon size={20}/></span><span>{label}</span></div><div className="lp-feature-illustration"><div className={`lp-illustration-shape shape-${i}`}><Icon size={32}/></div><span className="lp-spark spark-a">✦</span><span className="lp-spark spark-b">✧</span></div><h3>{title}</h3><p>{body}</p><button onClick={()=>goTo("how-it-works")}>See how it works <ArrowRight size={14}/></button></motion.article>)}</motion.div>
      </div></section>

      <section className="lp-story"><div className="lp-container lp-story-grid"><motion.div className="lp-story-art" initial={{opacity:0,scale:.94}} whileInView={{opacity:1,scale:1}} viewport={{once:true,amount:.3}} transition={{duration:.7}}><div className="lp-orbit orbit-1"/><div className="lp-orbit orbit-2"/><div className="lp-story-core"><span className="lp-mark"><CircleDollarSign size={25}/></span><b>Your financial picture</b><small>One clear place to begin</small></div><div className="lp-story-node n1"><Wallet size={16}/> Spending</div><div className="lp-story-node n2"><TrendingUp size={16}/> Savings</div><div className="lp-story-node n3"><CreditCard size={16}/> Monthly plan</div><div className="lp-story-node n4"><Sparkles size={16}/> Insights</div></motion.div>
        <motion.div className="lp-story-copy" initial="hidden" whileInView="show" viewport={{once:true,amount:.3}} variants={stagger}><motion.span className="lp-kicker" variants={fadeUp}>SEE THE BIGGER PICTURE</motion.span><motion.h2 variants={fadeUp}>Money feels simpler<br/><span>when it connects.</span></motion.h2><motion.p variants={fadeUp}>Bring everyday spending, monthly plans, and long-term hopes into one view. Finora helps you move from “Where did it go?” to “Here’s what I want next.”</motion.p><motion.ul variants={fadeUp}>{["A clean view of income and expenses","Goals broken into practical milestones","Insights you can understand at a glance"].map(x=><li key={x}><span><Check size={14}/></span>{x}</li>)}</motion.ul><motion.div variants={fadeUp}><Button className="lp-button" onClick={()=>openAuth("/register")}>Build your money routine <ArrowRight size={16}/></Button></motion.div></motion.div>
      </div></section>

      {/*<section className="lp-section lp-how" id="how-it-works"><div className="lp-container"><div className="lp-section-intro"><span className="lp-kicker">SIMPLE BY DESIGN</span><h2>Start small.<br/><span>Find your rhythm.</span></h2><p>No perfect plan required. Just a few simple steps to get a clearer view.</p></div><div className="lp-steps">{[{n:"01",icon:Fingerprint,title:"Set up your space",text:"Create your account and choose how you want to organize your money."},{n:"02",icon:Landmark,title:"Add your picture",text:"Bring in your income, spending, budgets, and goals at your own pace."},{n:"03",icon:TrendingUp,title:"Keep moving forward",text:"Check your progress, adjust your plan, and celebrate the small wins."}].map(({n,icon:Icon,title,text},i)=><motion.article className="lp-step" key={n} initial={{opacity:0,y:22}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.3}} transition={{duration:.55,delay:i*.12}}><span className="lp-step-number">{n}</span><span className="lp-step-icon"><Icon size={21}/></span><h3>{title}</h3><p>{text}</p><div className="lp-step-line"><span/></div></motion.article>)}</div></div></section>*/}

      <GoalPlanner />
      <MoneyCheckIn />

      <section className="lp-budget-band"><div className="lp-container lp-budget-inner"><div><span className="lp-kicker">PLANS THAT FEEL HUMAN</span><h2>A budget should help you live,<br/><span>not make life smaller.</span></h2><p>Make a plan with space for bills, goals, and the things that make a week feel like yours.</p><button className="lp-text-cta" onClick={()=>openAuth("/register")}>Make a plan that fits <ArrowRight size={15}/></button></div><div className="lp-budget-card"><div className="lp-budget-header"><span><PieChart size={17}/> Monthly plan</span><span className="lp-budget-tag">SAMPLE</span></div><div className="lp-budget-total"><small>Planned spending</small><b>₹24,800 <i>of ₹35,000</i></b></div><div className="lp-progress"><span/></div><div className="lp-budget-rows"><span><i className="cat home"/> Home & bills <b>₹14,000</b></span><span><i className="cat food"/> Food & coffee <b>₹6,300</b></span><span><i className="cat fun"/> Just for you <b>₹4,500</b></span></div><div className="lp-budget-note"><Sparkles size={14}/> You’re making steady progress.</div></div></div></section>

      <section className="lp-security" id="security"><div className="lp-container"><div className="lp-security-panel"><div className="lp-security-glow"/><div className="lp-security-copy"><span className="lp-kicker">BUILT FOR PEACE OF MIND</span><h2>Your money deserves<br/><span>a thoughtful space.</span></h2><p>Clear choices and careful design should be part of every money tool. Start with the way you want to manage your information.</p><div className="lp-security-points"><div><LockKeyhole size={17}/><span><b>Privacy comes first</b><small>You choose what information to add.</small></span></div><div><ShieldCheck size={17}/><span><b>Security minded</b><small>Designed with care around your financial life.</small></span></div><div><Fingerprint size={17}/><span><b>Your account, your control</b><small>Manage your details from your own space.</small></span></div></div><small className="lp-security-note">Review the product’s current security and privacy details before connecting sensitive accounts.</small></div><div className="lp-security-art"><div className="lp-security-ring r1"/><div className="lp-security-ring r2"/><div className="lp-security-ring r3"/><motion.div className="lp-shield"><ShieldCheck size={43}/></motion.div><i className="security-dot d1"/><i className="security-dot d2"/><i className="security-dot d3"/></div></div></div></section>

      <section className="lp-section lp-faq" id="faq"><div className="lp-container lp-faq-grid"><div><span className="lp-kicker">GOOD QUESTIONS</span><h2>Let’s clear<br/><span>things up.</span></h2><p>Still curious? We’ve answered a few things people often ask before getting started.</p><button className="lp-text-cta" onClick={()=>openAuth("/register")}>Try Finora <ArrowRight size={15}/></button></div><div className="lp-faq-list">{faqs.map(([q,a],i)=><div className={`lp-faq-item ${openFaq===i?"open":""}`} key={q}><button aria-expanded={openFaq===i} onClick={()=>setOpenFaq(openFaq===i?null:i)}><span>{q}</span><ChevronDown size={18}/></button><motion.div className="lp-faq-answer" initial={false} animate={{height:openFaq===i?"auto":0,opacity:openFaq===i?1:0}} transition={{duration:.25}}><p>{a}</p></motion.div></div>)}</div></div></section>

      <section className="lp-cta"><div className="lp-cta-aura"/><div className="lp-container lp-cta-content"><span className="lp-cta-icon"><Zap size={22}/></span><span className="lp-kicker">YOUR NEXT CHAPTER STARTS HERE</span><h2>A little more clarity.<br/><span>A lot more possibility.</span></h2><p>Start with one goal, one budget, or simply a better look at where you are today.</p><Button className="lp-button lp-button-large" onClick={()=>openAuth("/register")}>Get started with Finora <ArrowRight size={17}/></Button><small>Already have an account? <button onClick={()=>openAuth("/login")}>Log in</button></small></div></section>

      <footer className="lp-footer"><div className="lp-container lp-footer-inner"><button className="lp-wordmark" onClick={()=>window.scrollTo({top:0,behavior:reduceMotion?"auto":"smooth"})}><span className="lp-mark"><CircleDollarSign size={18}/></span><b>finora<span>.</span></b></button><p>Make your money make more sense.</p><div><button onClick={()=>goTo("features")}>Features</button><button onClick={()=>goTo("security")}>Security</button><button onClick={()=>goTo("faq")}>FAQ</button></div><small>© {new Date().getFullYear()} Finora. Dashboard values shown are sample data.</small></div></footer>
    </main>
  );
}
