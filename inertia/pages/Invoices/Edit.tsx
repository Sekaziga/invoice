import { Head, Link } from '@inertiajs/react'
import { useState } from 'react'
import { router } from '@inertiajs/react'
import AppLayout from '../../layouts/AppLayout'

type ClientSummary = {
  id: number
  name: string
}

type InvoiceItemRow = {
  description: string
  quantity: string
  unitPrice: string
}

type Invoice = {
  id: number
  clientId: number
  total: number
  items: { id: number; description: string; quantity: number; unitPrice: number }[]
  dueDate: string | null
  status: string
  isOverdue: boolean
  createdAt: string | null
  updatedAt: string | null
}

type InvoiceEditProps = {
  client: ClientSummary
  invoice: Invoice | null
}

const statusOptions = ['pending', 'paid', 'overdue']

function emptyRow(): InvoiceItemRow {
  return { description: '', quantity: '1', unitPrice: '' }
}

function lineTotal(row: InvoiceItemRow): number {
  const q = Number.parseFloat(row.quantity)
  const u = Number.parseFloat(row.unitPrice)
  if (Number.isNaN(q) || Number.isNaN(u)) return 0
  return q * u
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
}

export default function InvoiceEdit({ client, invoice }: InvoiceEditProps) {
  const isEditing = Boolean(invoice)

  const [dueDate, setDueDate] = useState(invoice?.dueDate ?? '')
  const [status, setStatus] = useState(invoice?.status ?? 'pending')
  const [items, setItems] = useState<InvoiceItemRow[]>(() => {
    if (invoice && invoice.items.length > 0) {
      return invoice.items.map((item) => ({
        description: item.description,
        quantity: String(item.quantity),
        unitPrice: String(item.unitPrice),
      }))
    }
    return [emptyRow()]
  })
  const [processing, setProcessing] = useState(false)

  const subtotal = items.reduce((sum, row) => sum + lineTotal(row), 0)

  function updateItem(index: number, field: keyof InvoiceItemRow, value: string) {
    setItems((prev) => prev.map((row, i) => (i === index ? { ...row, [field]: value } : row)))
  }

  function addItem() {
    setItems((prev) => [...prev, emptyRow()])
  }

  function removeItem(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index))
  }

  function submit() {
    const validItems = items.filter((row) => row.description.trim() !== '')
    const payload = {
      dueDate,
      status,
      items: validItems.map((row) => ({
        description: row.description.trim(),
        quantity: Number.parseFloat(row.quantity) || 1,
        unitPrice: Number.parseFloat(row.unitPrice) || 0,
      })),
    }

    setProcessing(true)

    if (isEditing && invoice) {
      router.put(`/clients/${client.id}/invoices/${invoice.id}`, payload, {
        onFinish: () => setProcessing(false),
      })
    } else {
      router.post(`/clients/${client.id}/invoices`, payload, {
        onFinish: () => setProcessing(false),
      })
    }
  }

  const backHref =
    isEditing && invoice
      ? `/clients/${client.id}/invoices/${invoice.id}`
      : `/clients/${client.id}/invoices`

  return (
    <>
      <Head title={isEditing ? `Edit invoice #${invoice?.id}` : `Create invoice · ${client.name}`} />

      <AppLayout title={isEditing ? `Edit invoice #${invoice?.id}` : `Create invoice · ${client.name}`}>
        <div className="space-y-6">
          {/* Header */}
          <section className="mb-8 overflow-hidden rounded-[2rem] border border-white/70 bg-white/85 p-8 shadow-[0_30px_80px_rgba(33,32,28,0.12)] backdrop-blur">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-stone-500">Invoice form</p>
                <h1 className="mt-3 text-4xl font-semibold tracking-tight text-stone-950 md:text-5xl">
                  {isEditing ? `Edit invoice #${invoice?.id}` : `Create invoice for ${client.name}`}
                </h1>
              </div>
              <Link
                href={backHref}
                className="inline-flex items-center rounded-full border border-stone-300 px-5 py-2.5 text-sm font-medium text-stone-700 transition hover:border-stone-950 hover:text-stone-950"
              >
                {isEditing ? 'Back to invoice' : 'Back to invoices'}
              </Link>
            </div>
          </section>

          <form
            onSubmit={(event) => {
              event.preventDefault()
              submit()
            }}
          >
            {/* Invoice details */}
            <section className="mb-6 rounded-[2rem] border border-stone-200 bg-white p-8 shadow-[0_24px_60px_rgba(33,32,28,0.1)]">
              <h2 className="mb-6 text-sm font-semibold uppercase tracking-widest text-stone-500">
                Invoice details
              </h2>

              <div className="mb-6 rounded-[1.5rem] bg-stone-50 px-5 py-4 text-sm text-stone-600">
                Client: <span className="font-semibold text-stone-950">{client.name}</span>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label htmlFor="dueDate" className="mb-2 block text-sm font-medium text-stone-700">
                    Due date
                  </label>
                  <input
                    id="dueDate"
                    type="date"
                    required
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full rounded-2xl border border-stone-300 bg-stone-50 px-4 py-3 text-stone-900 outline-none transition focus:border-stone-900 focus:bg-white"
                  />
                </div>

                <div>
                  <label htmlFor="status" className="mb-2 block text-sm font-medium text-stone-700">
                    Status
                  </label>
                  <select
                    id="status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full rounded-2xl border border-stone-300 bg-stone-50 px-4 py-3 text-stone-900 outline-none transition focus:border-stone-900 focus:bg-white"
                  >
                    {statusOptions.map((s) => (
                      <option key={s} value={s}>
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </section>

            {/* Line items */}
            <section className="mb-6 rounded-[2rem] border border-stone-200 bg-white p-8 shadow-[0_24px_60px_rgba(33,32,28,0.1)]">
              <h2 className="mb-6 text-sm font-semibold uppercase tracking-widest text-stone-500">
                Line items
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-stone-100 text-left text-xs uppercase tracking-widest text-stone-400">
                      <th className="pb-3 pr-4 font-medium">Description</th>
                      <th className="pb-3 pr-4 w-24 font-medium">Qty</th>
                      <th className="pb-3 pr-4 w-32 font-medium">Unit price</th>
                      <th className="pb-3 w-28 text-right font-medium">Line total</th>
                      <th className="pb-3 w-10" />
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((row, index) => (
                      <tr key={index} className="border-b border-stone-50">
                        <td className="py-2 pr-4">
                          <input
                            type="text"
                            placeholder="Item description"
                            value={row.description}
                            onChange={(e) => updateItem(index, 'description', e.target.value)}
                            className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-stone-900 outline-none transition focus:border-stone-900 focus:bg-white"
                          />
                        </td>
                        <td className="py-2 pr-4">
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="1"
                            value={row.quantity}
                            onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                            className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-stone-900 outline-none transition focus:border-stone-900 focus:bg-white"
                          />
                        </td>
                        <td className="py-2 pr-4">
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="0.00"
                            value={row.unitPrice}
                            onChange={(e) => updateItem(index, 'unitPrice', e.target.value)}
                            className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-stone-900 outline-none transition focus:border-stone-900 focus:bg-white"
                          />
                        </td>
                        <td className="py-2 text-right font-medium text-stone-700">
                          {formatCurrency(lineTotal(row))}
                        </td>
                        <td className="py-2 pl-3">
                          {items.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeItem(index)}
                              className="rounded-lg p-1 text-stone-400 transition hover:text-rose-600"
                              aria-label="Remove line"
                            >
                              ×
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={addItem}
                  className="inline-flex items-center gap-1 rounded-full border border-stone-300 px-4 py-2 text-sm font-medium text-stone-600 transition hover:border-stone-950 hover:text-stone-950"
                >
                  + Add line item
                </button>

                <div className="text-right">
                  <p className="text-xs uppercase tracking-widest text-stone-400">Total</p>
                  <p className="mt-1 text-2xl font-semibold text-stone-950">{formatCurrency(subtotal)}</p>
                </div>
              </div>
            </section>

            {/* Actions */}
            <div className="flex flex-wrap justify-end gap-3">
              <Link
                href={backHref}
                className="inline-flex items-center rounded-full border border-stone-300 px-5 py-2.5 text-sm font-medium text-stone-700 transition hover:border-stone-950 hover:text-stone-950"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={processing}
                className="inline-flex items-center rounded-full bg-stone-950 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {processing ? 'Saving…' : isEditing ? 'Update invoice' : 'Create invoice'}
              </button>
            </div>
          </form>
        </div>
      </AppLayout>
    </>
  )
}