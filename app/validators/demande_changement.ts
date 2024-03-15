import vine from '@vinejs/vine'

/**
 * Validator to validate the payload when creating
 * a new demande changement.
 */
export const createDemandeChangementValidator = vine.compile(
  vine.object({
    user_creatorId: vine.number().exists(async (db, value) => {
      const user = await db.from('user').where('id', value).first()
      return !user
    }),
    user_targetId: vine.number().exists(async (db, value) => {
      const user = await db.from('user').where('id', value).first()
      return !user
    }),
    planteId: vine.number().exists(async (db, value) => {
      const plante = await db.from('plante').where('id', value).first()
      return !plante
    }),
    status: vine.number(),
    field: vine.string(),
    old_value: vine.string(),
    new_value: vine.string(),
  })
)
