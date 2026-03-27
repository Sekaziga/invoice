import { Head, Link, router } from '@inertiajs/react'
import { useState } from 'react'
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

type InvoicesIndexProps = {
  client: ClientSummary
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

export default function InvoicesIndex({ client, invoices }: InvoicesIndexProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const normalizedQuery = searchQuery.trim().toLowerCase()

  function destroyInvoice(invoiceId: number) {
    if (!window.confirm(`Delete invoice #${invoiceId}? This cannot be undone.`)) {
      return
    }

    router.delete(`/clients/${client.id}/invoices/${invoiceId}`)
  }

  const paidCount = invoices.filter((invoice) => invoice.status.toLowerCase() === 'paid').length
  const overdueCount = invoices.filter((invoice) => invoice.isOverdue).length

  const filteredInvoices = invoices.filter((invoice) => {
    if (!normalizedQuery) {
      return true
    }

    const searchableValues = [
      `#${invoice.id}`,
      String(invoice.amount),
      formatCurrency(invoice.amount),
      invoice.dueDate ? formatDate(invoice.dueDate) : 'No due date',
      invoice.status ?? '',
      invoice.isOverdue ? 'overdue' : 'current',
    ]

    return searchableValues.some((value) => value.toLowerCase().includes(normalizedQuery))
  })

  return (
    <>
      <Head title={`Invoices · ${client.name}`} />

      <AppLayout title={`Invoices · ${client.name}`}>
        <div className="space-y-6">
          <section className="mb-8 overflow-hidden rounded-[2rem] border border-white/70 bg-white/85 p-8 shadow-[0_30px_80px_rgba(33,32,28,0.12)] backdrop-blur">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-stone-500">Invoices</p>
                <h1 className="mt-3 text-4xl font-semibold tracking-tight text-stone-950 md:text-5xl">
                  {client.name}
                </h1>
                <p className="mt-4 max-w-2xl text-base leading-7 text-stone-600">
                  Manage invoice history, jump into edits, and move between billing actions without
                  leaving the client workspace.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  href={`/clients/${client.id}`}
                  className="rounded-full border border-stone-300 px-5 py-2.5 text-sm font-medium text-stone-700 transition hover:border-stone-950 hover:text-stone-950"
                >
                  Back to client
                </Link>
                <Link
                  href={`/clients/${client.id}/invoices/overdue`}
                  className="rounded-full border border-stone-300 px-5 py-2.5 text-sm font-medium text-stone-700 transition hover:border-stone-950 hover:text-stone-950"
                >
                  Overdue report
                </Link>
                <Link
                  href={`/clients/${client.id}/invoices/create`}
                  className="rounded-full bg-stone-950 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-stone-800"
                >
                  New invoice
                </Link>
              </div>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <div className="rounded-[1.5rem] bg-stone-950 px-6 py-5 text-white">
                <p className="text-sm text-stone-300">Total invoices</p>
                <p className="mt-3 text-4xl font-semibold">{invoices.length}</p>
              </div>
              <div className="rounded-[1.5rem] bg-emerald-50 px-6 py-5 text-emerald-900">
                <p className="text-sm text-emerald-700">Paid invoices</p>
                <p className="mt-3 text-4xl font-semibold">{paidCount}</p>
              </div>
              <div className="rounded-[1.5rem] bg-rose-50 px-6 py-5 text-rose-900">
                <p className="text-sm text-rose-700">Overdue invoices</p>
                <p className="mt-3 text-4xl font-semibold">{overdueCount}</p>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 rounded-3xl border border-stone-200 bg-stone-50/80 p-4 sm:flex-row sm:items-center sm:justify-between">
              <label htmlFor="invoice-search" className="block flex-1">
                <span className="mb-2 block text-xs uppercase tracking-[0.28em] text-stone-500">
                  Search this client’s invoices
                </span>
                <input
                  id="invoice-search"
                  type="search"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search by invoice number, status, amount, or due date"
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
                <h2 className="mt-4 text-3xl font-semibold text-stone-950">Create the first invoice</h2>
                <p className="mx-auto mt-3 max-w-xl text-stone-600">
                  Start the billing history for this client and keep payment status visible in one place.
                </p>
                <Link
                  href={`/clients/${client.id}/invoices/create`}
                  className="mt-8 inline-flex items-center rounded-full bg-stone-950 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-stone-800"
                >
                  Create invoice
                </Link>
              </div>
            ) : filteredInvoices.length === 0 ? (
              <div className="px-8 py-20 text-center">
                <p className="text-sm uppercase tracking-[0.35em] text-stone-400">No matches</p>
                <h2 className="mt-4 text-3xl font-semibold text-stone-950">No invoices match your search</h2>
                <p className="mx-auto mt-3 max-w-xl text-stone-600">
                  Try an invoice number, amount, status, or due date.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-stone-200">
                  <thead className="bg-stone-50 text-left text-xs uppercase tracking-[0.25em] text-stone-500">
                    <tr>
                      <th className="px-6 py-4">Invoice</th>
                      <th className="px-6 py-4">Amount</th>
                      <th className="px-6 py-4">Due date</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 bg-white">
                    {filteredInvoices.map((invoice) => (
                      <tr key={invoice.id} className="transition hover:bg-stone-50/80">
                        <td className="px-6 py-5">
                          <div>
                            <p className="text-sm font-semibold text-stone-950">#{invoice.id}</p>
                            <p className="mt-1 text-sm text-stone-500">
                              Created {invoice.createdAt ? new Date(invoice.createdAt).toLocaleDateString() : 'recently'}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-sm text-stone-700">{formatCurrency(invoice.amount)}</td>
                        <td className="px-6 py-5 text-sm text-stone-700">{formatDate(invoice.dueDate)}</td>
                        <td className="px-6 py-5 text-sm">
                          <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusClasses(invoice)}`}>
                            {invoice.isOverdue ? 'Overdue' : invoice.status}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex flex-wrap justify-end gap-2">
                            <Link
                              href={`/clients/${client.id}/invoices/${invoice.id}`}
                              className="rounded-full border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 transition hover:border-stone-950 hover:text-stone-950"
                            >
                              View
                            </Link>
                            <Link
                              href={`/clients/${client.id}/invoices/${invoice.id}/edit`}
                              className="rounded-full bg-[#1f4b99] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#173a77]"
                            >
                              Edit
                            </Link>
                            <button
                              type="button"
                              onClick={() => destroyInvoice(invoice.id)}
                              className="rounded-full bg-[#af2f3a] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#8f2530]"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
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