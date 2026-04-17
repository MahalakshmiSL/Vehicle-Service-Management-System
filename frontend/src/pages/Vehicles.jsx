import { useState, useEffect } from 'react';
import { getVehicles, createVehicle, updateVehicle, deleteVehicle } from '../api';
import { PageHeader, Card, Btn, Input, Select, Table, Modal, Loader, FormGrid, StatCard, Badge, toast } from '../components/UI';

const empty = { registration_number: '', make: '', model: '', year: new Date().getFullYear(), owner_name: '', owner_phone: '', status: 'pending' };

export default function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState('all');

  const load = async () => {
    try {
      const r = await getVehicles();
      setVehicles(r.data);
    } catch {
      toast('Failed to load vehicles', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditing(null); setForm(empty); setModal(true); };
  const openEdit = (v) => { setEditing(v); setForm({ ...v }); setModal(true); };

  const handleSubmit = async () => {
    if (!form.registration_number || !form.make || !form.model || !form.owner_name) {
      toast('Fill all required fields', 'error'); return;
    }
    setSaving(true);
    try {
      if (editing) {
        await updateVehicle(editing.id, form);
        toast('Vehicle updated');
      } else {
        await createVehicle(form);
        toast('Vehicle registered');
      }
      setModal(false);
      load();
    } catch (e) {
      toast(e.response?.data?.registration_number?.[0] || 'Save failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this vehicle?')) return;
    try {
      await deleteVehicle(id);
      toast('Deleted');
      load();
    } catch {
      toast('Delete failed', 'error');
    }
  };

  const filtered = filter === 'all' ? vehicles : vehicles.filter(v => v.status === filter);

  const columns = [
    { key: 'registration_number', label: 'Reg #', render: v => (
      <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 13, background: 'var(--gray-light)', padding: '3px 8px', borderRadius: 4 }}>{v.registration_number}</span>
    )},
    { key: 'vehicle', label: 'Vehicle', render: v => (
      <div>
        <strong>{v.make} {v.model}</strong>
        <div style={{ fontSize: 12, color: 'var(--gray)' }}>{v.year}</div>
      </div>
    )},
    { key: 'owner_name', label: 'Owner', render: v => (
      <div>
        <div style={{ fontWeight: 500 }}>{v.owner_name}</div>
        <div style={{ fontSize: 12, color: 'var(--gray)' }}>{v.owner_phone}</div>
      </div>
    )},
    { key: 'status', label: 'Status', render: v => <Badge status={v.status} /> },
    { key: 'created_at', label: 'Registered', render: v => <span style={{ color: 'var(--gray)', fontSize: 13 }}>{new Date(v.created_at).toLocaleDateString('en-IN')}</span> },
    { key: 'actions', label: '', render: v => (
      <div style={{ display: 'flex', gap: 8 }}>
        <Btn size="sm" variant="outline" onClick={() => openEdit(v)}>Edit</Btn>
        <Btn size="sm" variant="danger" onClick={() => handleDelete(v.id)}>Delete</Btn>
      </div>
    )},
  ];

  const counts = { all: vehicles.length, pending: vehicles.filter(v => v.status === 'pending').length, in_progress: vehicles.filter(v => v.status === 'in_progress').length, completed: vehicles.filter(v => v.status === 'completed').length };

  return (
    <div className="fade-up">
      <PageHeader
        title="Vehicles"
        subtitle="Track all vehicles in the garage"
        action={<Btn onClick={openAdd}>+ Register Vehicle</Btn>}
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 16, marginBottom: 28 }}>
        <StatCard label="Total" value={counts.all} accent />
        <StatCard label="Pending" value={counts.pending} />
        <StatCard label="In Progress" value={counts.in_progress} />
        <StatCard label="Completed" value={counts.completed} />
      </div>

      <Card>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {['all', 'pending', 'in_progress', 'completed'].map(s => (
            <button key={s} onClick={() => setFilter(s)} style={{
              padding: '6px 16px', borderRadius: 99, border: 'none', cursor: 'pointer',
              background: filter === s ? 'var(--red)' : 'var(--gray-light)',
              color: filter === s ? 'white' : 'var(--dark)',
              fontWeight: 600, fontSize: 13, textTransform: 'capitalize',
              transition: 'all 0.2s',
            }}>
              {s === 'all' ? 'All' : s.replace('_', ' ')} {filter !== s && `(${counts[s]})`}
            </button>
          ))}
        </div>
        {loading ? <Loader /> : <Table columns={columns} data={filtered} emptyMsg="No vehicles registered yet." />}
      </Card>

      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Edit Vehicle' : 'Register New Vehicle'} width={560}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <FormGrid>
            <Input label="Registration Number *" value={form.registration_number} onChange={e => setForm({ ...form, registration_number: e.target.value.toUpperCase() })} placeholder="e.g. KA01AB1234" />
            <Input label="Year *" type="number" value={form.year} onChange={e => setForm({ ...form, year: e.target.value })} />
          </FormGrid>
          <FormGrid>
            <Input label="Make *" value={form.make} onChange={e => setForm({ ...form, make: e.target.value })} placeholder="e.g. Toyota" />
            <Input label="Model *" value={form.model} onChange={e => setForm({ ...form, model: e.target.value })} placeholder="e.g. Innova" />
          </FormGrid>
          <FormGrid>
            <Input label="Owner Name *" value={form.owner_name} onChange={e => setForm({ ...form, owner_name: e.target.value })} placeholder="Full name" />
            <Input label="Owner Phone *" value={form.owner_phone} onChange={e => setForm({ ...form, owner_phone: e.target.value })} placeholder="+91 XXXXX XXXXX" />
          </FormGrid>
          <Select label="Status" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </Select>
          <div style={{ display: 'flex', gap: 12, marginTop: 8, justifyContent: 'flex-end' }}>
            <Btn variant="outline" onClick={() => setModal(false)}>Cancel</Btn>
            <Btn onClick={handleSubmit} disabled={saving}>{saving ? 'Saving...' : editing ? 'Update' : 'Register'}</Btn>
          </div>
        </div>
      </Modal>
    </div>
  );
}