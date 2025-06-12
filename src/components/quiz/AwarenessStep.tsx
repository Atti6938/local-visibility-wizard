import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { QuizData } from "@/types/quiz";
import { MapPin, Star, Globe, Link, Eye, AlertTriangle } from "lucide-react";

interface AwarenessStepProps {
  data: QuizData;
  onUpdate: (field: keyof QuizData, value: any) => void;
  onNext: () => void;
}

export function AwarenessStep({ data, onUpdate, onNext }: AwarenessStepProps) {
  const calculateLostClients = () => {
    let score = 0;
    if (data.googleMapsClients === 'moins-10') score += 30;
    if (data.googleMapsClients === '10-30') score += 20;
    if (data.googleMapsClients === 'ne-sais-pas') score += 25;
    
    if (data.googleProfileOptimized === 'non') score += 25;
    if (data.googleProfileOptimized === 'ne-sais-pas') score += 15;
    
    if (data.platformsCount === '1-2') score += 20;
    if (data.platformsCount === 'aucune-idee') score += 25;
    
    if (data.hasWebsiteLinked === false) score += 15;
    if (data.competitorsAhead === 'oui') score += 20;
    if (data.competitorsAhead === 'ne-sais-pas') score += 10;
    
    return Math.min(score, 85); // Maximum 85 clients perdus
  };

  const lostClients = calculateLostClients();
  const canProceed = data.googleMapsClients && data.googleProfileOptimized && 
                    data.platformsCount && data.hasWebsiteLinked !== null && 
                    data.competitorsAhead;

  return (
    <div className="space-y-8">
      {/* Google Maps clients */}
      <div>
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-primary" />
          En moyenne, combien de clients viennent grâce à Google Maps ou une recherche locale ?
        </h3>
        <div className="grid md:grid-cols-2 gap-3">
          {[
            { value: 'moins-10', label: 'Moins de 10%' },
            { value: '10-30', label: '10-30%' },
            { value: '30-50', label: '30-50%' },
            { value: 'ne-sais-pas', label: 'Je ne sais pas' }
          ].map(({ value, label }) => (
            <Card 
              key={value}
              className={`cursor-pointer transition-all hover:shadow-md ${
                data.googleMapsClients === value ? 'border-primary bg-primary/5' : 'border-border'
              }`}
              onClick={() => onUpdate('googleMapsClients', value)}
            >
              <CardContent className="p-4">
                <span className="font-medium">{label}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Fiche Google optimisée */}
      <div>
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Star className="w-5 h-5 text-primary" />
          Votre fiche Google est-elle optimisée ? (photos, avis, description, lien site, etc.)
        </h3>
        <div className="grid md:grid-cols-3 gap-3">
          {[
            { value: 'oui', label: 'Oui, complètement' },
            { value: 'non', label: 'Non, pas du tout' },
            { value: 'ne-sais-pas', label: 'Je ne sais pas' }
          ].map(({ value, label }) => (
            <Card 
              key={value}
              className={`cursor-pointer transition-all hover:shadow-md ${
                data.googleProfileOptimized === value ? 'border-primary bg-primary/5' : 'border-border'
              }`}
              onClick={() => onUpdate('googleProfileOptimized', value)}
            >
              <CardContent className="p-4 text-center">
                <span className="font-medium">{label}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Plateformes de visibilité */}
      <div>
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Globe className="w-5 h-5 text-primary" />
          Sur combien de plateformes êtes-vous visible actuellement ?
        </h3>
        <div className="grid md:grid-cols-3 gap-3">
          {[
            { value: '1-2', label: '1-2 plateformes' },
            { value: '3-5', label: '3-5 plateformes' },
            { value: 'aucune-idee', label: 'Aucune idée' }
          ].map(({ value, label }) => (
            <Card 
              key={value}
              className={`cursor-pointer transition-all hover:shadow-md ${
                data.platformsCount === value ? 'border-primary bg-primary/5' : 'border-border'
              }`}
              onClick={() => onUpdate('platformsCount', value)}
            >
              <CardContent className="p-4 text-center">
                <span className="font-medium">{label}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Site web lié */}
      <div>
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Link className="w-5 h-5 text-primary" />
          Avez-vous un site web relié à votre fiche Google ?
        </h3>
        <div className="grid md:grid-cols-2 gap-3">
          {[
            { value: true, label: 'Oui, j\'ai un site web connecté' },
            { value: false, label: 'Non, pas de site ou pas connecté' }
          ].map(({ value, label }) => (
            <Card 
              key={String(value)}
              className={`cursor-pointer transition-all hover:shadow-md ${
                data.hasWebsiteLinked === value ? 'border-primary bg-primary/5' : 'border-border'
              }`}
              onClick={() => onUpdate('hasWebsiteLinked', value)}
            >
              <CardContent className="p-4">
                <span className="font-medium">{label}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Concurrents */}
      <div>
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Eye className="w-5 h-5 text-primary" />
          Vos concurrents apparaissent-ils avant vous sur Google ?
        </h3>
        <div className="grid md:grid-cols-3 gap-3">
          {[
            { value: 'oui', label: 'Oui, souvent' },
            { value: 'non', label: 'Non, je suis bien placé' },
            { value: 'ne-sais-pas', label: 'Je ne sais pas' }
          ].map(({ value, label }) => (
            <Card 
              key={value}
              className={`cursor-pointer transition-all hover:shadow-md ${
                data.competitorsAhead === value ? 'border-primary bg-primary/5' : 'border-border'
              }`}
              onClick={() => onUpdate('competitorsAhead', value)}
            >
              <CardContent className="p-4 text-center">
                <span className="font-medium">{label}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Jauge de clients perdus */}
      {canProceed && lostClients > 0 && (
        <Card className="border-destructive/20 bg-destructive/5">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              <h4 className="text-lg font-semibold text-destructive">
                Alerte : Clients perdus détectés
              </h4>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Basé sur vos réponses, voici une estimation de votre situation :
            </p>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Clients potentiellement perdus par mois :</span>
                <span className="text-lg font-bold text-destructive">{lostClients}</span>
              </div>
              <Progress value={(lostClients / 85) * 100} className="h-3" />
              <p className="text-xs text-muted-foreground">
                Cette estimation est basée sur votre secteur d'activité et votre zone géographique
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {canProceed && (
        <div className="flex justify-center pt-4">
          <Button onClick={onNext} size="lg">
            Calculer mon potentiel
          </Button>
        </div>
      )}
    </div>
  );
}