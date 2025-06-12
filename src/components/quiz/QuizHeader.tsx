import { Progress } from "@/components/ui/progress";

interface QuizHeaderProps {
  currentStep: number;
  totalSteps: number;
  title: string;
  subtitle?: string;
}

export function QuizHeader({ currentStep, totalSteps, title, subtitle }: QuizHeaderProps) {
  const progress = ((currentStep - 1) / (totalSteps - 1)) * 100;

  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      {/* Logo BeeVisible */}
      <div className="flex justify-center mb-6">
        <img 
          src="/lovable-uploads/09bfcd60-d55b-405e-b4a3-e6a91b29b76c.png" 
          alt="BeeVisible Logo" 
          className="h-16 w-auto"
        />
      </div>
      
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-muted-foreground">
            Étape {currentStep} sur {totalSteps}
          </span>
          <span className="text-sm font-medium text-primary">
            {Math.round(progress)}%
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>
      
      <div className="text-center">
        <h1 className="text-2xl md:text-3xl font-bold mb-2 text-foreground">
          {title}
        </h1>
        {subtitle && (
          <p className="text-lg text-muted-foreground">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}