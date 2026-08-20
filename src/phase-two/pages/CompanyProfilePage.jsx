import { SiteIcon } from "../../components/SiteChrome";
import { findCompany, portfolioCompanies } from "../../data/portfolio";

export default function CompanyProfilePage({ slug, fallback }) {
  const company = findCompany(slug);
  if (!company) return fallback;
  const currentIndex = portfolioCompanies.findIndex((item) => item.slug === slug);
  const nextCompany = portfolioCompanies[(currentIndex + 1) % portfolioCompanies.length];

  return <>
    <section className={`company-profile-hero tone-${company.tone}`}>
      <div className="company-profile-breadcrumb"><a href="/portfolio">Portfolio</a><span>/</span><strong>{company.name}</strong></div>
      <div className="company-profile-title"><p className="kicker">{company.sourceLabel}</p><h1>{company.name}</h1><p>{company.shortDescription}</p><div><span>{company.sector}</span><span>{company.geography}</span></div><a className="primary-action" href={company.website} target="_blank" rel="noreferrer">Visit official website <SiteIcon name="external-link" /></a></div>
      <div className="company-profile-art"><img src={company.image} alt="" /><b>{String(company.index).padStart(2, "0")}</b></div>
    </section>
    <section className="company-fact-rail"><article><small>Company</small><strong>{company.name}</strong></article><article><small>Geography</small><strong>{company.geography}</strong></article><article><small>Directory</small><strong>{company.relationshipType}</strong></article><article><small>Focus</small><strong>{company.sector}</strong></article><article><small>Source</small><strong>{company.sourceGroup}</strong></article></section>
    <section className="phase-section company-story"><div className="company-story-intro"><p className="kicker">Company profile</p><h2>Follow the product story at its source.</h2><p>{company.name} is part of the Odra company directory. Continue to the official company destination for the latest product, market, and team information.</p></div><div className="company-story-modules"><article><span>01</span><h3>The company</h3><p>{company.shortDescription}</p></article><article><span>02</span><h3>The focus</h3><p>{company.sector}</p></article><article><span>03</span><h3>The destination</h3><p>{company.domain}</p></article></div></section>
    <section className="company-source-section"><div><p className="kicker">Official destination</p><h2>Continue with the company.</h2><a href={company.website} target="_blank" rel="noreferrer">{new URL(company.website).hostname.replace("www.", "")} <SiteIcon name="arrow-up-right" /></a></div><a className="next-company" href={`/portfolio/${nextCompany.slug}`}><small>Next company</small><strong>{nextCompany.name}</strong><SiteIcon name="arrow-right" /></a></section>
  </>;
}
