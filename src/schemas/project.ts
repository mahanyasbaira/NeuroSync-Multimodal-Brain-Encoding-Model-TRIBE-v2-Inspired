import { z } from 'zod'

export const createProjectSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be under 100 characters'),
  description: z.string().max(500, 'Description must be under 500 characters').optional(),
})

export type CreateProjectInput = z.infer<typeof createProjectSchema>
