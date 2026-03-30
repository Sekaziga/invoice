import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { loginValidator } from '#validators/login_validator'
import { registerValidator } from '#validators/register_validator'

export default class AuthController {
  public async showLogin({ inertia }: HttpContext) {
    return inertia.render('Auth/Login')
  }

  public async showRegister({ inertia }: HttpContext) {
    return inertia.render('Auth/Register')
  }

  public async login({ auth, request, response, session }: HttpContext) {
    const payload = await request.validateUsing(loginValidator)

    try {
      const user = await User.verifyCredentials(payload.email, payload.password)
      await auth.use('web').login(user)

      return response.redirect('/dashboard')
    } catch {
      session.flash('errors', {
        email: 'Invalid email or password',
      })

      return response.redirect().back()
    }
  }

  public async register({ auth, request, response, session }: HttpContext) {
    const payload = await request.validateUsing(registerValidator)

    if (payload.password !== payload.passwordConfirmation) {
      session.flash('errors', {
        passwordConfirmation: 'Passwords do not match',
      })

      return response.redirect().back()
    }

    const existingUser = await User.findBy('email', payload.email)

    if (existingUser) {
      session.flash('errors', {
        email: 'An account with this email already exists',
      })

      return response.redirect().back()
    }

    const user = await User.create({
      fullName: payload.fullName,
      email: payload.email,
      password: payload.password,
    })

    await auth.use('web').login(user)

    return response.redirect('/dashboard')
  }

  public async logout({ auth, response }: HttpContext) {
    await auth.use('web').logout()

    return response.redirect('/login')
  }
}
