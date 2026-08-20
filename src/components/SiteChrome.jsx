import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { isActiveRoute, primaryNavigation } from "../data/routeRegistry";
import InternalCameraScene from "./InternalCameraScene";

gsap.registerPlugin(ScrollTrigger);

export function SiteIcon({ name, alt = "" }) {
  return <img className="ui-icon" src={`/assets/icons/${name}.svg`} alt={alt} />;
}

export function SkipLink() {
  return <a className="skip-link" href="#main-content">Skip to main content</a>;
}

function CinematicBackdrop({ progress, sceneCount }) {
  return (
    <div className="internal-camera" aria-hidden="true">
      <div className="internal-camera-poster" />
      <InternalCameraScene progress={progress} sceneCount={sceneCount} />
      <div className="internal-camera-haze" />
      <i className="internal-route-line" />
    </div>
  );
}

function useCinematicShell() {
  const rootRef = useRef(null);
  const cameraProgress = useRef(0);
  const [chapter, setChapter] = useState({ current: 1, total: 1, cameraTotal: 1, label: "Arrival" });

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const content = root.querySelector("#main-content");
    const sections = [...content.querySelectorAll(":scope > section, :scope > div > section")];
    if (!sections.length) return undefined;

    const isStableSurface = (section) => section.matches([
      ".application-workspace",
      ".application-after",
      ".application-success",
      ".school-auth-scene",
      ".school-app",
      ".onboarding-scene",
      ".portfolio-directory",
      ".company-fact-rail",
      ".company-story",
      ".company-source-section",
    ].join(",")) || Boolean(section.querySelector(".portfolio-results, .portfolio-list, .world-company-list"));

    sections.forEach((section, index) => {
      section.classList.add("cinematic-section");
      section.dataset.cameraIndex = String(index);
      section.classList.add(isStableSurface(section) ? "camera-static" : "camera-scene");
    });

    // Stable surfaces can be an arrival room, but never drive more camera
    // movement while the user reads, filters, signs in, or completes a form.
    const cameraSections = sections.filter((section, index) => index === 0 || !section.classList.contains("camera-static") || !sections[index - 1].classList.contains("camera-static"));

    const animations = [];
    const cinematicTimelines = [];
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    gsap.utils.toArray(root.querySelectorAll(".motion-heading")).forEach((element) => {
      animations.push(gsap.fromTo(element, { autoAlpha: 0, y: 44 }, { autoAlpha: 1, y: 0, duration: .95, ease: "power3.out", scrollTrigger: { trigger: element, start: "top 84%", once: true } }));
    });
    gsap.utils.toArray(root.querySelectorAll(".motion-mask")).forEach((element) => {
      const image = element.querySelector("img");
      animations.push(gsap.fromTo(element, { clipPath: "inset(0 0 100% 0 round 24px)" }, { clipPath: "inset(0 0 0% 0 round 24px)", duration: 1.15, ease: "power3.inOut", scrollTrigger: { trigger: element, start: "top 82%", once: true } }));
      if (image) animations.push(gsap.fromTo(image, { scale: 1.13 }, { scale: 1, duration: 1.45, ease: "power3.out", scrollTrigger: { trigger: element, start: "top 82%", once: true } }));
    });
    gsap.utils.toArray(root.querySelectorAll(".motion-card")).forEach((element, index) => {
      animations.push(gsap.fromTo(element, { autoAlpha: 0, y: 32 + (index % 3) * 12 }, { autoAlpha: 1, y: 0, duration: .72, delay: (index % 3) * .055, ease: "power2.out", scrollTrigger: { trigger: element, start: "top 88%", once: true } }));
    });
    if (!reducedMotion) {
      gsap.utils.toArray(root.querySelectorAll(".sequential-list")).forEach((list) => {
        const rows = [...list.children];
        animations.push(gsap.fromTo(rows,
          { autoAlpha: 0, x: -34 },
          {
            autoAlpha: 1,
            x: 0,
            duration: .68,
            stagger: .18,
            ease: "power3.out",
            scrollTrigger: { trigger: list, start: "top 82%", once: true },
          },
        ));
      });
    }
    const activateChapter = (section, sceneIndex, localProgress = 0) => {
      const index = sections.indexOf(section);
      const sceneTotal = Math.max(1, cameraSections.length);
      const progress = sceneTotal === 1 ? 0 : Math.min(1, Math.max(0, (sceneIndex + localProgress) / (sceneTotal - 1)));
      cameraProgress.current = progress;
      root.style.setProperty("--internal-camera-progress", progress.toFixed(4));
      root.style.setProperty("--internal-camera-chapter", index);
      root.dataset.cameraTone = String(index % 3);
      const nextChapter = {
        current: index + 1,
        total: sections.length,
        cameraTotal: sceneTotal,
        label: section.dataset.cameraLabel || section.querySelector(".kicker")?.textContent || `Chapter ${index + 1}`,
      };
      setChapter((current) => current.current === nextChapter.current && current.total === nextChapter.total && current.cameraTotal === nextChapter.cameraTotal && current.label === nextChapter.label ? current : nextChapter);
    };

    if (cameraSections.length) activateChapter(cameraSections[0], 0, 0);
    if (!reducedMotion && cameraSections.length > 1) {
      cameraSections.slice(1).forEach((section, sceneIndex) => {
        const destinationIndex = sceneIndex + 1;
        const trigger = ScrollTrigger.create({
          trigger: section,
          start: "top 88%",
          end: "top 12%",
          scrub: .5,
          onEnter: () => activateChapter(section, destinationIndex - 1, 0),
          onEnterBack: () => activateChapter(section, destinationIndex - 1, 1),
          onUpdate: (self) => activateChapter(section, destinationIndex - 1, self.progress),
        });
        cinematicTimelines.push(trigger);
        const entrance = gsap.fromTo(section,
          { clipPath: "inset(7% 4% round 30px)", scale: .975 },
          { clipPath: "inset(0% 0% round 0px)", scale: 1, ease: "none", scrollTrigger: { trigger: section, start: "top 88%", end: "top 12%", scrub: .62 } },
        );
        cinematicTimelines.push(entrance);
      });
    }
    ScrollTrigger.refresh();
    return () => {
      animations.forEach((animation) => { animation.scrollTrigger?.kill(); animation.kill(); });
      cinematicTimelines.forEach((animation) => { animation.scrollTrigger?.kill(); animation.kill(); });
    };
  }, []);

  useEffect(() => {
    document.documentElement.classList.add("route-arriving");
    const arrival = window.setTimeout(() => document.documentElement.classList.remove("route-arriving"), 700);
    return () => { window.clearTimeout(arrival); document.documentElement.classList.remove("route-arriving", "route-leaving"); };
  }, []);

  return { rootRef, cameraProgress, chapter };
}

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const currentPath = window.location.pathname.replace(/\/+$/, "") || "/";

  useEffect(() => setMenuOpen(false), [currentPath]);

  return (
    <header className="prototype-header">
      <a className="brand" href="/" aria-label="Odra Venture home">
        <img src="/assets/odra-ventures-logo.png" alt="Odra Venture" />
      </a>
      <nav id="primary-navigation" className={menuOpen ? "is-open" : ""} aria-label="Primary navigation">
        {primaryNavigation.map((route) => (
          <a className={isActiveRoute(currentPath, route) ? "active" : ""} href={route.path} key={route.path}>{route.label}</a>
        ))}
        <a className={`school-nav-link ${currentPath.startsWith("/school") || currentPath.startsWith("/programs/ov-school") ? "active" : ""}`} href="/programs/ov-school">OV School</a>
      </nav>
      <div className="header-actions">
        <a className="apply-button" href="/apply">Apply <span aria-hidden="true">↗</span></a>
        <button className="menu-button" type="button" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-controls="primary-navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen((value) => !value)}><SiteIcon name="menu" /></button>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-brand">
        <img src="/assets/odra-ventures-logo.png" alt="Odra Venture" />
        <p>Backing ambitious founders building technology companies with the potential to matter globally.</p>
        <a className="footer-contact" href="mailto:hello@odraventure.com">hello@odraventure.com</a>
      </div>
      <div><h3>Thesis</h3><a href="/investment">Approach</a><a href="/investment/focus">Focus</a><a href="/founder-support">Founder support</a><a href="/portfolio">Portfolio</a></div>
      <div><h3>Programs</h3><a href="/programs/ov-school">OV School</a><a href="/programs/ov-school/curriculum">Curriculum</a><a href="/programs/accelerator">Startup Accelerator</a><a href="/programs/scale">Scale Program</a></div>
      <div><h3>Discover</h3><a href="/insights">Insights</a><a href="/resources">Resources</a><a href="/events">Events</a><a href="/network">Network</a><a href="/team">Team</a><a href="/about">About</a></div>
      <div><h3>Connect</h3><a href="/apply">Apply</a><a href="/apply/guide">Application guide</a><a href="/contact">Contact</a><a href="/trust">Trust centre</a></div>
      <div className="footer-legal"><p>© 2026 Odra Venture Sp. z o.o.<br />All rights reserved.</p><p>Polish roots. Global founder ambition.<br />KRS 0001225642 &nbsp; | &nbsp; NIP 1133194972</p><a href="/trust#privacy">Privacy</a><a href="/trust#accessibility">Accessibility</a><a href="/trust#security">Security</a><a href="https://www.linkedin.com/company/odra-venture/" target="_blank" rel="noreferrer">LinkedIn ↗</a></div>
    </footer>
  );
}

export function SiteShell({ children }) {
  const { rootRef, cameraProgress, chapter } = useCinematicShell();
  return <main className="prototype-shell internal-shell cinematic-shell" ref={rootRef}>
    <SkipLink />
    <CinematicBackdrop progress={cameraProgress} sceneCount={chapter.cameraTotal} />
    <div className="route-curtain" aria-hidden="true"><span>Odra Venture</span></div>
    <SiteHeader />
    <div id="main-content">{children}</div>
    <SiteFooter />
  </main>;
}
