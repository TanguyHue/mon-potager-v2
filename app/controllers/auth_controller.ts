import { createAccount, loginAccount, updateAccount } from '#validators/auth'
import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { unlink, writeFile } from 'node:fs'
import { toPng } from 'jdenticon'
import app from '@adonisjs/core/services/app'
import { cuid } from '@adonisjs/core/helpers'

export default class AuthController {
  register({ view }: HttpContext) {
    return view.render('auth/register')
  }

  login({ view, session }: HttpContext) {
    console.log(session.flashMessages.all())
    return view.render('auth/login', {
      errors: session.flashMessages.get('errorsBag'),
    })
  }

  async logout({ response, auth }: HttpContext) {
    await auth.use('web').logout()
    return response.redirect().toRoute('home')
  }

  async handleLogin({ request, auth, response }: HttpContext) {
    const { email, password } = await request.validateUsing(loginAccount)
    const user = await User.verifyCredentials(email, password)
    await auth.use('web').login(user)
    return response.redirect().toRoute('admin.dashboard')
  }

  async handleRegister({ request, response, auth }: HttpContext) {
    const { email, password, username, thumbnail } = await request.validateUsing(createAccount)
    if (!thumbnail) {
      const png = toPng(username, 100)
      writeFile(`public/users/${username}.png`, png, (err) => {
        if (err) throw err
        console.log('The file has been saved!')
      })
    } else {
      await thumbnail.move(app.makePath('public/users/'), {
        name: `${cuid()}.${thumbnail.extname}`,
      })
    }

    const file = `/users/${thumbnail ? thumbnail.fileName : username + '.png'}`
    const user = await User.create({ email, password, username, thumbnail: file })
    await auth.use('web').login(user)
    return response.redirect().toRoute('admin.dashboard')
  }

  async handleUpdate({ request, response, auth }: HttpContext) {
    const { email, password, username, thumbnail } = await request.validateUsing(updateAccount)
    const user = auth.user!
    if (thumbnail) {
      user.thumbnail ||
        unlink(app.makePath(`public/users/${user.thumbnail}`), (err) => {
          if (err) throw err
          console.log('path/file.txt was deleted')
        })
      await thumbnail.move(app.makePath('public/users/'), {
        name: `${cuid()}.${thumbnail.extname}`,
      })
      user.thumbnail = `/users/${thumbnail.fileName}`
    }
    user.email = email ?? user.email
    user.password = password ?? user.password
    user.username = username ?? user.username
    await user.save()
    return response.redirect().back()
  }
}
