export const routeRegistry = [
  { id: "home", label: "Home", path: "/", visibility: "utility" },
  { id: "investment", label: "Thesis", path: "/investment", visibility: "primary" },
  { id: "portfolio", label: "Portfolio", path: "/portfolio", visibility: "primary" },
  { id: "programs", label: "Programs", path: "/programs", visibility: "primary" },
  { id: "insights", label: "Insights", path: "/insights", visibility: "primary" },
  { id: "events", label: "Events", path: "/events", visibility: "primary" },
  { id: "network", label: "Network", path: "/network", visibility: "primary" },
  { id: "team", label: "Team", path: "/team", visibility: "primary" },
  { id: "about", label: "About", path: "/about", visibility: "primary" },
  { id: "apply", label: "Apply", path: "/apply", visibility: "action" },
  { id: "school", label: "OV School sign in", path: "/school/sign-in", visibility: "utility" },
  { id: "school-public", label: "OV School", path: "/programs/ov-school", parent: "programs" },
  { id: "curriculum-public", label: "Curriculum", path: "/programs/ov-school/curriculum", parent: "programs" },
  { id: "accelerator", label: "Accelerator", path: "/programs/accelerator", parent: "programs" },
  { id: "scale", label: "Scale", path: "/programs/scale", parent: "programs" },
  { id: "apply-guide", label: "Application guide", path: "/apply/guide", parent: "apply" },
  { id: "resources", label: "Resources", path: "/resources", parent: "insights" },
  { id: "contact", label: "Contact", path: "/contact", visibility: "utility" },
  { id: "trust", label: "Trust", path: "/trust", visibility: "utility" },
  { id: "focus", label: "Investment focus", path: "/investment/focus", parent: "investment" },
  { id: "support", label: "Founder support", path: "/founder-support", parent: "investment" },
  { id: "company", label: "Company profile", path: "/portfolio/:company", parent: "portfolio", dynamic: true },
];

export const primaryNavigation = routeRegistry.filter((route) => route.visibility === "primary");

export function isActiveRoute(currentPath, route) {
  if (route.path === "/") return currentPath === "/";
  if (route.id === "investment") return currentPath === route.path || currentPath === "/founder-support" || currentPath.startsWith("/investment/");
  const routePath = route.path.split("?")[0];
  return currentPath === routePath || currentPath.startsWith(`${routePath}/`);
}

export function isPhaseTwoPath(path) {
  return path === "/investment" || path === "/investment/focus" || path === "/founder-support" || path === "/portfolio" || path.startsWith("/portfolio/");
}

export function isPublicPath(path) {
  return path === "/programs" || path.startsWith("/programs/") || path === "/apply/guide" || path === "/insights" || path.startsWith("/insights/") || path === "/resources" || path === "/events" || path.startsWith("/events/") || path === "/network" || path === "/team" || path.startsWith("/team/") || path === "/about" || path === "/contact" || path === "/trust";
}

export function isSchoolPath(path) {
  return path.startsWith("/school/");
}
