const sharedPendingFields = {
  shortDescription: "Explore the company, product, and official destination through the Odra company directory.",
  sector: "Technology company",
  geography: "European ecosystem",
  relationship: "Odra company roster",
  relationshipType: "Odra company roster",
  program: null,
  foundedYear: null,
  founders: [],
  operatingStatus: "Company profile",
  approvalStatus: "Odra company roster",
};

const approvedRedesignCompanies = [
  { name: "Agrento", slug: "agrento", website: "https://www.agrento.com", tone: "mint" },
  { name: "Roviaza", slug: "roviaza", website: "https://www.roviaza.com", tone: "lavender" },
  { name: "Railixa", slug: "railixa", website: "https://www.railixa.com", tone: "blue" },
  { name: "Ledgerza", slug: "ledgerza", website: "https://www.ledgerza.com", tone: "yellow" },
  { name: "Clarvec", slug: "clarvec", website: "https://clar-vec-site.vercel.app", tone: "peach" },
  { name: "Kilotrace", slug: "kilotrace", website: "https://www.kilotrace.com", tone: "blue" },
  { name: "Linerv", slug: "linerv", website: "https://www.linerv.com", tone: "mint" },
  { name: "Partvance", slug: "partvance", website: "https://www.partvance.com", tone: "lavender" },
  { name: "Maintgrid", slug: "maintgrid", website: "https://www.maintgrid.com", tone: "yellow" },
  { name: "Phishexa", slug: "phishexa", website: "https://phishexa-com.vercel.app", tone: "peach" },
].map((company) => ({
  ...sharedPendingFields,
  ...company,
  sourceGroup: "Approved redesign roster",
  sourceLabel: "Approved redesign company",
  approvalStatus: "Approved redesign roster",
}));

const currentSiteCompanies = [
  { name: "TopSpots", slug: "topspots", website: "https://topspots.global", sector: "Hospitality / Venue Tech", tone: "lavender", image: "/assets/portfolio/topspots-editorial-v2.webp" },
  { name: "Arcvon", slug: "arcvon", website: "https://arcvon.com", sector: "Fintech", tone: "yellow", image: "/assets/portfolio/arcvon-editorial-v2.webp" },
  { name: "CogStorm", slug: "cogstorm", website: "https://cogstorm.com", sector: "AI / ML", tone: "mint", image: "/assets/portfolio/cogstorm-editorial-v2.webp" },
  { name: "GridVoltX", slug: "gridvoltx", website: "https://gridvoltx.com", sector: "Energy / Voltage", tone: "blue", image: "/assets/portfolio/gridvoltx-editorial-v2.webp" },
  { name: "CarbVault", slug: "carbvault", website: "https://carbvault.com", sector: "CleanTech", tone: "peach", image: "/assets/portfolio/carbvault-editorial-v2.webp" },
  { name: "SolarNerve", slug: "solarnerve", website: "https://solarnerve.com", sector: "Energy / Solar", tone: "yellow", image: "/assets/portfolio/solarnerve-editorial-v2.webp" },
  { name: "PrimVolt", slug: "primvolt", website: "https://primvolt.com", sector: "Energy / Power", tone: "lavender", image: "/assets/portfolio/primvolt-editorial-v2.webp" },
  { name: "AuxGrid", slug: "auxgrid", website: "https://auxgrid.com", sector: "Energy / Smart Grid", tone: "mint", image: "/assets/portfolio/auxgrid-editorial-v2.webp" },
  { name: "SocWire", slug: "socwire", website: "https://socwire.com", sector: "SaaS / Social", tone: "blue", image: "/assets/portfolio/socwire-editorial-v2.webp" },
].map((company) => ({
  ...sharedPendingFields,
  ...company,
  shortDescription: "Currently listed in the public Odra Venture portfolio.",
  relationship: "Listed in the public Odra Venture portfolio",
  relationshipType: "Public portfolio listing",
  sourceGroup: "Current Odra website",
  sourceLabel: "Public website portfolio company",
  approvalStatus: "Listed on odraventure.com",
}));

export const portfolioCompanies = [...approvedRedesignCompanies, ...currentSiteCompanies].map((company, index) => ({
  ...company,
  index: index + 1,
  href: company.website,
  domain: new URL(company.website).hostname.replace("www.", ""),
  image: company.image || ["/assets/odra-editorial-mint.webp", "/assets/odra-editorial-lavender.webp", "/assets/odra-architectural-hero.webp", "/assets/odra-editorial-yellow.webp"][index % 4],
}));

export function findCompany(slug) {
  return portfolioCompanies.find((company) => company.slug === slug);
}

export function uniqueCompanyValues(field) {
  return [...new Set(portfolioCompanies.map((company) => company[field]).filter(Boolean))];
}
