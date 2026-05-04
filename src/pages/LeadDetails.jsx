import Layout from '../components/Layout';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function LeadDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(false);
  const [emailContent, setEmailContent] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [toast, setToast] = useState({ message: '', visible: false, type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ message, visible: true, type });
    setTimeout(() => setToast({ message: '', visible: false, type }), 4000);
  };

  useEffect(() => {
    async function fetchLead() {
      if (!id) return;
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('id', id)
        .single();
        
      if (data) {
        setLead(data);
        setRecipientEmail(data.email && data.email !== 'empty' ? data.email : '');
        setSubject(`Contact - ${data.name}`);
        setEmailContent(`Bonjour,\n\nJ'ai découvert ${data.name} et votre activité dans le secteur : ${data.industry}.\n\nJe pense que nous pourrions vous aider à identifier de nouvelles opportunités de croissance.\n\nSeriez-vous disponible pour un court échange de 15 minutes la semaine prochaine ?\n\nBien à vous,\nL'équipe`);
      }
    }
    fetchLead();
  }, [id]);

  const handleSendEmail = () => {
    if (!recipientEmail) {
      showToast("Veuillez renseigner une adresse e-mail valide.", "error");
      return;
    }
    
    // Ouvrir le client mail de façon synchrone pour éviter le blocage du navigateur
    window.location.href = `mailto:${recipientEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailContent)}`;
    
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      showToast("L'application de messagerie s'est ouverte !");
    }, 1500);
  };

  const handleGenerateEmail = async () => {
    if (!lead) return;
    setLoading(true);
    try {
      const res = await fetch('https://ornellaworkflow.app.n8n.cloud/webhook/generate-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          company_name: lead.name,
          sector: lead.industry,
          contact_name: "Responsable",
          context: `Voici la description de notre agence E-commerce : experte pour les acteurs de la mode, du fooding, de la beauté, de la santé, de l’énergie et des projets innovants. Notre accompagnement : expérience utilisateur, parcours client, conversion et performance des ventes. Dotée d’un Pôle Conception : Ux-Ui Design, Développements (Shopify, Prestashop, Sylius, Woo-Commerce), TMA/TME. Et d’un Pôle Performance : CRO, Paid Media, CRM & Email marketing. Nous proposons des solutions E-commerce adaptées et sur-mesure. Le prospect s'appelle ${lead.name} et est dans le secteur ${lead.industry} à ${lead.location}. À la fin du mail, propose 2 créneaux avec des dates et heures précises la semaine prochaine où notre agence est libre pour un rdv (via notre Google Agenda).`
        })
      });
      
      if (res.ok) {
        const data = await res.text();
        try {
          const json = JSON.parse(data);
          setEmailContent(json.email || json.content || data);
        } catch {
          setEmailContent(data);
        }
        showToast("L'e-mail a été généré avec succès !");
      } else {
        showToast("Erreur lors de la génération de l'e-mail.", 'error');
      }
    } catch (error) {
      console.error(error);
      showToast("Impossible de contacter n8n.", 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!lead) {
    return (
      <Layout title="Détails du prospect">
        <div className="flex items-center justify-center h-full">
          <p>Chargement des détails...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Détails du prospect">
      {/* Modal Overlay Style */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 overflow-hidden">
        <div className="absolute inset-0 bg-zinc-950/40 backdrop-blur-sm" onClick={() => navigate('/leads')}></div>
        
        {/* Modal Content */}
        <div className="relative bg-white w-full max-w-6xl h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
          
          {/* Left Side: Company Info */}
          <div className="w-full md:w-[450px] border-r border-zinc-100 p-8 overflow-y-auto flex flex-col bg-white">
            <div className="flex items-start justify-between mb-8">
              <div className="w-24 h-24 rounded-2xl bg-zinc-50 border border-zinc-100 flex items-center justify-center p-4 shadow-sm text-4xl font-bold text-zinc-300">
                {lead.name.charAt(0).toUpperCase()}
              </div>
              <button className="text-zinc-400 hover:text-zinc-900 transition-colors cursor-pointer" onClick={() => navigate('/leads')}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="mb-8">
              <h2 className="text-[32px] font-black text-primary leading-tight tracking-tight mb-2">{lead.name}</h2>
              <div className="flex flex-col gap-3 mt-4">
                {lead.website && (
                  <div className="flex items-center gap-3">
                    <a href={lead.website} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white rounded-full text-sm font-semibold hover:bg-zinc-800 transition-all shadow-sm">
                      <span className="material-symbols-outlined text-sm">public</span>
                      <span>Visiter le site web</span>
                    </a>
                  </div>
                )}
                <div className="space-y-2 mt-2">
                  <div className="flex items-center gap-3 text-zinc-600">
                    <span className="material-symbols-outlined text-zinc-400 text-lg">mail</span>
                    <span className="text-sm font-medium">{lead.email || "Non renseigné"}</span>
                  </div>
                  <div className="flex items-center gap-3 text-zinc-600">
                    <span className="material-symbols-outlined text-zinc-400 text-lg">call</span>
                    <span className="text-sm font-medium">{lead.phone || "Non renseigné"}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-y-6 gap-x-4 mb-10 py-6 border-y border-zinc-100">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Secteur</p>
                <p className="text-sm font-bold text-primary">{lead.industry}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Localisation</p>
                <p className="text-sm font-bold text-primary">{lead.location}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Ajouté le</p>
                <p className="text-sm font-bold text-primary">{new Date(lead.created_at).toLocaleDateString('fr-FR')}</p>
              </div>
            </div>
            
            <div className="mt-auto">
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-3">Informations & Description</p>
              <div className="bg-zinc-50 rounded-2xl p-5 border border-zinc-100">
                <p className="text-sm text-zinc-600 leading-relaxed">
                  {lead.description || "Aucune description trouvée sur Google Maps pour cet établissement."}
                </p>
              </div>
            </div>
          </div>
          
          {/* Right Side: Action Area */}
          <div className="flex-grow bg-zinc-50 p-8 flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-secondary-container"></span>
                <span className="text-label-sm font-label-sm text-zinc-600 uppercase tracking-widest">Aperçu du mail personnalisé</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-zinc-400 text-lg">auto_awesome</span>
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Optimisé par l'IA</span>
              </div>
            </div>
            
            <div className="flex-grow flex flex-col bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between bg-white">
                <div className="flex items-center gap-3 w-full">
                  <span className="text-label-sm font-bold text-zinc-400">À:</span>
                  <input 
                    type="email" 
                    value={recipientEmail} 
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    className="flex-grow px-2 py-1 bg-zinc-100 rounded text-sm font-medium text-zinc-700 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
              <div className="px-6 py-4 border-b border-zinc-100">
                <div className="flex items-center gap-3">
                  <span className="text-label-sm font-bold text-zinc-400">Objet:</span>
                  <input 
                    className="flex-grow border-none focus:ring-0 text-sm font-semibold p-0 outline-none" 
                    type="text" 
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                </div>
              </div>
              
              <textarea 
                className="flex-grow p-6 border-none focus:ring-0 text-body-md text-on-surface-variant leading-relaxed resize-none outline-none" 
                placeholder="Écrivez votre message personnalisé ici..." 
                value={emailContent}
                onChange={(e) => setEmailContent(e.target.value)}
              />
              
              <div className="p-6 bg-zinc-50/50 flex items-center justify-between border-t border-zinc-100">
                <button 
                  onClick={handleSendEmail}
                  disabled={isSending}
                  className="bg-[#FFD700] text-black px-8 py-3 rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-yellow-500/10 hover:shadow-yellow-500/20 active:scale-95 transition-all cursor-pointer ml-auto disabled:opacity-70 disabled:cursor-not-allowed">
                  <span>{isSending ? "Envoi en cours..." : "Envoyer le mail"}</span>
                  <span className={`material-symbols-outlined text-sm ${isSending ? 'animate-pulse' : ''}`}>{isSending ? 'hourglass_empty' : 'send'}</span>
                </button>
              </div>
            </div>
            
            <div className="mt-6 flex items-center justify-center gap-6">
              <button 
                onClick={handleGenerateEmail}
                disabled={loading}
                className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest hover:text-zinc-900 transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50">
                <span className={`material-symbols-outlined text-sm ${loading ? 'animate-spin' : ''}`}>refresh</span>
                {loading ? "Génération en cours..." : "Générer un e-mail sur mesure avec l'IA"}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Toast Notification */}
      {toast.visible && (
        <div className={`fixed bottom-8 right-8 z-[100] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl transition-all duration-300 animate-in slide-in-from-bottom-8 ${toast.type === 'error' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-zinc-900 text-white'}`}>
          <span className="material-symbols-outlined text-xl">
            {toast.type === 'error' ? 'error' : 'check_circle'}
          </span>
          <p className="font-semibold text-sm">{toast.message}</p>
        </div>
      )}
    </Layout>
  );
}
