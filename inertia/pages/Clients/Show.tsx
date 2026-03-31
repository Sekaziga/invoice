import { Head, Link, router } from '@inertiajs/react'
import AppLayout from '../../layouts/AppLayout'

type Invoice = {
  id: number
  total: number
  dueDate: string | null
  status: string
}

type Client = {
  id: number
  name: string
  email: string
  phone: string | null
  address: string | null
  invoices: Invoice[]
}

type ClientShowProps = {
  client: Client
}

function formatValue(value: string | null) {
  return value && value.trim() ? value : 'Not provided'
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

function statusClasses(status: string) {
  const normalized = status.toLowerCase()

  if (normalized === 'paid') {
    return 'bg-emerald-100 text-emerald-800'
  }

  if (normalized === 'pending') {
    return 'bg-amber-100 text-amber-800'
  }

  return 'bg-rose-100 text-rose-800'
}

export default function ClientShow({ client }: ClientShowProps) {
  function deleteClient() {
    if (!window.confirm(`Delete ${client.name}? This cannot be undone.`)) {
      return
    }

    router.delete(`/clients/${client.id}`)
  }

  return (
    <>
      <Head title={client.name} />

      <AppLayout title={client.name}>
        <div className="space-y-6">
          <section className="mb-8 overflow-hidden rounded-[2rem] border border-white/20 bg-white/90 p-8 shadow-[0_30px_90px_rgba(16,32,58,0.24)] backdrop-blur">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-stone-500">Client profile</p>
                <h1 className="mt-3 text-4xl font-semibold tracking-tight text-stone-950 md:text-5xl">
                  {client.name}
                </h1>
                <p className="mt-4 max-w-2xl text-base leading-7 text-stone-600">
                  Contact information and the invoice timeline for this client in one view.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  href="/clients"
                  className="rounded-full border border-stone-300 px-5 py-2.5 text-sm font-medium text-stone-700 transition hover:border-stone-950 hover:text-stone-950"
                >
                  Back to clients
                </Link>
                <Link
                  href={`/clients/${client.id}/edit`}
                  className="rounded-full bg-[#1f4b99] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#173a77]"
                >
                  Edit client
                </Link>
                <button
                  type="button"
                  onClick={deleteClient}
                  className="rounded-full bg-[#af2f3a] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#8f2530]"
                >
                  Delete client
                </button>
              </div>
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-[1.15fr_1.85fr]">
            <article className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-[0_24px_60px_rgba(33,32,28,0.1)]">
              <p className="text-xs uppercase tracking-[0.35em] text-stone-500">Details</p>
              <dl className="mt-6 space-y-6">
                <div>
                  <dt className="text-sm font-medium text-stone-500">Email</dt>
                  <dd className="mt-2 text-lg text-stone-900">{formatValue(client.email)}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-stone-500">Phone</dt>
                  <dd className="mt-2 text-lg text-stone-900">{formatValue(client.phone)}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-stone-500">Address</dt>
                  <dd className="mt-2 text-lg text-stone-900">{formatValue(client.address)}</dd>
                </div>
              </dl>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href={`/clients/${client.id}/invoices`}
                  className="rounded-full bg-stone-950 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-stone-800"
                >
                  View invoices
                </Link>
                <Link
                  href={`/clients/${client.id}/invoices/create`}
                  className="rounded-full border border-stone-300 px-5 py-2.5 text-sm font-medium text-stone-700 transition hover:border-stone-950 hover:text-stone-950"
                >
                  New invoice
                </Link>
              </div>
            </article>

            <article className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-[0_24px_60px_rgba(33,32,28,0.1)]">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-stone-500">Invoices</p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-tight text-stone-950">
                    Recent billing activity
                  </h2>
                </div>
                <span className="rounded-full bg-stone-100 px-4 py-2 text-sm font-medium text-stone-700">
                  {client.invoices.length} total
                </span>
              </div>

              {client.invoices.length === 0 ? (
                <div className="mt-10 rounded-[1.5rem] border border-dashed border-stone-300 bg-stone-50 px-6 py-14 text-center text-stone-600">
                  No invoices found for this client yet.
                </div>
              ) : (
                <div className="mt-8 overflow-x-auto">
                  <table className="min-w-full divide-y divide-stone-200">
                    <thead className="bg-stone-50 text-left text-xs uppercase tracking-[0.25em] text-stone-500">
                      <tr>
                        <th className="px-4 py-3">Invoice</th>
                        <th className="px-4 py-3">Total</th>
                        <th className="px-4 py-3">Due date</th>
                        <th className="px-4 py-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 bg-white">
                      {client.invoices.map((invoice) => (
                        <tr key={invoice.id} className="transition hover:bg-stone-50/80">
                          <td className="px-4 py-4 text-sm font-medium text-stone-950">#{invoice.id}</td>
                          <td className="px-4 py-4 text-sm text-stone-700">{formatCurrency(invoice.total)}</td>
                          <td className="px-4 py-4 text-sm text-stone-700">{formatDate(invoice.dueDate)}</td>
                          <td className="px-4 py-4 text-sm">
                            <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusClasses(invoice.status)}`}>
                              {invoice.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </article>
          </section>
        </div>
      </AppLayout>
    </>
  )
}
