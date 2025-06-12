import { QuizData, QuizCalculation } from "@/types/quiz";

export function calculateQuizResults(data: QuizData): QuizCalculation {
  // Vérifie si le prospect est qualifié
  const isQualified = checkQualification(data);
  const reasons = getDisqualificationReasons(data);
  
  if (!isQualified) {
    return {
      potentialClients: 0,
      lostClients: 0,
      estimatedRevenue: 0,
      isQualified: false,
      reasons
    };
  }

  // Calcul des clients perdus actuellement
  const lostClients = calculateLostClients(data);
  
  // Calcul du potentiel de clients
  const potentialClients = calculatePotentialClients(data);
  
  // Calcul du chiffre d'affaires estimé
  const estimatedRevenue = potentialClients * (data.averageTicket || 0);

  return {
    potentialClients,
    lostClients,
    estimatedRevenue,
    isQualified: true,
    reasons: []
  };
}

function checkQualification(data: QuizData): boolean {
  // Critères de qualification
  const hasDecisionRole = data.role === 'dirigeant' || data.role === 'responsable-marketing' || data.role === 'freelance';
  const hasPhysicalPresence = data.hasPhysicalLocation === true;
  const hasAdequateTicket = (data.averageTicket || 0) >= 30; // Minimum 30€ de ticket moyen
  const canAcceptMoreClients = data.acceptMoreClients === true;
  const hasNeed = data.mainObjective && data.mainObjective !== 'autre';

  return hasDecisionRole && hasPhysicalPresence && hasAdequateTicket && canAcceptMoreClients && hasNeed;
}

function getDisqualificationReasons(data: QuizData): string[] {
  const reasons: string[] = [];
  
  if (!data.role || data.role === 'autre') {
    reasons.push("Rôle non décisionnaire dans l'entreprise");
  }
  
  if (data.hasPhysicalLocation !== true) {
    reasons.push("Pas de présence locale ou physique");
  }
  
  if ((data.averageTicket || 0) < 30) {
    reasons.push("Ticket moyen trop faible pour justifier l'investissement SEO");
  }
  
  if (data.acceptMoreClients !== true) {
    reasons.push("Capacité limitée pour accueillir de nouveaux clients");
  }
  
  if (!data.mainObjective) {
    reasons.push("Objectifs marketing non définis");
  }

  return reasons;
}

function calculateLostClients(data: QuizData): number {
  let score = 0;
  
  // Impact du pourcentage de clients via Google Maps
  switch (data.googleMapsClients) {
    case 'moins-10':
      score += 30;
      break;
    case '10-30':
      score += 20;
      break;
    case 'ne-sais-pas':
      score += 25;
      break;
  }
  
  // Impact de l'optimisation Google
  switch (data.googleProfileOptimized) {
    case 'non':
      score += 25;
      break;
    case 'ne-sais-pas':
      score += 15;
      break;
  }
  
  // Impact du nombre de plateformes
  switch (data.platformsCount) {
    case '1-2':
      score += 20;
      break;
    case 'aucune-idee':
      score += 25;
      break;
  }
  
  // Site web non connecté
  if (data.hasWebsiteLinked === false) {
    score += 15;
  }
  
  // Concurrents mieux positionnés
  switch (data.competitorsAhead) {
    case 'oui':
      score += 20;
      break;
    case 'ne-sais-pas':
      score += 10;
      break;
  }
  
  return Math.min(score, 85); // Maximum 85 clients perdus
}

function calculatePotentialClients(data: QuizData): number {
  // Multiplicateurs par secteur
  const sectorMultipliers: { [key: string]: number } = {
    "Restaurant / Café": 0.8,
    "Commerce de détail": 1.0,
    "Services à la personne": 1.2,
    "Santé / Bien-être": 1.5,
    "Automobile": 1.3,
    "Immobilier": 2.0,
    "Artisanat / BTP": 1.4,
    "Services professionnels": 1.6,
    "Tourisme / Hôtellerie": 0.9,
    "Fitness / Sport": 1.1,
    "Beauté / Esthétique": 1.2,
    "Autre": 1.0
  };

  // Base de 25 clients potentiels par mois pour une stratégie SEO locale
  const baseClients = 25;
  const sectorMultiplier = sectorMultipliers[data.sector] || 1.0;
  
  // Ajustement selon l'état actuel
  let currentStateMultiplier = 1.0;
  
  // Bonus si déjà quelques clients via Google Maps
  if (data.googleMapsClients === '10-30' || data.googleMapsClients === '30-50') {
    currentStateMultiplier *= 1.2;
  }
  
  // Bonus si fiche Google déjà optimisée
  if (data.googleProfileOptimized === 'oui') {
    currentStateMultiplier *= 1.1;
  }
  
  // Malus si concurrents très bien positionnés
  if (data.competitorsAhead === 'oui') {
    currentStateMultiplier *= 0.9;
  }

  return Math.round(baseClients * sectorMultiplier * currentStateMultiplier);
}

// Fonction pour calculer le ROI estimé
export function calculateROI(data: QuizData, monthlyInvestment: number = 800): number {
  const results = calculateQuizResults(data);
  const monthlyRevenue = results.estimatedRevenue;
  
  if (monthlyRevenue === 0) return 0;
  
  return Math.round(((monthlyRevenue - monthlyInvestment) / monthlyInvestment) * 100);
}