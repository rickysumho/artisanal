(() => {
  const candidateSelector = ".site-brand, .site-nav__link";
  const prefetched = new Set();

  const preserveEntryPath = () => {
    const backLink = document.querySelector("[data-back-link]");
    if (!backLink || !document.referrer) return;

    let referrer;
    try {
      referrer = new URL(document.referrer);
    } catch {
      return;
    }

    const normalizePath = (url) => url.pathname.replace(/\/+$/, "") || "/";
    if (referrer.origin !== location.origin || normalizePath(referrer) === normalizePath(new URL(location.href))) return;

    const candidates = [
      { path: backLink.dataset.backSectionPath, label: backLink.dataset.backSectionLabel },
      { path: backLink.dataset.backParentPath, label: backLink.dataset.backParentLabel },
    ].filter((candidate) => candidate.path);
    const match = candidates.find((candidate) => normalizePath(new URL(candidate.path, location.href)) === normalizePath(referrer));
    if (!match) return;

    backLink.href = referrer.href;
    const label = backLink.querySelector("[data-back-label]");
    if (label && match.label) label.textContent = match.label;
  };

  const prefetch = (link) => {
    if (!(link instanceof HTMLAnchorElement)) return;
    if (link.target && link.target !== "_self") return;
    if (link.hasAttribute("download")) return;

    const destination = new URL(link.href, document.baseURI);
    if (destination.origin !== location.origin || destination.protocol !== location.protocol) return;
    if (destination.pathname === location.pathname && destination.search === location.search) return;

    const key = destination.href;
    if (prefetched.has(key)) return;
    prefetched.add(key);

    const hint = document.createElement("link");
    hint.rel = "prefetch";
    hint.href = destination.href;
    document.head.append(hint);
  };

  const handleIntent = (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const link = target.closest(candidateSelector);
    if (!link) return;
    if (event.type === "pointerover" && link.contains(event.relatedTarget)) return;

    prefetch(link);
  };

  document.addEventListener("pointerover", handleIntent, { passive: true });
  document.addEventListener("focusin", handleIntent);
  preserveEntryPath();
})();
