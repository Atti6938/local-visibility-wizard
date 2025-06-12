import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, ArrowRight, Globe, Users } from "lucide-react";

interface RedirectStepProps {
  reason: string;
}

export function RedirectStep({ reason }: RedirectStepProps) {
  const getRedirectContent = () => {
    if (reason.includes('national')) {
      return {
        title: "Nous vous recommandons le SEO national",
        description: "Votre activité semble plus adaptée à une stratégie SEO nationale plutôt que locale.",
        suggestions: [
          "Optimisation pour des mots-clés génériques",
          "Stratégie de contenu national",
          "Link building à grande échelle",
          "SEO technique avancé"
        ],
        actionText: "Découvrir le SEO national",
        actionUrl: "#seo-national"
      };
    }
    
    return {
      title: "Votre profil ne correspond pas à nos services actuels",
      description: "Nous nous concentrons sur les dirigeants et responsables d'entreprises locales.",
      suggestions: [
        "Revenez quand vous aurez un rôle décisionnaire",
        "Partagez ce quiz avec votre responsable",
        "Consultez nos ressources gratuites",
        "Rejoignez notre newsletter pour des conseils"
      ],
      actionText: "Retour à l'accueil",
      actionUrl: "/"
    };
  };

  const content = getRedirectContent();

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="border-muted">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-muted/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8 text-muted-foreground" />
          </div>
          
          <h2 className="text-2xl font-bold mb-4">{content.title}</h2>
          <p className="text-muted-foreground mb-8">{content.description}</p>
          
          <div className="space-y-4 mb-8">
            <h3 className="text-lg font-semibold text-left">Nous vous suggérons :</h3>
            {content.suggestions.map((suggestion, index) => (
              <div key={index} className="flex items-center gap-3 text-left">
                <ArrowRight className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="text-sm">{suggestion}</span>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <Card className="border-primary/20">
              <CardContent className="p-4 text-center">
                <Globe className="w-8 h-8 text-primary mx-auto mb-2" />
                <h4 className="font-semibold text-sm">Ressources gratuites</h4>
                <p className="text-xs text-muted-foreground">Guides et outils SEO</p>
              </CardContent>
            </Card>
            
            <Card className="border-primary/20">
              <CardContent className="p-4 text-center">
                <Users className="w-8 h-8 text-primary mx-auto mb-2" />
                <h4 className="font-semibold text-sm">Communauté</h4>
                <p className="text-xs text-muted-foreground">Rejoignez nos experts</p>
              </CardContent>
            </Card>
          </div>

          <Button 
            onClick={() => window.location.href = content.actionUrl}
            size="lg"
            className="w-full md:w-auto"
          >
            {content.actionText}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}