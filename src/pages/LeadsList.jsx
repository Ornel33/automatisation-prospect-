import Layout from '../components/Layout';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function LeadsList() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterSector, setFilterSector] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [sendingId, setSendingId] = useState(null);
  const [toast, setToast] = useState({ message: '', visible: false, type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ message, visible: true, type });
    setTimeout(() => setToast({ message: '', visible: false, type }), 4000);
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  async function fetchLeads() {
    try {
      setLoading(true);
      let query = supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (filterSector && filterSector !== 'Tous les secteurs') {
        query = query.ilike('industry', `%${filterSector}%`);
      }
      if (filterLocation) {
        query = query.ilike('location', `%${filterLocation}%`);
      }
      if (filterDate) {
        const startOfDay = new Date(filterDate);
        startOfDay.setHours(0,0,0,0);
        const endOfDay = new Date(filterDate);
        endOfDay.setHours(23,59,59,999);
        query = query.gte('created_at', startOfDay.toISOString())
                     .lte('created_at', endOfDay.toISOString());
      }
      
      const { data, error } = await query;
      if (error) throw error;
      if (data) setLeads(data);
    } catch (error) {
      console.error('Error fetching leads:', error.message);
    } finally {
      setLoading(false);
    }
  }

  const handleSendEmail = (e, lead) => {
    e.preventDefault();
    if (!lead.email || lead.email === 'empty') {
      showToast("Cet établissement n'a pas d'adresse e-mail renseignée.", "error");
      return;
    }
    
    // Synchrone pour éviter le blocage
    window.location.href = `mailto:${lead.email}?subject=Contact - ${encodeURIComponent(lead.name)}&body=Bonjour, j'aimerais vous présenter nos services.`;
    
    setSendingId(lead.id);
    setTimeout(() => {
      setSendingId(null);
      showToast("L'application de messagerie s'est ouverte !");
    }, 1500);
  };

  return (
    <Layout title="Résultats des Leads">
      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-zinc-100 shadow-sm flex flex-col md:flex-row items-stretch md:items-center gap-4 mb-lg">
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div className="relative">
            <label className="absolute -top-2 left-3 px-1 bg-white font-label-sm text-zinc-500">Secteur</label>
            <select 
              value={filterSector}
              onChange={(e) => setFilterSector(e.target.value)}
              className="w-full border-zinc-200 rounded-lg focus:ring-0 focus:border-zinc-900 py-3 font-body-md bg-white border outline-none px-2"
            >
              <option value="">Tous les secteurs</option>
              <option value="Mode">Mode</option>
              <option value="Fooding">Fooding</option>
              <option value="Beauté">Beauté</option>
              <option value="Santé">Santé</option>
              <option value="Energie">Énergie</option>
              <option value="Tech">Projets innovants</option>
            </select>
          </div>
          <div className="relative">
            <label className="absolute -top-2 left-3 px-1 bg-white font-label-sm text-zinc-500">Pays/Ville</label>
            <div className="flex items-center border border-zinc-200 rounded-lg focus-within:border-zinc-900 transition-colors">
              <span className="material-symbols-outlined text-zinc-400 ml-3">location_on</span>
              <input 
                value={filterLocation}
                onChange={(e) => setFilterLocation(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchLeads()}
                className="w-full border-none focus:ring-0 py-3 font-body-md placeholder:text-zinc-300 outline-none px-2" 
                placeholder="Chercher un lieu..." 
                type="text" 
              />
            </div>
          </div>
          <div className="relative">
            <label className="absolute -top-2 left-3 px-1 bg-white font-label-sm text-zinc-500">Date d'ajout</label>
            <div className="flex items-center border border-zinc-200 rounded-lg focus-within:border-zinc-900 transition-colors">
              <span className="material-symbols-outlined text-zinc-400 ml-3">calendar_today</span>
              <input 
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchLeads()}
                className="w-full border-none focus:ring-0 py-3 font-body-md placeholder:text-zinc-300 outline-none px-2 bg-transparent" 
                type="date" 
              />
            </div>
          </div>
        </div>
        <button 
          onClick={fetchLeads}
          className="bg-zinc-100 w-full md:w-auto justify-center text-zinc-900 px-6 py-3 rounded-lg font-bold hover:bg-zinc-200 transition-colors flex items-center gap-2 cursor-pointer"
        >
          <span className="material-symbols-outlined">filter_list</span>
          Appliquer
        </button>
      </div>

      {/* Nouveau Prospect Button */}
      <div className="flex justify-end mb-md">
        <Link to="/recherche" className="bg-[#FFD700] text-black font-bold py-3 px-8 rounded-lg shadow-sm hover:opacity-90 active:scale-95 transition-all flex items-center gap-2 cursor-pointer inline-flex">
          <span className="material-symbols-outlined text-[20px]">add</span>
          Nouveau Prospect
        </Link>
      </div>

      {/* Leads Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md">
        {loading ? (
          <p className="text-zinc-500 col-span-full text-center py-8">Chargement des prospects...</p>
        ) : leads.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-white rounded-xl border border-zinc-100">
            <span className="material-symbols-outlined text-4xl text-zinc-300 mb-2">group_off</span>
            <p className="text-zinc-500 font-medium">Aucun prospect trouvé dans la base de données.</p>
          </div>
        ) : (
          leads.map((lead) => (
            <div key={lead.id} className="group bg-white border border-zinc-100 rounded-xl p-md shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all duration-300 flex flex-col gap-4 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-[#FFD700] transform -translate-y-full group-hover:translate-y-0 transition-transform"></div>
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 bg-zinc-50 rounded-lg border border-zinc-100 flex items-center justify-center text-zinc-900 font-bold text-xl">
                  {lead.name ? lead.name.charAt(0).toUpperCase() : '?'}
                </div>
                <button className="text-zinc-300 hover:text-error transition-colors cursor-pointer">
                  <span className="material-symbols-outlined">delete</span>
                </button>
              </div>
              <div>
                <h3 className="font-headline-md text-zinc-900 mb-1">{lead.name}</h3>
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-zinc-50 text-zinc-600 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider border border-zinc-100">{lead.industry}</span>
                  <div className="flex items-center gap-1 text-zinc-400 text-xs">
                    <span className="material-symbols-outlined text-[14px]">location_on</span>
                    {lead.location}
                  </div>
                </div>
              </div>
              <div className="mt-auto flex flex-col gap-3">
                <Link to={`/leads/${lead.id}`} className="text-center font-label-md text-zinc-500 hover:text-zinc-900 underline underline-offset-4 decoration-zinc-200">
                  Voir les détails
                </Link>
                <button 
                  onClick={(e) => handleSendEmail(e, lead)}
                  disabled={sendingId === lead.id}
                  className="w-full bg-zinc-900 text-white font-bold py-3 rounded-lg hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <span className={`material-symbols-outlined text-[20px] ${sendingId === lead.id ? 'animate-pulse' : ''}`}>
                    {sendingId === lead.id ? 'hourglass_empty' : 'mail'}
                  </span>
                  {sendingId === lead.id ? "Envoi en cours..." : "Envoyer un mail"}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Toast Notification */}
      {toast.visible && (
        <div className={`fixed bottom-24 md:bottom-8 right-4 md:right-8 z-[100] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl transition-all duration-300 animate-in slide-in-from-bottom-8 ${toast.type === 'error' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-zinc-900 text-white'}`}>
          <span className="material-symbols-outlined text-xl">
            {toast.type === 'error' ? 'error' : 'check_circle'}
          </span>
          <p className="font-semibold text-sm">{toast.message}</p>
        </div>
      )}
    </Layout>
  );
}
