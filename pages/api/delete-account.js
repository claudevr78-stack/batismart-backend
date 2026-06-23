export default function DeleteAccount() {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '60px auto', padding: '20px' }}>
      <h1 style={{ color: '#0a1628' }}>🏗️ DevisClic — Suppression de compte</h1>
      <p style={{ color: '#555', lineHeight: '1.6', marginTop: '20px' }}>
        Pour supprimer votre compte et toutes vos données, vous pouvez :
      </p>
      <ul style={{ color: '#555', lineHeight: '2', marginTop: '16px' }}>
        <li>Ouvrir l'application DevisClic</li>
        <li>Aller dans <strong>Profil → Supprimer mon compte</strong></li>
        <li>Confirmer la suppression</li>
      </ul>
      <p style={{ color: '#555', lineHeight: '1.6', marginTop: '20px' }}>
        Toutes vos données (devis, factures, profil) seront supprimées définitivement et immédiatement.
      </p>
      <p style={{ color: '#888', fontSize: '13px', marginTop: '40px' }}>
        Pour toute assistance : <a href="mailto:rayanhen4@gmail.com">rayanhen4@gmail.com</a>
      </p>
    </div>
  );
}