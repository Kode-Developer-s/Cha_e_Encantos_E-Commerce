import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany()
    res.json(products)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar produtos' })
  }
}

export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const product = await prisma.product.findUnique({ where: { id } })

    if (!product) {
      return res.status(404).json({ error: 'Produto não encontrado' })
    }

    res.json(product)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar produto' })
  }
}

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, category, tag, price, weight, ingredients, description, image } = req.body

    const product = await prisma.product.create({
      data: {
        name,
        category,
        tag,
        price,
        weight,
        ingredients,
        description,
        image,
      },
    })

    res.status(201).json(product)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar produto' })
  }
}
