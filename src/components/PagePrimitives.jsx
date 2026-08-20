import { SiteIcon } from "./SiteChrome";

export function ContentLabel({ number, name }) {
  return <aside className="section-index content-label"><span>{number}</span><i /><strong>{name}</strong></aside>;
}

export function PageHero({ number, eyebrow, title, body, image, imageAlt = "", actions = [] }) {
  return (
    <section className="phase-page-hero">
      <ContentLabel number={number} name={eyebrow} />
      <div className="phase-page-hero-copy">
        <p className="kicker">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{body}</p>
        {actions.length > 0 && <div className="phase-hero-actions">{actions.map((action, index) => <a className={index === 0 ? "primary-action" : "secondary-action"} href={action.href} key={action.label}>{action.label}<SiteIcon name="arrow-right" /></a>)}</div>}
      </div>
      <div className="phase-page-hero-image"><img src={image} alt={imageAlt} /></div>
    </section>
  );
}

export function SectionHeading({ eyebrow, title, body }) {
  return <header className="phase-section-heading"><p className="kicker">{eyebrow}</p><h2>{title}</h2>{body && <p>{body}</p>}</header>;
}

export function Disclosure({ children }) {
  return <aside className="data-disclosure"><SiteIcon name="layers-3" /><p>{children}</p></aside>;
}

export function RouteLoading() {
  return <div className="route-loading" role="status"><span /><p>Opening Odra</p></div>;
}
