import { useEffect, useRef, useState } from "react";
import { SiteIcon, SiteShell } from "../components/SiteChrome";

const pathways = [
  { id: "investment", number: "01", title: "Direct investment", body: "For technology companies exploring an investment relationship with Odra Venture.", note: "Investment interest" },
  { id: "school", number: "02", title: "OV School", body: "For founders building their core operating knowledge and preparing for the next stage.", note: "Non-investment program" },
  { id: "accelerator", number: "03", title: "Startup Accelerator", body: "For early teams moving from a promising product toward repeatable market evidence.", note: "Non-investment program" },
  { id: "scale", number: "04", title: "Scale Program", body: "For companies strengthening growth systems, international reach, and organisational readiness.", note: "Non-investment program" },
];

const steps = ["Pathway", "Founder & company", "Company context", "Review"];
const initialForm = {
  pathway: "", firstName: "", lastName: "", email: "", phone: "", company: "", website: "", location: "",
  stage: "", sector: "", product: "", evidence: "", fundraising: "", support: "", consent: false, updates: false,
};

const requiredByStep = [
  ["pathway"],
  ["firstName", "lastName", "email", "company", "location"],
  ["stage", "sector", "product", "evidence", "fundraising", "support"],
  ["consent"],
];

function Field({ label, name, form, errors, onChange, type = "text", placeholder, optional = false, children }) {
  const error = errors[name];
  return (
    <label className={`application-field ${error ? "has-error" : ""}`}>
      <span>{label}{optional ? <small>Optional</small> : <b aria-hidden="true">*</b>}</span>
      {children || <input type={type} name={name} value={form[name]} onChange={onChange} placeholder={placeholder} aria-invalid={Boolean(error)} aria-describedby={error ? `${name}-error` : undefined} />}
      {error && <em id={`${name}-error`} role="alert">{error}</em>}
    </label>
  );
}

function PathwayStep({ form, errors, onSelect }) {
  const [matcher, setMatcher] = useState({ stage: "", priority: "" });
  const [recommendation, setRecommendation] = useState("");
  const recommend = () => {
    if (!matcher.stage || !matcher.priority) return;
    const next = matcher.stage === "learning" ? "school" : matcher.stage === "evidence" ? "accelerator" : matcher.stage === "scale" ? "scale" : "investment";
    setRecommendation(next);
    onSelect(next);
    window.setTimeout(() => document.getElementById(`pathway-${next}`)?.focus(), 0);
  };
  return (
    <>
      <section className="pathway-matcher" aria-labelledby="matcher-heading">
        <div><span>Guided start</span><h3 id="matcher-heading">Find the closest pathway.</h3><p>Two short questions create a starting recommendation. It is guidance, not an admissions or investment decision.</p></div>
        <div className="matcher-questions">
          <label><span>Where is the company now?</span><select value={matcher.stage} onChange={(event) => { setMatcher((current) => ({ ...current, stage: event.target.value })); setRecommendation(""); }}><option value="">Choose the closest stage</option><option value="learning">Important idea or early product questions</option><option value="evidence">Product or prototype, building market evidence</option><option value="scale">Meaningful evidence, preparing to scale</option><option value="investment">Exploring a direct investment conversation</option></select></label>
          <label><span>What help matters most?</span><select value={matcher.priority} onChange={(event) => { setMatcher((current) => ({ ...current, priority: event.target.value })); setRecommendation(""); }}><option value="">Choose the closest priority</option><option>Founder and company fundamentals</option><option>Customer and product evidence</option><option>Go-to-market and growth systems</option><option>Capital readiness</option></select></label>
          <button type="button" onClick={recommend} disabled={!matcher.stage || !matcher.priority}>Show recommendation <span>→</span></button>
        </div>
        {recommendation && <p className="matcher-result" role="status"><span>Recommended starting point</span><strong>{pathways.find((item) => item.id === recommendation)?.title}</strong><small>You can choose a different pathway below if another route better reflects the context.</small></p>}
      </section>
      <fieldset className="application-pathways">
        <legend>Choose or confirm a pathway</legend>
        {pathways.map((pathway) => {
        const selected = form.pathway === pathway.id;
        return (
          <label className={selected ? "selected" : ""} id={`pathway-${pathway.id}`} tabIndex="-1" key={pathway.id}>
            <input type="radio" name="pathway" value={pathway.id} checked={selected} onChange={() => onSelect(pathway.id)} />
            <span>{pathway.number}</span>
            <div><small>{pathway.note}</small><strong>{pathway.title}</strong><p>{pathway.body}</p></div>
            <i aria-hidden="true">{selected ? "✓" : "→"}</i>
          </label>
        );
        })}
        {errors.pathway && <p className="application-choice-error" role="alert">{errors.pathway}</p>}
      </fieldset>
    </>
  );
}

function FounderStep({ form, errors, onChange }) {
  return (
    <div className="application-grid">
      <Field label="First name" name="firstName" form={form} errors={errors} onChange={onChange} placeholder="First name" />
      <Field label="Last name" name="lastName" form={form} errors={errors} onChange={onChange} placeholder="Last name" />
      <Field label="Work email" name="email" form={form} errors={errors} onChange={onChange} type="email" placeholder="you@company.com" />
      <Field label="Phone" name="phone" form={form} errors={errors} onChange={onChange} type="tel" placeholder="Country code and number" optional />
      <Field label="Company name" name="company" form={form} errors={errors} onChange={onChange} placeholder="Company name" />
      <Field label="Company website" name="website" form={form} errors={errors} onChange={onChange} type="url" placeholder="https://" optional />
      <div className="application-span-two"><Field label="Company location" name="location" form={form} errors={errors} onChange={onChange} placeholder="City, country" /></div>
    </div>
  );
}

function ContextStep({ form, errors, onChange }) {
  return (
    <div className="application-grid application-context-grid">
      <Field label="Company stage" name="stage" form={form} errors={errors} onChange={onChange}>
        <select name="stage" value={form.stage} onChange={onChange} aria-invalid={Boolean(errors.stage)}>
          <option value="">Select stage</option><option>Idea / pre-product</option><option>Pre-seed</option><option>Seed</option><option>Series A</option><option>Growth</option>
        </select>
      </Field>
      <Field label="Primary sector" name="sector" form={form} errors={errors} onChange={onChange}>
        <select name="sector" value={form.sector} onChange={onChange} aria-invalid={Boolean(errors.sector)}>
          <option value="">Select sector</option><option>AI & data</option><option>Climate & energy</option><option>Cybersecurity</option><option>Deep tech</option><option>Enterprise software</option><option>Fintech</option><option>Healthtech</option><option>Other technology</option>
        </select>
      </Field>
      <div className="application-span-two"><Field label="What are you building?" name="product" form={form} errors={errors} onChange={onChange}><textarea name="product" value={form.product} onChange={onChange} placeholder="Describe the product, the problem it solves, and who it is for." maxLength={900} aria-invalid={Boolean(errors.product)} /></Field></div>
      <div className="application-span-two"><Field label="What evidence do you have so far?" name="evidence" form={form} errors={errors} onChange={onChange}><textarea name="evidence" value={form.evidence} onChange={onChange} placeholder="Share relevant product progress, customers, revenue, pilots, research, or other signals." maxLength={900} aria-invalid={Boolean(errors.evidence)} /></Field></div>
      <Field label="Fundraising status" name="fundraising" form={form} errors={errors} onChange={onChange}>
        <select name="fundraising" value={form.fundraising} onChange={onChange} aria-invalid={Boolean(errors.fundraising)}>
          <option value="">Select status</option><option>Not currently raising</option><option>Preparing a round</option><option>Actively raising</option><option>Exploring options</option>
        </select>
      </Field>
      <Field label="How can Odra help?" name="support" form={form} errors={errors} onChange={onChange}>
        <select name="support" value={form.support} onChange={onChange} aria-invalid={Boolean(errors.support)}>
          <option value="">Select priority</option><option>Capital</option><option>Go-to-market</option><option>Product and technology</option><option>Hiring and organisation</option><option>International expansion</option><option>Founder development</option>
        </select>
      </Field>
    </div>
  );
}

function ReviewStep({ form, errors, onChange }) {
  const pathway = pathways.find((item) => item.id === form.pathway);
  return (
    <div className="application-review">
      <div className="application-summary">
        <article><small>Pathway</small><strong>{pathway?.title}</strong></article>
        <article><small>Founder</small><strong>{form.firstName} {form.lastName}</strong><span>{form.email}</span></article>
        <article><small>Company</small><strong>{form.company}</strong><span>{form.location} · {form.stage}</span></article>
        <article><small>Focus</small><strong>{form.sector}</strong><span>{form.support}</span></article>
      </div>
      <div className="application-review-copy"><h3>Before you continue</h3><p>Review the information above. Selecting a program pathway does not represent an investment offer, program admission, or guaranteed service.</p></div>
      <label className={`application-check ${errors.consent ? "has-error" : ""}`}><input type="checkbox" name="consent" checked={form.consent} onChange={onChange} /><span><strong>I confirm the information is accurate.</strong><small>I understand Odra may use it to assess fit and contact me about this application.</small></span></label>
      {errors.consent && <p className="application-choice-error" role="alert">{errors.consent}</p>}
      <label className="application-check"><input type="checkbox" name="updates" checked={form.updates} onChange={onChange} /><span><strong>Send me relevant Odra updates.</strong><small>Optional. You can unsubscribe from future updates.</small></span></label>
    </div>
  );
}

export default function ApplicationPage() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [complete, setComplete] = useState(false);
  const headingRef = useRef(null);

  useEffect(() => { headingRef.current?.focus(); window.scrollTo({ top: 0, behavior: "smooth" }); }, [step, complete]);

  const onChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
  };

  const validate = () => {
    const next = {};
    requiredByStep[step].forEach((name) => { if (!form[name]) next[name] = name === "consent" ? "Please confirm before submitting." : "Please complete this field."; });
    if (step === 1 && form.email && !/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Enter a valid email address.";
    if (step === 1 && form.website && !/^https?:\/\//i.test(form.website)) next.website = "Include http:// or https://";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const advance = () => { if (validate()) setStep((current) => Math.min(current + 1, steps.length - 1)); };
  const submit = (event) => { event.preventDefault(); if (validate()) setComplete(true); };

  if (complete) return (
    <SiteShell><section className="application-success"><div><span>Application complete</span><h1>Thank you, {form.firstName}.</h1><p>Your company, team, market, product, evidence, and ambition now form one clear application story.</p><div><a className="primary-action" href="/">Return home <SiteIcon name="arrow-right" /></a><a className="secondary-action" href="/portfolio">Explore the portfolio <SiteIcon name="arrow-right" /></a></div></div><img src="/assets/odra-founder-collaboration.png" alt="Founders collaborating around a table" /></section></SiteShell>
  );

  return (
    <SiteShell>
      <section className="application-hero" data-camera-label="Application introduction">
        <div><p className="kicker">Applications are welcome globally</p><h1>Start your<br />Odra application.</h1><p>Choose the route that best matches where you are, then share the essentials about your team, product, evidence, and ambition.</p></div>
        <aside><strong>One starting point.<br />Four founder pathways.</strong><p>We use your answers to understand fit. Program applications are separate from direct investment interest.</p></aside>
      </section>
      <section className="application-workspace" data-camera-label="Application form">
        <aside className="application-progress" aria-label="Application progress">
          <p>Application progress</p>
          <ol>{steps.map((label, index) => <li className={index === step ? "active" : index < step ? "complete" : ""} key={label}><span>{index < step ? "✓" : `0${index + 1}`}</span><strong>{label}</strong></li>)}</ol>
          <div><span aria-hidden="true">Privacy</span><p><strong>Share only what is appropriate.</strong><br />Sensitive diligence materials can follow later through a secure process.</p></div>
        </aside>
        <form className="application-form" onSubmit={submit} noValidate>
          <div className="application-form-heading" tabIndex="-1" ref={headingRef}><span>Step {step + 1} of {steps.length}</span><h2>{step === 0 ? "Choose your pathway." : step === 1 ? "Tell us who you are." : step === 2 ? "Share the company context." : "Review your application."}</h2><p>{step === 0 ? "Select the closest fit. You can explain any nuance later in the process." : step === 1 ? "Start with the essential founder and company details." : step === 2 ? "Concise, specific answers are the most useful at this stage." : "Check the essentials and confirm you are ready to continue."}</p></div>
          {step === 0 && <PathwayStep form={form} errors={errors} onSelect={(pathway) => { setForm((current) => ({ ...current, pathway })); setErrors({}); }} />}
          {step === 1 && <FounderStep form={form} errors={errors} onChange={onChange} />}
          {step === 2 && <ContextStep form={form} errors={errors} onChange={onChange} />}
          {step === 3 && <ReviewStep form={form} errors={errors} onChange={onChange} />}
          <div className="application-form-actions">
            {step > 0 ? <button type="button" className="application-back" onClick={() => setStep((current) => current - 1)}>← Back</button> : <a className="application-back" href="/">Cancel</a>}
            {step < steps.length - 1 ? <button type="button" className="application-next" onClick={advance}>Continue <span>→</span></button> : <button type="submit" className="application-next">Complete application <span>→</span></button>}
          </div>
        </form>
      </section>
      <section className="application-after"><span>What happens next</span><ol><li><b>01</b><strong>Fit review</strong><p>The Odra team reviews the company, pathway, and current evidence.</p></li><li><b>02</b><strong>Founder conversation</strong><p>If there may be a fit, the next step is a direct conversation.</p></li><li><b>03</b><strong>Diligence and decision</strong><p>Relevant information, terms, and decisions are handled separately.</p></li></ol></section>
    </SiteShell>
  );
}
