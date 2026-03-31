import { Head, Link, router } from '@inertiajs/react'
import AppLayout from '../../layouts/AppLayout'

type ClientSummary = {
  id: number
  name: string
}

type InvoiceItem = {
  id: number
  description: string
  quantity: number
  unitPrice: number
}

type Invoice = {
  id: number
  clientId: number
  total: number
  items: InvoiceItem[]
  dueDate: string | null
  status: string
  isOverdue: boolean
  createdAt: string | null
  updatedAt: string | null
}

type InvoiceShowProps = {
  client: ClientSummary
  invoice: Invoice
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
}

function formatDate(value: string | null) {
  if (!value) return 'No due date'
  return new Date(`${value}T00:00:00`).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function formatTimestamp(value: string | null) {
  if (!value) return 'Not available'
  return new Date(value).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export default function InvoiceShow({ client, invoice }: InvoiceShowProps) {
  function destroyInvoice() {
    if (!window.confirm(`Delete invoice #${invoice.id}? This cannot be undone.`)) return
    router.delete(`/clients/${client.id}/invoices/${invoice.id}`)
  }

  return (
    <>
      <Head title={`Invoice #${invoice.id}`} />

      <AppLayout title={`Invoice #${invoice.id}`}>
        <div className="space-y-6">
          {/* Header */}
          <section className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/85 p-8 shadow-[0_30px_80px_rgba(33,32,28,0.12)] backdrop-blur">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-stone-500">Invoice detail</p>
                <h1 className="mt-3 text-4xl font-semibold tracking-tight text-stone-950 md:text-5xl">
                  Invoice #{invoice.id}
                </h1>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  href={`/clients/${client.id}/invoices`}
                  className="rounded-full border border-stone-300 px-5 py-2.5 text-sm font-medium text-stone-700 transition hover:border-stone-950 hover:text-stone-950"
                >
                  Back to invoices
                </Link>
                <Link
                  href={`/clients/${client.id}/invoices/${invoice.id}/edit`}
                  className="rounded-full bg-[#1f4b99] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#173a77]"
                >
                  Edit invoice
                </Link>
                <button
                  type="button"
                  onClick={destroyInvoice}
                  className="rounded-full bg-[#af2f3a] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#8f2530]"
                >
                  Delete invoice
                </button>
              </div>
            </div>
          </section>

          {/* Billing data + timestamps */}
          <section className="grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
            <article className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-[0_24px_60px_rgba(33,32,28,0.1)]">
              <p className="text-xs uppercase tracking-[0.35em] text-stone-500">Billing data</p>
              <dl className="mt-6 space-y-6">
                <div>
                  <dt className="text-sm font-medium text-stone-500">Client</dt>
                  <dd className="mt-2 text-lg text-stone-950">
                    <Link
                      href={`/clients/${client.id}`}
                      className="underline decoration-stone-300 underline-offset-4 transition hover:decoration-stone-950"
                    >
                      {client.name}
                    </Link>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-stone-500">Due date</dt>
                  <dd className="mt-2 text-lg text-stone-950">{formatDate(invoice.dueDate)}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-stone-500">Status</dt>
                  <dd className="mt-2">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${
                        invoice.isOverdue
                          ? 'bg-rose-100 text-rose-800'
                          : invoice.status.toLowerCase() === 'paid'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {invoice.isOverdue ? 'Overdue' : invoice.status}
                    </span>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-stone-500">Total</dt>
                  <dd className="mt-2 text-2xl font-semibold text-stone-950">
                    {formatCurrency(invoice.total)}
                  </dd>
                </div>
              </dl>
            </article>

            <article className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-[0_24px_60px_rgba(33,32,28,0.1)]">
              <p className="text-xs uppercase tracking-[0.35em] text-stone-500">Timestamps</p>
              <dl className="mt-6 space-y-6">
                <div>
                  <dt className="text-sm font-medium text-stone-500">Created</dt>
                  <dd className="mt-2 text-base text-stone-900">{formatTimestamp(invoice.createdAt)}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-stone-500">Last updated</dt>
                  <dd className="mt-2 text-base text-stone-900">{formatTimestamp(invoice.updatedAt)}</dd>
                </div>
              </dl>
            </article>
          </section>

          {/* Line items read-only */}
          {invoice.items.length > 0 ? (
            <section className="overflow-hidden rounded-[2rem] border border-stone-200 bg-white shadow-[0_24px_60px_rgba(33,32,28,0.1)]">
              <div className="border-b border-stone-100 px-8 py-5">
                <p className="text-xs uppercase tracking-[0.35em] text-stone-500">Line items</p>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-stone-100">
                  <thead className="bg-stone-50 text-left text-xs uppercase tracking-[0.2em] text-stone-500">
                    <tr>
                      <th className="px-6 py-4 font-medium">Description</th>
                      <th className="px-6 py-4 text-right font-medium">Qty</th>
                      <th className="px-6 py-4 text-right font-medium">Unit price</th>
                      <th className="px-6 py-4 text-right font-medium">Line total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 bg-white">
                    {invoice.items.map((item) => (
                      <tr key={item.id} className="hover:bg-stone-50/60">
                        <td className="px-6 py-4 text-sm text-stone-900">{item.description}</td>
                        <td className="px-6 py-4 text-right text-sm text-stone-700">{item.quantity}</td>
                        <td className="px-6 py-4 text-right text-sm text-stone-700">
                          {formatCurrency(item.unitPrice)}
                        </td>
                        <td className="px-6 py-4 text-right text-sm font-semibold text-stone-950">
                          {formatCurrency(item.quantity * item.unitPrice)}
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-stone-50">
                      <td colSpan={3} className="px-6 py-4 text-sm font-medium text-stone-500">
                        Total
                      </td>
                      <td className="px-6 py-4 text-right text-lg font-semibold text-stone-950">
                        {formatCurrency(invoice.total)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="border-t border-stone-100 px-8 py-4 text-right">
                <Link
                  href={`/clients/${client.id}/invoices/${invoice.id}/edit`}
                  className="rounded-full border border-stone-300 px-5 py-2 text-sm font-medium text-stone-700 transition hover:border-stone-950 hover:text-stone-950"
                >
                  Edit items
                </Link>
              </div>
            </section>
          ) : null}
        </div>
      </AppLayout>
    </>
  )
}