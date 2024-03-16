import vine from '@vinejs/vine'

/**
 * Validator to validate the payload when creating
 * a new plantation.
 */
export const createPlantationValidator = vine.compile(
  vine.object({
    id_plante: vine.string().exists(async (db, value) => {
      const plante = await db.from('plantes').where('id', value).first()
      return plante
    }),
    date_arrosage: vine.date(),
    id_potager: vine.string().exists(async (db, value) => {
      const potager = await db.from('potagers').where('id', value).first()
      return potager
    }),
    name: vine.string(),
  })
)

export const updatePlantationValidator = vine.compile(
  vine.object({
    id_plante: vine
      .string()
      .exists(async (db, value) => {
        const plante = await db.from('plantes').where('id', value).first()
        return plante
      })
      .optional(),
    name: vine.string().optional(),
  })
)
