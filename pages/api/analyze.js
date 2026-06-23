export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { imageUris, description, tradeType } = req.body;

  const imageContents = (imageUris || []).map(uri => ({
    type: 'image_url',
    image_url: { url: uri, detail: 'high' }
  }));

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        max_tokens: 2000,
        temperature: 0.2,
        messages: [
          {
            role: 'system',
            content: `Tu es un expert en devis de travaux du bâtiment en France, avec 20 ans d'expérience.

Tu connais parfaitement:
- Les prix réels du marché français 2025-2026
- Les normes techniques françaises (DTU, NF)
- Les matériaux et fournisseurs locaux (Leroy Merlin, Bricomarché, Point P)
- Les différences de coût entre régions (Paris plus cher, zones rurales moins cher)
- Les taxes applicables (TVA 20%, TVA réduite 10% pour rénovation)

RÈGLES ABSOLUES:
1. Tous les montants en EUR (€)
2. Main d'œuvre basée sur les tarifs réels 2026
3. Ajoute TOUJOURS une marge de sécurité de 15% sur les matériaux
4. INCLUS TOUJOURS: déplacement, préparation, nettoyage et consommables
5. Ne sous-estime JAMAIS — préfère toujours surestimer
6. INCLUS TOUJOURS "Imprévus et divers" = 10% du total
7. Signale TOUS les problèmes cachés visibles sur les photos
8. Décompose les travaux complexes en étapes détaillées
9. Mention légale TVA non applicable art. 293B du CGI si auto-entrepreneur

IMPORTANT: Réponds UNIQUEMENT avec le JSON pur, sans texte avant ni après, sans markdown, sans backticks.`
          },
          {
            role: 'user',
            content: [
              ...imageContents,
              {
                type: 'text',
                text: `Type de travaux: ${tradeType}
Description: ${description}

Réponds UNIQUEMENT en JSON valide sans markdown:
{
  "resume": "résumé technique en 2-3 phrases",
  "difficulte": "faible/moyenne/élevée/très élevée",
  "duree": "ex: 3-5 jours ouvrés",
  "budgetMin": 0,
  "budgetMax": 0,
  "pointsAttention": ["point 1", "point 2"],
  "lignes": [
    {
      "label": "description précise du service",
      "detail": "explication technique courte",
      "quantite": 1,
      "unite": "u/m²/ml/h/forfait",
      "prixUnitaire": 0
    }
  ]
}`
              }
            ]
          }
        ]
      })
    });

    const data = await response.json();
    if (data.error) return res.status(400).json({ error: data.error.message });
    const content = data.choices[0].message.content;
    const cleaned = content.replace(/```json|```/g, '').trim();
    return res.status(200).json(JSON.parse(cleaned));
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}