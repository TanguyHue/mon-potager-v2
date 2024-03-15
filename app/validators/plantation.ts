import vine from '@vinejs/vine'

/**
 * Validator to validate the payload when creating
 * a new plantation.
 */
export const createPlantationValidator = vine.compile(
  vine.object({
    idPlante: vine.number().exists(async (db, value) => {
      const plante = await db.from('plantes').where('id', value).first()
      return !plante
    }),
    dateArrosage: vine.date().optional(),
    idPotager: vine.number().exists(async (db, value) => {
      const potager = await db.from('potager').where('id', value).first()
      return !potager
    }),
    name: vine.string(),
    state: vine.number(),
  })
)

/**
 * Validator to validate the payload when updating
 * an existing plantation.
 */
export const updatePlantationValidator = vine.compile(vine.object({}))
