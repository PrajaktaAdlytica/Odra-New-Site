import { useState } from "react";
import { SiteIcon, SiteShell } from "../components/SiteChrome";

const schoolNav = [
  ["Dashboard", "/school/dashboard"],
  ["Curriculum", "/school/curriculum"],
  ["Progress", "/school/progress"],
  ["Weekly update", "/school/weekly-update"],
  ["Company", "/school/company"],
  ["Community", "/school/community"],
  ["Opportunities", "/school/opportunities"],
  ["Events", "/school/events"],
  ["Calendar", "/school/calendar"],
  ["Notifications", "/school/notifications"],
  ["Settings", "/school/settings"],
  ["Help", "/school/help"],
];

const modules = [
  ["01", "Founder clarity", "Define the company thesis, the current stage, and the most important uncertainty.", 100],
  ["02", "Customer evidence", "Turn conversations and behaviour into signals that improve decisions.", 68],
  ["03", "Product rhythm", "Connect discovery, delivery, measurement, and review.", 32],
  ["04", "Commercial foundations", "Build a focused route from buyer problem to repeatable conversation.", 0],
  ["05", "Company craft", "Design roles, communication, priorities, and decision rights.", 0],
  ["06", "Capital readiness", "Prepare the evidence and narrative behind a useful funding process.", 0],
];

function AuthPage({ mode }) {
  const [state, setState] = useState("idle");
  const copy = mode === "sign-up" ? ["Create your OV School account", "Begin with the founder and company essentials.", "Create account"] : mode === "forgot-password" ? ["Reset your password", "Enter the email connected to your learning workspace.", "Send reset link"] : ["Welcome back to OV School", "Continue the work behind the company.", "Sign in"];
  const submit = (event) => { event.preventDefault(); setState("loading"); window.setTimeout(() => setState("success"), 650); };
  return <SiteShell><section className="school-auth-scene" data-camera-label="OV School access"><div className="school-auth-story"><p className="kicker">OV School</p><h1>Learn in the room.<br />Build in the company.</h1><p>A founder learning environment where lessons, exercises, evidence, and weekly decisions stay connected.</p><a href="/programs/ov-school">Explore the public program <SiteIcon name="arrow-right" /></a></div><div className="school-auth-card">{state === "success" ? <div className="school-auth-success" role="status"><span>OV School access</span><h2>{mode === "forgot-password" ? "Check your inbox." : "Your workspace is ready."}</h2><p>{mode === "forgot-password" ? "Follow the reset instructions to return to your founder workspace." : "Continue into the dashboard and pick up the company work that matters this week."}</p><a className="primary-action" href="/school/dashboard">Open dashboard <SiteIcon name="arrow-right" /></a></div> : <form onSubmit={submit}><span>Founder workspace</span><h2>{copy[0]}</h2><p>{copy[1]}</p>{mode === "sign-up" && <div className="school-field-row"><label><span>First name</span><input required placeholder="First name" /></label><label><span>Last name</span><input required placeholder="Last name" /></label></div>}<label><span>Work email</span><input required type="email" placeholder="you@company.com" /></label>{mode !== "forgot-password" && <label><span>Password</span><input required type="password" minLength="8" placeholder="At least 8 characters" /></label>}<button className="primary-action" type="submit" disabled={state === "loading"}>{state === "loading" ? "Preparing…" : copy[2]} <SiteIcon name="arrow-right" /></button>{mode === "sign-in" && <a href="/school/forgot-password">Forgot password?</a>}<small>{mode === "sign-up" ? <>Already have an account? <a href="/school/sign-in">Sign in</a></> : <>New to OV School? <a href="/school/sign-up">Create account</a></>}</small></form>}</div></section></SiteShell>;
}

function SchoolSideNav({ path }) {
  return <aside className="school-sidebar"><a className="school-wordmark" href="/programs/ov-school"><span>OV</span><strong>School</strong></a><nav aria-label="OV School"><small>Learning workspace</small>{schoolNav.map(([label,href])=><a className={path===href?"active":""} href={href} key={href}><span>{label}</span><b>→</b></a>)}</nav><div className="school-sidebar-context"><strong>Move between every layer</strong><p>Connect the public OV School story, founder workspace, and wider Odra Venture platform.</p><a href="/programs/ov-school">OV School overview <span>↗</span></a><a href="/">Odra Venture home <span>↗</span></a></div></aside>;
}

function Workspace({ path, children, label, title, summary, actions }) {
  return <SiteShell><section className="school-app" data-camera-label={label}><SchoolSideNav path={path}/><main className="school-main"><header className="school-topbar"><div><p className="kicker">{label}</p><h1>{title}</h1><p>{summary}</p></div><div>{actions}</div></header>{children}</main></section></SiteShell>;
}

function Dashboard() {
  return <Workspace path="/school/dashboard" label="Founder dashboard" title="Good morning, Founder." summary="Return to the most important learning, evidence, and company decision for this week." actions={<a className="secondary-action" href="/school/weekly-update">Write weekly update <SiteIcon name="arrow-right"/></a>}><div className="school-dashboard-grid"><article className="school-next-card"><small>Continue learning · Module 02</small><h2>Customer evidence that changes a decision</h2><p>Distinguish observation, interpretation, and belief before choosing the next experiment.</p><div><span><i style={{width:"68%"}}/>68% complete</span><a href="/school/lesson/customer-evidence">Continue lesson →</a></div></article><article className="school-decision-card"><small>This week’s decision</small><h2>Which buyer assumption needs evidence before product scope expands?</h2><a href="/school/weekly-update">Open weekly review →</a></article><article className="school-signal-card"><span>Evidence log</span><strong>7</strong><p>Signals recorded this month</p><a href="/school/company">Review company evidence</a></article><article className="school-signal-card"><span>Current streak</span><strong>3</strong><p>Weekly reviews completed</p><a href="/school/progress">View progress</a></article></div><section className="school-workstream"><header><div><small>Current company work</small><h2>From interview notes to a sharper buyer hypothesis</h2></div><span>In progress</span></header><ol><li className="complete"><span>✓</span><div><strong>Capture five customer signals</strong><small>Exercise complete</small></div></li><li className="active"><span>02</span><div><strong>Separate evidence from interpretation</strong><small>Continue in Module 02</small></div></li><li><span>03</span><div><strong>Choose the next decision-ready test</strong><small>Unlocks next</small></div></li></ol></section></Workspace>;
}

function Curriculum() {
  return <Workspace path="/school/curriculum" label="Curriculum" title="Your learning path." summary="Six connected modules move from founder clarity to capital readiness."><div className="school-module-list">{modules.map(([number,title,body,progress])=><a className={progress===0?"locked":""} href={progress===0?"/school/curriculum":`/school/lesson/${title.toLowerCase().replace(/\s+/g,"-")}`} key={number}><span>{number}</span><div><small>{progress===100?"Complete":progress>0?"In progress":"Upcoming"}</small><h2>{title}</h2><p>{body}</p><i><b style={{width:`${progress}%`}}/></i></div><strong>{progress}%</strong><b>→</b></a>)}</div></Workspace>;
}

function LessonPage({ slug }) {
  const title = slug.split("-").map((word)=>word.charAt(0).toUpperCase()+word.slice(1)).join(" ");
  return <Workspace path="/school/curriculum" label="Module 02 · Lesson" title={title} summary="A short learning room connected to one company-applied exercise." actions={<a className="secondary-action" href="/school/curriculum">Back to curriculum</a>}><article className="school-lesson"><aside><small>In this lesson</small><a href="#idea">The core idea</a><a href="#practice">Put it into practice</a><a href="#reflection">Founder reflection</a><div><strong>12 min</strong><span>Reading and exercise</span></div></aside><div><section id="idea"><span>01</span><h2>Evidence is useful when it changes what the company does next.</h2><p>Observation describes what happened. Interpretation explains what it may mean. Belief is the current working view. Keeping them separate makes disagreement more productive and experiments more precise.</p><blockquote>Do not ask whether the signal is encouraging. Ask which decision it should influence and what would change your mind.</blockquote></section><section id="practice"><span>02</span><h2>Choose one important customer signal.</h2><p>Write the observation without explanation. Add two plausible interpretations, then identify the decision each interpretation would imply.</p><a className="primary-action" href="/school/exercise/evidence-map">Open exercise <SiteIcon name="arrow-right"/></a></section><section id="reflection"><span>03</span><h2>Founder reflection</h2><p>Where is the team treating a repeated belief as evidence because it supports the preferred plan?</p></section></div></article></Workspace>;
}

function ExercisePage() {
  const [saved,setSaved]=useState(false);
  return <Workspace path="/school/curriculum" label="Exercise" title="Customer evidence map." summary="Turn one signal into a clearer decision and a better next test."><form className="school-exercise" onSubmit={(event)=>{event.preventDefault();setSaved(true);}}><div><span>01</span><label><strong>Observation</strong><small>What happened, without interpretation?</small><textarea required placeholder="A customer did, said, or avoided…"/></label></div><div><span>02</span><label><strong>Possible interpretations</strong><small>What could the observation mean?</small><textarea required placeholder="One explanation could be… Another could be…"/></label></div><div><span>03</span><label><strong>Decision</strong><small>Which company decision should this signal inform?</small><textarea required placeholder="This should help us decide whether…"/></label></div><div><span>04</span><label><strong>Next test</strong><small>What small test would distinguish the interpretations?</small><textarea required placeholder="In the next cycle we will…"/></label></div><footer><p>{saved?"Exercise saved · ready for the weekly review":"Draft · complete each field to connect the signal to a decision"}</p><button className="primary-action" type="submit">Save exercise <SiteIcon name="arrow-right"/></button></footer></form></Workspace>;
}

function ProgressPage() {
  return <Workspace path="/school/progress" label="Progress" title="Learning translated into company movement." summary="Track module completion, weekly practice, and the evidence behind important decisions."><div className="progress-overview"><article><span>Program progress</span><strong>33%</strong><i><b style={{width:"33%"}}/></i><p>2 of 6 modules active or complete</p></article><article><span>Weekly practice</span><strong>3 / 4</strong><p>Founder updates completed this month</p></article><article><span>Exercises</span><strong>8</strong><p>Company-applied exercises completed</p></article></div><section className="progress-timeline"><header><small>Learning timeline</small><h2>Recent movement</h2></header>{[["Today","Customer evidence map","Exercise state prepared"],["This week","Customer evidence","Lesson in progress"],["Last week","Founder thesis","Module completed"],["Earlier","Company orientation","Starting context captured"]].map(([time,title,state])=><article key={title}><span>{time}</span><div><strong>{title}</strong><p>{state}</p></div><b>✓</b></article>)}</section></Workspace>;
}

function WeeklyUpdate() {
  const [done,setDone]=useState(false);
  return <Workspace path="/school/weekly-update" label="Weekly update" title="Make the learning visible." summary="A short founder review connecting evidence, decisions, constraints, and the next company move.">{done?<div className="school-update-success"><span>Week reviewed</span><h2>Your reflection is ready.</h2><p>The evidence, decision, current constraint, and next move are now connected in one founder review.</p><button type="button" onClick={()=>setDone(false)}>Edit review</button></div>:<form className="weekly-form" onSubmit={(event)=>{event.preventDefault();setDone(true);}}>{[["Evidence","What did the company learn that matters?"],["Decision","Which decision became clearer?"],["Constraint","What is now limiting progress?"],["Next move","What will the team do before the next review?"]].map(([label,prompt],index)=><label key={label}><span>0{index+1}</span><strong>{label}</strong><small>{prompt}</small><textarea required placeholder="Write a concise, specific reflection…"/></label>)}<button className="primary-action" type="submit">Complete weekly review <SiteIcon name="arrow-right"/></button></form>}</Workspace>;
}

function CompanyPage() {
  return <Workspace path="/school/company" label="Company workspace" title="One shared view of the company now." summary="Keep the thesis, customer, evidence, priorities, and next-stage questions connected."><div className="company-workspace-grid">{[["Company thesis","We help a specific user make an important job meaningfully easier.","Review thesis"],["Primary customer","Operations leaders in complex, multi-system environments.","Edit customer"],["Current evidence","Seven signals recorded across interviews and workflow observation.","Open evidence log"],["Critical assumption","The buyer will prioritise reconciliation speed over broader reporting depth.","Plan a test"],["This month’s priority","Prove repeated urgency before expanding the product surface.","Review priority"],["Next-stage question","What evidence would justify a repeatable commercial motion?","Open readiness view"]].map(([title,body,action])=><article key={title}><small>{title}</small><h2>{body}</h2><button type="button">{action} →</button></article>)}</div></Workspace>;
}

function SchoolEvents() {
  return <Workspace path="/school/events" label="Founder events" title="Learning happens in rooms with other builders." summary="Upcoming sessions connected to the curriculum and company work."><div className="school-event-list">{[["Founder room","Evidence without theatre","Peer session · Online","Bring one signal and the decision it should inform."],["Operator clinic","Early pipeline learning","Working clinic · Hybrid","Review what is moving, stalling, and teaching the team."],["Mentor room","Founder roles under pressure","Small group · Online","Clarify responsibilities before company complexity grows."]].map(([type,title,meta,body],index)=><article key={title}><span>{String(index+1).padStart(2,"0")}</span><div><small>{type} · {meta}</small><h2>{title}</h2><p>{body}</p></div><button className="register-interest-action" type="button"><span>Register interest</span><SiteIcon name="arrow-right"/></button></article>)}</div></Workspace>;
}

function CommunityPage() {
  const rooms=[["Founder circle","Customer evidence","8 founders","Bring one interview signal and the decision it should inform."],["Peer review","Product focus","6 founders","Share the product choice the team is struggling to make."],["Operator office hours","Early sales systems","Open room","Work through one pipeline constraint with an experienced operator."],["Build log","Weekly progress","Community feed","Share one learning, one decision, and one question for the network."]];
  return <Workspace path="/school/community" label="Founder community" title="Build beside people doing the same difficult work." summary="Focused peer rooms, operator access, and company practice—not an endless social feed."><div className="school-community-grid">{rooms.map(([type,title,size,body],index)=><article className="motion-card" key={title}><span>{String(index+1).padStart(2,"0")}</span><small>{type} · {size}</small><h2>{title}</h2><p>{body}</p><button type="button">Enter room →</button></article>)}</div></Workspace>;
}

function OpportunitiesPage() {
  const opportunities=[["Customer discovery","Enterprise workflow interviews","Market access","Warm conversations with operators exploring reconciliation and workflow automation."],["Founder talent","Technical co-founder circle","Team building","Meet builders interested in joining early technology companies."],["Ecosystem","Partner office hours","Infrastructure","Talk with technology and specialist partners around the next operating constraint."],["Showcase","Founder demo room","Visibility","Prepare a concise product and evidence narrative for the wider Odra network."]];
  return <Workspace path="/school/opportunities" label="Opportunities" title="The right opening, with the right context." summary="Customer conversations, talent, expert access, and founder visibility organised around company readiness."><div className="school-opportunity-list">{opportunities.map(([type,title,category,body],index)=><article className="motion-card" key={title}><span>{String(index+1).padStart(2,"0")}</span><div><small>{category}</small><h2>{title}</h2><p>{body}</p></div><b>{type}</b><button type="button">View opportunity →</button></article>)}</div></Workspace>;
}

function CalendarPage() {
  const days=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
  return <Workspace path="/school/calendar" label="Calendar" title="Your founder rhythm at a glance." summary="Learning, exercises, review, and founder rooms in one weekly view."><div className="school-calendar"><header><button type="button" aria-label="Previous week">←</button><div><small>Current learning week</small><h2>Founder practice</h2></div><button type="button" aria-label="Next week">→</button></header><div>{days.map((day,index)=><article className={index===2?"today":""} key={day}><span>{day}</span><strong>{18+index}</strong>{index===0&&<p>Module 02<br/><small>Lesson</small></p>}{index===2&&<p>Evidence room<br/><small>Founder session</small></p>}{index===4&&<p>Weekly review<br/><small>Due</small></p>}</article>)}</div></div></Workspace>;
}

function NotificationsPage() {
  return <Workspace path="/school/notifications" label="Notifications" title="Only the signals that help you move." summary="Learning, review, and event updates ordered by what needs attention."><div className="notification-list">{[["Now","Weekly review opens","Connect this week’s evidence to one visible decision.",true],["Today","New founder-room note","Preparation is available for Evidence without theatre.",true],["Yesterday","Module 02 progress","You completed the first two lessons in Customer evidence.",false],["Earlier","Company workspace prompt","Review the critical assumption before adding new product scope.",false]].map(([time,title,body,unread])=><article className={unread?"unread":""} key={title}><span>{unread?"•":"✓"}</span><div><small>{time}</small><h2>{title}</h2><p>{body}</p></div><button type="button" aria-label={`Open ${title}`}>→</button></article>)}</div></Workspace>;
}

function SettingsPage() {
  return <Workspace path="/school/settings" label="Settings" title="Control your learning workspace." summary="Set the profile and learning preferences that shape your founder rhythm."><form className="settings-groups" onSubmit={(event)=>event.preventDefault()}><section><header><h2>Profile</h2><p>How you appear in founder rooms.</p></header><label><span>Display name</span><input defaultValue="Founder"/></label><label><span>Role</span><input defaultValue="Co-founder"/></label></section><section><header><h2>Learning preferences</h2><p>Choose how the workspace supports your weekly rhythm.</p></header><label className="setting-toggle"><span><strong>Weekly review reminder</strong><small>Prompt the Friday founder reflection.</small></span><input type="checkbox" defaultChecked/></label><label className="setting-toggle"><span><strong>Event updates</strong><small>Show relevant founder-room announcements.</small></span><input type="checkbox" defaultChecked/></label><label className="setting-toggle"><span><strong>Reduced motion</strong><small>Also follows the device-level preference.</small></span><input type="checkbox"/></label></section><button className="primary-action" type="submit">Save preferences</button></form></Workspace>;
}

function HelpPage() {
  const [open,setOpen]=useState(0);
  const questions=[["How does the weekly rhythm work?","Complete the current lesson or exercise, record the company evidence that matters, and use the weekly update to connect it to one decision and next action."],["How do I return to unfinished work?","Exercises stay in Draft until the founder completes the review. The dashboard always shows the next useful learning and company action."],["How do founder rooms work?","Each room has a clear audience, preparation prompt, working question, and intended next action. Register from Events or Community."],["Where should sensitive material go?","Use the company workspace for learning context. The Odra team will provide a dedicated route whenever confidential diligence material is requested."]];
  return <Workspace path="/school/help" label="Help centre" title="Find the next useful answer." summary="Guidance for the learning workspace, founder rhythm, events, community, and company practice."><div className="help-layout"><aside><strong>Need a person?</strong><p>Use the public contact route for program or access questions.</p><a href="/contact">Contact Odra →</a></aside><div className="help-faq">{questions.map(([question,answer],index)=><article className={open===index?"open":""} key={question}><button type="button" onClick={()=>setOpen(open===index?-1:index)} aria-expanded={open===index}><span>{question}</span><b>{open===index?"−":"+"}</b></button><p>{answer}</p></article>)}</div></div></Workspace>;
}

export default function SchoolRoutes({ path }) {
  if (path === "/school/sign-up") return <AuthPage mode="sign-up"/>;
  if (path === "/school/sign-in") return <AuthPage mode="sign-in"/>;
  if (path === "/school/forgot-password") return <AuthPage mode="forgot-password"/>;
  if (path === "/school/onboarding") return <Onboarding/>;
  if (path === "/school/dashboard") return <Dashboard/>;
  if (path === "/school/curriculum") return <Curriculum/>;
  if (path.startsWith("/school/lesson/")) return <LessonPage slug={path.split("/").pop()}/>;
  if (path.startsWith("/school/exercise/")) return <ExercisePage/>;
  if (path === "/school/progress") return <ProgressPage/>;
  if (path === "/school/weekly-update") return <WeeklyUpdate/>;
  if (path === "/school/company") return <CompanyPage/>;
  if (path === "/school/community") return <CommunityPage/>;
  if (path === "/school/opportunities") return <OpportunitiesPage/>;
  if (path === "/school/events") return <SchoolEvents/>;
  if (path === "/school/calendar") return <CalendarPage/>;
  if (path === "/school/notifications") return <NotificationsPage/>;
  if (path === "/school/settings") return <SettingsPage/>;
  if (path === "/school/help") return <HelpPage/>;
  return <AuthPage mode="sign-in"/>;
}

function Onboarding() {
  const [step,setStep]=useState(0);
  const screens=[
    ["Founder context","What role do you hold in the company?",["Founder / co-founder","Founding team","Operator"]],
    ["Company stage","Which description is closest today?",["Idea or pre-product","Product or prototype","Early market evidence","Preparing to scale"]],
    ["Learning priority","What would make the next stage more credible?",["Customer evidence","Product focus","Commercial system","Team and company craft","Capital readiness"]],
  ];
  const current=screens[step];
  return <SiteShell><section className="onboarding-scene" data-camera-label="OV School onboarding"><aside><a href="/school/sign-in">OV School</a><span>0{step+1} / 03</span><div><i style={{width:`${((step+1)/3)*100}%`}}/></div><p>Three short questions shape the initial learning view and bring the most relevant company practice forward.</p></aside><form onSubmit={(event)=>{event.preventDefault();step<2?setStep(step+1):window.location.assign("/school/dashboard");}}><p className="kicker">{current[0]}</p><h1>{current[1]}</h1><fieldset>{current[2].map((answer,index)=><label key={answer}><input required type="radio" name={`step-${step}`} value={answer}/><span>0{index+1}</span><strong>{answer}</strong><b>→</b></label>)}</fieldset><div>{step>0&&<button type="button" onClick={()=>setStep(step-1)}>← Back</button>}<button className="primary-action" type="submit">{step===2?"Enter workspace":"Continue"} <SiteIcon name="arrow-right"/></button></div></form></section></SiteShell>;
}
