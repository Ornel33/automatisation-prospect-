import Layout from '../components/Layout';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ProspectSearch() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [toast, setToast] = useState({ message: '', visible: false, type: 'success' });
  const [formData, setFormData] = useState({
    secteur: '',
    positionnement: '',
    taille: '',
    revenu: '',
    localisation: ''
  });

  const showToast = (message, type = 'success') => {
    setToast({ message, visible: true, type });
    setTimeout(() => setToast({ message: '', visible: false, type }), 5000);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setProgress(0);
    showToast("Recherche lancée, cela peut prendre 1 à 2 minutes...", "info");
    
    // Fake progress interval
    const interval = setInterval(() => {
      setProgress((old) => {
        if (old >= 95) return old;
        return old + (95 - old) * 0.05; // slows down as it gets closer to 95
      });
    }, 1000);
    
    try {
      // Appel du webhook n8n (Production)
      const res = await fetch('https://ornellaworkflow.app.n8n.cloud/webhook/prospect-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        const data = await res.json();
        
        if (data && data.prospects && data.prospects.length > 0) {
          // On transforme le format n8n pour l'adapter à notre table Supabase (leads)
          const leadsToInsert = data.prospects.map(p => ({
            name: p.nom || 'Entreprise inconnue',
            industry: p.secteur || formData.secteur || 'Non défini',
            location: p.localisation || p.adresse || formData.localisation || 'Non défini',
            website: p.siteWeb || null,
            description: p.description || null,
            email: p.email && p.email !== 'empty' ? p.email : null,
            phone: p.telephone && p.telephone !== 'empty' ? p.telephone : null
          }));

          const { supabase } = await import('../lib/supabase');
          const { error } = await supabase.from('leads').insert(leadsToInsert);

          if (error) {
            console.error("Erreur d'insertion Supabase:", error);
            showToast("Erreur de sauvegarde Supabase : " + error.message, "error");
          } else {
            showToast(`${data.prospects.length} prospects trouvés et ajoutés à votre base !`, "success");
            setTimeout(() => navigate('/leads'), 2000);
          }
        } else {
          showToast("Aucun prospect n'a été trouvé par n8n avec ces critères.", "error");
        }
      } else {
        showToast("Erreur lors de la communication avec n8n.", "error");
      }
    } catch (error) {
      console.error("Erreur Webhook:", error);
      showToast("Impossible de contacter le serveur n8n.", "error");
    } finally {
      clearInterval(interval);
      setProgress(100);
      setTimeout(() => setLoading(false), 500);
    }
  };

  return (
    <Layout title="Recherche de prospects">
      {/* Prospecting Content */}
      <section className="max-w-4xl mx-auto py-8 md:py-xl px-4 md:px-md">
        <div className="mb-lg text-center">
          <h1 className="text-4xl md:text-5xl font-black text-primary mb-4 tracking-tight">Trouver vos prochains prospects</h1>
          <p className="font-body-lg text-on-surface-variant max-w-2xl mx-auto">Configurez vos critères pour trouver vos leads.</p>
        </div>
        <div className="bg-white rounded-xl border border-zinc-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden max-w-2xl mx-auto">
          <div className="p-md border-b border-zinc-100 bg-zinc-50/30">
            <h3 className="font-headline-md flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">filter_list</span>
              Paramètres de ciblage
            </h3>
          </div>
          <form className="p-md space-y-md" onSubmit={handleSearch}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
              {/* Secteur */}
              <div className="space-y-xs">
                <label className="font-label-sm uppercase tracking-wider text-on-surface-variant">Secteur d'activité</label>
                <select name="secteur" value={formData.secteur} onChange={handleChange} className="w-full bg-white border-x-0 border-t-0 border-b-2 border-zinc-200 focus:ring-0 focus:border-zinc-900 px-0 py-2 font-body-md outline-none transition-colors">
                  <option value="">Choisir un secteur</option>
                  <option value="Mode">Mode</option>
                  <option value="Fooding">Fooding</option>
                  <option value="Beauté">Beauté</option>
                  <option value="Santé">Santé</option>
                  <option value="Energie">Énergie</option>
                  <option value="Tech">Projets innovants</option>
                </select>
              </div>
              {/* Positionnement */}
              <div className="space-y-xs">
                <label className="font-label-sm uppercase tracking-wider text-on-surface-variant">Positionnement</label>
                <select name="positionnement" value={formData.positionnement} onChange={handleChange} className="w-full bg-white border-x-0 border-t-0 border-b-2 border-zinc-200 focus:ring-0 focus:border-zinc-900 px-0 py-2 font-body-md outline-none transition-colors">
                  <option value="">Type d'entreprise</option>
                  <option value="Grand groupe">Grand groupe</option>
                  <option value="Retailers">Retailers</option>
                  <option value="DNVB">DNVB</option>
                  <option value="Autres">Autres</option>
                </select>
              </div>
              {/* Taille */}
              <div className="space-y-xs">
                <label className="font-label-sm uppercase tracking-wider text-on-surface-variant">Taille de l'entreprise</label>
                <select name="taille" value={formData.taille} onChange={handleChange} className="w-full bg-white border-x-0 border-t-0 border-b-2 border-zinc-200 focus:ring-0 focus:border-zinc-900 px-0 py-2 font-body-md outline-none transition-colors">
                  <option value="">Nombre d'employés</option>
                  <option value="1-10">1-10</option>
                  <option value="11-50">11-50</option>
                  <option value="51-200">51-200</option>
                  <option value="201-500">201-500</option>
                  <option value="500+">500+</option>
                </select>
              </div>
              {/* Revenu */}
              <div className="space-y-xs">
                <label className="font-label-sm uppercase tracking-wider text-on-surface-variant">Revenu annuel</label>
                <select name="revenu" value={formData.revenu} onChange={handleChange} className="w-full bg-white border-x-0 border-t-0 border-b-2 border-zinc-200 focus:ring-0 focus:border-zinc-900 px-0 py-2 font-body-md outline-none transition-colors">
                  <option value="">Chiffre d'affaires</option>
                  <option value="100K+">100K+</option>
                  <option value="500K+">500K+</option>
                  <option value="1M+">1M+</option>
                  <option value="5M+">5M+</option>
                </select>
              </div>
            </div>
            {/* Localisation */}
            <div className="space-y-xs">
              <label className="font-label-sm uppercase tracking-wider text-on-surface-variant">Localisation</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute right-0 bottom-2 text-zinc-400">location_on</span>
                <input name="localisation" value={formData.localisation} onChange={handleChange} className="w-full bg-white border-x-0 border-t-0 border-b-2 border-zinc-200 focus:ring-0 focus:border-zinc-900 px-0 py-2 font-body-md outline-none transition-colors" placeholder="ex: Paris, France, Europe" type="text" />
              </div>
            </div>
            {/* Progress Bar & Primary Action */}
            <div className="pt-8 space-y-4">
              {loading && (
                <div className="w-full">
                  <div className="flex justify-between text-[11px] text-zinc-500 font-bold mb-2 uppercase tracking-widest">
                    <span>Recherche en cours...</span>
                    <span className="animate-pulse">{Math.round(progress)}%</span>
                  </div>
                  <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#FFD700] rounded-full transition-all duration-1000 ease-out" 
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              )}
              <button disabled={loading} className="w-full py-4 bg-[#FFD700] text-black font-bold text-lg rounded-xl hover:bg-[#e6c200] disabled:bg-zinc-200 disabled:text-zinc-400 transition-all transform active:scale-95 shadow-sm flex items-center justify-center gap-3 cursor-pointer" type="submit">
                <span className="material-symbols-outlined">{loading ? 'hourglass_empty' : 'bolt'}</span>
                {loading ? 'Recherche en cours...' : 'Rechercher les prospects'}
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Toast Notification */}
      {toast.visible && (
        <div className={`fixed bottom-24 md:bottom-8 right-4 md:right-8 z-[100] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl transition-all duration-300 animate-in slide-in-from-bottom-8 ${toast.type === 'error' ? 'bg-red-50 text-red-600 border border-red-100' : toast.type === 'info' ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'bg-zinc-900 text-white'}`}>
          <span className="material-symbols-outlined text-xl">
            {toast.type === 'error' ? 'error' : toast.type === 'info' ? 'info' : 'check_circle'}
          </span>
          <p className="font-semibold text-sm">{toast.message}</p>
        </div>
      )}
    </Layout>
  );
}
