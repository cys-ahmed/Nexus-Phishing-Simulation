import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { UserPlus, Users } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || '';

export default function Targets() {
    const [targets, setTargets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/targets`);
            setTargets(res.data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        const data = Object.fromEntries(fd.entries());
        try {
            await axios.post(`${API_URL}/api/targets`, data);
            e.currentTarget.reset();
            fetchData();
        } catch (error: any) {
            console.error(error);
            alert(`Failed to add target: ${error.response?.data?.error || error.message}`);
        }
    };

    const handleDeleteTarget = async (id: number) => {
        if (!confirm('Are you sure you want to delete this target?')) return;
        try {
            await axios.delete(`${API_URL}/api/targets/${id}`);
            // Optimistically remove from UI
            setTargets(targets.filter(t => t.id !== id));
        } catch (error: any) {
            console.error(error);
            alert(`Failed to delete target: ${error.response?.data?.error || error.message}`);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="animate-fade-in delay-1">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <Users size={32} color="var(--primary)" />
                <h1 style={{ margin: 0 }}>Targets Management</h1>
            </div>
            <p className="subtitle">
                Manage the victims/targets for your phishing campaigns.
            </p>

            <div className="grid-cols-2">
                <div className="card animate-fade-in delay-2" style={{ height: 'fit-content' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                        <UserPlus size={20} color="var(--text-main)" />
                        <h2 style={{ margin: 0 }}>Add New Target</h2>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <input name="first_name" placeholder="First Name" />
                        <input name="last_name" placeholder="Last Name" />
                        <input name="email" type="email" placeholder="Email Address *" required />
                        <button type="submit" style={{ width: '100%' }}>Add Target</button>
                    </form>
                </div>

                <div className="card animate-fade-in delay-3" style={{ overflowX: 'auto' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                        <Users size={20} color="var(--text-main)" />
                        <h2 style={{ margin: 0 }}>Target List ({targets.length})</h2>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>Email</th>
                                <th>Name</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {targets.map(t => (
                                <tr key={t.id}>
                                    <td><strong style={{ color: 'var(--text-main)' }}>{t.email}</strong></td>
                                    <td><span style={{ color: 'var(--text-muted)' }}>{t.first_name} {t.last_name}</span></td>
                                    <td>
                                        <button
                                            onClick={() => handleDeleteTarget(t.id)}
                                            style={{ padding: '6px 12px', background: 'var(--danger)', fontSize: '12px' }}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {targets.length === 0 && (
                                <tr>
                                    <td colSpan={3} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                                        No targets added yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
