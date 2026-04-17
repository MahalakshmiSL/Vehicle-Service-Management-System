import { useState, useEffect, useRef  } from 'react';
// Change this:
import { getVehicles, getComponents, getIssues, createIssue, deleteIssue, createComponentUsage, deleteComponentUsage } from '../api';
import { PageHeader, Card, Btn, Input, Select, Table, Modal, Loader, StatCard, Badge, toast } from '../components/UI';

export default function Issues() {
  const [issues, setIssues] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [detailModal, setDetailModal] = useState(null);
  const [saving, setSaving] = useState(false);
  const [filterVehicle, setFilterVehicle] = useState('');

  const [form, setForm] = useState({
    vehicle: '', description: '', service_type: 'new_part', labor_charge: 0,
  });
const nextId = useRef(2);
const [usages, setUsages] = useState([{ id: 1, component: '', use_new_part: true, quantity: 1 }]);

  const load = async () => {
    try {
      const [iv, ic, ii] = await Promise.all([getVehicles(), getComponents(), getIssues()]);
      setVehicles(iv.data);
      setComponents(ic.data);
      setIssues(ii.data);
    } catch {
      toast('Failed to load data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

 const addUsageRow = () => {
  setUsages(prev => [...prev, { id: nextId.current++, component: '', use_new_part: true, quantity: 1 }]);
};

const removeUsageRow = (id) => setUsages(prev => prev.filter(u => u.id !== id));

const updateUsage = (id, field, value) => {
  console.log('updateUsage:', id, field, value); // ← add this
  setUsages(prev => prev.map(u => u.id === id ? { ...u, [field]: value } : u));
};

const handleSubmit = async () => {
  console.log('Submitting usages:', usages); 
  if (!form.vehicle || !form.description) {
    toast('Fill vehicle and description', 'error'); return;
  }
  setSaving(true);
  try {
    const r = await createIssue({
      ...form,
      vehicle: Number(form.vehicle),
      labor_charge: Number(form.labor_charge) || 0
    });
    const issueId = r.data.id;

    // Save component usages one by one
    for (const u of usages) {
      if (!u.component) continue; // skip empty rows
      try {
        await createComponentUsage({
          issue: issueId,
          component: Number(u.component),
          use_new_part: Boolean(u.use_new_part),
          quantity: Number(u.quantity) || 1,
        });
     } catch (err) {
  console.error('ComponentUsage save failed:', err?.response?.data, err?.response?.status, err?.message);
  toast(`Part save failed`, 'error');
}
    }

    toast('Issue logged');
    setModal(false);
    setForm({ vehicle: '', description: '', service_type: 'new_part', labor_charge: 0 });
    setUsages([{ component: '', use_new_part: true, quantity: 1 }]);
    load();
  } catch (e) {
    console.error('Issue save failed:', e.response?.data);
    toast('Failed to create issue', 'error');
  } finally {
    setSaving(false);
  }
};

  const handleDelete = async (id) => {
    if (!confirm('Delete this issue?')) return;
    try {
      await deleteIssue(id);
      toast('Deleted');
      load();
    } catch {
      toast('Delete failed', 'error');
    }
  };

  const getVehicleName = (id) => {
    const v = vehicles.find(v => v.id === id);
    return v ? `${v.registration_number} — ${v.make} ${v.model}` : '—';
  };

  const filtered = filterVehicle ? issues.filter(i => String(i.vehicle) === filterVehicle) : issues;

  const columns = [
    { key: 'id', label: '#', render: i => <span style={{ color: 'var(--gray)', fontSize: 13 }}>#{i.id}</span> },
    { key: 'vehicle', label: 'Vehicle', render: i => <strong style={{ fontSize: 13 }}>{getVehicleName(i.vehicle)}</strong> },
    { key: 'description', label: 'Description', render: i => (
      <span style={{ maxWidth: 220, display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{i.description}</span>
    )},
    { key: 'service_type', label: 'Service', render: i => (
      <span style={{ padding: '3px 10px', borderRadius: 99, fontSize: 12, fontWeight: 600, background: i.service_type === 'new_part' ? '#dbeafe' : '#fef3c7', color: i.service_type === 'new_part' ? '#1e40af' : '#92400e' }}>
        {i.service_type === 'new_part' ? 'New Part' : 'Repair'}
      </span>
    )},
    { key: 'labor_charge', label: 'Labour', render: i => <span>₹{Number(i.labor_charge).toLocaleString()}</span> },
    { key: 'status', label: 'Status', render: i => <Badge status={i.status} /> },
    { key: 'created_at', label: 'Date', render: i => <span style={{ color: 'var(--gray)', fontSize: 13 }}>{new Date(i.created_at).toLocaleDateString('en-IN')}</span> },
    { key: 'actions', label: '', render: i => (
      <div style={{ display: 'flex', gap: 8 }}>
        <Btn size="sm" variant="outline" onClick={() => setDetailModal(i)}>View</Btn>
        <Btn size="sm" variant="danger" onClick={() => handleDelete(i.id)}>Del</Btn>
      </div>
    )},
  ];

  return (
    <div className="fade-up">
      <PageHeader
        title="Issues"
        subtitle="Log vehicle issues and component usage"
        action={<Btn onClick={() => setModal(true)}>+ Log Issue</Btn>}
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 16, marginBottom: 28 }}>
        <StatCard label="Total Issues" value={issues.length} accent />
        <StatCard label="Open" value={issues.filter(i => i.status === 'open').length} />
        <StatCard label="Resolved" value={issues.filter(i => i.status === 'resolved').length} />
        <StatCard label="New Part Jobs" value={issues.filter(i => i.service_type === 'new_part').length} />
      </div>

      <Card>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <select
            value={filterVehicle}
            onChange={e => setFilterVehicle(e.target.value)}
            style={{ border: '1.5px solid var(--border)', borderRadius: 'var(--radius)', padding: '8px 14px', fontSize: 14, minWidth: 220 }}
          >
            <option value="">All Vehicles</option>
            {vehicles.map(v => <option key={v.id} value={v.id}>{v.registration_number} — {v.make} {v.model}</option>)}
          </select>
          <span style={{ fontSize: 13, color: 'var(--gray)' }}>{filtered.length} issues</span>
        </div>
        {loading ? <Loader /> : <Table columns={columns} data={filtered} emptyMsg="No issues logged yet." />}
      </Card>

      {/* Add Issue Modal */}
      <Modal open={modal} onClose={() => setModal(false)} title="Log New Issue" width={600}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Select label="Vehicle *" value={form.vehicle} onChange={e => setForm({ ...form, vehicle: e.target.value })}>
            <option value="">Select a vehicle...</option>
            {vehicles.map(v => <option key={v.id} value={v.id}>{v.registration_number} — {v.make} {v.model}</option>)}
          </Select>

          <div>
            <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>Description *</label>
            <textarea
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              placeholder="Describe the issue in detail..."
              rows={3}
              style={{ width: '100%', border: '1.5px solid var(--border)', borderRadius: 'var(--radius)', padding: '10px 14px', fontSize: 14, resize: 'vertical', fontFamily: 'var(--font-body)' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Select label="Service Type" value={form.service_type} onChange={e => setForm({ ...form, service_type: e.target.value })}>
              <option value="new_part">New Part</option>
              <option value="repair">Repair Service</option>
            </Select>
            <Input label="Labour Charge (₹)" type="number" value={form.labor_charge} onChange={e => setForm({ ...form, labor_charge: e.target.value })} placeholder="0" />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <label style={{ fontSize: 13, fontWeight: 600 }}>Components Used</label>
              <Btn size="sm" variant="outline" onClick={addUsageRow}>+ Add Part</Btn>
            </div>
          



{usages.map((u) => (
  <div key={u.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 80px auto', gap: 10, marginBottom: 10, alignItems: 'center' }}>
    <select
      value={u.component}
      onChange={e => updateUsage(u.id, 'component', e.target.value)}
      style={{ border: '1.5px solid var(--border)', borderRadius: 'var(--radius)', padding: '9px 12px', fontSize: 13 }}
    >
      <option value="">Select component...</option>
      {components.map(c => <option key={c.id} value={c.id}>{c.name} ({c.part_number})</option>)}
    </select>
    <select
      value={u.use_new_part}
      onChange={e => updateUsage(u.id, 'use_new_part', e.target.value === 'true')}
      style={{ border: '1.5px solid var(--border)', borderRadius: 'var(--radius)', padding: '9px 12px', fontSize: 13 }}
    >
      <option value="true">New</option>
      <option value="false">Repair</option>
    </select>
    <input
      type="number" min="1" value={u.quantity}
      onChange={e => updateUsage(u.id, 'quantity', e.target.value)}
      style={{ border: '1.5px solid var(--border)', borderRadius: 'var(--radius)', padding: '9px 12px', fontSize: 13, textAlign: 'center' }}
    />
    <button
      onClick={() => removeUsageRow(u.id)}
      style={{ background: '#fee2e2', border: 'none', borderRadius: 'var(--radius)', padding: '9px 12px', cursor: 'pointer', color: '#991b1b', fontWeight: 700 }}
    >×</button>
  </div>
))}
          </div>

          <div style={{ display: 'flex', gap: 12, marginTop: 8, justifyContent: 'flex-end' }}>
            <Btn variant="outline" onClick={() => setModal(false)}>Cancel</Btn>
            <Btn onClick={handleSubmit} disabled={saving}>{saving ? 'Saving...' : 'Log Issue'}</Btn>
          </div>
        </div>
      </Modal>

      {/* Detail Modal */}
      {detailModal && (
        <Modal open={!!detailModal} onClose={() => setDetailModal(null)} title={`Issue #${detailModal.id} Details`}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ background: 'var(--gray-light)', borderRadius: 'var(--radius)', padding: 16 }}>
              <p style={{ fontSize: 13, color: 'var(--gray)', marginBottom: 4 }}>Vehicle</p>
              <p style={{ fontWeight: 600 }}>{getVehicleName(detailModal.vehicle)}</p>
            </div>
            <div>
              <p style={{ fontSize: 13, color: 'var(--gray)', marginBottom: 4 }}>Description</p>
              <p>{detailModal.description}</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
              <div style={{ background: 'var(--gray-light)', borderRadius: 'var(--radius)', padding: 12 }}>
                <p style={{ fontSize: 11, color: 'var(--gray)', textTransform: 'uppercase', letterSpacing: 1 }}>Type</p>
                <p style={{ fontWeight: 600 }}>{detailModal.service_type === 'new_part' ? 'New Part' : 'Repair'}</p>
              </div>
              <div style={{ background: 'var(--gray-light)', borderRadius: 'var(--radius)', padding: 12 }}>
                <p style={{ fontSize: 11, color: 'var(--gray)', textTransform: 'uppercase', letterSpacing: 1 }}>Labour</p>
                <p style={{ fontWeight: 600 }}>₹{Number(detailModal.labor_charge).toLocaleString()}</p>
              </div>
              <div style={{ background: 'var(--gray-light)', borderRadius: 'var(--radius)', padding: 12 }}>
                <p style={{ fontSize: 11, color: 'var(--gray)', textTransform: 'uppercase', letterSpacing: 1 }}>Status</p>
                <Badge status={detailModal.status} />
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}