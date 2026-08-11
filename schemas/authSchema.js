import { z } from 'zod';

export const authSchema =
    z.object({
        username: z.string().min(3, 'Username deve ter pelo menos 3 caracteres'),
        password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
    });
