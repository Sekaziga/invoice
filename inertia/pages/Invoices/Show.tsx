import { Head, Link, router } from '@inertiajs/react'
import AppLayout from '../../layouts/AppLayout'

type ClientSummary = {
  id: number
  name: string
}

type Invoice = {
  id: number
  clientId: number
  amount: number
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
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value)
}

function formatDate(value: string | null) {
  if (!value) {
    return 'No due date'
  }

  return new Date(`${value}T00:00:00`).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function formatTimestamp(value: string | null) {
  if (!value) {
    return 'Not available'
  }

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
    if (!window.confirm(`Delete invoice #${invoice.id}? This cannot be undone.`)) {
      return
    }

    router.delete(`/clients/${client.id}/invoices/${invoice.id}`)
  }

  return (
    <>
      <Head title={`Invoice #${invoice.id}`} />

      <AppLayout title={`Invoice #${invoice.id}`}>
        <div className="space-y-6">
          <section className="mb-8 overflow-hidden rounded-[2rem] border border-white/70 bg-white/85 p-8 shadow-[0_30px_80px_rgba(33,32,28,0.12)] backdrop-blur">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-stone-500">Invoice detail</p>
                <h1 className="mt-3 text-4xl font-semibold tracking-tight text-stone-950 md:text-5xl">
                  Invoice #{invoice.id}
                </h1>
                <p className="mt-4 max-w-2xl text-base leading-7 text-stone-600">
                  Review payment status, due date, and client context before making changes.
                </p>
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

          <section className="grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
            <article className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-[0_24px_60px_rgba(33,32,28,0.1)]">
              <p className="text-xs uppercase tracking-[0.35em] text-stone-500">Billing data</p>
              <dl className="mt-6 space-y-6">
                <div>
                  <dt className="text-sm font-medium text-stone-500">Client</dt>
                  <dd className="mt-2 text-lg text-stone-950">
                    <Link href={`/clients/${client.id}`} className="text-stone-950 underline decoration-stone-300 underline-offset-4 transition hover:decoration-stone-950">
                      {client.name}
                    </Link>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-stone-500">Amount</dt>
                  <dd className="mt-2 text-lg text-stone-950">{formatCurrency(invoice.amount)}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-stone-500">Due date</dt>
                  <dd className="mt-2 text-lg text-stone-950">{formatDate(invoice.dueDate)}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-stone-500">Status</dt>
                  <dd className="mt-2">
                    <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${invoice.isOverdue ? 'bg-rose-100 text-rose-800' : invoice.status.toLowerCase() === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                      {invoice.isOverdue ? 'Overdue' : invoice.status}
                    </span>
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
        </div>
      </AppLayout>
    </>
  )
}