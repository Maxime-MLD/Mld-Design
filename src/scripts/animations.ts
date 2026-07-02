import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

export function initAnimations() {
  const revealTargets = gsap.utils.toArray<HTMLElement>('[data-animate="reveal"]');
  const imageFrames = gsap.utils.toArray<HTMLElement>('[data-animate="image-reveal"]');

  if (prefersReducedMotion) {
    gsap.set(revealTargets, { clipPath: "inset(0 0 0% 0)", opacity: 1 });
    gsap.set(imageFrames, { clipPath: "inset(0% 0 0 0)" });
    return;
  }

  // Reveal des titres, stats, cards, étapes, items FAQ... — groupés par section
  // pour que le stagger ne se déclenche qu'entre éléments qui entrent en même temps.
  // L'état masqué est posé immédiatement (gsap.set) pour éviter un flash de
  // contenu visible avant que le batch n'entre dans sa zone de déclenchement.
  gsap.set(revealTargets, { clipPath: "inset(0 0 100% 0)", opacity: 0 });

  ScrollTrigger.batch(revealTargets, {
    start: "top 85%",
    once: true,
    onEnter: (batch) =>
      gsap.to(batch, {
        clipPath: "inset(0 0 0% 0)",
        opacity: 1,
        duration: 1,
        ease: "power3.out",
        stagger: 0.13,
      }),
  });

  // Réalisations — clip-path reveal à l'entrée. L'image reste fixe (cadrage
  // exact, sans recadrage ni pan) ; le zoom léger au survol est géré en CSS
  // pur (group-hover) dans Realisations.astro, pas ici.
  imageFrames.forEach((frame) => {
    gsap.fromTo(
      frame,
      { clipPath: "inset(100% 0 0 0)" },
      {
        clipPath: "inset(0% 0 0 0)",
        duration: 1.1,
        ease: "power3.out",
        scrollTrigger: { trigger: frame, start: "top 85%", once: true },
      },
    );
  });

  // Étapes — spotlight qui suit le curseur sur chaque card (superposé au
  // fond .card-glow existant). Désactivé sans hover fiable (tactile) : on
  // garde alors uniquement le fond statique de .card-glow.
  const supportsHover = window.matchMedia(
    "(hover: hover) and (pointer: fine)",
  ).matches;

  if (supportsHover) {
    gsap.utils.toArray<HTMLElement>("[data-step-card]").forEach((card) => {
      let rafId: number | null = null;
      let x = 50;
      let y = 50;

      function apply() {
        card.style.setProperty("--mouse-x", `${x}%`);
        card.style.setProperty("--mouse-y", `${y}%`);
        rafId = null;
      }

      card.addEventListener("mousemove", (event) => {
        const rect = card.getBoundingClientRect();
        x = ((event.clientX - rect.left) / rect.width) * 100;
        y = ((event.clientY - rect.top) / rect.height) * 100;
        if (rafId === null) rafId = requestAnimationFrame(apply);
      });

      card.addEventListener("mouseleave", () => {
        x = 50;
        y = 50;
        if (rafId === null) rafId = requestAnimationFrame(apply);
      });
    });
  }

  // Les images (Réalisations, About) sont en lazy-loading : leur chargement
  // peut faire varier la hauteur de page après le calcul initial des
  // ScrollTrigger. On recalcule une fois tout chargé pour garder des zones
  // de déclenchement justes.
  window.addEventListener("load", () => ScrollTrigger.refresh());
}
