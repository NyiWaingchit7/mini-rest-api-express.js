import express, { Request, Response } from "express";
import { prisma } from "../utils/db";
export const BookRouter = express.Router();
//get all book
BookRouter.get("/", async (req: Request, res: Response) => {
  try {
    const books = await prisma.book.findMany({
      select: {
        id: true,
        title: true,
        is_fiction: true,
        date_public: true,
        author: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
          },
        },
      },
    });
    res.status(200).json(books);
  } catch (err: any) {
    res.status(405).send(err.message);
  }
});
//get one book on id
BookRouter.get("/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  try {
    const book = await prisma.book.findFirst({ where: { id } });
    if (!book) return res.status(404).send("this book could not be found");
    res.status(200).json(book);
  } catch (err: any) {
    res.status(405).send(err.message);
  }
});
//create book
BookRouter.post("/", async (req: Request, res: Response) => {
  const { title, isFiction, datePublished, authorId } = req.body;

  const validate = title && datePublished && authorId;
  if (!validate) return res.status(405).send("bad request");
  const parsedDate: Date = new Date(datePublished);
  try {
    const newBook = await prisma.book.create({
      data: {
        title,
        is_fiction: isFiction,
        date_public: parsedDate,
        authorId: authorId,
      },
      select: {
        id: true,
        title: true,
        is_fiction: true,
        date_public: true,
        author: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
          },
        },
      },
    });
    res.status(200).json(newBook);
  } catch (err: any) {
    res.status(405).send(err.message);
  }
});
//update book
BookRouter.post("/:id", async (req: Request, res: Response) => {
  const { title, isFiction, datePublished, authorId } = req.body;
  const id = Number(req.params.id);
  const parsedDate: Date = new Date(datePublished);

  const validate = title && datePublished && authorId;
  if (!validate) return res.status(405).send("bad request");
  try {
    const exist = await prisma.book.findFirst({ where: { id } });
    if (!exist) return res.status(404).send("this book could not be found");
    const updateBook = await prisma.book.update({
      data: {
        title,
        is_fiction: isFiction,
        date_public: parsedDate,
        authorId: authorId,
      },
      where: { id },
      select: {
        id: true,
        title: true,
        is_fiction: true,
        date_public: true,
        author: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
          },
        },
      },
    });
    res.status(200).json(updateBook);
  } catch (err: any) {
    res.status(405).send(err.message);
  }
});
//delete book
BookRouter.delete("/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    const exist = await prisma.book.findFirst({ where: { id } });
    if (!exist) return res.status(404).send("this book could not be found");
    await prisma.book.delete({ where: { id } });
    res.status(200).send("this book is deleted successfully");
  } catch (err: any) {
    res.status(405).send(err.message);
  }
});
