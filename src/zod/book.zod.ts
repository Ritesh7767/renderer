import * as zod from 'zod'

export const registerBookValidation = zod.object({
    title: zod.string(),
    content: zod.string()
})