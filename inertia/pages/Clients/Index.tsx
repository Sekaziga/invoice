import { Head, Link, router } from '@inertiajs/react'
import { useState } from 'react'
import AppLayout from '../../layouts/AppLayout'

type Client = {
  id: number
  name: string
  email: string
  phone: string | null
  address: string | null
}

type ClientsIndexProps = {
  clients: Client[]
}

function formatValue(value: string | null) {
  return value && value.trim() ? value : 'Not provided'
}

export default function ClientsIndex({ clients }: ClientsIndexProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const normalizedQuery = searchQuery.trim().toLowerCase()

  const filteredClients = clients.filter((client) => {
    if (!normalizedQuery) {
      return true
    }

    const searchableValues = [
      `#${client.id}`,
      client.name,
      client.email,
      client.phone ?? '',
      client.address ?? '',
    ]

    return searchableValues.some((value) => value.toLowerCase().includes(normalizedQuery))
  })

  function deleteClient(id: number, name: string) {
    if (!window.confirm(`Delete ${name}? This cannot be undone.`)) {
      return
    }

    router.delete(`/clients/${id}`)
  }

  return (
    <>
      <Head title="Clients" />

      <AppLayout title="Clients">
        <div className="space-y-6">
          <section className="mb-8 overflow-hidden rounded-[2rem] border border-white/70 bg-white/80 p-8 shadow-[0_30px_80px_rgba(33,32,28,0.12)] backdrop-blur">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-xs uppercase tracking-[0.35em] text-stone-500">Client directory</p>
                <h1 className="mt-3 text-4xl font-semibold tracking-tight text-stone-950 md:text-5xl">
                  Relationships, billing context, and quick actions in one place.
                </h1>
                <p className="mt-4 text-base leading-7 text-stone-600">
                  Review every client, jump to invoices, and manage records without leaving the
                  Inertia flow.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center rounded-full border border-stone-300 px-5 py-2.5 text-sm font-medium text-stone-700 transition hover:border-stone-950 hover:text-stone-950"
                >
                  Dashboard
                </Link>
                <Link
                  href="/clients/create"
                  className="inline-flex items-center rounded-full bg-stone-950 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-stone-800"
                >
                  Add client
                </Link>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 rounded-3xl border border-stone-200 bg-stone-50/80 p-4 sm:flex-row sm:items-center sm:justify-between">
              <label htmlFor="client-search" className="block flex-1">
                <span className="mb-2 block text-xs uppercase tracking-[0.28em] text-stone-500">
                  Search clients
                </span>
                <input
                  id="client-search"
                  type="search"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search by name, email, phone, or address"
                  className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-stone-950 focus:ring-2 focus:ring-stone-200"
                />
              </label>

              <div className="flex items-center gap-3 sm:pt-7">
                <span className="rounded-full bg-white px-4 py-2 text-sm font-medium text-stone-700 ring-1 ring-stone-200">
                  {filteredClients.length} of {clients.length}
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

          <section className="overflow-hidden rounded-[2rem] border border-stone-200/80 bg-white shadow-[0_24px_60px_rgba(33,32,28,0.1)]">
            {clients.length === 0 ? (
              <div className="px-8 py-20 text-center">
                <p className="text-sm uppercase tracking-[0.35em] text-stone-400">No clients yet</p>
                <h2 className="mt-4 text-3xl font-semibold text-stone-950">Start your first client file</h2>
                <p className="mx-auto mt-3 max-w-xl text-stone-600">
                  Create a client to track contact details and move directly into invoice management.
                </p>
                <Link
                  href="/clients/create"
                  className="mt-8 inline-flex items-center rounded-full bg-stone-950 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-stone-800"
                >
                  Create client
                </Link>
              </div>
            ) : filteredClients.length === 0 ? (
              <div className="px-8 py-20 text-center">
                <p className="text-sm uppercase tracking-[0.35em] text-stone-400">No matches</p>
                <h2 className="mt-4 text-3xl font-semibold text-stone-950">No clients match your search</h2>
                <p className="mx-auto mt-3 max-w-xl text-stone-600">
                  Try a client name, email, phone, or address.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-stone-200">
                  <thead className="bg-stone-50 text-left text-xs uppercase tracking-[0.25em] text-stone-500">
                    <tr>
                      <th className="px-6 py-4">Client</th>
                      <th className="px-6 py-4">Email</th>
                      <th className="px-6 py-4">Phone</th>
                      <th className="px-6 py-4">Address</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 bg-white">
                    {filteredClients.map((client) => (
                      <tr key={client.id} className="transition hover:bg-stone-50/80">
                        <td className="px-6 py-5">
                          <div>
                            <p className="text-sm font-semibold text-stone-950">{client.name}</p>
                            <p className="mt-1 text-sm text-stone-500">Client #{client.id}</p>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-sm text-stone-600">{formatValue(client.email)}</td>
                        <td className="px-6 py-5 text-sm text-stone-600">{formatValue(client.phone)}</td>
                        <td className="px-6 py-5 text-sm text-stone-600">{formatValue(client.address)}</td>
                        <td className="px-6 py-5">
                          <div className="flex flex-wrap justify-end gap-2">
                            <Link
                              href={`/clients/${client.id}`}
                              className="rounded-full border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 transition hover:border-stone-950 hover:text-stone-950"
                            >
                              View
                            </Link>
                            <Link
                              href={`/clients/${client.id}/edit`}
                              className="rounded-full bg-[#1f4b99] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#173a77]"
                            >
                              Edit
                            </Link>
                            <button
                              type="button"
                              onClick={() => deleteClient(client.id, client.name)}
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
