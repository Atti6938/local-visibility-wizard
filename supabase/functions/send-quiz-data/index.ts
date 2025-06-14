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

    const formatQuizData = (data: any, calculation: any) => {
      const formatRole = (role: string) => {
        const roles = {
          'dirigeant': 'Dirigeant / CEO',
          'responsable-marketing': 'Responsable Marketing',
          'freelance': 'Freelance / Indépendant',
          'autre': 'Autre'
        };
        return roles[role as keyof typeof roles] || role;
      };

      const formatObjective = (objective: string) => {
        const objectives = {
          'attirer-clients': 'Attirer plus de clients',
          'visibilite-online': 'Améliorer visibilité en ligne',
          'google-visibility': 'Être mieux positionné sur Google',
          'autre': 'Autre objectif'
        };
        return objectives[objective as keyof typeof objectives] || objective;
      };

      const formatSeoAgency = (agency: string) => {
        const agencies = {
          'oui': 'Oui, j\'ai déjà fait appel à une agence SEO',
          'non': 'Non, jamais travaillé avec une agence SEO',
          'en-cours': 'J\'ai une agence actuellement'
        };
        return agencies[agency as keyof typeof agencies] || agency;
      };

      const formatClientsCount = (count: string) => {
        const counts = {
          'moins-10': 'Moins de 10 clients par mois',
          '10-30': 'Entre 10 et 30 clients par mois',
          '30-50': 'Plus de 30 clients par mois',
          'ne-sais-pas': 'Je ne sais pas'
        };
        return counts[count as keyof typeof counts] || count;
      };

      return `
        <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; background: #f9f9f9;">
          <div style="background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h1 style="color: #2563eb; text-align: center; margin-bottom: 30px; border-bottom: 3px solid #2563eb; padding-bottom: 15px;">
              🎯 Nouveau Lead Qualifié - Quiz BeeVisible
            </h1>
            
            <div style="background: #f0f7ff; padding: 20px; border-radius: 6px; margin-bottom: 25px; border-left: 4px solid #2563eb;">
              <h2 style="color: #1e40af; margin-top: 0;">👤 Informations du Prospect</h2>
              <p><strong>Nom complet :</strong> ${data.firstName} ${data.lastName}</p>
              <p><strong>Email :</strong> <a href="mailto:${data.email}" style="color: #2563eb;">${data.email}</a></p>
              <p><strong>Téléphone :</strong> ${data.phone || '❌ Non renseigné'}</p>
              <p><strong>Site web :</strong> ${data.website ? `<a href="${data.website}" target="_blank" style="color: #2563eb;">${data.website}</a>` : '❌ Non renseigné'}</p>
              <p><strong>Rôle dans l'entreprise :</strong> ${formatRole(data.role)}</p>
            </div>

            <div style="background: #f0fdf4; padding: 20px; border-radius: 6px; margin-bottom: 25px; border-left: 4px solid #16a34a;">
              <h2 style="color: #15803d; margin-top: 0;">🏢 Informations Entreprise</h2>
              <p><strong>Secteur d'activité :</strong> ${data.sector}</p>
              <p><strong>Localisation :</strong> ${data.location}</p>
              <p><strong>Ticket moyen :</strong> <span style="color: #16a34a; font-weight: bold;">${data.averageTicket}€</span></p>
              <p><strong>Présence physique :</strong> ${data.hasPhysicalLocation ? '✅ Oui' : '❌ Non'}</p>
              <p><strong>Peut accepter plus de clients :</strong> ${data.acceptMoreClients ? '✅ Oui' : '❌ Non'}</p>
              <p><strong>Objectif principal :</strong> ${formatObjective(data.mainObjective)}</p>
            </div>

            <div style="background: #fefce8; padding: 20px; border-radius: 6px; margin-bottom: 25px; border-left: 4px solid #eab308;">
              <h2 style="color: #a16207; margin-top: 0;">📊 Situation SEO Actuelle</h2>
              <p><strong>A déjà utilisé une agence SEO :</strong> ${formatSeoAgency(data.hasUsedSeoAgency)}</p>
              <p><strong>Clients via Google Maps :</strong> ${formatClientsCount(data.googleMapsClients)}</p>
              <p><strong>Profil Google optimisé :</strong> ${data.googleProfileOptimized === 'oui' ? '✅ Oui' : data.googleProfileOptimized === 'non' ? '❌ Non' : '❓ Ne sait pas'}</p>
              <p><strong>Nombre de plateformes présentes :</strong> ${data.platformsCount === '1-2' ? '1-2 plateformes' : data.platformsCount === '3-5' ? '3-5 plateformes' : 'Aucune idée'}</p>
              <p><strong>Site web connecté au profil Google :</strong> ${data.hasWebsiteLinked ? '✅ Oui' : '❌ Non'}</p>
              <p><strong>Concurrents mieux positionnés :</strong> ${data.competitorsAhead === 'oui' ? '✅ Oui' : data.competitorsAhead === 'non' ? '❌ Non' : '❓ Ne sait pas'}</p>
            </div>

            <div style="background: ${calculation.isQualified ? '#dcfce7' : '#fef2f2'}; padding: 20px; border-radius: 6px; margin-bottom: 25px; border-left: 4px solid ${calculation.isQualified ? '#16a34a' : '#dc2626'};">
              <h2 style="color: ${calculation.isQualified ? '#15803d' : '#dc2626'}; margin-top: 0;">
                ${calculation.isQualified ? '🎉 Résultats du Calcul - QUALIFIÉ' : '❌ Résultats du Calcul - NON QUALIFIÉ'}
              </h2>
              <p><strong>Statut :</strong> <span style="color: ${calculation.isQualified ? '#16a34a' : '#dc2626'}; font-weight: bold; font-size: 18px;">
                ${calculation.isQualified ? '✅ QUALIFIÉ' : '❌ NON QUALIFIÉ'}
              </span></p>
              <p><strong>Clients potentiels par mois :</strong> <span style="color: #2563eb; font-weight: bold;">${calculation.potentialClients}</span></p>
              <p><strong>Clients perdus actuellement :</strong> <span style="color: #dc2626; font-weight: bold;">${calculation.lostClients}</span></p>
              <p><strong>Chiffre d'affaires potentiel estimé :</strong> <span style="color: #16a34a; font-weight: bold; font-size: 18px;">+${calculation.estimatedRevenue.toLocaleString()}€ / mois</span></p>
              
              ${calculation.reasons.length > 0 ? `
              <div style="margin-top: 20px; padding: 15px; background: #fef2f2; border-radius: 4px; border: 1px solid #fecaca;">
                <h3 style="color: #dc2626; margin-top: 0;">⚠️ Raisons de non-qualification :</h3>
                <ul style="margin: 0; padding-left: 20px;">
                  ${calculation.reasons.map((reason: string) => `<li style="color: #dc2626; margin: 5px 0;">${reason}</li>`).join('')}
                </ul>
              </div>
              ` : ''}
            </div>

            <div style="background: #e0e7ff; padding: 15px; border-radius: 6px; margin-top: 30px; text-align: center;">
              <p style="margin: 0; color: #3730a3; font-size: 14px;">
                <strong>📧 Email généré automatiquement par le Quiz BeeVisible</strong><br>
                🕒 Reçu le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}
              </p>
            </div>
          </div>
        </div>
      `;
    };

    const emailResponse = await resend.emails.send({
      from: "Quiz BeeVisible <onboarding@resend.dev>",
      to: ["beevisible6938@gmail.com"],
      subject: `🎯 ${calculation.isQualified ? 'QUALIFIÉ' : 'NON QUALIFIÉ'} - ${data.firstName} ${data.lastName} - ${data.sector} (${data.location})`,
      html: formatQuizData(data, calculation),
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