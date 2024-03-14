import vine from '@vinejs/vine'

/**
 * Validator to validate the payload when creating
 * a new demande changement.
 */
export const createDemandeChangementValidator = vine.compile(
  vine.object({
    user_creatorId: vine.number(),
    user_targetId: vine.number(),
    planteId: vine.number(),
    status: vine.number(),
    field: vine.string(),
    old_value: vine.string(),
    new_value: vine.string(),
  })
)
