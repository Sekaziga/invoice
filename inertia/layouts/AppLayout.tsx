import { Link, usePage } from '@inertiajs/react'
import { useEffect, useState, type ReactNode } from 'react'

type AppLayoutProps = {
  title: string
  children: ReactNode
}

type NavItem = {
  label: string
  href: string
  icon: ReactNode
  isActive: (pathname: string) => boolean
}

function DashboardIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-5 w-5 shrink-0">
      <path
        d="M4 13.5V20h6.5v-6.5H4Zm9.5 0V20H20v-6.5h-6.5ZM4 4v6.5h6.5V4H4Zm9.5 0v10.5H20V4h-6.5Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ClientsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-5 w-5 shrink-0">
      <path
        d="M16.5 20a5 5 0 0 0-9 0M12 13.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm7 2.5a4 4 0 0 0-3.5-2.1"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.5 9.5a2.5 2.5 0 1 0-5 0 2.5 2.5 0 0 0 5 0Zm-13 2a2.5 2.5 0 1 0 5 0 2.5 2.5 0 0 0-5 0Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function InvoicesIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-5 w-5 shrink-0">
      <path
        d="M7 4.5h9.5l2 2V19a1.5 1.5 0 0 1-1.5 1.5H7A1.5 1.5 0 0 1 5.5 19V6A1.5 1.5 0 0 1 7 4.5Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M8.5 10h7M8.5 13.5h5.5M14 4.5V7h2.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  )
}

function OverdueIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-5 w-5 shrink-0">
      <path
        d="M12 8.5v4.25m0 3.25h.01M10.2 4.5h3.6L20 11.1v1.8l-6.2 6.6h-3.6L4 12.9v-1.8l6.2-6.6Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-5 w-5">
      <path
        d="M4 7.5h16M4 12h16M4 16.5h16"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-5 w-5">
      <path
        d="M6 6l12 12M18 6 6 18"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}

function LogoMark() {
  return (
    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/10">
      <svg viewBox="0 0 24 24" className="h-6 w-6 text-white" fill="none" aria-hidden="true">
        <path
          d="M6.5 17.5 12 4.5l5.5 13M9 12h6"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  )
}

export default function AppLayout({ title, children }: AppLayoutProps) {
  const { url } = usePage()
  const pathname = url.split('?')[0]
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  useEffect(() => {
    setMobileNavOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!mobileNavOpen) {
      return
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setMobileNavOpen(false)
      }
    }

    window.addEventListener('keydown', onKeyDown)

    return () => window.removeEventListener('keydown', onKeyDown)
  }, [mobileNavOpen])

  const navItems: NavItem[] = [
    {
      label: 'Dashboard',
      href: '/dashboard',
      icon: <DashboardIcon />,
      isActive: (currentPath) => currentPath === '/dashboard',
    },
    {
      label: 'Clients',
      href: '/clients',
      icon: <ClientsIcon />,
      isActive: (currentPath) =>
        currentPath === '/clients' ||
        currentPath === '/clients/create' ||
        (currentPath.startsWith('/clients/') && !currentPath.includes('/invoices') && !currentPath.includes('/overdue')),
    },
    {
      label: 'Invoices',
      href: '/invoices',
      icon: <InvoicesIcon />,
      isActive: (currentPath) => currentPath === '/invoices' || currentPath.includes('/invoices'),
    },
    {
      label: 'Overdue Invoices',
      href: '/overdue',
      icon: <OverdueIcon />,
      isActive: (currentPath) => currentPath === '/overdue' || currentPath.includes('/overdue'),
    },
  ]

  function navLinkClass(isActive: boolean) {
    return [
      'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-200',
      isActive
        ? 'bg-white/10 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]'
        : 'text-slate-300 hover:bg-white/5 hover:text-white',
    ].join(' ')
  }

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900">
      {mobileNavOpen ? (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={() => setMobileNavOpen(false)}
          className="fixed inset-0 z-30 bg-slate-950/40 backdrop-blur-[2px] md:hidden"
        />
      ) : null}

      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 flex-col border-r border-slate-800/80 bg-slate-950 text-white shadow-2xl md:flex">
        <div className="flex h-20 items-center gap-3 px-6">
          <LogoMark />
          <div>
            <p className="text-lg font-semibold tracking-tight">Invoice App</p>
            <p className="text-xs uppercase tracking-[0.28em] text-slate-400">SaaS workspace</p>
          </div>
        </div>

        <nav className="flex-1 px-4 pb-6">
          <p className="px-4 pb-3 text-xs uppercase tracking-[0.28em] text-slate-500">Navigation</p>
          <div className="space-y-1">
            {navItems.map((item) => {
              const active = item.isActive(pathname)

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={navLinkClass(active)}
                  aria-current={active ? 'page' : undefined}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>
        </nav>

        <div className="border-t border-white/10 p-6">
          <div className="rounded-3xl bg-white/5 p-4 ring-1 ring-white/10">
            <p className="text-sm font-medium text-white">Operations team</p>
            <p className="mt-1 text-sm leading-6 text-slate-400">
              Keep billing, collections, and client records in one place.
            </p>
          </div>
        </div>
      </aside>

      <aside
        className={[
          'fixed inset-y-0 left-0 z-40 w-[82vw] max-w-xs border-r border-slate-800/80 bg-slate-950 text-white shadow-2xl transition-transform duration-300 ease-out md:hidden',
          mobileNavOpen ? 'translate-x-0' : '-translate-x-full',
        ].join(' ')}
      >
        <div className="flex h-20 items-center justify-between px-5">
          <div className="flex items-center gap-3">
            <LogoMark />
            <div>
              <p className="text-lg font-semibold tracking-tight">Invoice App</p>
              <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Workspace</p>
            </div>
          </div>

          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => setMobileNavOpen(false)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white transition hover:bg-white/10"
          >
            <CloseIcon />
          </button>
        </div>

        <nav className="flex-1 px-4 pb-6">
          <p className="px-4 pb-3 text-xs uppercase tracking-[0.28em] text-slate-500">Navigation</p>
          <div className="space-y-1">
            {navItems.map((item) => {
              const active = item.isActive(pathname)

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileNavOpen(false)}
                  className={navLinkClass(active)}
                  aria-current={active ? 'page' : undefined}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>
        </nav>
      </aside>

      <div className="md:pl-72">
        <header className="sticky top-0 z-20 border-b border-stone-200/80 bg-white/90 backdrop-blur">
          <div className="flex h-20 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileNavOpen(true)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-stone-200 bg-white text-stone-700 shadow-sm transition hover:border-stone-300 hover:text-stone-950 md:hidden"
                aria-label="Open navigation"
              >
                <MenuIcon />
              </button>

              <div className="min-w-0">
                <p className="text-xs uppercase tracking-[0.28em] text-stone-500">Workspace</p>
                <h1 className="truncate text-lg font-semibold tracking-tight text-stone-950 sm:text-xl">
                  {title}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-medium text-stone-950">Finance team</p>
                <p className="text-xs text-stone-500">Active workspace</p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-stone-950 text-sm font-semibold text-white shadow-sm">
                IA
              </div>
            </div>
          </div>
        </header>

        <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="mx-auto max-w-7xl space-y-6">{children}</div>
        </main>
      </div>
    </div>
  )
}