import React, { useState, useEffect, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { getTickets, getUserProfile, updateUserProfile } from '../../service/firestoreService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../ToastProvider';
import html2canvas from 'html2canvas';
import Layout from '../Layout/Layout';
import { supermarkets, getSuperColor } from '../../service/supermarketService';
import './Stats.css';

const Stats = () => {
  const [gastos, setGastos] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, isPremium } = useAuth();
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;
      try {
        const ticketsData = await getTickets(user.uid);
        setGastos(ticketsData);
      } catch (error) {
        console.error("Error al cargar datos:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [user]);

  const statsPorSuper = useMemo(() => {
    const map = {};
    gastos.forEach(g => {
      const nombre = g.opcion || 'Otro';
      map[nombre] = (map[nombre] || 0) + g.cantidad;
    });
    return Object.keys(map).map(name => ({ name, value: parseFloat(map[name].toFixed(2)) }))
      .sort((a, b) => b.value - a.value);
  }, [gastos]);

  const frecuenciaSuper = useMemo(() => {
    const map = {};
    gastos.forEach(g => {
      const nombre = g.opcion || 'Otro';
      map[nombre] = (map[nombre] || 0) + 1;
    });
    return Object.keys(map).map(name => ({ name, count: map[name] }))
      .sort((a, b) => b.count - a.count);
  }, [gastos]);

  const exportToCSV = () => {
    if (!isPremium) {
      showError("Función exclusiva para usuarios Premium 👑");
      return;
    }
    try {
      const headers = ['Fecha', 'Establecimiento', 'Cantidad (€)'];
// ... resto de la función
      const rows = gastos.map(g => [g.fecha, g.opcion, g.cantidad.toFixed(2)]);

      const csvContent = [
        headers.join(','),
        ...rows.map(e => e.join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `reporte_gastos_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showSuccess("Excel (CSV) exportado con éxito");
    } catch (e) {
      showError("Error al exportar CSV");
    }
  };

  const exportToPDF = async () => {
    const element = document.getElementById('stats-content');
    if (!element) return;

    showSuccess("Generando captura de reporte...");
    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#f8f9fa'
      });

      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.setAttribute("href", image);
      link.setAttribute("download", `dashboard_gastos_${new Date().toISOString().split('T')[0]}.png`);
      link.click();
      showSuccess("Reporte visual exportado");
    } catch (e) {
      showError("Error al generar PDF/Imagen");
    }
  };

  const gastosPorMesData = useMemo(() => {
    const map = {};
    const nombresMeses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

    // Inicializar últimos 6 meses
    const hoy = new Date();
    for(let i = 5; i >= 0; i--) {
      const d = new Date(hoy.getFullYear(), hoy.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      map[key] = { label: nombresMeses[d.getMonth()], total: 0 };
    }

    gastos.forEach(g => {
      if (!g.fecha) return;
      const fecha = new Date(g.fecha);
      const key = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`;
      if (map[key]) {
        map[key].total += g.cantidad;
      }
    });

    return Object.keys(map).sort().map(key => ({
      name: map[key].label,
      total: parseFloat(map[key].total.toFixed(2))
    }));
  }, [gastos]);

  if (loading) return <Layout><div className="stats-app"><p>Analizando tus hábitos...</p></div></Layout>;

  return (
    <Layout>
      <div className="stats-app">
        <header className="page-header">
          <h2 className="title-app">Mis Estadísticas</h2>
          <p className="subtitle-app">Control de gastos mensual</p>
        </header>

        <div id="stats-content" className="stats-grid">
          {/* Gráfico de Evolución Mensual */}
          <div className="card-native chart-card wide-card">
            <h4>Evolución de Gastos (Últimos 6 meses)</h4>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={gastosPorMesData}>
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(val) => `${val}€`} />
                  <Tooltip formatter={(val) => [`${val}€`, 'Gasto total']} />
                  <Bar dataKey="total" fill="#4F46E5" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          {/* Gráfico de Distribución de Gasto */}
          <div className="card-native chart-card">
            <h4>Distribución por Supermercado (€)</h4>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={statsPorSuper}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statsPorSuper.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getSuperColor(entry.name)} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}€`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="chart-legend">
                {statsPorSuper.slice(0, 6).map((item, i) => (
                    <div key={i} className="legend-item">
                        <span className="dot" style={{backgroundColor: getSuperColor(item.name)}}></span>
                        <span className="name">{item.name}</span>
                        <span className="val">{item.value}€</span>
                    </div>
                ))}
            </div>
          </div>

          {/* Gráfico de Frecuencia de Visitas */}
          <div className="card-native chart-card">
            <h4>Frecuencia de Compras (Visitas)</h4>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={frecuenciaSuper.slice(0, 8)}>
                  <XAxis dataKey="name" fontSize={10} />
                  <YAxis />
                  <Tooltip cursor={{fill: 'transparent'}} />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {frecuenciaSuper.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getSuperColor(entry.name)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Insights */}
          <div className="card-native insights-card">
            <h4>Resumen de Inteligencia</h4>
            <div className="insight-row">
                <span className="icon">🏆</span>
                <div className="text">
                    <p className="label">Tu favorito</p>
                    <p className="value">{statsPorSuper[0]?.name || 'N/A'}</p>
                </div>
            </div>
            <div className="insight-row">
                <span className="icon">📊</span>
                <div className="text">
                    <p className="label">Gasto medio por ticket</p>
                    <p className="value">
                        {gastos.length > 0
                          ? (gastos.reduce((acc, g) => acc + g.cantidad, 0) / gastos.length).toFixed(2)
                          : '0'}€
                    </p>
                </div>
            </div>
          </div>

          {/* Metas de Ahorro - EXCLUSIVO PRO */}
          <div className={`card-native goals-card ${!isPremium ? 'locked-section' : ''}`}>
            <div className="section-header-pro">
              <h4>Metas de Ahorro</h4>
              {!isPremium && <span className="pro-badge-mini">PRO</span>}
            </div>

            {!isPremium ? (
              <div className="locked-overlay-content">
                <p>Define presupuestos por tienda y controla tus ahorros con el Plan Pro.</p>
                <button className="btn-native btn-primary-mini" onClick={() => showError("Función exclusiva de Ticketera Pro 👑")}>
                  Saber más
                </button>
              </div>
            ) : (
              statsPorSuper.slice(0, 3).map((item, index) => {
                const meta = 100; // Meta estática de ejemplo o basada en profile
                const porcentaje = Math.min((item.value / meta) * 100, 100);
                return (
                  <div key={index} className="goal-item">
                    <div className="goal-info">
                      <span>{item.name}</span>
                      <span>{item.value}€ / {meta}€</span>
                    </div>
                    <div className="progress-bar-bg">
                      <div
                        className={`progress-bar-fill ${porcentaje > 90 ? 'danger' : porcentaje > 70 ? 'warning' : ''}`}
                        style={{ width: `${porcentaje}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Stats;
