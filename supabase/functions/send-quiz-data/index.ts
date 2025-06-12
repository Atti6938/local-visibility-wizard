import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface QuizSubmissionRequest {
  data: any;
  calculation: any;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { data, calculation }: QuizSubmissionRequest = await req.json();

    const formatQuizData = (data: any) => {
      return `
        <h2>Informations du prospect :</h2>
        <p><strong>Nom :</strong> ${data.lastName}</p>
        <p><strong>Prénom :</strong> ${data.firstName}</p>
        <p><strong>Email :</strong> ${data.email}</p>
        <p><strong>Téléphone :</strong> ${data.phone || 'Non renseigné'}</p>
        <p><strong>Site web :</strong> ${data.website || 'Non renseigné'}</p>
        
        <h2>Informations entreprise :</h2>
        <p><strong>Rôle :</strong> ${data.role}</p>
        <p><strong>Secteur :</strong> ${data.sector}</p>
        <p><strong>Localisation :</strong> ${data.location}</p>
        <p><strong>Ticket moyen :</strong> ${data.averageTicket}€</p>
        <p><strong>Présence physique :</strong> ${data.hasPhysicalLocation ? 'Oui' : 'Non'}</p>
        <p><strong>Peut accepter plus de clients :</strong> ${data.acceptMoreClients ? 'Oui' : 'Non'}</p>
        
        <h2>Objectifs et situation SEO :</h2>
        <p><strong>Objectif principal :</strong> ${data.mainObjective}</p>
        <p><strong>A déjà utilisé une agence SEO :</strong> ${data.hasUsedSeoAgency}</p>
        <p><strong>Clients via Google Maps :</strong> ${data.googleMapsClients}</p>
        <p><strong>Profil Google optimisé :</strong> ${data.googleProfileOptimized}</p>
        <p><strong>Nombre de plateformes :</strong> ${data.platformsCount}</p>
        <p><strong>Site web connecté :</strong> ${data.hasWebsiteLinked ? 'Oui' : 'Non'}</p>
        <p><strong>Concurrents mieux positionnés :</strong> ${data.competitorsAhead}</p>
        
        <h2>Résultats du calcul :</h2>
        <p><strong>Qualifié :</strong> ${calculation.isQualified ? 'Oui' : 'Non'}</p>
        <p><strong>Clients potentiels par mois :</strong> ${calculation.potentialClients}</p>
        <p><strong>Clients perdus actuellement :</strong> ${calculation.lostClients}</p>
        <p><strong>Chiffre d'affaires estimé :</strong> ${calculation.estimatedRevenue.toLocaleString()}€</p>
        
        ${calculation.reasons.length > 0 ? `
        <h2>Raisons de non-qualification :</h2>
        <ul>
          ${calculation.reasons.map((reason: string) => `<li>${reason}</li>`).join('')}
        </ul>
        ` : ''}
      `;
    };

    const emailResponse = await resend.emails.send({
      from: "Quiz BeeVisible <onboarding@resend.dev>",
      to: ["beevisible6938@gmail.com"],
      subject: `Nouveau prospect qualifié : ${data.firstName} ${data.lastName} - ${data.sector}`,
      html: `
        <h1>Nouveau lead généré par le quiz BeeVisible</h1>
        ${formatQuizData(data)}
        
        <hr>
        <p><small>Email généré automatiquement par le quiz BeeVisible</small></p>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-quiz-data function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);