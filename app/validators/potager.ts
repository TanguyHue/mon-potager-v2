import vine from '@vinejs/vine'

/**
 * Validator to validate the payload when creating
 * a new potager.
 */
export const createPotager = vine.compile(
  vine.object({
    name: vine.string().unique(async (db, value, field) => {
      const potager = await db
        .from('potagers')
        .where('name', value)
        .where('user_id', field.meta.userId)
        .first()
      return !potager
    }),
    description: vine.string().maxLength(180).optional(),
    longueur: vine.number(),
    largeur: vine.number(),
  })
)
