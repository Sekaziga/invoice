import vine from '@vinejs/vine'

export const registerValidator = vine.compile(
  vine.object({
    fullName: vine.string().trim().minLength(2).maxLength(255),
    email: vine.string().trim().email(),
    password: vine.string().minLength(8).maxLength(255),
    passwordConfirmation: vine.string().minLength(8).maxLength(255),
  })
)
