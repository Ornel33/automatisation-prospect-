import Layout from '../components/Layout';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const initialSectors = [
  { name: 'Mode', prospects: 0, emailsSent: '0', emailsPending: 0 },
  { name: 'Fooding', prospects: 0, emailsSent: '0', emailsPending: 0 },
  { name: 'Beauté', prospects: 0, emailsSent: '0', emailsPending: 0 },
  { name: 'Santé', prospects: 0, emailsSent: '0', emailsPending: 0 },
  { name: 'Energie', prospects: 0, emailsSent: '0', emailsPending: 0 },
  { name: 'Tech', prospects: 0, emailsSent: '0', emailsPending: 0 },
];

export default function Dashboard() {
  const [activeFilter, setActiveFilter] = useState('7 Jours');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [totalLeads, setTotalLeads] = useState(0);
  const [sectorsData, setSectorsData] = useState(initialSectors);

  useEffect(() => {
    async function fetchData() {
      let query = supabase.from('leads').select('industry, created_at');

      if (activeFilter === '7 Jours') {
        const d = new Date();
        d.setDate(d.getDate() - 7);
        query = query.gte('created_at', d.toISOString());
      } else if (activeFilter === '30 Jours') {
        const d = new Date();
        d.setDate(d.getDate() - 30);
        query = query.gte('created_at', d.toISOString());
      } else if (activeFilter === 'Personnalisé' && startDate && endDate) {
        query = query.gte('created_at', new Date(startDate).toISOString())
                     .lte('created_at', new Date(endDate + 'T23:59:59').toISOString());
      }

      const { data, error } = await query;
      if (data) {
        setTotalLeads(data.length);
        
        const updatedSectors = initialSectors.map(sector => {
          const count = data.filter(lead => lead.industry && lead.industry.toLowerCase().includes(sector.name.toLowerCase())).length;
          return { ...sector, prospects: count };
        });
        setSectorsData(updatedSectors);
      }
    }
    fetchData();
  }, [activeFilter, startDate, endDate]);

  return (
    <Layout title="Tableau de bord">
      <div className="flex flex-col gap-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-md mb-lg">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-zinc-900 tracking-tight">Vue d'ensemble</h1>
            <p className="text-zinc-500 font-label-md mt-1">
              Performance de vos campagnes pour la période sélectionnée.
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
          {activeFilter === 'Personnalisé' && (
            <div className="flex flex-wrap items-center gap-2 bg-white border border-zinc-100 p-1.5 rounded-lg shadow-sm animate-fade-in w-full md:w-auto">
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="text-xs font-body-md border border-zinc-200 rounded px-2 py-1 outline-none focus:border-[#FFD700] bg-zinc-50" />
              <span className="text-zinc-400 text-xs font-body-md">à</span>
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="text-xs font-body-md border border-zinc-200 rounded px-2 py-1 outline-none focus:border-[#FFD700] bg-zinc-50" />
            </div>
          )}
          <div className="flex items-center gap-sm bg-white border border-zinc-100 p-1.5 rounded-lg shadow-sm overflow-x-auto whitespace-nowrap w-full md:w-auto">
            <button onClick={() => setActiveFilter('7 Jours')} className={`px-4 py-1.5 text-label-sm font-label-sm rounded transition-colors cursor-pointer ${activeFilter === '7 Jours' ? 'bg-[#FFD700] text-black' : 'hover:bg-zinc-50'}`}>7 Jours</button>
            <button onClick={() => setActiveFilter('30 Jours')} className={`px-4 py-1.5 text-label-sm font-label-sm rounded transition-colors cursor-pointer ${activeFilter === '30 Jours' ? 'bg-[#FFD700] text-black' : 'hover:bg-zinc-50'}`}>30 Jours</button>
            <button onClick={() => setActiveFilter('Personnalisé')} className={`px-4 py-1.5 text-label-sm font-label-sm rounded transition-colors cursor-pointer ${activeFilter === 'Personnalisé' ? 'bg-[#FFD700] text-black' : 'hover:bg-zinc-50'}`}>Personnalisé</button>
            <div className="h-4 w-[1px] bg-zinc-200 mx-1"></div>
            <span className="material-symbols-outlined text-zinc-400 px-2 cursor-pointer" title="Choisir une date">calendar_today</span>
          </div>
        </div>

        {/* Summary Cards Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-md">
          <div className="bg-white p-6 rounded-xl border border-zinc-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col gap-xs">
            <div className="flex justify-between items-start">
              <span className="text-zinc-500 font-label-md text-label-md">Total des Prospects</span>
              <div className="p-1.5 bg-yellow-50 rounded">
                <span className="material-symbols-outlined text-[#FFD700] text-lg">group</span>
              </div>
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-display-lg font-display-lg text-primary">{totalLeads}</span>
              <span className="text-zinc-400 text-label-sm font-label-sm flex items-center">
                +12% depuis hier
              </span>
            </div>
            <div className="w-full h-1 bg-zinc-50 rounded-full mt-4">
              <div className="h-full bg-[#FFD700] rounded-full" style={{ width: Math.min(totalLeads, 100) + '%' }}></div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-zinc-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col gap-xs">
            <div className="flex justify-between items-start">
              <span className="text-zinc-500 font-label-md text-label-md">E-mails Envoyés</span>
              <div className="p-1.5 bg-yellow-50 rounded">
                <span className="material-symbols-outlined text-[#FFD700] text-lg">send</span>
              </div>
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-display-lg font-display-lg text-primary">0</span>
              <span className="text-zinc-400 text-label-sm font-label-sm flex items-center">
                À venir
              </span>
            </div>
            <div className="w-full h-1 bg-zinc-50 rounded-full mt-4">
              <div className="h-full w-[0%] bg-primary rounded-full"></div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-zinc-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col gap-xs">
            <div className="flex justify-between items-start">
              <span className="text-zinc-500 font-label-md text-label-md">E-mails en Attente</span>
              <div className="p-1.5 bg-yellow-50 rounded">
                <span className="material-symbols-outlined text-[#FFD700] text-lg">schedule</span>
              </div>
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-display-lg font-display-lg text-primary">0</span>
              <span className="text-zinc-400 text-label-sm font-label-sm flex items-center">
                À venir
              </span>
            </div>
            <div className="w-full h-1 bg-zinc-50 rounded-full mt-4">
              <div className="h-full w-[0%] bg-zinc-300 rounded-full"></div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-zinc-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col gap-xs">
            <div className="flex justify-between items-start">
              <span className="text-zinc-500 font-label-md text-label-md">Taux d'Envoi</span>
              <div className="p-1.5 bg-yellow-50 rounded">
                <span className="material-symbols-outlined text-[#FFD700] text-lg">speed</span>
              </div>
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-display-lg font-display-lg text-primary">0%</span>
              <span className="text-zinc-400 text-label-sm font-label-sm flex items-center">
                À venir
              </span>
            </div>
            <div className="w-full h-1 bg-zinc-50 rounded-full mt-4">
              <div className="h-full w-[0%] bg-[#FFD700] rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Actions Row */}
        <div className="flex flex-wrap gap-4 mt-4">
          <Link to="/recherche" className="flex-1 flex items-center justify-center gap-3 bg-[#FFD700] text-black font-bold py-5 rounded-xl shadow-lg hover:shadow-yellow-500/20 transition-all active:scale-[0.98]">
            <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>rocket_launch</span>
            Lancer la prospection
          </Link>
          <Link to="/leads" className="flex-1 flex items-center justify-center gap-3 bg-primary text-white font-bold py-5 rounded-xl shadow-lg hover:bg-zinc-800 transition-all active:scale-[0.98]">
            <span className="material-symbols-outlined">list_alt</span>
            Voir la liste des prospects
          </Link>
        </div>

        {/* Analytics Table */}
        <div className="grid grid-cols-1 gap-md mt-4">
          <div className="bg-white p-6 rounded-xl border border-zinc-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden">
            <div className="flex items-center justify-between mb-6 px-2">
              <div>
                <h3 className="font-headline-md text-primary mb-1">Analyse par Secteur</h3>
                <p className="text-zinc-500 text-label-md">Performances détaillées par segment de marché</p>
              </div>
              <button className="p-2 text-zinc-400 hover:text-primary transition-colors cursor-pointer">
                <span className="material-symbols-outlined">download</span>
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-100">
                    <th className="px-4 py-3 text-label-sm font-bold text-zinc-400 uppercase tracking-wider">Secteur</th>
                    <th className="px-4 py-3 text-label-sm font-bold text-zinc-400 uppercase tracking-wider text-right">Prospects</th>
                    <th className="px-4 py-3 text-label-sm font-bold text-zinc-400 uppercase tracking-wider text-right">E-mails Envoyés</th>
                    <th className="px-4 py-3 text-label-sm font-bold text-zinc-400 uppercase tracking-wider text-right">E-mails en Attente</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50">
                  {sectorsData.map((sector) => (
                    <tr key={sector.name} className="hover:bg-zinc-50/50 transition-colors group">
                      <td className="px-4 py-4 font-semibold text-primary">{sector.name === 'Tech' ? 'Projets Innovants' : sector.name}</td>
                      <td className="px-4 py-4 text-right">{sector.prospects}</td>
                      <td className="px-4 py-4 text-right">{sector.emailsSent}</td>
                      <td className="px-4 py-4 text-right">{sector.emailsPending}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
