import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Users, TrendingUp } from "lucide-react";

interface QuizIntroProps {
  onStart: () => void;
}

export function QuizIntro({ onStart }: QuizIntroProps) {
  return (
    <div className="max-w-4xl mx-auto text-center">
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
          BeeVisible
        </h1>
        <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-foreground">
          Testez votre visibilité locale
        </h2>
        <p className="text-xl text-muted-foreground mb-8">
          Combien de clients vous échappent chaque mois ? Découvrez votre potentiel en 2 minutes.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <Card className="border-primary/20 hover:border-primary/40 transition-colors">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Visibilité Locale</h3>
            <p className="text-sm text-muted-foreground">
              Analysez votre présence sur Google Maps et les recherches locales
            </p>
          </CardContent>
        </Card>

        <Card className="border-primary/20 hover:border-primary/40 transition-colors">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Clients Perdus</h3>
            <p className="text-sm text-muted-foreground">
              Découvrez combien de prospects passent chez vos concurrents
            </p>
          </CardContent>
        </Card>

        <Card className="border-primary/20 hover:border-primary/40 transition-colors">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Potentiel ROI</h3>
            <p className="text-sm text-muted-foreground">
              Estimez le retour sur investissement d'une stratégie SEO locale
            </p>
          </CardContent>
        </Card>
      </div>

      <Button onClick={onStart} size="lg" className="text-lg px-8 py-6">
        Commencer le test gratuit
      </Button>
      
      <p className="text-sm text-muted-foreground mt-4">
        ⏱️ 2 minutes • 📊 Résultats immédiats • 🔒 Aucun engagement
      </p>
    </div>
  );
}