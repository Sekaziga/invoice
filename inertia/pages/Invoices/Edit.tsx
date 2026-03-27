import { Head, Link, useForm } from '@inertiajs/react'
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

type InvoiceEditProps = {
  client: ClientSummary
  invoice: Invoice | null
}

type InvoiceForm = {
  amount: string
  dueDate: string
  status: string
}

const statusOptions = ['pending', 'paid', 'overdue']

export default function InvoiceEdit({ client, invoice }: InvoiceEditProps) {
  const isEditing = Boolean(invoice)
  const form = useForm<InvoiceForm>({
    amount: invoice ? String(invoice.amount) : '',
    dueDate: invoice?.dueDate ?? '',
    status: invoice?.status ?? 'pending',
  })

  function submit() {
    if (isEditing && invoice) {
      form.put(`/clients/${client.id}/invoices/${invoice.id}`)
      return
    }

    form.post(`/clients/${client.id}/invoices`)
  }

  return (
    <>
      <Head title={isEditing ? `Edit invoice #${invoice?.id}` : `Create invoice · ${client.name}`} />

      <AppLayout title={isEditing ? `Edit invoice #${invoice?.id}` : `Create invoice · ${client.name}`}>
        <div className="space-y-6">
          <section className="mb-8 overflow-hidden rounded-[2rem] border border-white/70 bg-white/85 p-8 shadow-[0_30px_80px_rgba(33,32,28,0.12)] backdrop-blur">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-stone-500">Invoice form</p>
                <h1 className="mt-3 text-4xl font-semibold tracking-tight text-stone-950 md:text-5xl">
                  {isEditing ? `Edit invoice #${invoice?.id}` : `Create invoice for ${client.name}`}
                </h1>
                <p className="mt-4 max-w-2xl text-base leading-7 text-stone-600">
                  Capture the amount, due date, and payment state with the same workflow used by the
                  rest of the Inertia client area.
                </p>
              </div>

              <Link
                href={isEditing && invoice ? `/clients/${client.id}/invoices/${invoice.id}` : `/clients/${client.id}/invoices`}
                className="inline-flex items-center rounded-full border border-stone-300 px-5 py-2.5 text-sm font-medium text-stone-700 transition hover:border-stone-950 hover:text-stone-950"
              >
                {isEditing ? 'Back to invoice' : 'Back to invoices'}
              </Link>
            </div>
          </section>

          <section className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-[0_24px_60px_rgba(33,32,28,0.1)]">
            <div className="mb-8 rounded-[1.5rem] bg-stone-50 px-5 py-4 text-sm text-stone-600">
              Client: <span className="font-semibold text-stone-950">{client.name}</span>
            </div>

            <form
              onSubmit={(event) => {
                event.preventDefault()
                submit()
              }}
              className="grid gap-6 md:grid-cols-2"
            >
              <div>
                <label htmlFor="amount" className="mb-2 block text-sm font-medium text-stone-700">
                  Amount
                </label>
                <input
                  id="amount"
                  type="number"
                  min="0.01"
                  step="0.01"
                  required
                  value={form.data.amount}
                  onChange={(event) => form.setData('amount', event.target.value)}
                  className="w-full rounded-2xl border border-stone-300 bg-stone-50 px-4 py-3 text-stone-900 outline-none transition focus:border-stone-900 focus:bg-white"
                />
                {form.errors.amount ? <p className="mt-2 text-sm text-rose-600">{form.errors.amount}</p> : null}
              </div>

              <div>
                <label htmlFor="dueDate" className="mb-2 block text-sm font-medium text-stone-700">
                  Due date
                </label>
                <input
                  id="dueDate"
                  type="date"
                  required
                  value={form.data.dueDate}
                  onChange={(event) => form.setData('dueDate', event.target.value)}
                  className="w-full rounded-2xl border border-stone-300 bg-stone-50 px-4 py-3 text-stone-900 outline-none transition focus:border-stone-900 focus:bg-white"
                />
                {form.errors.dueDate ? <p className="mt-2 text-sm text-rose-600">{form.errors.dueDate}</p> : null}
              </div>

              <div className="md:col-span-2">
                <label htmlFor="status" className="mb-2 block text-sm font-medium text-stone-700">
                  Status
                </label>
                <select
                  id="status"
                  value={form.data.status}
                  onChange={(event) => form.setData('status', event.target.value)}
                  className="w-full rounded-2xl border border-stone-300 bg-stone-50 px-4 py-3 text-stone-900 outline-none transition focus:border-stone-900 focus:bg-white"
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
                {form.errors.status ? <p className="mt-2 text-sm text-rose-600">{form.errors.status}</p> : null}
              </div>

              <div className="md:col-span-2 flex flex-wrap justify-end gap-3 pt-2">
                <Link
                  href={isEditing && invoice ? `/clients/${client.id}/invoices/${invoice.id}` : `/clients/${client.id}/invoices`}
                  className="inline-flex items-center rounded-full border border-stone-300 px-5 py-2.5 text-sm font-medium text-stone-700 transition hover:border-stone-950 hover:text-stone-950"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={form.processing}
                  className="inline-flex items-center rounded-full bg-stone-950 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {form.processing ? 'Saving...' : isEditing ? 'Update invoice' : 'Create invoice'}
                </button>
              </div>
            </form>
          </section>
        </div>
      </AppLayout>
    </>
  )
}