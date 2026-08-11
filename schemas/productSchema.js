import { z } from 'zod';

export const productSchema = z.object({
    name: z.string().min(1, 'O nome do produto é obrigatório'),
    price: z.number().nonnegative('O preço do produto deve ser maior ou igual a 0'),
    stock: z.number().int('O quantidade deve ser um numero inteiro e maior ou igual a zero').nonnegative('O estoque deve ser um número inteiro não negativo')
});