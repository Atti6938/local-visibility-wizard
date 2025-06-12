import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { QuizData, QuizCalculation } from "@/types/quiz";
import { CheckCircle, Mail, Phone, Globe, Gift } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FinalStepProps {
  data: QuizData;
  calculation: QuizCalculation;
  onUpdate: (field: keyof QuizData, value: any) => void;
  onSubmit: () => void;
}

export function FinalStep({ data, calculation, onUpdate, onSubmit }: FinalStepProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      const response = await fetch('https://teeebalqimwaqonfnoaw.supabase.co/functions/v1/send-quiz-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data,
          calculation
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'envoi');
      }

      toast({
        title: "Demande envoyée avec succès !",
        description: "Nous vous contacterons dans les 24h pour votre analyse gratuite.",
      });
      
      onSubmit();
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: "Erreur lors de l'envoi",
        description: "Une erreur s'est produite. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const canSubmit = data.firstName && data.lastName && data.email && 
                   data.firstName.length > 1 && data.lastName.length > 1 && 
                   data.email.includes('@');

  if (!calculation.isQualified) {
    return (
      <Card className="border-muted">
        <CardContent className="p-8 text-center">
          <h3 className="text-xl font-semibold mb-4">
            Votre profil ne correspond pas à nos critères actuels
          </h3>
          <p className="text-muted-foreground mb-6">
            Nous nous concentrons sur les entreprises locales avec un potentiel SEO immédiat. 
            Cependant, nous serions ravis de vous orienter vers des solutions plus adaptées.
          </p>
          <div className="space-y-3">
            {calculation.reasons.map((reason, index) => (
              <p key={index} className="text-sm text-muted-foreground">
                • {reason}
              </p>
            ))}
          </div>
          <Button className="mt-6" onClick={() => window.location.href = '/'}>
            Retour à l'accueil
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      {/* Confirmation d'éligibilité */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-6 text-center">
          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-2 text-primary">
            Félicitations ! Votre profil est parfait pour le SEO local
          </h3>
          <p className="text-muted-foreground">
            Vous pourriez attirer entre <strong>{calculation.potentialClients}</strong> clients par mois 
            et générer <strong>+{calculation.estimatedRevenue.toLocaleString()}€</strong> de chiffre d'affaires
          </p>
        </CardContent>
      </Card>

      {/* Offre gratuite */}
      <Card className="border-2 border-primary">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Gift className="w-6 h-6 text-primary" />
            <h3 className="text-xl font-semibold">
              Analyse SEO Gratuite & Personnalisée
            </h3>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                <CheckCircle className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-semibold text-sm">Estimation du trafic</h4>
              <p className="text-xs text-muted-foreground">Potentiel de votre zone</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                <CheckCircle className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-semibold text-sm">Mots-clés stratégiques</h4>
              <p className="text-xs text-muted-foreground">Opportunités cachées</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                <CheckCircle className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-semibold text-sm">Points d'amélioration</h4>
              <p className="text-xs text-muted-foreground">Plan d'action concret</p>
            </div>
          </div>

          <div className="bg-accent/50 rounded-lg p-4 mb-6">
            <p className="text-sm font-medium mb-1">🎯 Analyse 100% gratuite</p>
            <p className="text-xs text-muted-foreground">
              Aucun engagement • Résultats sous 48h • Valeur : 297€
            </p>
          </div>

          {/* Formulaire de contact */}
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">Prénom *</Label>
                <Input
                  id="firstName"
                  value={data.firstName}
                  onChange={(e) => onUpdate('firstName', e.target.value)}
                  placeholder="Votre prénom"
                />
              </div>
              <div>
                <Label htmlFor="lastName">Nom *</Label>
                <Input
                  id="lastName"
                  value={data.lastName}
                  onChange={(e) => onUpdate('lastName', e.target.value)}
                  placeholder="Votre nom"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email professionnel *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={data.email}
                  onChange={(e) => onUpdate('email', e.target.value)}
                  placeholder="votre@email.com"
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="phone">Téléphone (optionnel)</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="phone"
                  type="tel"
                  value={data.phone}
                  onChange={(e) => onUpdate('phone', e.target.value)}
                  placeholder="06 12 34 56 78"
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="website">Site web ou fiche Google (optionnel)</Label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="website"
                  value={data.website}
                  onChange={(e) => onUpdate('website', e.target.value)}
                  placeholder="https://votre-site.com"
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          <Button 
            onClick={handleSubmit}
            disabled={!canSubmit || isSubmitting}
            size="lg" 
            className="w-full mt-6"
          >
            {isSubmitting ? 'Envoi en cours...' : 'Demander mon analyse gratuite'}
          </Button>

          <p className="text-xs text-muted-foreground text-center mt-4">
            En cliquant, vous acceptez d'être contacté par notre équipe dans les 48h. 
            Aucun spam, données sécurisées.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}