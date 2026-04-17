import { useState, useEffect } from 'react';
import { getVehicles, getIssues, getInvoices, getPayments, generateInvoice, payInvoice } from '../api';
import { PageHeader, Card, Btn, Select, Table, Modal, Loader, StatCard, toast } from '../components/UI';

export default function Payments() {
  const [vehicles, setVehicles] = useState([]);
  const [issues, setIssues] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [preview, setPreview] = useState(null);
  const [payModal, setPayModal] = useState(null);
  const [paying, setPaying] = useState(false);

  const load = async () => {
    try {
      const [iv, ii, inv, pay] = await Promise.all([getVehicles(), getIssues(), getInvoices(), getPayments()]);
      setVehicles(iv.data);
      setIssues(ii.data);
      setInvoices(inv.data);
      setPayments(pay.data);
    } catch {
      toast('Failed to load data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openIssues = issues.filter(i => i.status === 'open');

  const handleGenerate = async () => {
    if (!selectedVehicle) { toast('Select a vehicle', 'error'); return; }
    const vIssues = openIssues.filter(i => String(i.vehicle) === selectedVehicle);
    if (!vIssues.length) { toast('No open issues for this vehicle', 'error'); return; }
    setGenerating(true);
    try {
     const r = await generateInvoice(selectedVehicle);

      toast('Invoice generated!');
      setPreview(r.data.invoice);
      load();
    } catch {
      toast('Failed to generate invoice', 'error');
    } finally {
      setGenerating(false);
    }
  };

const handlePay = async () => {
  if (!payModal) return;
  setPaying(true);

  try {
    // 🔥 directly call pay API using invoice id mapping
    const payment = payments.find(p => p.invoice === payModal.invoice);

    if (!payment) {
      toast("Payment not found", "error");
      return;
    }

    await payInvoice(payment.id); // ✅ correct API

    toast("Payment successful 🎉", "success");
    setPayModal(null);
    load();

  } catch (err) {
    console.error(err);
    toast("Payment failed", "error");
  } finally {
    setPaying(false);
  }
};

  const getVehicleName = (id) => {
    const v = vehicles.find(v => v.id === id);
    return v ? `${v.registration_number} — ${v.make} ${v.model}` : String(id);
  };

  const getPaymentForInvoice = (invId) => payments.find(p => p.invoice === invId);

  const totalRevenue = payments.filter(p => p.status === 'paid').reduce((s, p) => s + Number(p.amount), 0);
  const pendingAmt = payments.filter(p => p.status === 'pending').reduce((s, p) => s + Number(p.amount), 0);

  const invColumns = [
    { key: 'id', label: '#', render: i => <span style={{ color: 'var(--gray)' }}>INV-{String(i.id).padStart(4, '0')}</span> },
    { key: 'vehicle', label: 'Vehicle', render: i => <strong style={{ fontSize: 13 }}>{getVehicleName(i.vehicle)}</strong> },
    { key: 'parts_total', label: 'Parts', render: i => <span>₹{Number(i.parts_total).toLocaleString()}</span> },
    { key: 'labor_total', label: 'Labour', render: i => <span>₹{Number(i.labor_total).toLocaleString()}</span> },
    { key: 'grand_total', label: 'Total', render: i => <strong style={{ fontSize: 15, color: 'var(--red)' }}>₹{Number(i.grand_total).toLocaleString()}</strong> },
    { key: 'status', label: 'Payment', render: i => {
      const p = getPaymentForInvoice(i.id);
      if (!p) return <span style={{ color: 'var(--gray)', fontSize: 13 }}>No payment</span>;
      return (
        <span style={{ padding: '3px 10px', borderRadius: 99, fontSize: 12, fontWeight: 700, background: p.status === 'paid' ? '#dcfce7' : '#fee2e2', color: p.status === 'paid' ? '#166534' : '#991b1b' }}>
          {p.status === 'paid' ? '✓ Paid' : 'Pending'}
        </span>
      );
    }},
    { key: 'date', label: 'Date', render: i => <span style={{ color: 'var(--gray)', fontSize: 13 }}>{new Date(i.created_at).toLocaleDateString('en-IN')}</span> },
   { key: 'actions', label: '', render: i => {
  const p = getPaymentForInvoice(i.id);

  if (p && p.status === 'paid') return null;

  return (
    <Btn size="sm" variant="success" onClick={() => setPayModal({
      invoice: i.id,
      amount: i.grand_total
    })}>
      Pay Now
    </Btn>
);
      return <Btn size="sm" variant="success" onClick={() => setPayModal(p)}>Pay Now</Btn>;
    }},
  ];

  return (
    <div className="fade-up">
      <PageHeader title="Invoices & Payments" subtitle="Generate invoices and process payments" />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 16, marginBottom: 28 }}>
        <StatCard label="Total Invoices" value={invoices.length} accent />
        <StatCard label="Total Revenue" value={`₹${Math.round(totalRevenue).toLocaleString()}`} />
        <StatCard label="Pending" value={`₹${Math.round(pendingAmt).toLocaleString()}`} />
        <StatCard label="Paid" value={payments.filter(p => p.status === 'paid').length} />
      </div>

      {/* Invoice Generator */}
      <Card style={{ marginBottom: 24, padding: 24 }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, marginBottom: 16 }}>Generate New Invoice</h2>
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 200 }}>
           <Select
  label="Select Vehicle"
  value={selectedVehicle}
  onChange={e => {
    setSelectedVehicle(e.target.value);
    setPreview(null);
  }}
>
  <option value="">Choose vehicle...</option>
  {vehicles.map(v => (
    <option key={v.id} value={v.id}>
      {v.registration_number} — {v.make} {v.model}
    </option>
  ))}
</Select>
          </div>
          {selectedVehicle && (
            <div style={{ fontSize: 13, color: 'var(--gray)', alignSelf: 'flex-end', paddingBottom: 10 }}>
              {openIssues.filter(i => String(i.vehicle) === selectedVehicle).length} open issue(s)
            </div>
          )}
          <Btn onClick={handleGenerate} disabled={generating || !selectedVehicle} style={{ alignSelf: 'flex-end' }}>
            {generating ? 'Generating...' : '⚡ Generate Invoice'}
          </Btn>
        </div>

        {/* Preview */}
        {preview && (
          <div style={{ marginTop: 20, background: 'var(--gray-light)', borderRadius: 'var(--radius-lg)', padding: 20, animation: 'fadeUp 0.3s ease' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
              <div>
                <p style={{ fontSize: 11, color: 'var(--gray)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>Invoice Generated</p>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700 }}>INV-{String(preview.id).padStart(4, '0')}</p>
                <p style={{ color: 'var(--gray)', fontSize: 13 }}>{getVehicleName(preview.vehicle)}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ display: 'flex', gap: 24, marginBottom: 8 }}>
                  <div><p style={{ fontSize: 12, color: 'var(--gray)' }}>Parts</p><p style={{ fontWeight: 600 }}>₹{Number(preview.parts_total).toLocaleString()}</p></div>
                  <div><p style={{ fontSize: 12, color: 'var(--gray)' }}>Labour</p><p style={{ fontWeight: 600 }}>₹{Number(preview.labor_total).toLocaleString()}</p></div>
                  <div><p style={{ fontSize: 12, color: 'var(--gray)' }}>Total</p><p style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 800, color: 'var(--red)' }}>₹{Number(preview.grand_total).toLocaleString()}</p></div>
                </div>
                {(() => {
                  const p = getPaymentForInvoice(preview.id);
                  return p && p.status !== 'paid'
                    ? <Btn onClick={() => setPayModal({
  invoice: preview.id,
  amount: preview.grand_total
})}>
  💳 Pay Now
</Btn>
                    : <span style={{ color: 'var(--green)', fontWeight: 600 }}>✓ Payment Recorded</span>;
                })()}
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Invoices Table */}
      <Card>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700 }}>All Invoices</h2>
         
        </div>
        {loading ? <Loader /> : <Table columns={invColumns} data={invoices} emptyMsg="No invoices yet. Select a vehicle above to generate one." />}
      </Card>

      {/* Pay Modal */}
      <Modal open={!!payModal} onClose={() => setPayModal(null)} title="Confirm Payment" width={420}>
        {payModal && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ background: 'var(--gray-light)', borderRadius: 'var(--radius-lg)', padding: 20, textAlign: 'center' }}>
              <p style={{ fontSize: 13, color: 'var(--gray)', marginBottom: 8 }}>Amount Due</p>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: 48, fontWeight: 800, color: 'var(--red)' }}>₹{Number(payModal.amount).toLocaleString()}</p>
            </div>
            <div style={{ background: '#dcfce7', borderRadius: 'var(--radius)', padding: '12px 16px', fontSize: 14, color: '#166534' }}>
              ✓ Marking as paid will update the vehicle status to <strong>Completed</strong>
            </div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <Btn variant="outline" onClick={() => setPayModal(null)}>Cancel</Btn>
              <Btn onClick={handlePay} disabled={paying} variant="dark">{paying ? 'Processing...' : '✓ Confirm Payment'}</Btn>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}