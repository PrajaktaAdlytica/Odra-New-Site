import { useState } from "react";
import { SiteIcon, SiteShell } from "../components/SiteChrome";
import { portfolio, team } from "../siteData";

const programs = {
  school: {
    route: "/programs/ov-school",
    number: "01",
    eyebrow: "OV School",
    title: "Build the operating system behind the company.",
    body: "A structured learning environment for founders turning early conviction into repeatable decisions, clear priorities, and a company that can keep learning.",
    image: "/assets/odra-editorial-lavender.webp",
    fit: ["First-time and repeat founders", "Pre-product through early commercial evidence", "Teams that want a disciplined operating cadence"],
    modules: [
      ["Founder clarity", "Turn the ambition into a precise company thesis and a small set of decisions that matter now."],
      ["Customer evidence", "Build interviews, experiments, and learning loops that replace assumption with useful signal."],
      ["Product rhythm", "Connect discovery, delivery, measurement, and review without creating process for its own sake."],
      ["Commercial foundations", "Define the buyer, value story, route to market, and early revenue system."],
      ["Company craft", "Create clear roles, communication habits, and decision rights before complexity arrives."],
      ["Capital readiness", "Understand the narrative, evidence, and materials needed for a productive investor conversation."],
    ],
    outcomes: ["A company thesis that guides decisions", "A practical evidence and experiment backlog", "A weekly operating and review cadence", "A clear next-stage readiness plan"],
    rhythm: [["Monday", "Choose the company question"], ["Midweek", "Learn and apply in the company"], ["Founder room", "Review evidence with peers"], ["Friday", "Record the decision and next move"]],
  },
  accelerator: {
    route: "/programs/accelerator",
    number: "02",
    eyebrow: "OV Startup Accelerator",
    title: "Move from a promising product to repeatable evidence.",
    body: "A focused company-building pathway for early teams testing demand, strengthening the product, and constructing a credible route to market.",
    image: "/assets/odra-editorial-mint.webp",
    fit: ["Early technology teams with a working product or prototype", "Founders validating a specific market and buyer", "Companies ready for concentrated execution"],
    modules: [
      ["Evidence sprint", "Prioritise the highest-risk assumptions and design fast, decision-ready tests."],
      ["Product focus", "Tighten the value proposition and roadmap around the problem customers care about most."],
      ["Go-to-market", "Build the first repeatable motion across targeting, conversations, pilots, and conversion."],
      ["Founder room", "Work through difficult company decisions with peers and experienced operators."],
      ["Readiness review", "Assess what is proven, what remains uncertain, and what the next stage should require."],
      ["Next-step narrative", "Translate progress into a clear story for customers, hires, partners, and investors."],
    ],
    outcomes: ["Sharper market and buyer focus", "A tested commercial motion", "A prioritised product and evidence plan", "A credible next-stage company narrative"],
    rhythm: [["Diagnose", "Name the constraint behind progress"], ["Sprint", "Run one focused evidence cycle"], ["Review", "Work through results with operators"], ["Decide", "Commit the next product-to-market move"]],
  },
  scale: {
    route: "/programs/scale",
    number: "03",
    eyebrow: "OV Scale Funding Program",
    title: "Strengthen the systems that carry growth.",
    body: "A scale-readiness pathway for companies preparing to expand markets, teams, commercial capacity, and the quality of their funding conversations.",
    image: "/assets/odra-editorial-yellow.webp",
    fit: ["Companies with meaningful market evidence", "Teams preparing for international or organisational expansion", "Founders building a disciplined funding process"],
    modules: [
      ["Growth diagnosis", "Identify the constraints behind growth before adding more channels, people, or capital."],
      ["Market expansion", "Evaluate where to expand, what must localise, and which signals justify the move."],
      ["Commercial systems", "Improve pipeline quality, forecasting, ownership, and the handoff from sale to value."],
      ["Leadership design", "Evolve roles, communication, and accountability as the company becomes more complex."],
      ["Funding readiness", "Prepare an evidence-led narrative, data room structure, and investor process."],
      ["Scale plan", "Bring the company’s priorities, risks, owners, and milestones into one operating view."],
    ],
    outcomes: ["A focused growth-constraint diagnosis", "An expansion and leadership plan", "A stronger funding-readiness package", "A shared operating view for the next stage"],
    rhythm: [["Map", "Make the growth system visible"], ["Stress-test", "Challenge the expansion assumptions"], ["Design", "Strengthen leadership and commercial systems"], ["Sequence", "Build the next-stage operating plan"]],
  },
};

const insightRecords = [
  {
    slug: "evidence-before-velocity",
    type: "Founder practice",
    title: "Evidence before velocity: what early momentum should actually prove",
    summary: "Activity can look like traction. A better operating rhythm asks which uncertainty each sprint removes and which decision becomes easier next.",
    image: "/assets/odra-editorial-yellow.webp",
    read: "6 min",
    paragraphs: [
      "Early companies rarely suffer from a shortage of possible work. They suffer from uncertainty about which work changes the quality of the next decision.",
      "Useful evidence is specific. It links a customer, a painful situation, an observable behaviour, and a decision the company can make. A busy pipeline without that connection can create motion without learning.",
      "The practical shift is to frame each important initiative as a question. What do we need to learn, what would change our mind, and what will we do differently when the signal arrives?",
      "Velocity matters after the direction is credible. Before then, the aim is not to move slowly; it is to make every fast cycle reduce the uncertainty that could otherwise compound.",
    ],
  },
  {
    slug: "designing-founder-operating-rhythm",
    type: "Company building",
    title: "Designing a founder operating rhythm that survives the next stage",
    summary: "A lightweight weekly system can connect customer evidence, product priorities, commercial progress, and founder decisions without creating bureaucracy.",
    image: "/assets/odra-editorial-mint.webp",
    read: "7 min",
    paragraphs: [
      "An operating rhythm is not a calendar full of meetings. It is a predictable way for the company to notice change, make decisions, and keep commitments visible.",
      "The most useful early rhythm connects four views: what customers are teaching us, what the product is changing, what the commercial system is proving, and where the founders need to decide.",
      "Keep the artefacts small. A living evidence log, a short decision register, and one shared view of priorities are usually more valuable than a complex planning stack.",
      "The test is simple: when a difficult week arrives, does the rhythm help the team focus and learn, or does it become another layer of work?",
    ],
  },
  {
    slug: "expansion-is-a-sequence",
    type: "Scaling",
    title: "International expansion is a sequence, not a destination",
    summary: "Treat a new market as a chain of evidence: problem transfer, buyer access, delivery readiness, local trust, and a repeatable commercial path.",
    image: "/assets/odra-editorial-lavender.webp",
    read: "8 min",
    paragraphs: [
      "A map can make expansion look like a geographic choice. In practice, it is a sequence of business-model questions that become more expensive when answered in the wrong order.",
      "Start with problem transfer. The same category may exist in another market while the urgency, buyer, budget, procurement path, or trust requirements are completely different.",
      "Then test access and delivery. A company needs a credible way to reach buyers and a product, team, and support model capable of creating value once the first agreement is signed.",
      "The strongest expansion plans define evidence gates. Each gate earns the next level of commitment and prevents enthusiasm from becoming fixed cost too early.",
    ],
  },
  {
    slug: "a-better-investor-conversation",
    type: "Capital readiness",
    title: "A better investor conversation begins before the deck",
    summary: "The strongest funding narratives connect a difficult problem, a credible insight, a learning company, and evidence that the opportunity is becoming more real.",
    image: "/assets/odra-architectural-hero.webp",
    read: "5 min",
    paragraphs: [
      "A deck is a container. The investor conversation becomes useful when the company can explain why the problem matters, what it understands differently, and how the evidence is changing.",
      "Founders should be able to distinguish what is known, what is believed, and what is being tested. That clarity is more credible than presenting every assumption as certainty.",
      "A strong narrative also shows how the team learns. Investors are assessing the current evidence, but they are also assessing whether the company can continue making better decisions as conditions change.",
      "Prepare the conversation as a decision system: the evidence, the open questions, the use of capital, and the milestones that would materially change the company’s position.",
    ],
  },
];

const eventRecords = [
  { slug: "founder-evidence-room", type: "Founder session", format: "Online", audience: "Early-stage founders", cadence: "Monthly founder room", duration: "90 minutes", status: "Next room opening soon", image: "/assets/odra-editorial-yellow.webp", hosts: ["Shubham Kishore", "Robert Orłowski"], title: "The Founder Evidence Room", body: "A working session for turning uncertain customer, product, and commercial signals into a focused next experiment.", agenda: ["Evidence versus activity", "Finding the highest-risk assumption", "Designing a decision-ready test", "Peer review and next actions"] },
  { slug: "market-expansion-clinic", type: "Operator clinic", format: "Hybrid", audience: "Scaling teams", cadence: "Quarterly operator clinic", duration: "2 hours", status: "Interest list open", image: "/assets/odra-editorial-mint.webp", hosts: ["Hubert Drabik", "Damian Puczyński"], title: "Market Expansion Clinic", body: "A practical clinic for testing market priority, buyer access, localisation needs, and the operational cost of expansion.", agenda: ["Problem transfer", "Market-selection evidence", "Buyer and partner access", "Expansion gates"] },
  { slug: "capital-readiness-table", type: "Roundtable", format: "In person", audience: "Fundraising founders", cadence: "Curated roundtable", duration: "Half day", status: "Invitations in progress", image: "/assets/odra-architectural-hero.webp", hosts: ["Maciej Uciechowski", "Krzysztof Murzyn"], title: "Capital Readiness Table", body: "A small founder roundtable on narrative, evidence, process design, and preparing for a productive funding conversation.", agenda: ["Narrative architecture", "Evidence and open questions", "Investor process", "Readiness checklist"] },
  { slug: "product-to-market-review", type: "Open workshop", format: "Online", audience: "Product and commercial leaders", cadence: "Open working session", duration: "75 minutes", status: "Registration opens soon", image: "/assets/odra-editorial-lavender.webp", hosts: ["Robert Orłowski", "Shubham Kishore"], title: "Product-to-Market Review", body: "A cross-functional workshop for aligning product priorities with the customer evidence and commercial motion that matter now.", agenda: ["Customer signal map", "Product priority review", "Commercial learning loop", "Thirty-day alignment plan"] },
];

function slugify(value) {
  return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function SceneHero({ number, eyebrow, title, body, image, actions = [], className = "" }) {
  return (
    <section className={`public-scene public-hero ${className}`.trim()} data-camera-label={eyebrow}>
      <aside className="public-scene-index"><span>{number}</span><i /><strong>{eyebrow}</strong></aside>
      <div className="public-hero-copy motion-heading"><p className="kicker">{eyebrow}</p><h1>{title}</h1><p>{body}</p>{actions.length > 0 && <div className="phase-hero-actions">{actions.map((action, index) => <a className={index === 0 ? "primary-action" : "secondary-action"} href={action.href} key={action.label}>{action.label}<SiteIcon name="arrow-right" /></a>)}</div>}</div>
      <figure className="public-hero-visual motion-mask"><img src={image} alt="" /><figcaption>Move forward to explore</figcaption></figure>
    </section>
  );
}

function SectionIntro({ eyebrow, title, body }) {
  return <header className="public-section-intro motion-heading"><p className="kicker">{eyebrow}</p><h2>{title}</h2>{body && <p>{body}</p>}</header>;
}

function PageCTA({ eyebrow = "Continue the journey", title, body, primary, secondary }) {
  return <section className="public-scene public-cta" data-camera-label={eyebrow}><div className="motion-heading"><p className="kicker">{eyebrow}</p><h2>{title}</h2><p>{body}</p></div><div>{primary && <a className="primary-action" href={primary.href}>{primary.label}<SiteIcon name="arrow-right" /></a>}{secondary && <a className="secondary-action" href={secondary.href}>{secondary.label}<SiteIcon name="arrow-right" /></a>}</div></section>;
}

function ProgramCards() {
  const tones = ["lavender", "mint", "amber"];
  return <div className="program-card-grid">{Object.values(programs).map((program, index) => <a className={`program-card program-card--${tones[index]} motion-card`} href={program.route} key={program.eyebrow}>
    <div className="program-card-meta"><span>{program.number}</span><small>Applications welcome globally</small></div>
    <figure><img src={program.image} alt="" /><figcaption>Choose the pathway closest to the company today</figcaption></figure>
    <div className="program-card-copy"><p>Founder pathway</p><h3>{program.eyebrow}</h3><p>{program.body}</p></div>
    <footer><strong>Explore pathway</strong><i aria-hidden="true">→</i></footer>
  </a>)}</div>;
}

function ProgramsPage() {
  return <SiteShell>
    <SceneHero number="01" eyebrow="Founder programs" title="Different stages. One continuous founder journey." body="Choose the environment that matches the company’s most important work now—from building founder fundamentals to proving a market and preparing the systems behind scale." image="/assets/odra-founder-collaboration.png" actions={[{ label: "Find your pathway", href: "/apply" }, { label: "Application guide", href: "/apply/guide" }]} />
    <section className="public-scene public-content" data-camera-label="Choose a pathway"><SectionIntro eyebrow="Three pathways" title="Start where the company is—not where it is expected to be." body="Each program has a distinct job. The application journey helps founders identify the environment that best matches the company’s work now." /><ProgramCards /></section>
    <section className="public-scene public-content program-comparison" data-camera-label="Compare programs"><SectionIntro eyebrow="Program comparison" title="A clear view of what changes in each room." /><div className="comparison-table" role="table" aria-label="Program comparison"><div role="row"><span role="columnheader">Pathway</span><span role="columnheader">Core job</span><span role="columnheader">Best starting signal</span><span role="columnheader">Primary output</span></div><div role="row"><strong>OV School</strong><span>Build founder and company operating fundamentals.</span><span>Important questions, limited repeatability.</span><span>A disciplined learning and operating system.</span></div><div role="row"><strong>Accelerator</strong><span>Turn product promise into market evidence.</span><span>A product or prototype and a specific buyer hypothesis.</span><span>A focused product-to-market motion.</span></div><div role="row"><strong>Scale Program</strong><span>Prepare the systems behind growth and funding.</span><span>Meaningful market evidence and increasing complexity.</span><span>A scale-readiness and capital plan.</span></div></div></section>
    <section className="public-scene public-content shared-journey-section" data-camera-label="How it works"><SectionIntro eyebrow="Shared journey" title="Every pathway moves through the same four questions." /><div className="numbered-journey shared-journey">{[["01","Where are you now?","Name the evidence, constraints, and decisions shaping the present stage."],["02","What must become true?","Define the change that would materially improve the company’s position."],["03","What will you practise?","Build the habits, experiments, and systems that make that change repeatable."],["04","What comes next?","Leave with a clear readiness view and a focused next-stage plan."]].map(([n,t,b], index) => <article className={`journey-card journey-card--${index + 1} motion-card`} tabIndex="0" key={n}><span>{n}</span><h3>{t}</h3><p>{b}</p><i aria-hidden="true">↗</i></article>)}</div></section>
    <PageCTA title="Unsure which program fits?" body="Start with the pathway matcher and build a clear view of the company’s current stage, evidence, and next constraint." primary={{ label: "Use the pathway matcher", href: "/apply" }} secondary={{ label: "Read the guide", href: "/apply/guide" }} />
  </SiteShell>;
}

function CompanyLandscape({ offset = 0, count = 5 }) {
  const companies = portfolio.slice(offset, offset + count);
  return <div className="program-company-strip">{companies.map((company, index) => <a className="motion-card" href={`/portfolio/${company.slug}`} key={company.slug}><span>{String(index + 1).padStart(2, "0")}</span><img src={company.image} alt=""/><div><small>{company.sector}</small><h3>{company.name}</h3><p>{company.shortDescription}</p></div><b aria-hidden="true">↗</b></a>)}</div>;
}

function SchoolProductTour() {
  const [active, setActive] = useState(0);
  const views = [
    ["Today", "A focused founder dashboard", "See the current lesson, the decision in progress, the next founder room, and the evidence that needs attention."],
    ["Curriculum", "Six connected learning paths", "Move from founder clarity and customer evidence through product rhythm, commercial foundations, company craft, and capital readiness."],
    ["Weekly update", "Make the learning visible", "Record what changed, which decision became clearer, the current constraint, and the next move the team will make."],
    ["Company", "One operating view", "Keep company stage, assumptions, evidence, current priorities, and founder commitments together."],
    ["Community", "Peer rooms with a job to do", "Enter founder circles, operator clinics, office hours, and reviews built around a real company question."],
  ];
  return <div className="school-product-tour"><nav aria-label="OV School product tour">{views.map(([label], index) => <button className={active === index ? "active" : ""} type="button" onClick={() => setActive(index)} key={label}><span>0{index + 1}</span>{label}</button>)}</nav><article key={active}><div><small>OV School / {views[active][0]}</small><h3>{views[active][1]}</h3><p>{views[active][2]}</p><a href={active === 1 ? "/school/curriculum" : active === 2 ? "/school/weekly-update" : active === 3 ? "/school/company" : active === 4 ? "/school/community" : "/school/dashboard"}>Open this room <SiteIcon name="arrow-right"/></a></div><figure><img src={["/assets/odra-architectural-hero.webp","/assets/odra-editorial-lavender.webp","/assets/odra-editorial-yellow.webp","/assets/odra-editorial-mint.webp","/assets/odra-founder-collaboration.png"][active]} alt=""/><span>{views[active][0]}</span></figure></article></div>;
}

function SchoolAccessPanel() {
  const routes = [
    ["Returning founder", "Sign in", "Continue your lessons, company work, weekly reviews, and founder-room preparation.", "/school/sign-in", "Sign in to OV School"],
    ["New to OV School", "Create an account", "Set up your founder profile, orient the company, and begin the connected learning path.", "/school/sign-up", "Create founder account"],
    ["Explore the product", "Enter the workspace", "Walk through the dashboard, curriculum, company view, community, events, and progress experience.", "/school/dashboard", "Open founder workspace"],
  ];
  return <section className="public-scene public-content school-access-section camera-static" data-camera-label="OV School access"><SectionIntro eyebrow="OV School access" title="One school. One connected founder workspace." body="The public story, learning platform, and founder workspace are now part of the same journey. Choose the doorway that matches where you are."/><div className="school-access-grid">{routes.map(([eyebrow,title,body,href,label],index)=><a className="motion-card" href={href} key={title}><span>{String(index+1).padStart(2,"0")}</span><small>{eyebrow}</small><h3>{title}</h3><p>{body}</p><strong>{label} <SiteIcon name="arrow-right"/></strong></a>)}</div></section>;
}

function ProgramDetail({ program }) {
  return <SiteShell>
    <SceneHero number={program.number} eyebrow={program.eyebrow} title={program.title} body={program.body} image={program.image} actions={program === programs.school ? [{ label: "Enter the workspace", href: "/school/dashboard" }, { label: "Sign in", href: "/school/sign-in" }] : [{ label: "Check your fit", href: "/apply" }, { label: "View all programs", href: "/programs" }]} />
    {program === programs.school && <section className="public-scene public-content school-platform-section" data-camera-label="Inside OV School"><SectionIntro eyebrow="Inside OV School" title="A founder operating platform—not a course catalogue." body="Lessons, company exercises, progress, events, and peer rooms meet in one workspace designed around the decisions founders are already making."/><SchoolProductTour/></section>}
    {program === programs.school && <SchoolAccessPanel />}
    <section className="public-scene public-content split-story" data-camera-label="Who it is for"><SectionIntro eyebrow="Who it is for" title="A focused environment for the work directly ahead." /><div className="statement-list">{program.fit.map((item, index) => <article className="motion-card" key={item}><span>0{index + 1}</span><p>{item}</p></article>)}</div></section>
    <section className="public-scene public-content" data-camera-label="Learning architecture"><SectionIntro eyebrow="Learning architecture" title="Six connected rooms. One company-building system." body="The modules are designed to connect rather than compete for founder attention." /><div className="module-grid">{program.modules.map(([title, body], index) => <article className="motion-card" key={title}><span>{String(index + 1).padStart(2,"0")}</span><h3>{title}</h3><p>{body}</p></article>)}</div></section>
    <section className="public-scene public-content program-rhythm" data-camera-label="Program rhythm"><SectionIntro eyebrow="Program rhythm" title={program === programs.school ? "A weekly loop that turns learning into company practice." : program === programs.accelerator ? "Concentrated execution around the evidence that matters next." : "A sequence that strengthens the systems behind growth."}/><div>{program.rhythm.map(([label, body], index) => <article className="motion-card" key={label}><span>{String(index + 1).padStart(2,"0")}</span><small>{label}</small><h3>{body}</h3></article>)}</div></section>
    <section className="public-scene public-content outcome-room" data-camera-label="What changes"><SectionIntro eyebrow="What changes" title="Leave with decisions, systems, and a clearer next move." /><ul>{program.outcomes.map((outcome) => <li key={outcome}><span>→</span>{outcome}</li>)}</ul></section>
    {program === programs.school ? <section className="public-scene curriculum-preview" data-camera-label="Curriculum"><div><p className="kicker">Curriculum + workspace</p><h2>Learn it. Apply it. Bring the evidence back.</h2><p>Explore the complete curriculum or enter the OV School workspace to see the learning product in action.</p><div className="phase-hero-actions"><a className="primary-action" href="/school/dashboard">Enter OV School <SiteIcon name="arrow-right" /></a><a className="secondary-action" href="/programs/ov-school/curriculum">Explore curriculum <SiteIcon name="arrow-right" /></a></div></div><img src="/assets/odra-architectural-hero.webp" alt="" /></section> : <section className="public-scene public-content program-landscape" data-camera-label="Company landscape"><SectionIntro eyebrow="Company landscape" title="Technology companies building across the Odra ecosystem." body="Explore company stories, products, and markets across the wider Odra platform."/><CompanyLandscape offset={program === programs.scale ? 4 : 0} count={program === programs.scale ? 6 : 5}/></section>}
    <PageCTA title={program === programs.school ? "Build the practice behind the company." : "Ready to find the closest route?"} body={program === programs.school ? "Create your OV School profile, orient the company, and enter a connected founder learning workspace." : "The pathway matcher connects the company’s current evidence and constraint to the most useful starting route."} primary={{ label: program === programs.school ? "Create founder account" : "Start pathway matcher", href: program === programs.school ? "/school/sign-up" : "/apply" }} secondary={program === programs.school ? { label: "Sign in to OV School", href: "/school/sign-in" } : { label: "Application guide", href: "/apply/guide" }} />
  </SiteShell>;
}

function CurriculumPage() {
  const phases = [
    ["01", "Orient", "Founder thesis, company stage, critical assumptions, and the evidence map."],
    ["02", "Understand", "Customer reality, problem depth, buyer dynamics, and market structure."],
    ["03", "Build", "Product focus, experiment design, delivery rhythm, and measurement."],
    ["04", "Reach", "Positioning, sales conversations, pilots, conversion, and learning loops."],
    ["05", "Organise", "Founder roles, team communication, priorities, and decision rights."],
    ["06", "Prepare", "Company narrative, readiness evidence, next-stage plan, and reflection."],
  ];
  return <SiteShell><SceneHero number="01.1" eyebrow="OV School curriculum" title="A curriculum that follows the company—not a stack of disconnected lessons." body="Six learning phases move from founder clarity to customer evidence, product rhythm, commercial foundations, company craft, and next-stage readiness." image="/assets/odra-editorial-lavender.webp" actions={[{ label: "Enter OV School", href: "/school/dashboard" }, { label: "About OV School", href: "/programs/ov-school" }]} /><section className="public-scene public-content" data-camera-label="Learning path"><SectionIntro eyebrow="The learning path" title="Move through six rooms of company-building practice." /><div className="curriculum-track">{phases.map(([number,title,body]) => <article className="motion-card" key={number}><span>{number}</span><div><h3>{title}</h3><p>{body}</p></div><b>Lessons · exercises · founder reflection</b></article>)}</div></section><section className="public-scene public-content split-story" data-camera-label="Weekly cadence"><SectionIntro eyebrow="Weekly cadence" title="Learn. Apply. Review. Decide." body="Each cycle connects a short learning input to a company exercise, peer or mentor conversation, evidence review, and one visible decision." /><div className="statement-list">{["A focused learning brief","A company-applied exercise","A founder or peer review","A weekly evidence update"].map((item,index)=><article className="motion-card" key={item}><span>0{index+1}</span><p>{item}</p></article>)}</div></section><PageCTA title="Continue into the founder workspace." body="Open the complete OV School experience to explore lessons, exercises, progress, company practice, events, and weekly founder reviews." primary={{label:"Enter OV School",href:"/school/dashboard"}} secondary={{label:"Create an account",href:"/school/sign-up"}} /></SiteShell>;
}

function ApplicationGuidePage() {
  const preparation = [
    ["Company essentials", "Founder contact details, company name, location, website, and current stage."],
    ["What you are building", "A concise explanation of the product, the problem, and the customer or user."],
    ["Evidence so far", "Relevant learning from customers, product use, pilots, commercial activity, or research."],
    ["The help that matters", "The constraint or next-stage question where the right environment could be useful."],
  ];
  return <SiteShell><SceneHero number="A1" eyebrow="Application guide" title="Prepare the signal. Leave the theatre behind." body="The application is designed to understand where the company is, what has been learned, and which pathway may be useful. Concise and specific beats polished but vague." image="/assets/odra-founder-collaboration.png" actions={[{label:"Start the application",href:"/apply"},{label:"Explore programs",href:"/programs"}]} /><section className="public-scene public-content" data-camera-label="Prepare"><SectionIntro eyebrow="What to prepare" title="Four blocks of useful context." /><div className="module-grid">{preparation.map(([title,body],index)=><article className="motion-card" key={title}><span>0{index+1}</span><h3>{title}</h3><p>{body}</p></article>)}</div></section><section className="public-scene public-content split-story" data-camera-label="Good answers"><SectionIntro eyebrow="Writing useful answers" title="Specific enough to understand. Short enough to discuss." body="Describe what is true today, distinguish evidence from belief, and name what remains uncertain. Sensitive diligence materials should wait for a secure follow-up process." /><div className="guide-example"><small>Instead of</small><p>“We are transforming a massive global industry.”</p><small>Try</small><p>“Operations teams lose time reconciling three disconnected systems. In six interviews, four teams described the same weekly failure.”</p></div></section><section className="public-scene public-content" data-camera-label="What happens next"><SectionIntro eyebrow="After the application" title="A clear journey from first signal to the right conversation." /><div className="numbered-journey">{[["01","Fit review","The information is reviewed against the selected pathway and current company needs."],["02","Founder conversation","Where there may be a fit, the next step is a direct conversation about context and expectations."],["03","Focused follow-up","Additional material is requested only when it is useful and through an appropriate secure process."],["04","Pathway decision","The team communicates the route and next action that best match the company’s current stage."]].map(([n,t,b])=><article className="motion-card" key={n}><span>{n}</span><h3>{t}</h3><p>{b}</p></article>)}</div></section><PageCTA title="You have what you need to begin." body="Start with the essentials. The application will guide you through company, team, market, product, evidence, and ambition." primary={{label:"Start application",href:"/apply"}} secondary={{label:"Return to programs",href:"/programs"}} /></SiteShell>;
}

function InsightsPage() {
  const [filter, setFilter] = useState("All");
  const categories = ["All", ...new Set(insightRecords.map((item) => item.type))];
  const visible = filter === "All" ? insightRecords : insightRecords.filter((item) => item.type === filter);
  return <SiteShell><SceneHero number="01" eyebrow="Insights" title="Ideas for the decisions founders make before certainty arrives." body="Practical thinking on evidence, company building, markets, scale, and capital readiness—from the work between milestones." image="/assets/odra-editorial-yellow.webp" actions={[{label:"Browse resources",href:"/resources"},{label:"Meet at an event",href:"/events"}]} /><section className="public-scene public-content" data-camera-label="Latest thinking"><div className="filter-bar" aria-label="Filter insights">{categories.map((category)=><button className={filter===category?"active":""} type="button" onClick={()=>setFilter(category)} key={category}>{category}</button>)}</div><div className="insight-grid">{visible.map((item,index)=><a className={`insight-card insight-card--${(index % 3) + 1} motion-card ${index===0?"featured":""}`} href={`/insights/${item.slug}`} key={item.slug}><figure><img src={item.image} alt=""/><span>{String(index + 1).padStart(2,"0")}</span></figure><div className="insight-card-body"><div className="insight-card-meta"><span>{item.type}</span><small>{item.read}</small></div><h2>{item.title}</h2><p>{item.summary}</p><footer><strong>Read perspective</strong><i aria-hidden="true">→</i></footer></div></a>)}</div></section><PageCTA title="Turn the thinking into company practice." body="Explore practical resources or find the founder program closest to the work ahead." primary={{label:"Explore resources",href:"/resources"}} secondary={{label:"View programs",href:"/programs"}} /></SiteShell>;
}

function InsightDetail({ item }) {
  return <SiteShell><SceneHero number="I" eyebrow={item.type} title={item.title} body={item.summary} image={item.image} actions={[{label:"Back to insights",href:"/insights"},{label:"Explore resources",href:"/resources"}]} /><article className="public-scene article-body" data-camera-label="Read perspective"><aside><span>{item.read}</span><strong>Odra perspective</strong><p>Read, reflect, and carry one useful question into the company.</p></aside><div>{item.paragraphs.map((paragraph,index)=><p className="motion-heading" key={index}>{paragraph}</p>)}<div className="article-prompt"><small>Founder prompt</small><h2>Which uncertainty would make your next important decision materially easier?</h2></div></div></article><PageCTA title="Keep moving through the founder journey." body="Use the resource library for practical prompts and canvases, or explore the program pathways." primary={{label:"Open resources",href:"/resources"}} secondary={{label:"Explore programs",href:"/programs"}} /></SiteShell>;
}

function ResourcesPage() {
  const groups = [
    ["Evidence", "Customer evidence map", "Separate observation, interpretation, belief, and the decision each signal should inform.", "Founder canvas"],
    ["Product", "Assumption-to-experiment brief", "Turn the most important product uncertainty into a small test with a decision threshold.", "Working template"],
    ["Commercial", "Early pipeline learning review", "Review conversations, objections, movement, and stalled deals as one learning system.", "Review guide"],
    ["Company", "Founder decision register", "Keep difficult decisions, owners, evidence, trade-offs, and review dates visible.", "Operating tool"],
    ["Scale", "Market expansion gates", "Define the evidence required before committing more people, budget, or infrastructure to a market.", "Planning canvas"],
    ["Capital", "Funding-readiness room", "Organise narrative, evidence, open questions, use of capital, and the intended investor process.", "Preparation guide"],
  ];
  return <SiteShell><SceneHero number="R" eyebrow="Founder resources" title="Small tools for high-consequence company decisions." body="A practical library of prompts, canvases, and review structures founders can adapt without adding unnecessary process." image="/assets/odra-editorial-mint.webp" actions={[{label:"Explore OV School",href:"/programs/ov-school"},{label:"Read insights",href:"/insights"}]} /><section className="public-scene public-content" data-camera-label="Resource library"><SectionIntro eyebrow="The library" title="Choose the decision—not the document." body="Use each tool as a working room: clarify the question, capture the evidence, make the decision, and carry the next action into the company." /><div className="resource-grid">{groups.map(([type,title,body,format],index)=><article className="resource-card motion-card" key={title}><span>{String(index+1).padStart(2,"0")}</span><small>{type} · {format}</small><h3>{title}</h3><p>{body}</p><button type="button" onClick={(event)=>{event.currentTarget.textContent="Resource opened";}}>Open resource <SiteIcon name="arrow-right"/></button></article>)}</div></section><PageCTA title="Need a connected learning path?" body="OV School brings the tools into a structured founder practice." primary={{label:"Explore OV School",href:"/programs/ov-school"}} secondary={{label:"View curriculum",href:"/programs/ov-school/curriculum"}} /></SiteShell>;
}

function EventsDirectory() {
  const [filter,setFilter]=useState("All");
  const filters=["All","Online","Hybrid","In person"];
  const visible=filter==="All"?eventRecords:eventRecords.filter((event)=>event.format===filter);
  return <SiteShell><SceneHero className="events-hero" number="01" eyebrow="Events" title="Rooms for the conversations that move companies forward." body="Founder sessions, operator clinics, roundtables, and open workshops designed around the work behind the next company decision." image="/assets/odra-founder-collaboration.png" actions={[{label:"See event formats",href:"#event-list"},{label:"Explore programs",href:"/programs"}]} /><section className="public-scene public-content" id="event-list" data-camera-label="Event directory"><div className="filter-bar" aria-label="Filter events">{filters.map((value)=><button className={filter===value?"active":""} type="button" onClick={()=>setFilter(value)} key={value}>{value}</button>)}</div><div className="event-directory">{visible.map((event,index)=><a className="event-directory-card motion-card" href={`/events/${event.slug}`} key={event.slug}><span>{String(index+1).padStart(2,"0")}</span><figure><img src={event.image} alt=""/><small>{event.status}</small></figure><div><small>{event.type} · {event.format} · {event.duration}</small><h2>{event.title}</h2><p>{event.body}</p><strong>{event.cadence} · {event.audience}</strong><div className="event-host-thumbs">{event.hosts.map((name)=>{const host=team.find((person)=>person.name===name);return host?<img src={host.image} alt={host.name} key={name}/>:null;})}</div></div><SiteIcon name="arrow-right"/></a>)}</div></section><section className="public-scene public-content split-story" data-camera-label="Event principles"><SectionIntro eyebrow="How the rooms work" title="Small enough to participate. Focused enough to leave with a decision." /><div className="statement-list">{["Built around a real founder or operator question","Clear audience and preparation before the session","Practical working time—not presentation theatre","A visible next action after the conversation"].map((item,index)=><article className="motion-card" key={item}><span>0{index+1}</span><p>{item}</p></article>)}</div></section><PageCTA title="Bring a useful conversation into the network." body="Speaker, facilitator, and ecosystem-partner enquiries can start through the contact page." primary={{label:"Contact the team",href:"/contact"}} secondary={{label:"Explore the network",href:"/network"}} /></SiteShell>;
}

function EventRegistration({ event }) {
  const [complete, setComplete] = useState(false);
  if (complete) return <div className="event-registration-success" role="status"><span>Interest registered</span><h3>You are on the room list.</h3><p>We’ll use the details you shared to match the invitation and preparation notes to the right founder context.</p><button type="button" onClick={() => setComplete(false)}>Update details</button></div>;
  return <form className="event-registration-form" onSubmit={(e)=>{e.preventDefault();setComplete(true);}}><label><span>Name</span><input required placeholder="Your name"/></label><label><span>Work email</span><input required type="email" placeholder="you@company.com"/></label><label><span>Company and role</span><input required placeholder="Company · founder / operator"/></label><label><span>Question for the room</span><textarea required placeholder="What decision or constraint would make this session useful?"/></label><button className="primary-action" type="submit">Register interest <SiteIcon name="arrow-right"/></button><small>{event.status} · {event.format} · {event.duration}</small></form>;
}

function EventDetail({ event }) {
  const hosts=event.hosts.map((name)=>team.find((person)=>person.name===name)).filter(Boolean);
  return <SiteShell><SceneHero number="E" eyebrow={`${event.type} · ${event.format}`} title={event.title} body={event.body} image={event.image} actions={[{label:"Register interest",href:"#register"},{label:"Back to events",href:"/events"}]} /><section className="public-scene public-content event-facts" data-camera-label="Event overview"><SectionIntro eyebrow="Event overview" title="Everything you need before entering the room."/><div>{[["Status",event.status],["Cadence",event.cadence],["Format",event.format],["Duration",event.duration],["Audience",event.audience]].map(([label,value])=><article className="motion-card" key={label}><small>{label}</small><strong>{value}</strong></article>)}</div></section><section className="public-scene public-content" data-camera-label="Working agenda"><SectionIntro eyebrow="Working agenda" title="A focused sequence from context to action." /><div className="numbered-journey">{event.agenda.map((item,index)=><article className="motion-card" key={item}><span>{String(index+1).padStart(2,"0")}</span><h3>{item}</h3><p>{index===event.agenda.length-1?"Capture the decision, owner, and next action before leaving the room.":"Use shared context and practical prompts to turn experience into a useful company decision."}</p></article>)}</div></section><section className="public-scene public-content event-hosts" data-camera-label="People in the room"><SectionIntro eyebrow="People in the room" title="Relevant operating perspective, close to the work." body="Meet the Odra team members shaping the questions, prompts, and founder discussion in this room."/><div>{hosts.map((host)=><a className="motion-card" href={`/team/${slugify(host.name)}`} key={host.name}><img src={host.image} alt={host.name}/><small>{host.role}</small><h3>{host.name}</h3><p>{host.meta}</p><span>Meet {host.name.split(" ")[0]} →</span></a>)}</div></section><section className="public-scene interest-panel event-register-panel" id="register" data-camera-label="Register interest"><div><p className="kicker">Register interest</p><h2>Bring the real company question.</h2><p>Tell us enough to understand your stage, role, and the decision you want to move forward.</p></div><EventRegistration event={event}/></section></SiteShell>;
}

function NetworkPage() {
  const layers=[["01","Founder peers","A trusted room for comparing the difficult work, not performing certainty."],["02","Operators","Functional experience across product, commercial systems, technology, hiring, and organisational design."],["03","Capital relationships","Context-aware introductions when the company, evidence, and timing make the conversation useful."],["04","Market access","Customers, partners, and ecosystem relationships that can help test or extend a credible route to market."],["05","Learning infrastructure","Programs, resources, events, and founder practices that turn access into repeatable capability."],["06","Local roots, global reach","Polish and European operating context connected to global founder ambition and market opportunity."]];
  return <SiteShell><SceneHero number="N" eyebrow="Network ecosystem" title="Access matters when context arrives with it." body="Odra connects founders with peers, operators, capital relationships, market pathways, and learning infrastructure around the decision in front of the company." image="/assets/odra-global-network-map.png" actions={[{label:"Explore founder support",href:"/founder-support"},{label:"Meet at an event",href:"/events"}]} /><section className="public-scene public-content" data-camera-label="Network layers"><SectionIntro eyebrow="Six connected layers" title="A network designed around useful movement." /><div className="network-layer-grid">{layers.map(([n,t,b])=><article className="motion-card" key={n}><span>{n}</span><h3>{t}</h3><p>{b}</p></article>)}</div></section><section className="public-scene network-map-room" data-camera-label="How access moves"><img src="/assets/odra-global-network-map.png" alt="Abstract map representing Odra's connected founder network"/><div className="motion-heading"><p className="kicker">How access moves</p><h2>Question → context → relationship → next action.</h2><p>The aim is not the largest possible introduction list. It is the smallest useful set of conversations around a clear founder need.</p></div></section><PageCTA title="Tell us which conversation could change the next decision." body="Founder, operator, ecosystem, and event enquiries can begin through one clear contact route." primary={{label:"Contact Odra",href:"/contact"}} secondary={{label:"Explore programs",href:"/programs"}} /></SiteShell>;
}

function TeamDirectory() {
  return <SiteShell><SceneHero number="T" eyebrow="People" title="Experience that enters the room when it is useful." body="Meet the people behind Odra Venture and the operating perspectives they bring to founder, company, and investment conversations." image="/assets/odra-architectural-hero.webp" actions={[{label:"Explore the network",href:"/network"},{label:"Contact the team",href:"/contact"}]} /><section className="public-scene public-content" data-camera-label="Team directory"><SectionIntro eyebrow="The team" title="Different backgrounds. Shared responsibility to the founder journey." /><div className="public-team-grid">{team.map((person,index)=><a className="public-team-card motion-card" href={`/team/${slugify(person.name)}`} key={person.name}><div><img src={person.image} alt={person.name}/><span>{String(index+1).padStart(2,"0")}</span></div><small>{person.role}</small><h2>{person.name}</h2><p>{person.body}</p><b>View profile <SiteIcon name="arrow-right"/></b></a>)}</div></section><PageCTA title="A useful relationship begins with the company context." body="Start with the application or choose the contact pathway that best matches the conversation." primary={{label:"Start application",href:"/apply"}} secondary={{label:"Contact Odra",href:"/contact"}} /></SiteShell>;
}

function TeamProfile({ person }) {
  return <SiteShell><section className="public-scene team-profile-hero" data-camera-label="Team profile"><div className="team-profile-copy motion-heading"><a href="/team">← Back to team</a><p className="kicker">{person.role}</p><h1>{person.name}</h1><p>{person.body}</p><div>{person.tags?.map((tag)=><span key={tag}>{tag}</span>)}</div><div className="profile-links"><a className="secondary-action" href={person.linkedin} target="_blank" rel="noreferrer">LinkedIn <SiteIcon name="arrow-up-right"/></a>{person.sources?.map((source)=><a className="secondary-action" href={source.href} target="_blank" rel="noreferrer" key={source.href}>{source.label}<SiteIcon name="arrow-up-right"/></a>)}</div></div><figure className="motion-mask"><img src={person.image} alt={person.name}/></figure></section><section className="public-scene public-content split-story" data-camera-label="Working perspective"><SectionIntro eyebrow="Working perspective" title="Experience becomes useful through the question in front of the company." /><div className="profile-principles"><p>Founder conversations begin with context: the current stage, the evidence available, the trade-offs under consideration, and the decision that cannot remain vague.</p><p>The aim is practical clarity—connecting relevant experience to the company’s current product, market, operating, or investment question.</p></div></section><PageCTA title="Continue into the wider Odra network." body="Meet the rest of the team or explore how founder support is structured." primary={{label:"Meet the team",href:"/team"}} secondary={{label:"Founder support",href:"/founder-support"}} /></SiteShell>;
}

function AboutPage() {
  const principles=[["01","Founder reality first","Begin with the company’s actual stage, evidence, constraints, and ambition."],["02","Conviction with questions","Hold a point of view while making uncertainty visible and testable."],["03","Access with context","Connect people and opportunities around a specific decision—not a generic network promise."],["04","Systems that outlast the moment","Help founders build learning, product, commercial, and organisational rhythms they can own."],["05","Global ambition, grounded roots","Carry Polish and European context confidently while meeting founders wherever the company can matter."],["06","Trust before theatre","Use clear language, precise relationship labels, and honest boundaries around what is known."]];
  return <SiteShell><SceneHero number="A" eyebrow="About Odra" title="Polish roots. Global founder ambition." body="Odra Venture connects investment conversations, company-building programs, learning infrastructure, network access, events, and practical insight in one continuous founder journey." image="/assets/odra-architectural-hero.webp" actions={[{label:"Our investment approach",href:"/investment"},{label:"Explore programs",href:"/programs"}]} /><section className="public-scene public-content about-manifesto" data-camera-label="Why Odra"><SectionIntro eyebrow="Why Odra" title="The work between the milestones determines what can happen next." /><div><p>Founders are often surrounded by fragmented advice, disconnected introductions, and pressure to present certainty before the company has earned it.</p><p>Odra’s role is to create a more useful environment: one where the evidence becomes clearer, the right people enter with context, and the next decision improves the company’s ability to keep building.</p></div></section><section className="public-scene public-content" data-camera-label="Operating principles"><SectionIntro eyebrow="Operating principles" title="How the platform shows up." /><div className="principle-public-grid">{principles.map(([n,t,b])=><article className="motion-card" key={n}><span>{n}</span><h3>{t}</h3><p>{b}</p></article>)}</div></section><section className="public-scene public-content about-model" data-camera-label="The platform"><SectionIntro eyebrow="One connected platform" title="Capital, capability, context, and community." /><div className="model-rings">{["Investment","Programs","OV School","Network","Insights","Events"].map((item,index)=><a href={item==="Investment"?"/investment":item==="Programs"?"/programs":item==="OV School"?"/programs/ov-school":item==="Network"?"/network":item==="Insights"?"/insights":"/events"} key={item}><span>0{index+1}</span>{item}</a>)}</div></section><PageCTA title="Choose the doorway that matches your next question." body="Explore the platform directly or start with the founder pathway matcher." primary={{label:"Start pathway matcher",href:"/apply"}} secondary={{label:"Explore the network",href:"/network"}} /></SiteShell>;
}

function ContactPage() {
  const [submitted,setSubmitted]=useState(false);
  const onSubmit=(event)=>{event.preventDefault();setSubmitted(true);};
  return <SiteShell><SceneHero number="C" eyebrow="Contact" title="Start with the conversation you actually need." body="Choose the closest route for founder, program, event, network, media, or general questions. Investment and program applications should begin through the application journey." image="/assets/odra-founder-collaboration.png" actions={[{label:"Start an application",href:"/apply"},{label:"Read the application guide",href:"/apply/guide"}]} /><section className="public-scene contact-workspace" data-camera-label="Contact pathways"><aside><p className="kicker">Contact pathways</p>{[["Founders","Applications and pathway fit begin at /apply."],["Operators and ecosystem","Share the context and the kind of contribution you have in mind."],["Events and speaking","Describe the audience, question, format, and intended outcome."],["Media and general","Use the form for institutional or general enquiries."]].map(([title,body])=><div key={title}><strong>{title}</strong><p>{body}</p></div>)}<a href="mailto:hello@odraventure.com">hello@odraventure.com</a></aside>{submitted?<div className="contact-success" role="status"><span>Conversation started</span><h2>Thank you for the context.</h2><p>The clearest conversations begin with the real question. Continue exploring Odra or update the message you prepared.</p><button type="button" onClick={()=>setSubmitted(false)}>Update message</button></div>:<form className="contact-form" onSubmit={onSubmit}><label><span>Name</span><input required name="name" placeholder="Your name"/></label><label><span>Work email</span><input required type="email" name="email" placeholder="you@company.com"/></label><label><span>Conversation</span><select required name="topic" defaultValue=""><option value="" disabled>Select the closest route</option><option>Founder or company</option><option>Operator or ecosystem</option><option>Event or speaking</option><option>Media</option><option>General enquiry</option></select></label><label><span>Context</span><textarea required name="message" placeholder="What are you working through, and what would make the conversation useful?"/></label><label className="contact-consent"><input required type="checkbox"/><span>I agree that Odra may use these details to respond to my enquiry.</span></label><button className="primary-action" type="submit">Send enquiry <SiteIcon name="arrow-right"/></button></form>}</section></SiteShell>;
}

function TrustPage() {
  const topics=[
    ["Privacy","Founder and company information is handled around a clear purpose, defined access, proportional retention, and an appropriate privacy notice."],
    ["Cookies and measurement","Essential, preference, and analytics technologies are explained by purpose, duration, provider, and user control."],
    ["Security","Sensitive diligence material uses dedicated access, encryption, monitoring, and a clear reporting path rather than a general public form."],
    ["Accessibility","The platform is designed around keyboard access, focus visibility, contrast, reflow, structured forms, clear content, and reduced motion."],
    ["Relationship clarity","Program, network, application, and investment pathways use precise language so founders can understand the route, stage, and decision in front of them."],
    ["Content governance","Dates, eligibility, locations, partner benefits, program details, outcomes, and relationship labels are maintained as governed content records."],
  ];
  return <SiteShell><SceneHero number="T" eyebrow="Trust centre" title="Clarity is part of the product." body="A single place for the principles behind privacy, security, accessibility, content accuracy, and founder-facing interactions." image="/assets/odra-editorial-mint.webp" actions={[{label:"Contact Odra",href:"/contact"},{label:"Application guide",href:"/apply/guide"}]} /><section className="public-scene public-content" data-camera-label="Trust topics"><SectionIntro eyebrow="Trust topics" title="Built to be understandable at every step." /><div className="trust-grid">{topics.map(([title,body],index)=><article id={title.toLowerCase()} className="motion-card" key={title}><span>{String(index+1).padStart(2,"0")}</span><h3>{title}</h3><p>{body}</p></article>)}</div></section><section className="public-scene public-content split-story" data-camera-label="Founder controls"><SectionIntro eyebrow="Founder controls" title="Clear choices around data, communication, and participation." body="People should be able to understand what is requested, why it matters, and how to ask questions or change their preferences." /><div className="trust-status"><span>Core commitment</span><strong>Clarity before complexity.</strong><p>Plain-language pathways, accessible interaction, secure handling, and visible points of contact across the Odra platform.</p></div></section><PageCTA title="Have a trust, privacy, or accessibility question?" body="Use the contact route and choose the general enquiry pathway." primary={{label:"Contact the team",href:"/contact"}} secondary={{label:"Return home",href:"/"}} /></SiteShell>;
}

export default function PublicRoutes({ path }) {
  if (path === "/programs") return <ProgramsPage />;
  if (path === programs.school.route) return <ProgramDetail program={programs.school} />;
  if (path === "/programs/ov-school/curriculum") return <CurriculumPage />;
  if (path === programs.accelerator.route) return <ProgramDetail program={programs.accelerator} />;
  if (path === programs.scale.route) return <ProgramDetail program={programs.scale} />;
  if (path === "/apply/guide") return <ApplicationGuidePage />;
  if (path === "/insights") return <InsightsPage />;
  if (path.startsWith("/insights/")) return <InsightDetail item={insightRecords.find((item)=>`/insights/${item.slug}`===path) || insightRecords[0]} />;
  if (path === "/resources") return <ResourcesPage />;
  if (path === "/events") return <EventsDirectory />;
  if (path.startsWith("/events/")) return <EventDetail event={eventRecords.find((item)=>`/events/${item.slug}`===path) || eventRecords[0]} />;
  if (path === "/network") return <NetworkPage />;
  if (path === "/team") return <TeamDirectory />;
  if (path.startsWith("/team/")) return <TeamProfile person={team.find((person)=>`/team/${slugify(person.name)}`===path) || team[0]} />;
  if (path === "/about") return <AboutPage />;
  if (path === "/contact") return <ContactPage />;
  if (path === "/trust") return <TrustPage />;
  return null;
}
