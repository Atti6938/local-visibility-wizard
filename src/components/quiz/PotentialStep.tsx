import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { QuizData } from "@/types/quiz";
import { Building, MapPin, Euro, TrendingUp, Users } from "lucide-react";

interface PotentialStepProps {
  data: QuizData;
  onUpdate: (field: keyof QuizData, value: any) => void;
  onNext: () => void;
}

const sectors = [
  "Restaurant / Café",
  "Commerce de détail",
  "Services à la personne",
  "Santé / Bien-être",
  "Automobile",
  "Immobilier",
  "Artisanat / BTP",
  "Services professionnels",
  "Tourisme / Hôtellerie",
  "Fitness / Sport",
  "Beauté / Esthétique",
  "Autre"
];

export function PotentialStep({ data, onUpdate, onNext }: PotentialStepProps) {
  const calculatePotential = () => {
    if (!data.averageTicket || !data.sector || !data.location) return null;
    
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

    const baseClients = 25; // Base de 25 clients potentiels par mois
    const sectorMultiplier = sectorMultipliers[data.sector] || 1.0;
    const potentialClients = Math.round(baseClients * sectorMultiplier);
    const monthlyRevenue = potentialClients * data.averageTicket;
    
    return {
      minClients: Math.round(potentialClients * 0.5),
      maxClients: Math.round(potentialClients * 1.4),
      monthlyRevenue,
      yearlyRevenue: monthlyRevenue * 12
    };
  };

  const potential = calculatePotential();
  const canProceed = data.sector && data.location && data.averageTicket > 0 && data.acceptMoreClients !== null;

  return (
    <div className="space-y-8">
      {/* Secteur d'activité */}
      <div>
        <Label htmlFor="sector" className="text-lg font-semibold flex items-center gap-2 mb-4">
          <Building className="w-5 h-5 text-primary" />
          Quel est votre secteur d'activité ?
        </Label>
        <Select value={data.sector} onValueChange={(value) => onUpdate('sector', value)}>
          <SelectTrigger className="h-12">
            <SelectValue placeholder="Sélectionnez votre secteur" />
          </SelectTrigger>
          <SelectContent>
            {sectors.map((sector) => (
              <SelectItem key={sector} value={sector}>
                {sector}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Zone géographique */}
      <div>
        <Label htmlFor="location" className="text-lg font-semibold flex items-center gap-2 mb-4">
          <MapPin className="w-5 h-5 text-primary" />
          Quelle est votre zone de couverture ou ville ?
        </Label>
        <Input
          id="location"
          value={data.location}
          onChange={(e) => onUpdate('location', e.target.value)}
          placeholder="Ex: Paris, Lyon, région parisienne..."
          className="h-12"
        />
      </div>

      {/* Ticket moyen */}
      <div>
        <Label htmlFor="ticket" className="text-lg font-semibold flex items-center gap-2 mb-4">
          <Euro className="w-5 h-5 text-primary" />
          Quelle est la valeur moyenne d'un client (ticket moyen) ?
        </Label>
        <div className="relative">
          <Euro className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            id="ticket"
            type="number"
            value={data.averageTicket || ''}
            onChange={(e) => onUpdate('averageTicket', parseFloat(e.target.value) || 0)}
            placeholder="Ex: 50"
            className="h-12 pl-10"
          />
        </div>
      </div>

      {/* Accepter plus de clients */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          Accepteriez-vous 5 à 20 clients supplémentaires par mois ?
        </h3>
        <div className="grid md:grid-cols-2 gap-3">
          {[
            { value: true, label: 'Oui, j\'ai la capacité' },
            { value: false, label: 'Non, je suis au maximum' }
          ].map(({ value, label }) => (
            <Card 
              key={String(value)}
              className={`cursor-pointer transition-all hover:shadow-md ${
                data.acceptMoreClients === value ? 'border-primary bg-primary/5' : 'border-border'
              }`}
              onClick={() => onUpdate('acceptMoreClients', value)}
            >
              <CardContent className="p-4">
                <span className="font-medium">{label}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Estimation du potentiel */}
      {potential && data.acceptMoreClients === true && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h4 className="text-lg font-semibold text-primary">
                Votre Potentiel SEO Local
              </h4>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Clients supplémentaires par mois :</p>
                <p className="text-2xl font-bold text-primary">
                  {potential.minClients} à {potential.maxClients}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Chiffre d'affaires supplémentaire :</p>
                <p className="text-2xl font-bold text-primary">
                  {potential.monthlyRevenue.toLocaleString()}€/mois
                </p>
              </div>
            </div>
            <div className="mt-4 p-4 bg-background rounded-lg">
              <p className="text-sm font-medium mb-2">Projection annuelle :</p>
              <p className="text-xl font-bold">
                +{potential.yearlyRevenue.toLocaleString()}€ de CA
              </p>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              * Estimation basée sur votre secteur d'activité ({data.sector}) et votre zone géographique
            </p>
          </CardContent>
        </Card>
      )}

      {canProceed && (
        <div className="flex justify-center pt-4">
          <Button onClick={onNext} size="lg">
            Voir si je suis éligible
          </Button>
        </div>
      )}
    </div>
  );
}