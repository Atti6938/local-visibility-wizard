import { useState } from "react";
import { QuizData, QuizCalculation } from "@/types/quiz";
import { calculateQuizResults } from "@/utils/quizCalculations";
import { QuizIntro } from "./QuizIntro";
import { QuizHeader } from "./QuizHeader";
import { InitialFiltering } from "./InitialFiltering";
import { AwarenessStep } from "./AwarenessStep";
import { PotentialStep } from "./PotentialStep";
import { FinalStep } from "./FinalStep";
import { RedirectStep } from "./RedirectStep";

type QuizStep = 'intro' | 'filtering' | 'awareness' | 'potential' | 'final' | 'redirect' | 'success';

const initialData: QuizData = {
  role: '',
  hasPhysicalLocation: null,
  mainObjective: '',
  hasUsedSeoAgency: '',
  googleMapsClients: '',
  googleProfileOptimized: '',
  platformsCount: '',
  hasWebsiteLinked: null,
  competitorsAhead: '',
  sector: '',
  location: '',
  averageTicket: 0,
  acceptMoreClients: null,
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  website: ''
};

export function QuizContainer() {
  const [currentStep, setCurrentStep] = useState<QuizStep>('intro');
  const [data, setData] = useState<QuizData>(initialData);
  const [redirectReason, setRedirectReason] = useState<string>('');
  const [calculation, setCalculation] = useState<QuizCalculation | null>(null);

  const updateData = (field: keyof QuizData, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const handleStart = () => {
    setCurrentStep('filtering');
  };

  const handleNext = () => {
    switch (currentStep) {
      case 'filtering':
        setCurrentStep('awareness');
        break;
      case 'awareness':
        setCurrentStep('potential');
        break;
      case 'potential':
        const results = calculateQuizResults(data);
        setCalculation(results);
        setCurrentStep('final');
        break;
      case 'final':
        setCurrentStep('success');
        break;
    }
  };

  const handleRedirect = (reason: string) => {
    setRedirectReason(reason);
    setCurrentStep('redirect');
  };

  const handleSubmit = () => {
    // Ici vous pourriez envoyer les données à votre backend
    console.log('Quiz data:', data);
    console.log('Calculation:', calculation);
    setCurrentStep('success');
  };

  const getStepInfo = () => {
    switch (currentStep) {
      case 'filtering':
        return { step: 1, total: 4, title: "Parlons de votre entreprise", subtitle: "Quelques questions pour mieux vous connaître" };
      case 'awareness':
        return { step: 2, total: 4, title: "Analysons votre visibilité actuelle", subtitle: "Découvrons ensemble vos points d'amélioration" };
      case 'potential':
        return { step: 3, total: 4, title: "Calculons votre potentiel", subtitle: "Estimons le retour sur investissement possible" };
      case 'final':
        return { step: 4, total: 4, title: "Votre analyse personnalisée", subtitle: "Obtenez votre audit gratuit maintenant" };
      default:
        return { step: 1, total: 4, title: "", subtitle: "" };
    }
  };

  if (currentStep === 'intro') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
        <QuizIntro onStart={handleStart} />
      </div>
    );
  }

  if (currentStep === 'redirect') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
        <RedirectStep reason={redirectReason} />
      </div>
    );
  }

  if (currentStep === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-primary" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-4">Merci pour votre demande !</h1>
          <p className="text-lg text-muted-foreground mb-6">
            Nous avons bien reçu vos informations. Notre équipe vous contactera dans les 24h 
            pour vous présenter votre analyse SEO personnalisée.
          </p>
          <p className="text-sm text-muted-foreground">
            Vérifiez vos emails (et vos spams) pour ne rien manquer !
          </p>
        </div>
      </div>
    );
  }

  const stepInfo = getStepInfo();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-8">
        <QuizHeader 
          currentStep={stepInfo.step}
          totalSteps={stepInfo.total}
          title={stepInfo.title}
          subtitle={stepInfo.subtitle}
        />
        
        <div className="max-w-4xl mx-auto">
          {currentStep === 'filtering' && (
            <InitialFiltering
              data={data}
              onUpdate={updateData}
              onNext={handleNext}
              onRedirect={handleRedirect}
            />
          )}
          
          {currentStep === 'awareness' && (
            <AwarenessStep
              data={data}
              onUpdate={updateData}
              onNext={handleNext}
            />
          )}
          
          {currentStep === 'potential' && (
            <PotentialStep
              data={data}
              onUpdate={updateData}
              onNext={handleNext}
            />
          )}
          
          {currentStep === 'final' && calculation && (
            <FinalStep
              data={data}
              calculation={calculation}
              onUpdate={updateData}
              onSubmit={handleSubmit}
            />
          )}
        </div>
      </div>
    </div>
  );
}