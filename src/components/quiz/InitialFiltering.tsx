import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { QuizData } from "@/types/quiz";
import { User, Building, Briefcase, HelpCircle, MapPin, Target } from "lucide-react";

interface InitialFilteringProps {
  data: QuizData;
  onUpdate: (field: keyof QuizData, value: any) => void;
  onNext: () => void;
  onRedirect: (reason: string) => void;
}

export function InitialFiltering({ data, onUpdate, onNext, onRedirect }: InitialFilteringProps) {
  const handleRoleSelect = (role: QuizData['role']) => {
    onUpdate('role', role);
    if (role === 'autre') {
      onRedirect('Role non qualifié pour nos services');
    }
  };

  const handleLocationSelect = (hasLocation: boolean) => {
    onUpdate('hasPhysicalLocation', hasLocation);
    if (!hasLocation) {
      onRedirect('SEO national recommandé plutôt que local');
    }
  };

  const canProceed = data.role && data.role !== 'autre' && 
                    data.hasPhysicalLocation !== null && data.hasPhysicalLocation &&
                    data.mainObjective && data.hasUsedSeoAgency;

  return (
    <div className="space-y-8">
      {/* Rôle dans l'entreprise */}
      <div>
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-primary" />
          Quel est votre rôle dans l'entreprise ?
        </h3>
        <div className="grid md:grid-cols-2 gap-3">
          {[
            { value: 'dirigeant', label: 'Dirigeant / Gérant', icon: Building },
            { value: 'responsable-marketing', label: 'Responsable marketing', icon: Target },
            { value: 'freelance', label: 'Freelance / Indépendant', icon: Briefcase },
            { value: 'autre', label: 'Autre', icon: HelpCircle }
          ].map(({ value, label, icon: Icon }) => (
            <Card 
              key={value}
              className={`cursor-pointer transition-all hover:shadow-md ${
                data.role === value ? 'border-primary bg-primary/5' : 'border-border'
              }`}
              onClick={() => handleRoleSelect(value as QuizData['role'])}
            >
              <CardContent className="p-4 flex items-center gap-3">
                <Icon className="w-5 h-5 text-primary" />
                <span className="font-medium">{label}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Local physique */}
      {data.role && data.role !== 'autre' && (
        <div>
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            Avez-vous un local, une adresse ou une zone de chalandise à promouvoir ?
          </h3>
          <div className="grid md:grid-cols-2 gap-3">
            {[
              { value: true, label: 'Oui, j\'ai une présence locale' },
              { value: false, label: 'Non, je travaille uniquement à distance' }
            ].map(({ value, label }) => (
              <Card 
                key={String(value)}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  data.hasPhysicalLocation === value ? 'border-primary bg-primary/5' : 'border-border'
                }`}
                onClick={() => handleLocationSelect(value)}
              >
                <CardContent className="p-4">
                  <span className="font-medium">{label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Objectif principal */}
      {data.hasPhysicalLocation === true && (
        <div>
          <h3 className="text-xl font-semibold mb-4">
            Votre objectif principal aujourd'hui :
          </h3>
          <div className="grid md:grid-cols-2 gap-3">
            {[
              { value: 'attirer-clients', label: 'Attirer plus de clients' },
              { value: 'visibilite-online', label: 'Être plus visible en ligne' },
              { value: 'google-visibility', label: 'Mieux ressortir sur Google' },
              { value: 'autre', label: 'Autre objectif' }
            ].map(({ value, label }) => (
              <Card 
                key={value}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  data.mainObjective === value ? 'border-primary bg-primary/5' : 'border-border'
                }`}
                onClick={() => onUpdate('mainObjective', value)}
              >
                <CardContent className="p-4">
                  <span className="font-medium">{label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Expérience SEO */}
      {data.mainObjective && (
        <div>
          <h3 className="text-xl font-semibold mb-4">
            Avez-vous déjà fait appel à une agence SEO ou un freelance ?
          </h3>
          <div className="grid md:grid-cols-3 gap-3">
            {[
              { value: 'oui', label: 'Oui, déjà fait' },
              { value: 'non', label: 'Non, jamais' },
              { value: 'en-cours', label: 'En cours' }
            ].map(({ value, label }) => (
              <Card 
                key={value}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  data.hasUsedSeoAgency === value ? 'border-primary bg-primary/5' : 'border-border'
                }`}
                onClick={() => onUpdate('hasUsedSeoAgency', value)}
              >
                <CardContent className="p-4 text-center">
                  <span className="font-medium">{label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {canProceed && (
        <div className="flex justify-center pt-4">
          <Button onClick={onNext} size="lg">
            Continuer l'analyse
          </Button>
        </div>
      )}
    </div>
  );
}