import vine from '@vinejs/vine'

/**
 * Validator to validate the payload when creating
 * a new plante.
 */
export const createPlanteValidator = vine.compile(
  vine.object({
    name: vine.string().unique(async (db, value) => {
      const potager = await db.from('plantes').where('name', value).first()
      return !potager
    }),
    icon: vine.file({ extnames: ['png', 'jpg'], size: '10mb' }).optional(),
    delai_recolte: vine.number().min(1),
  })
)
