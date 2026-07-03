import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

/**
 * Effet "Flou Cinétique" unique et centralisé : tous les éléments animés du
 * site (titres, TrustBar, Constat, cards Services/Étapes, items FAQ, Contact,
 * grille Réalisations...) passent par cette même fonction pour une cohérence
 * totale — plus aucun clip-path ailleurs dans le code.
 *
 * filter: blur() est coûteux au rendu : will-change est posé juste avant
 * l'animation (onStart) et retiré juste après (onComplete) pour ne pas
 * laisser cette charge GPU en permanence sur la page.
 */
function kineticBlurReveal(elements: HTMLElement[], options: { stagger?: number } = {}) {
  if (!elements.length) return;

  if (prefersReducedMotion) {
    // Pas de flou ni de mouvement : un simple fondu instantané suffit.
    gsap.set(elements, { opacity: 1, scale: 1, filter: "blur(0px)" });
    return;
  }

  gsap.set(elements, { opacity: 0, scale: 1.07, filter: "blur(12px)" });

  ScrollTrigger.batch(elements, {
    start: "top 85%",
    once: true,
    onEnter: (batch) =>
      gsap.to(batch, {
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",
        duration: 1.1,
        ease: "power2.out",
        stagger: options.stagger ?? 0.13,
        onStart: function (this: gsap.core.Tween) {
          this.targets().forEach((el) => {
            (el as HTMLElement).style.willChange = "filter, transform, opacity";
          });
        },
        onComplete: function (this: gsap.core.Tween) {
          this.targets().forEach((el) => {
            (el as HTMLElement).style.willChange = "auto";
          });
        },
      }),
  });
}

export function initAnimations() {
  const revealTargets = gsap.utils.toArray<HTMLElement>('[data-animate="reveal"]');
  const imageFrames = gsap.utils.toArray<HTMLElement>('[data-animate="image-reveal"]');

  // Titres, TrustBar, stats Constat, cards Services/Étapes, items FAQ,
  // formulaire/coordonnées Contact — un seul et même effet cinétique.
  kineticBlurReveal(revealTargets, { stagger: 0.13 });

  // Grille Réalisations — exactement la même fonction, mêmes valeurs.
  kineticBlurReveal(imageFrames, { stagger: 0.13 });

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
