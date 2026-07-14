export interface Realisation {
  /** Filename inside src/assets/images/realisations/ */
  src: string;
  alt: string;
  title: string;
  url?: string;
}

// (capture du Hero de chaque site livré, alt descriptif, url si le site est en ligne).
export const realisations: Realisation[] = [
  {
    src: "hero_denisoudure.png",
    alt: "page d'accueil d'un site réalisé par Mld Dev pour un artisan soudeur",
    title: "Site pour un artisan soudeur",
    url: "https://denis-soudure.vercel.app/",
  },
  {
    src: "hero_dentiste.png",
    alt: "page d'accueil d'un site réalisé par Mld Dev pour un cabinet dentaire",
    title: "Site pour un cabinet dentaire",
    url: "https://cabinet-dentaire-jade-chi.vercel.app/",
  },
  {
    src: "hero_coiffeur.png",
    alt: "page d'accueil d'un site réalisé par Mld Dev pour un salon de coiffure",
    title: "Site pour un salon de coiffure pour femme",
  },
  {
    src: "hero_macon.png",
    alt: "page d'accueil d'un site réalisé par Mld Dev pour une entreprise de maçonnerie",
    title: "Site pour une entreprise de maçonnerie",
    url: "https://macon-modern.vercel.app/",
  },
  {
    src: "hero_mld.png",
    alt: "page d'accueil d'un site réalisé par Mld Dev pour une agence web",
    title: "Site pour une agence web",
  },
];
