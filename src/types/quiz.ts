export interface QuizData {
  // Filtrage initial
  role: 'dirigeant' | 'responsable-marketing' | 'freelance' | 'autre' | '';
  hasPhysicalLocation: boolean | null;
  mainObjective: 'attirer-clients' | 'visibilite-online' | 'google-visibility' | 'autre' | '';
  hasUsedSeoAgency: 'oui' | 'non' | 'en-cours' | '';

  // Prise de conscience
  googleMapsClients: 'moins-10' | '10-30' | '30-50' | 'ne-sais-pas' | '';
  googleProfileOptimized: 'oui' | 'non' | 'ne-sais-pas' | '';
  platformsCount: '1-2' | '3-5' | 'aucune-idee' | '';
  hasWebsiteLinked: boolean | null;
  competitorsAhead: 'oui' | 'non' | 'ne-sais-pas' | '';

  // Potentiel ROI
  sector: string;
  location: string;
  averageTicket: number;
  acceptMoreClients: boolean | null;

  // Contact
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  website: string;
}

export interface QuizStep {
  id: string;
  title: string;
  subtitle?: string;
  component: React.ComponentType<any>;
}

export interface QuizCalculation {
  potentialClients: number;
  lostClients: number;
  estimatedRevenue: number;
  isQualified: boolean;
  reasons: string[];
}