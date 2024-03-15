import vine from '@vinejs/vine'

/**
 * Validator to validate the payload when creating
 * a new demande changement.
 */
export const createDemandeChangementValidator = vine.compile(
  vine.object({
    user_creatorId: vine.string().exists(async (db, value) => {
      const user = await db.from('users').where('id', value).first()
      return user
    }),
    user_targetId: vine.string().exists(async (db, value) => {
      const user = await db.from('users').where('id', value).first()
      return user
    }),
    planteId: vine.string().exists(async (db, value) => {
      const plante = await db.from('plantes').where('id', value).first()
      return plante
    }),
    status: vine.number(),
    field: vine.string(),
    old_value: vine.string(),
    new_value: vine.string(),
  })
)
