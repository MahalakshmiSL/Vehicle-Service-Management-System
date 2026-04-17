import { useState, useEffect } from 'react';
import { getComponents, createComponent, updateComponent, deleteComponent } from '../api';
import { PageHeader, Card, Btn, Input, Table, Modal, Loader, FormGrid, StatCard, toast } from '../components/UI';

const empty = { name: '', part_number: '', description: '', purchase_price: '', repair_price: '', stock_quantity: 0 };

export default function Components() {
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');

  const load = async () => {
    try {
      const r = await getComponents();
      setComponents(r.data);
    } catch {
      toast('Failed to load components', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditing(null); setForm(empty); setModal(true); };
  const openEdit = (c) => { setEditing(c); setForm({ ...c }); setModal(true); };

  const handleSubmit = async () => {
    if (!form.name || !form.part_number || !form.purchase_price) {
      toast('Please fill required fields', 'error'); return;
    }
    setSaving(true);
    try {
      if (editing) {
        await updateComponent(editing.id, form);
        toast('Component updated');
      } else {
        await createComponent(form);
        toast('Component added');
      }
      setModal(false);
      load();
    } catch (e) {
      toast(e.response?.data?.part_number?.[0] || 'Save failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this component?')) return;
    try {
      await deleteComponent(id);
      toast('Deleted');
      load();
    } catch {
      toast('Delete failed', 'error');
    }
  };

  const filtered = components.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.part_number.toLowerCase().includes(search.toLowerCase())
  );

  const totalStock = components.reduce((s, c) => s + c.stock_quantity, 0);

  const columns = [
    { key: 'part_number', label: 'Part #', render: c => <span style={{ fontFamily: 'monospace', fontWeight: 600, fontSize: 13, color: 'var(--red)' }}>{c.part_number}</span> },
    { key: 'name', label: 'Name', render: c => <strong>{c.name}</strong> },
    { key: 'description', label: 'Description', render: c => <span style={{ color: 'var(--gray)', maxWidth: 200, display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.description || '—'}</span> },
    { key: 'purchase_price', label: 'Buy Price', render: c => <span>₹{Number(c.purchase_price).toLocaleString()}</span> },
    { key: 'repair_price', label: 'Repair Price', render: c => <span>₹{Number(c.repair_price).toLocaleString()}</span> },
    { key: 'stock_quantity', label: 'Stock', render: c => (
      <span style={{ padding: '3px 10px', borderRadius: 99, fontSize: 12, fontWeight: 700, background: c.stock_quantity < 5 ? '#fee2e2' : '#dcfce7', color: c.stock_quantity < 5 ? '#991b1b' : '#166534' }}>
        {c.stock_quantity}
      </span>
    )},
    { key: 'actions', label: '', render: c => (
      <div style={{ display: 'flex', gap: 8 }}>
        <Btn size="sm" variant="outline" onClick={() => openEdit(c)}>Edit</Btn>
        <Btn size="sm" variant="danger" onClick={() => handleDelete(c.id)}>Delete</Btn>
      </div>
    )},
  ];

  return (
    <div className="fade-up">
      <PageHeader
        title="Components"
        subtitle="Manage spare parts and repair components"
        action={<Btn onClick={openAdd}>+ Add Component</Btn>}
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 16, marginBottom: 28 }}>
        <StatCard label="Total Parts" value={components.length} accent />
        <StatCard label="Total Stock" value={totalStock.toLocaleString()} />
        <StatCard label="Low Stock" value={components.filter(c => c.stock_quantity < 5).length} />
        <StatCard label="Avg Buy Price" value={components.length ? `₹${Math.round(components.reduce((s,c) => s + Number(c.purchase_price), 0) / components.length).toLocaleString()}` : '—'} />
      </div>

      <Card>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', gap: 12 }}>
          <input
            placeholder="Search by name or part number..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ flex: 1, border: '1.5px solid var(--border)', borderRadius: 'var(--radius)', padding: '9px 14px', fontSize: 14, outline: 'none' }}
          />
          <span style={{ alignSelf: 'center', fontSize: 13, color: 'var(--gray)' }}>{filtered.length} results</span>
        </div>
        {loading ? <Loader /> : <Table columns={columns} data={filtered} emptyMsg="No components added yet. Add your first component above." />}
      </Card>

      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Edit Component' : 'Add New Component'}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <FormGrid>
            <Input label="Component Name *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Brake Pad" />
            <Input label="Part Number *" value={form.part_number} onChange={e => setForm({ ...form, part_number: e.target.value })} placeholder="e.g. BP-001" />
          </FormGrid>
          <Input label="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Brief description..." />
          <FormGrid>
            <Input label="Purchase Price (₹) *" type="number" value={form.purchase_price} onChange={e => setForm({ ...form, purchase_price: e.target.value })} placeholder="0.00" />
            <Input label="Repair Price (₹) *" type="number" value={form.repair_price} onChange={e => setForm({ ...form, repair_price: e.target.value })} placeholder="0.00" />
          </FormGrid>
          <Input label="Stock Quantity" type="number" value={form.stock_quantity} onChange={e => setForm({ ...form, stock_quantity: e.target.value })} placeholder="0" />
          <div style={{ display: 'flex', gap: 12, marginTop: 8, justifyContent: 'flex-end' }}>
            <Btn variant="outline" onClick={() => setModal(false)}>Cancel</Btn>
            <Btn onClick={handleSubmit} disabled={saving}>{saving ? 'Saving...' : editing ? 'Update' : 'Add Component'}</Btn>
          </div>
        </div>
      </Modal>
    </div>
  );
}