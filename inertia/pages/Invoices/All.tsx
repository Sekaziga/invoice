import { Head, Link } from '@inertiajs/react'
import { useState } from 'react'
import AppLayout from '../../layouts/AppLayout'

type ClientSummary = {
  id: number
  name: string
}

type Invoice = {
  id: number
  clientId: number
  total: number
  dueDate: string | null
  status: string
  isOverdue: boolean
  createdAt: string | null
  updatedAt: string | null
  client: ClientSummary
}

type AllInvoicesProps = {
  invoices: Invoice[]
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
    month: 'short',
    day: 'numeric',
  })
}

function statusClasses(invoice: Invoice) {
  if (invoice.isOverdue) {
    return 'bg-rose-100 text-rose-800'
  }

  if (invoice.status.toLowerCase() === 'paid') {
    return 'bg-emerald-100 text-emerald-800'
  }

  return 'bg-amber-100 text-amber-800'
}

export default function AllInvoices({ invoices }: AllInvoicesProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const normalizedQuery = searchQuery.trim().toLowerCase()

  const filteredInvoices = invoices.filter((invoice) => {
    if (!normalizedQuery) {
      return true
    }

    const clientName = invoice.client?.name ?? 'Unknown client'
    const searchableValues = [
      `#${invoice.id}`,
      clientName,
      String(invoice.total),
      formatCurrency(invoice.total),
      invoice.dueDate ? formatDate(invoice.dueDate) : 'No due date',
      invoice.status ?? '',
      invoice.isOverdue ? 'overdue' : 'current',
    ]

    return searchableValues.some((value) => value.toLowerCase().includes(normalizedQuery))
  })

  return (
    <>
      <Head title="All invoices" />

      <AppLayout title="All invoices">
        <div className="space-y-6">
          <section className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/85 p-8 shadow-[0_30px_80px_rgba(33,32,28,0.12)] backdrop-blur">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-stone-500">Billing overview</p>
                <h1 className="mt-3 text-4xl font-semibold tracking-tight text-stone-950 md:text-5xl">
                  All invoices across all clients
                </h1>
                <p className="mt-4 max-w-3xl text-base leading-7 text-stone-600">
                  Review every invoice in one place, then jump into the matching client workspace when you need to take action.
                </p>
              </div>

              <Link
                href="/dashboard"
                className="rounded-full border border-stone-300 px-5 py-2.5 text-sm font-medium text-stone-700 transition hover:border-stone-950 hover:text-stone-950"
              >
                Dashboard
              </Link>
            </div>

            <div className="mt-8 flex flex-col gap-3 rounded-3xl border border-stone-200 bg-stone-50/80 p-4 sm:flex-row sm:items-center sm:justify-between">
              <label htmlFor="invoice-search" className="block flex-1">
                <span className="mb-2 block text-xs uppercase tracking-[0.28em] text-stone-500">
                  Search invoices
                </span>
                <input
                  id="invoice-search"
                  type="search"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search by invoice number, client, status, or amount"
                  className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-stone-950 focus:ring-2 focus:ring-stone-200"
                />
              </label>

              <div className="flex items-center gap-3 sm:pt-7">
                <span className="rounded-full bg-white px-4 py-2 text-sm font-medium text-stone-700 ring-1 ring-stone-200">
                  {filteredInvoices.length} of {invoices.length}
                </span>
                {normalizedQuery ? (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="rounded-full border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 transition hover:border-stone-950 hover:text-stone-950"
                  >
                    Clear
                  </button>
                ) : null}
              </div>
            </div>
          </section>

          <section className="overflow-hidden rounded-[2rem] border border-stone-200 bg-white shadow-[0_24px_60px_rgba(33,32,28,0.1)]">
            {invoices.length === 0 ? (
              <div className="px-8 py-20 text-center">
                <p className="text-sm uppercase tracking-[0.35em] text-stone-400">No invoices yet</p>
                <h2 className="mt-4 text-3xl font-semibold text-stone-950">Create your first invoice</h2>
                <p className="mx-auto mt-3 max-w-xl text-stone-600">
                  Once invoices exist, they will appear here with client context and payment status.
                </p>
              </div>
            ) : filteredInvoices.length === 0 ? (
              <div className="px-8 py-20 text-center">
                <p className="text-sm uppercase tracking-[0.35em] text-stone-400">No matches</p>
                <h2 className="mt-4 text-3xl font-semibold text-stone-950">No invoices match your search</h2>
                <p className="mx-auto mt-3 max-w-xl text-stone-600">
                  Try a client name, invoice number, status, or amount.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-stone-200">
                  <thead className="bg-stone-50 text-left text-xs uppercase tracking-[0.25em] text-stone-500">
                    <tr>
                      <th className="px-6 py-4">Invoice</th>
                      <th className="px-6 py-4">Client</th>
                      <th className="px-6 py-4">Amount</th>
                      <th className="px-6 py-4">Due date</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 bg-white">
                    {filteredInvoices.map((invoice) => (
                      <tr key={invoice.id} className="transition hover:bg-stone-50/80">
                        {(() => {
                          const clientName = invoice.client?.name ?? 'Unknown client'
                          const clientHref = invoice.client ? `/clients/${invoice.client.id}` : '/clients'

                          return (
                            <>
                        <td className="px-6 py-5 text-sm font-semibold text-stone-950">#{invoice.id}</td>
                        <td className="px-6 py-5 text-sm text-stone-700">
                          <Link
                            href={clientHref}
                            className="underline decoration-stone-300 underline-offset-4 transition hover:decoration-stone-950"
                          >
                            {clientName}
                          </Link>
                        </td>
                        <td className="px-6 py-5 text-sm text-stone-700">{formatCurrency(invoice.total)}</td>
                        <td className="px-6 py-5 text-sm text-stone-700">{formatDate(invoice.dueDate)}</td>
                        <td className="px-6 py-5 text-sm">
                          <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusClasses(invoice)}`}>
                            {invoice.isOverdue ? 'Overdue' : invoice.status}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex flex-wrap justify-end gap-2">
                            <Link
                              href={`/clients/${invoice.client.id}/invoices/${invoice.id}`}
                              className="rounded-full border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 transition hover:border-stone-950 hover:text-stone-950"
                            >
                              View
                            </Link>
                            <Link
                              href={`/clients/${invoice.client.id}/invoices/${invoice.id}/edit`}
                              className="rounded-full bg-[#1f4b99] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#173a77]"
                            >
                              Edit
                            </Link>
                          </div>
                        </td>
                            </>
                          )
                        })()}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </AppLayout>
    </>
  )
}