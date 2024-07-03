import * as zod from 'zod'

export const userRegisterValidation = zod.object({
    fullname: zod.string(),
    username: zod.string(),
    email: zod.string().email(),
    password: zod.string().min(8),
    role: zod.enum(["CREATOR", 'VIEW ALL'])
})

export const userLoginValidation = userRegisterValidation.pick({
    username: true,
    email: true,
    password: true
}).extend({
    username: zod.string().optional(),
    email: zod.string().optional()
})