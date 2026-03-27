import { Head, Link, useForm } from '@inertiajs/react'
import AppLayout from '../../layouts/AppLayout'

type Client = {
  id: number
  name: string
  email: string
  phone: string | null
  address: string | null
}

type ClientEditProps = {
  client: Client | null
}

type ClientForm = {
  name: string
  email: string
  phone: string
  address: string
}

export default function ClientEdit({ client }: ClientEditProps) {
  const isEditing = Boolean(client)

  const form = useForm<ClientForm>({
    name: client?.name ?? '',
    email: client?.email ?? '',
    phone: client?.phone ?? '',
    address: client?.address ?? '',
  })

  function submit() {
    if (isEditing && client) {
      form.put(`/clients/${client.id}`)
      return
    }

    form.post('/clients')
  }

  return (
    <>
      <Head title={isEditing ? `Edit ${client?.name}` : 'Create client'} />

      <AppLayout title={isEditing ? `Edit ${client?.name}` : 'Create client'}>
        <div className="space-y-6">
          <section className="mb-8 overflow-hidden rounded-[2rem] border border-white/70 bg-white/85 p-8 shadow-[0_30px_80px_rgba(33,32,28,0.12)] backdrop-blur">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-stone-500">Client form</p>
                <h1 className="mt-3 text-4xl font-semibold tracking-tight text-stone-950 md:text-5xl">
                  {isEditing ? 'Refine the client record' : 'Create a new client profile'}
                </h1>
                <p className="mt-4 max-w-2xl text-base leading-7 text-stone-600">
                  Keep contact details accurate so invoice reminders and account history stay easy to
                  manage.
                </p>
              </div>

              <Link
                href={isEditing && client ? `/clients/${client.id}` : '/clients'}
                className="inline-flex items-center rounded-full border border-stone-300 px-5 py-2.5 text-sm font-medium text-stone-700 transition hover:border-stone-950 hover:text-stone-950"
              >
                {isEditing ? 'Back to client' : 'Back to clients'}
              </Link>
            </div>
          </section>

          <section className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-[0_24px_60px_rgba(33,32,28,0.1)]">
            <form
              onSubmit={(event) => {
                event.preventDefault()
                submit()
              }}
              className="grid gap-6 md:grid-cols-2"
            >
              <div className="md:col-span-2">
                <label htmlFor="name" className="mb-2 block text-sm font-medium text-stone-700">
                  Full name
                </label>
                <input
                  id="name"
                  type="text"
                  value={form.data.name}
                  onChange={(event) => form.setData('name', event.target.value)}
                  className="w-full rounded-2xl border border-stone-300 bg-stone-50 px-4 py-3 text-stone-900 outline-none transition focus:border-stone-900 focus:bg-white"
                  required
                />
                {form.errors.name ? (
                  <p className="mt-2 text-sm text-rose-600">{form.errors.name}</p>
                ) : null}
              </div>

              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium text-stone-700">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={form.data.email}
                  onChange={(event) => form.setData('email', event.target.value)}
                  className="w-full rounded-2xl border border-stone-300 bg-stone-50 px-4 py-3 text-stone-900 outline-none transition focus:border-stone-900 focus:bg-white"
                />
                {form.errors.email ? (
                  <p className="mt-2 text-sm text-rose-600">{form.errors.email}</p>
                ) : null}
              </div>

              <div>
                <label htmlFor="phone" className="mb-2 block text-sm font-medium text-stone-700">
                  Phone
                </label>
                <input
                  id="phone"
                  type="text"
                  value={form.data.phone}
                  onChange={(event) => form.setData('phone', event.target.value)}
                  className="w-full rounded-2xl border border-stone-300 bg-stone-50 px-4 py-3 text-stone-900 outline-none transition focus:border-stone-900 focus:bg-white"
                />
                {form.errors.phone ? (
                  <p className="mt-2 text-sm text-rose-600">{form.errors.phone}</p>
                ) : null}
              </div>

              <div className="md:col-span-2">
                <label htmlFor="address" className="mb-2 block text-sm font-medium text-stone-700">
                  Address
                </label>
                <textarea
                  id="address"
                  value={form.data.address}
                  onChange={(event) => form.setData('address', event.target.value)}
                  className="min-h-32 w-full rounded-2xl border border-stone-300 bg-stone-50 px-4 py-3 text-stone-900 outline-none transition focus:border-stone-900 focus:bg-white"
                />
                {form.errors.address ? (
                  <p className="mt-2 text-sm text-rose-600">{form.errors.address}</p>
                ) : null}
              </div>

              <div className="md:col-span-2 flex flex-wrap justify-end gap-3 pt-2">
                <Link
                  href={isEditing && client ? `/clients/${client.id}` : '/clients'}
                  className="inline-flex items-center rounded-full border border-stone-300 px-5 py-2.5 text-sm font-medium text-stone-700 transition hover:border-stone-950 hover:text-stone-950"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={form.processing}
                  className="inline-flex items-center rounded-full bg-stone-950 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {form.processing ? 'Saving...' : isEditing ? 'Update client' : 'Create client'}
                </button>
              </div>
            </form>
          </section>
        </div>
      </AppLayout>
    </>
  )
}
