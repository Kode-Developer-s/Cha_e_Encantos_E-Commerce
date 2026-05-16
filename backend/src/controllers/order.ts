import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { AuthRequest } from '../middleware/auth'

const prisma = new PrismaClient()

export const getAllOrders = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Não autenticado' })
    }

    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      include: { items: { include: { product: true } }, payment: true },
    })

    res.json(orders)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar pedidos' })
  }
}

export const getOrderById = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Não autenticado' })
    }

    const { id } = req.params
    const order = await prisma.order.findUnique({
      where: { id },
      include: { items: { include: { product: true } }, payment: true },
    })

    if (!order) {
      return res.status(404).json({ error: 'Pedido não encontrado' })
    }

    if (order.userId !== req.user.id) {
      return res.status(403).json({ error: 'Acesso negado' })
    }

    res.json(order)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar pedido' })
  }
}

export const createOrder = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Não autenticado' })
    }

    const { items } = req.body

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Nenhum item no pedido' })
    }

    let total = 0
    const orderItems = []

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      })

      if (!product) {
        return res.status(404).json({ error: `Produto ${item.productId} não encontrado` })
      }

      total += product.price * item.quantity
      orderItems.push({
        productId: product.id,
        quantity: item.quantity,
        price: product.price,
      })
    }

    const order = await prisma.order.create({
      data: {
        userId: req.user.id,
        total,
        status: 'pending',
        items: {
          createMany: {
            data: orderItems,
          },
        },
      },
      include: { items: { include: { product: true } } },
    })

    res.status(201).json(order)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar pedido' })
  }
}
