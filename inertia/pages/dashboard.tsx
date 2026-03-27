import { Head, Link } from '@inertiajs/react'
import AppLayout from '../layouts/AppLayout'

type DashboardProps = {
  totalInvoices: number
  paidInvoices: number
  overdueInvoices: number
}

export default function Dashboard({
  totalInvoices,
  paidInvoices,
  overdueInvoices,
}: DashboardProps) {
  const cards = [
    {
      label: 'Total invoices',
      value: totalInvoices,
      tone: 'from-sky-500 to-cyan-400',
    },
    {
      label: 'Paid invoices',
      value: paidInvoices,
      tone: 'from-emerald-500 to-lime-400',
    },
    {
      label: 'Overdue invoices',
      value: overdueInvoices,
      tone: 'from-rose-500 to-orange-400',
    },
  ]

  return (
    <>
      <Head title="Dashboard" />

      <AppLayout title="Dashboard">
        <section className="grid gap-6 xl:grid-cols-[1.35fr_0.95fr]">
          <article className="overflow-hidden rounded-3xl border border-stone-200 bg-white p-8 shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
            <p className="text-xs uppercase tracking-[0.35em] text-stone-500">Overview</p>
            <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
              Keep invoices, clients, and collections in one calm workspace.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-stone-600">
              Monitor invoice volume, spot overdue balances quickly, and jump into client records without leaving the dashboard.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/clients"
                className="inline-flex items-center justify-center rounded-full bg-stone-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-stone-800"
              >
                View clients
              </Link>
              <Link
                href="/overdue"
                className="inline-flex items-center justify-center rounded-full border border-stone-300 px-5 py-3 text-sm font-medium text-stone-700 transition hover:border-stone-950 hover:text-stone-950"
              >
                Open overdue report
              </Link>
            </div>
          </article>

          <article className="rounded-3xl border border-stone-200 bg-[linear-gradient(180deg,#0f172a_0%,#1e293b_100%)] p-8 text-white shadow-[0_24px_60px_rgba(15,23,42,0.14)]">
            <p className="text-xs uppercase tracking-[0.35em] text-slate-300">At a glance</p>
            <div className="mt-8 space-y-4">
              <div className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3 ring-1 ring-white/10">
                <span className="text-sm text-slate-300">Total invoices</span>
                <span className="text-2xl font-semibold">{totalInvoices}</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3 ring-1 ring-white/10">
                <span className="text-sm text-slate-300">Paid invoices</span>
                <span className="text-2xl font-semibold text-emerald-300">{paidInvoices}</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3 ring-1 ring-white/10">
                <span className="text-sm text-slate-300">Overdue invoices</span>
                <span className="text-2xl font-semibold text-rose-300">{overdueInvoices}</span>
              </div>
            </div>

            <p className="mt-8 text-sm leading-6 text-slate-300">
              Use the sidebar to move between client records, billing views, and overdue collections without losing context.
            </p>
          </article>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {cards.map((card) => (
            <article
              key={card.label}
              className="rounded-3xl border border-stone-200 bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.06)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_50px_rgba(15,23,42,0.1)]"
            >
              <div className={`mb-6 h-2 w-24 rounded-full bg-gradient-to-r ${card.tone}`} />
              <p className="text-sm text-stone-500">{card.label}</p>
              <p className="mt-3 text-5xl font-semibold tracking-tight text-stone-950">{card.value}</p>
              <p className="mt-3 text-sm text-stone-500">{card.note}</p>
            </article>
          ))}
        </section>
      </AppLayout>
    </>
  )
}