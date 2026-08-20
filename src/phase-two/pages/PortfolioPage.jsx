import { useMemo, useState } from "react";
import { PageHero } from "../../components/PagePrimitives";
import { SiteIcon } from "../../components/SiteChrome";
import { portfolioCompanies, uniqueCompanyValues } from "../../data/portfolio";

const views = ["grid", "list", "world"];

export default function PortfolioPage() {
  const params = new URLSearchParams(window.location.search);
  const [query, setQuery] = useState(params.get("q") || "");
  const [sector, setSector] = useState(params.get("sector") || "all");
  const [geography, setGeography] = useState(params.get("geography") || "all");
  const [sort, setSort] = useState(params.get("sort") || "az");
  const [view, setView] = useState(views.includes(params.get("view")) ? params.get("view") : "grid");
  const sectors = uniqueCompanyValues("sector");
  const geographies = uniqueCompanyValues("geography");

  const results = useMemo(() => portfolioCompanies.filter((company) => {
    const searchMatch = `${company.name} ${company.shortDescription}`.toLowerCase().includes(query.toLowerCase());
    return searchMatch && (sector === "all" || company.sector === sector) && (geography === "all" || company.geography === geography);
  }).sort((a, b) => sort === "za" ? b.name.localeCompare(a.name) : a.name.localeCompare(b.name)), [query, sector, geography, sort]);

  function updateUrl(next = {}) {
    const values = { q: query, sector, geography, sort, view, ...next };
    const search = new URLSearchParams();
    Object.entries(values).forEach(([key, value]) => { if (value && !["all", "az", "grid"].includes(value)) search.set(key, value); });
    window.history.replaceState({}, "", `${window.location.pathname}${search.size ? `?${search}` : ""}`);
  }

  return <>
    <PageHero number="04" eyebrow="Portfolio" title="Companies building what comes next." body="Explore the approved redesign roster together with companies currently listed on the Odra Venture website. Company facts and relationship details appear only when a supporting record exists." image="/assets/odra-editorial-mint.webp" actions={[{ label: "Investment approach", href: "/investment" }]} />
    <section className="portfolio-directory phase-section">
      <div className="portfolio-toolbar">
        <label className="portfolio-search"><SiteIcon name="search" /><span className="sr-only">Search companies</span><input value={query} onChange={(event) => { setQuery(event.target.value); updateUrl({ q: event.target.value }); }} placeholder="Search companies" /></label>
        <label><span>Sector</span><select value={sector} onChange={(event) => { setSector(event.target.value); updateUrl({ sector: event.target.value }); }}><option value="all">All sectors</option>{sectors.map((value) => <option key={value}>{value}</option>)}</select></label>
        <label><span>Geography</span><select value={geography} onChange={(event) => { setGeography(event.target.value); updateUrl({ geography: event.target.value }); }}><option value="all">All geographies</option>{geographies.map((value) => <option key={value}>{value}</option>)}</select></label>
        <label><span>Sort</span><select value={sort} onChange={(event) => { setSort(event.target.value); updateUrl({ sort: event.target.value }); }}><option value="az">A–Z</option><option value="za">Z–A</option></select></label>
        <div className="view-switcher" aria-label="Portfolio view">{views.map((item) => <button className={view === item ? "active" : ""} type="button" aria-pressed={view === item} onClick={() => { setView(item); updateUrl({ view: item }); }} key={item}>{item}</button>)}</div>
      </div>
      <div className="portfolio-result-meta"><p><strong>{results.length}</strong> public directory companies</p><button type="button" onClick={() => { setQuery(""); setSector("all"); setGeography("all"); setSort("az"); updateUrl({ q: "", sector: "all", geography: "all", sort: "az" }); }}>Reset filters</button></div>
      {view === "world" ? <WorldView companies={results} /> : <div className={`portfolio-results ${view}-view`}>{results.map((company) => <CompanyCard company={company} view={view} key={company.slug} />)}</div>}
      {results.length === 0 && <div className="portfolio-empty"><h2>No companies match those filters.</h2><button type="button" onClick={() => { setQuery(""); setSector("all"); setGeography("all"); }}>Clear filters</button></div>}
    </section>
  </>;
}

function CompanyCard({ company, view }) {
  return <article className={`directory-company-card tone-${company.tone}`}>
    <a className="company-card-link" href={`/portfolio/${company.slug}`} aria-label={`View ${company.name} profile`}>
      <div className="company-card-art"><img src={company.image} alt="" /><span>{String(company.index).padStart(2, "0")}</span></div>
      <div className="company-card-copy"><div><small>{company.sector}</small><small>{company.geography}</small></div><h2>{company.name}</h2><p>{view === "list" ? company.shortDescription : company.approvalStatus}</p></div>
      <SiteIcon name="arrow-up-right" />
    </a>
    <a className="company-external-link" href={company.website} target="_blank" rel="noreferrer">Official website <SiteIcon name="external-link" /></a>
  </article>;
}

function WorldView({ companies }) {
  return <div className="portfolio-world"><div className="world-map"><img src="/assets/odra-global-network-map.png" alt="Abstract global network map" /><div><SiteIcon name="globe-2" /><h2>Geography awaits approved records.</h2><p>Companies remain accessible without placing them at invented locations.</p></div></div><div className="world-company-list">{companies.map((company) => <a href={`/portfolio/${company.slug}`} key={company.slug}><span>{String(company.index).padStart(2, "0")}</span><strong>{company.name}</strong><small>Location not disclosed</small><SiteIcon name="arrow-right" /></a>)}</div></div>;
}
