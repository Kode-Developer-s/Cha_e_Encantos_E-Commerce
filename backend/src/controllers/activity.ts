import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const getAllActivities = async (req: Request, res: Response) => {
  try {
    const activities = await prisma.activity.findMany({
      include: {
        slots: true,
      },
    })
    res.json(activities)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar atividades' })
  }
}

export const getActivityById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const activity = await prisma.activity.findUnique({
      where: { id },
      include: { slots: true },
    })

    if (!activity) {
      return res.status(404).json({ error: 'Atividade não encontrada' })
    }

    res.json(activity)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar atividade' })
  }
}

export const createActivity = async (req: Request, res: Response) => {
  try {
    const { title, duration, price, description } = req.body

    const activity = await prisma.activity.create({
      data: {
        title,
        duration,
        price,
        description,
      },
    })

    res.status(201).json(activity)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar atividade' })
  }
}
