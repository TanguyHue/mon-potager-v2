import vine from '@vinejs/vine'

/**
 * Validator to validate the payload when creating
 * a new auth.
 */
export const createAccount = vine.compile(
  vine.object({
    username: vine
      .string()
      .alphaNumeric()
      .unique(async (db, value) => {
        const user = await db.from('users').where('username', value).first()
        return !user
      }),
    password: vine.string().minLength(8).confirmed({ confirmationField: 'password_confirmation' }),
    email: vine
      .string()
      .email()
      .unique(async (db, value) => {
        const user = await db.from('users').where('email', value).first()
        return !user
      }),
    thumbnail: vine.file({ extnames: ['png', 'jpg'], size: '10mb' }).optional(),
  })
)

export const updateAccount = vine.compile(
  vine.object({
    username: vine
      .string()
      .alphaNumeric()
      .unique(async (db, value, field) => {
        const user = await db.from('users').where('username', value).first()
        return !user || user.id === field.meta.userId
      })
      .optional(),
    email: vine
      .string()
      .email()
      .unique(async (db, value, field) => {
        const user = await db.from('users').where('email', value).first()
        return !user || user.id === field.meta.userId
      })
      .optional(),
    password: vine
      .string()
      .minLength(8)
      .confirmed({ confirmationField: 'password_confirmation' })
      .optional(),
    thumbnail: vine.file({ extnames: ['png', 'jpg'], size: '10mb' }).optional(),
  })
)

export const loginAccount = vine.compile(
  vine.object({
    email: vine.string().email(),
    password: vine.string(),
  })
)
