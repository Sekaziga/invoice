import { Head, Link, useForm } from '@inertiajs/react'

type RegisterForm = {
  fullName: string
  email: string
  password: string
  passwordConfirmation: string
}

export default function Register() {
  const form = useForm<RegisterForm>({
    fullName: '',
    email: '',
    password: '',
    passwordConfirmation: '',
  })

  function submit() {
    form.post('/register', {
      onFinish: () => {
        form.reset('password', 'passwordConfirmation')
      },
    })
  }

  return (
    <>
      <Head title="Register" />

      <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(15,23,42,0.08),_transparent_40%),linear-gradient(180deg,_#f8fafc_0%,_#e7e5e4_100%)] px-4 py-10 text-stone-900 sm:px-6 lg:px-8">
        <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl items-center justify-center">
          <div className="grid w-full overflow-hidden rounded-[2rem] border border-white/70 bg-white/80 shadow-[0_30px_80px_rgba(33,32,28,0.12)] backdrop-blur lg:grid-cols-[1.1fr_0.9fr]">
            <section className="hidden bg-stone-900 px-10 py-12 text-white lg:block">
              <p className="text-xs uppercase tracking-[0.35em] text-stone-400">Invoice Reminder</p>
              <h1 className="mt-6 max-w-md text-5xl font-semibold tracking-tight">
                Create your workspace login and start tracking invoices.
              </h1>
              <p className="mt-6 max-w-md text-base leading-7 text-stone-300">
                Registration creates your user account and immediately signs you in with a session.
              </p>
            </section>

            <section className="px-6 py-10 sm:px-10">
              <div className="mx-auto max-w-md">
                <p className="text-xs uppercase tracking-[0.35em] text-stone-500">Create account</p>
                <h2 className="mt-3 text-4xl font-semibold tracking-tight text-stone-950">
                  Register
                </h2>
                <p className="mt-4 text-base leading-7 text-stone-600">
                  Fill in your details to create a new account for this app.
                </p>

                <form
                  onSubmit={(event) => {
                    event.preventDefault()
                    submit()
                  }}
                  className="mt-10 space-y-5"
                >
                  <div>
                    <label
                      htmlFor="fullName"
                      className="mb-2 block text-sm font-medium text-stone-700"
                    >
                      Full name
                    </label>
                    <input
                      id="fullName"
                      type="text"
                      value={form.data.fullName}
                      onChange={(event) => form.setData('fullName', event.target.value)}
                      className="w-full rounded-2xl border border-stone-300 bg-stone-50 px-4 py-3 text-stone-900 outline-none transition focus:border-stone-900 focus:bg-white"
                      autoComplete="name"
                      required
                    />
                    {form.errors.fullName ? (
                      <p className="mt-2 text-sm text-rose-600">{form.errors.fullName}</p>
                    ) : null}
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-medium text-stone-700"
                    >
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={form.data.email}
                      onChange={(event) => form.setData('email', event.target.value)}
                      className="w-full rounded-2xl border border-stone-300 bg-stone-50 px-4 py-3 text-stone-900 outline-none transition focus:border-stone-900 focus:bg-white"
                      autoComplete="email"
                      required
                    />
                    {form.errors.email ? (
                      <p className="mt-2 text-sm text-rose-600">{form.errors.email}</p>
                    ) : null}
                  </div>

                  <div>
                    <label
                      htmlFor="password"
                      className="mb-2 block text-sm font-medium text-stone-700"
                    >
                      Password
                    </label>
                    <input
                      id="password"
                      type="password"
                      value={form.data.password}
                      onChange={(event) => form.setData('password', event.target.value)}
                      className="w-full rounded-2xl border border-stone-300 bg-stone-50 px-4 py-3 text-stone-900 outline-none transition focus:border-stone-900 focus:bg-white"
                      autoComplete="new-password"
                      required
                    />
                    {form.errors.password ? (
                      <p className="mt-2 text-sm text-rose-600">{form.errors.password}</p>
                    ) : null}
                  </div>

                  <div>
                    <label
                      htmlFor="passwordConfirmation"
                      className="mb-2 block text-sm font-medium text-stone-700"
                    >
                      Confirm password
                    </label>
                    <input
                      id="passwordConfirmation"
                      type="password"
                      value={form.data.passwordConfirmation}
                      onChange={(event) => form.setData('passwordConfirmation', event.target.value)}
                      className="w-full rounded-2xl border border-stone-300 bg-stone-50 px-4 py-3 text-stone-900 outline-none transition focus:border-stone-900 focus:bg-white"
                      autoComplete="new-password"
                      required
                    />
                    {form.errors.passwordConfirmation ? (
                      <p className="mt-2 text-sm text-rose-600">
                        {form.errors.passwordConfirmation}
                      </p>
                    ) : null}
                  </div>

                  <button
                    type="submit"
                    disabled={form.processing}
                    className="inline-flex w-full items-center justify-center rounded-full bg-stone-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {form.processing ? 'Creating account...' : 'Create account'}
                  </button>
                </form>

                <p className="mt-6 text-sm text-stone-600">
                  Already have an account?{' '}
                  <Link
                    href="/login"
                    className="font-medium text-stone-950 underline-offset-4 hover:underline"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  )
}
