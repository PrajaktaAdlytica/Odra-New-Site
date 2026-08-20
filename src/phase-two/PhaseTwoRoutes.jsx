import { lazy, Suspense } from "react";
import { RouteLoading } from "../components/PagePrimitives";
import { SiteShell } from "../components/SiteChrome";

const InvestmentPage = lazy(() => import("./pages/InvestmentPage"));
const InvestmentFocusPage = lazy(() => import("./pages/InvestmentFocusPage"));
const FounderSupportPage = lazy(() => import("./pages/FounderSupportPage"));
const PortfolioPage = lazy(() => import("./pages/PortfolioPage"));
const CompanyProfilePage = lazy(() => import("./pages/CompanyProfilePage"));

function PhaseNotFound() {
  return <section className="not-found-page"><p className="kicker">404</p><h1>That company profile is not here.</h1><p>Return to the approved portfolio directory to continue exploring.</p><a className="primary-action" href="/portfolio">View portfolio</a></section>;
}

export default function PhaseTwoRoutes({ path }) {
  let page = null;
  if (path === "/investment") page = <InvestmentPage />;
  else if (path === "/investment/focus") page = <InvestmentFocusPage />;
  else if (path === "/founder-support") page = <FounderSupportPage />;
  else if (path === "/portfolio") page = <PortfolioPage />;
  else if (path.startsWith("/portfolio/")) page = <CompanyProfilePage slug={path.split("/").filter(Boolean)[1]} fallback={<PhaseNotFound />} />;

  return <SiteShell><Suspense fallback={<RouteLoading />}>{page || <PhaseNotFound />}</Suspense></SiteShell>;
}
