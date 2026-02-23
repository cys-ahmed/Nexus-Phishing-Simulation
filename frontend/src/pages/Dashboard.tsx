import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Send, MailOpen, MousePointerClick, KeyRound, Activity } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || '';

export default function Dashboard() {
    const [stats, setStats] = useState<any>({ sent: 0, opened: 0, clicked: 0, submitted: 0 });
    const [campaigns, setCampaigns] = useState<any[]>([]);
    const [details, setDetails] = useState<any[]>([]);
    const [modalType, setModalType] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const resStats = await axios.get(`${API_URL}/api/stats`);
                const resCamps = await axios.get(`${API_URL}/api/campaigns`);
                const resDetails = await axios.get(`${API_URL}/api/reports/details`);
                setStats(resStats.data);
                setCampaigns(resCamps.data.slice(0, 5));
                setDetails(resDetails.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
        const interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleDeleteCampaign = async (id: number) => {
        if (!confirm('Are you sure you want to delete this campaign?')) return;
        try {
            await axios.delete(`${API_URL}/api/campaigns/${id}`);
            // Optimistically remove from UI
            setCampaigns(campaigns.filter(c => c.id !== id));
        } catch (error: any) {
            console.error('Error deleting campaign:', error);
            alert(`Failed to delete campaign: ${error.response?.data?.error || error.message}`);
        }
    };

    if (loading) return <div className="loading">Loading dashboard...</div>;

    return (
        <div className="animate-fade-in delay-1">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <Activity size={32} color="var(--primary)" />
                <h1 style={{ margin: 0 }}>Dashboard Overview</h1>
            </div>
            <p className="subtitle">Real-time metrics from your active phishing simulations.</p>

            <div className="grid-cols-4" style={{ marginBottom: '40px' }}>
                <div className="card stat-box cursor-pointer" style={{ borderTop: '4px solid #60a5fa', cursor: 'pointer' }} onClick={() => setModalType('sent')}>
                    <Send className="stat-icon" size={40} color="#60a5fa" style={{ background: 'rgba(96, 165, 250, 0.1)' }} />
                    <div className="stat-value" style={{ color: '#60a5fa' }}>{stats.sent || 0}</div>
                    <div className="stat-label">Emails Sent</div>
                </div>
                <div className="card stat-box cursor-pointer" style={{ borderTop: '4px solid #f59e0b', cursor: 'pointer' }} onClick={() => setModalType('opened')}>
                    <MailOpen className="stat-icon" size={40} color="#f59e0b" style={{ background: 'rgba(245, 158, 11, 0.1)' }} />
                    <div className="stat-value" style={{ color: '#f59e0b' }}>{stats.opened || 0}</div>
                    <div className="stat-label">Emails Opened</div>
                </div>
                <div className="card stat-box cursor-pointer" style={{ borderTop: '4px solid #10b981', cursor: 'pointer' }} onClick={() => setModalType('clicked')}>
                    <MousePointerClick className="stat-icon" size={40} color="#10b981" style={{ background: 'rgba(16, 185, 129, 0.1)' }} />
                    <div className="stat-value" style={{ color: '#10b981' }}>{stats.clicked || 0}</div>
                    <div className="stat-label">Links Clicked</div>
                </div>
                <div className="card stat-box cursor-pointer" style={{ borderTop: '4px solid #ef4444', cursor: 'pointer' }} onClick={() => setModalType('submitted')}>
                    <KeyRound className="stat-icon" size={40} color="#ef4444" style={{ background: 'rgba(239, 68, 68, 0.1)' }} />
                    <div className="stat-value" style={{ color: '#ef4444' }}>{stats.submitted || 0}</div>
                    <div className="stat-label">Credentials Captured</div>
                </div>
            </div>

            <div className="card animate-fade-in delay-2">
                <h2>Recent Campaigns</h2>
                {campaigns.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)' }}>No campaigns launched yet. Head over to <strong>Campaigns</strong> to start your first simulation.</p>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Subject</th>
                                <th>Status</th>
                                <th>Created</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {campaigns.map(c => (
                                <tr key={c.id}>
                                    <td><strong style={{ color: 'var(--text-main)' }}>{c.name}</strong></td>
                                    <td><span style={{ color: 'var(--text-muted)' }}>{c.subject}</span></td>
                                    <td>
                                        <span className={`badge ${c.status.toLowerCase()}`}>
                                            {c.status}
                                        </span>
                                    </td>
                                    <td><span style={{ color: 'var(--text-muted)' }}>{new Date(c.created_at + 'Z').toLocaleString()}</span></td>
                                    <td>
                                        <button
                                            onClick={() => handleDeleteCampaign(c.id)}
                                            style={{ padding: '6px 12px', background: 'var(--danger)', fontSize: '12px' }}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {modalType && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div className="card" style={{ width: '80%', maxHeight: '80vh', overflowY: 'auto', position: 'relative' }}>
                        <button
                            onClick={() => setModalType(null)}
                            style={{ position: 'absolute', top: '10px', right: '10px', background: 'transparent', color: 'var(--text-main)', border: 'none', fontSize: '20px', cursor: 'pointer' }}>
                            ✖
                        </button>
                        <h2>{modalType.toUpperCase()} Details</h2>
                        <table style={{ marginTop: '20px' }}>
                            <thead>
                                <tr>
                                    <th>Target Email</th>
                                    <th>Name</th>
                                    <th>Campaign</th>
                                    <th>{modalType === 'submitted' ? 'Data' : 'Timestamp'}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {details
                                    .filter(d =>
                                        (modalType === 'sent' && d.status !== 'pending') ||
                                        (modalType === 'opened' && d.opened_at) ||
                                        (modalType === 'clicked' && d.clicked_at) ||
                                        (modalType === 'submitted' && d.submitted_at)
                                    )
                                    .map(d => (
                                        <tr key={d.id}>
                                            <td>{d.email}</td>
                                            <td>{d.first_name} {d.last_name}</td>
                                            <td>{d.campaign_name}</td>
                                            <td>
                                                {modalType === 'sent' && 'Sent'}
                                                {modalType === 'opened' && new Date(d.opened_at + 'Z').toLocaleString()}
                                                {modalType === 'clicked' && new Date(d.clicked_at + 'Z').toLocaleString()}
                                                {modalType === 'submitted' && d.submitted_data}
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div >
    );
}
