import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [adminUsers, setAdminUsers] = useState([]);
    const [adminFarms, setAdminFarms] = useState([]);
    const [activeTab, setActiveTab] = useState('farms'); // 'users' or 'farms'

    useEffect(() => {
        if (user?.role === 'admin') {
            fetchAdminData();
        }
    }, [user]);

    const fetchAdminData = async () => {
        try {
            const uRes = await fetch('/api/admin/users');
            if (uRes.ok) setAdminUsers(await uRes.json());

            const fRes = await fetch('/api/admin/farms');
            if (fRes.ok) setAdminFarms(await fRes.json());
        } catch (err) {
            console.error("Failed to load admin data", err);
        }
    }

    const updateUserStatus = async (id, status) => {
        await fetch(`/api/admin/users/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status })
        });
        fetchAdminData();
    }

    const updateFarmStatus = async (id, status) => {
        await fetch(`/api/admin/farms/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status })
        });
        fetchAdminData();
    }

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    return (
        <div className="container" style={{ paddingTop: '2rem' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2>{user?.role === 'admin' ? 'Admin Dashboard' : 'My Dashboard'}</h2>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <span>Welcome, <strong>{user?.name}</strong> ({user?.role})</span>
                    <button onClick={handleLogout} style={{ padding: '0.5rem 1rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', cursor: 'pointer', background: 'white' }}>Logout</button>
                </div>
            </header>

            {user?.role === 'admin' ? (
                <div style={{ background: 'var(--color-surface)', padding: '2rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' }}>
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem' }}>
                        <button onClick={() => setActiveTab('users')} style={{ fontWeight: activeTab === 'users' ? 'bold' : 'normal', background: 'none', border: 'none', cursor: 'pointer', color: activeTab === 'users' ? 'var(--color-primary)' : 'var(--color-text)' }}>Users</button>
                        <button onClick={() => setActiveTab('farms')} style={{ fontWeight: activeTab === 'farms' ? 'bold' : 'normal', background: 'none', border: 'none', cursor: 'pointer', color: activeTab === 'farms' ? 'var(--color-primary)' : 'var(--color-text)' }}>Farms</button>
                    </div>

                    {activeTab === 'users' && (
                        <div>
                            <h3>User Management</h3>
                            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
                                <thead>
                                    <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--color-border)' }}>
                                        <th style={{ padding: '0.5rem' }}>Name</th>
                                        <th style={{ padding: '0.5rem' }}>Email</th>
                                        <th style={{ padding: '0.5rem' }}>Status</th>
                                        <th style={{ padding: '0.5rem' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {adminUsers.map(u => (
                                        <tr key={u.id} style={{ borderBottom: '1px solid #eee' }}>
                                            <td style={{ padding: '0.5rem' }}>{u.name}</td>
                                            <td style={{ padding: '0.5rem' }}>{u.email}</td>
                                            <td style={{ padding: '0.5rem' }}>
                                                <span style={{
                                                    padding: '2px 6px', borderRadius: '4px', fontSize: '0.8rem',
                                                    background: u.status === 'approved' ? '#dcfce7' : u.status === 'pending_approval' ? '#fef9c3' : '#fee2e2',
                                                    color: u.status === 'approved' ? '#166534' : u.status === 'pending_approval' ? '#854d0e' : '#991b1b'
                                                }}>
                                                    {u.status}
                                                </span>
                                            </td>
                                            <td style={{ padding: '0.5rem', display: 'flex', gap: '0.5rem' }}>
                                                {u.status !== 'approved' && <button onClick={() => updateUserStatus(u.id, 'approved')} style={{ fontSize: '0.8rem', cursor: 'pointer', padding: '2px 5px' }}>✅ Approve</button>}
                                                {u.status !== 'rejected' && <button onClick={() => updateUserStatus(u.id, 'rejected')} style={{ fontSize: '0.8rem', cursor: 'pointer', padding: '2px 5px' }}>❌ Reject</button>}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {activeTab === 'farms' && (
                        <div>
                            <h3>Farm Management</h3>
                            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
                                <thead>
                                    <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--color-border)' }}>
                                        <th style={{ padding: '0.5rem' }}>Farm Name</th>
                                        <th style={{ padding: '0.5rem' }}>Owner</th>
                                        <th style={{ padding: '0.5rem' }}>Status</th>
                                        <th style={{ padding: '0.5rem' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {adminFarms.map(f => (
                                        <tr key={f.id} style={{ borderBottom: '1px solid #eee' }}>
                                            <td style={{ padding: '0.5rem' }}>{f.name}</td>
                                            <td style={{ padding: '0.5rem' }}>{f.owner_name}</td>
                                            <td style={{ padding: '0.5rem' }}>
                                                <span style={{
                                                    padding: '2px 6px', borderRadius: '4px', fontSize: '0.8rem',
                                                    background: f.status === 'approved' ? '#dcfce7' : f.status === 'pending_approval' ? '#fef9c3' : '#fee2e2',
                                                    color: f.status === 'approved' ? '#166534' : f.status === 'pending_approval' ? '#854d0e' : '#991b1b'
                                                }}>
                                                    {f.status}
                                                </span>
                                            </td>
                                            <td style={{ padding: '0.5rem', display: 'flex', gap: '0.5rem' }}>
                                                {f.status !== 'approved' && <button onClick={() => updateFarmStatus(f.id, 'approved')} style={{ fontSize: '0.8rem', cursor: 'pointer', padding: '2px 5px' }}>✅ Approve</button>}
                                                {f.status !== 'suspended' && <button onClick={() => updateFarmStatus(f.id, 'suspended')} style={{ fontSize: '0.8rem', cursor: 'pointer', padding: '2px 5px' }}>⛔ Suspend</button>}
                                                <button onClick={() => updateFarmStatus(f.id, 'deleted')} style={{ fontSize: '0.8rem', cursor: 'pointer', padding: '2px 5px' }}>🗑️ Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            ) : (
                <div style={{ background: 'var(--color-surface)', padding: '2rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' }}>
                    <h3>My Farms</h3>
                    {user?.status === 'pending_approval' ? (
                        <div style={{ marginTop: '1rem', padding: '1rem', background: '#fff3cd', color: '#856404', borderRadius: 'var(--radius-md)' }}>
                            ⚠️ Your account is pending admin approval. You cannot add farms yet.
                        </div>
                    ) : (
                        <div style={{ marginTop: '1rem' }}>
                            <p>You have no farms listed yet.</p>
                            {/* Add Farm Button will go here */}
                            <button className="cta-button" style={{ marginTop: '1rem' }}>+ Add New Farm</button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Dashboard;
