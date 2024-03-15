import vine from '@vinejs/vine'

/**
 * Validator to validate the payload when creating
 * a new plantation.
 */
export const createPlantationValidator = vine.compile(
  vine.object({
    idPlante: vine.string().exists(async (db, value) => {
      const plante = await db.from('plantes').where('id', value).first()
      return plante
    }),
    dateArrosage: vine.date().optional(),
    idPotager: vine.string().exists(async (db, value) => {
      const potager = await db.from('potagers').where('id', value).first()
      return potager
    }),
    name: vine.string(),
    state: vine.number(),
  })
)
