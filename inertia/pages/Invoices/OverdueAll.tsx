import { Head, Link } from '@inertiajs/react'
import AppLayout from '../../layouts/AppLayout'

type ClientSummary = {
  id: number
  name: string
}

type OverdueInvoice = {
  id: number
  clientId: number
  total: number
  dueDate: string | null
  status: string
  isOverdue: boolean
  createdAt: string | null
  updatedAt: string | null
  daysLate: number
  client?: ClientSummary
}

type OverdueAllProps = {
  invoices: OverdueInvoice[]
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

export default function OverdueAll({ invoices }: OverdueAllProps) {
  return (
    <>
      <Head title="Overdue invoices" />

      <AppLayout title="Overdue invoices">
        <div className="space-y-6">
          <section className="mb-8 overflow-hidden rounded-[2rem] border border-white/70 bg-white/85 p-8 shadow-[0_30px_80px_rgba(33,32,28,0.12)] backdrop-blur">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-stone-500">Global overdue report</p>
                <h1 className="mt-3 text-4xl font-semibold tracking-tight text-stone-950 md:text-5xl">
                  Overdue invoices across all clients
                </h1>
                <p className="mt-4 max-w-3xl text-base leading-7 text-stone-600">
                  Prioritize collection work by seeing every late invoice in a single ranked list.
                </p>
              </div>

              <Link
                href="/dashboard"
                className="rounded-full border border-stone-300 px-5 py-2.5 text-sm font-medium text-stone-700 transition hover:border-stone-950 hover:text-stone-950"
              >
                Dashboard
              </Link>
            </div>
          </section>

          <section className="overflow-hidden rounded-[2rem] border border-stone-200 bg-white shadow-[0_24px_60px_rgba(33,32,28,0.1)]">
            {invoices.length === 0 ? (
              <div className="px-8 py-20 text-center">
                <p className="text-sm uppercase tracking-[0.35em] text-emerald-500">All clear</p>
                <h2 className="mt-4 text-3xl font-semibold text-stone-950">No overdue invoices</h2>
                <p className="mx-auto mt-3 max-w-xl text-stone-600">
                  There are no late balances across the portfolio right now.
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
                      <th className="px-6 py-4">Days late</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 bg-white">
                    {invoices.map((invoice) => (
                      <tr key={invoice.id} className="transition hover:bg-rose-50/40">
                        <td className="px-6 py-5 text-sm font-semibold text-stone-950">#{invoice.id}</td>
                        <td className="px-6 py-5 text-sm text-stone-700">
                          {invoice.client ? (
                            <Link
                              href={`/clients/${invoice.client.id}`}
                              className="underline decoration-stone-300 underline-offset-4 transition hover:decoration-stone-950"
                            >
                              {invoice.client.name}
                            </Link>
                          ) : (
                            'Unknown client'
                          )}
                        </td>
                        <td className="px-6 py-5 text-sm text-stone-700">{formatCurrency(invoice.total)}</td>
                        <td className="px-6 py-5 text-sm text-stone-700">{formatDate(invoice.dueDate)}</td>
                        <td className="px-6 py-5 text-sm font-semibold text-rose-700">{invoice.daysLate} days</td>
                        <td className="px-6 py-5">
                          <div className="flex flex-wrap justify-end gap-2">
                            {invoice.client ? (
                              <Link
                                href={`/clients/${invoice.client.id}/invoices/${invoice.id}`}
                                className="rounded-full border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 transition hover:border-stone-950 hover:text-stone-950"
                              >
                                View
                              </Link>
                            ) : null}
                            {invoice.client ? (
                              <Link
                                href={`/clients/${invoice.client.id}/invoices`}
                                className="rounded-full bg-[#af2f3a] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#8f2530]"
                              >
                                Client invoices
                              </Link>
                            ) : null}
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