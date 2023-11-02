import express, { Request, Response } from "express";
import { prisma } from "../utils/db";
export const AuthorRouter = express.Router();

//get all author
AuthorRouter.get("/", async (req: Request, res: Response) => {
  try {
    const authors = await prisma.author.findMany({
      select: {
        id: true,
        first_name: true,
        last_name: true,
      },
    });
    res.status(200).json(authors);
  } catch (err: any) {
    res.status(405).send(err.message);
  }
});
//get one author on id
AuthorRouter.get("/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    const author = await prisma.author.findFirst({
      where: { id },
      select: {
        id: true,
        first_name: true,
        last_name: true,
      },
    });
    if (!author) return res.status(404).send("this author could not found");
    res.status(200).json(author);
  } catch (err: any) {
    res.status(405).send(err.message);
  }
});
//create new author
AuthorRouter.post("/", async (req: Request, res: Response) => {
  const { firstName, lastName } = req.body;
  const validate = firstName && lastName;
  if (!validate) return res.status(405).send("bad request");
  try {
    const newAuthor = await prisma.author.create({
      data: { first_name: firstName, last_name: lastName },
      select: {
        id: true,
        first_name: true,
        last_name: true,
      },
    });
    res.status(200).json(newAuthor);
  } catch (err: any) {
    res.status(405).send(err.message);
  }
});
//update auhtor
AuthorRouter.put("/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { firstName, lastName } = req.body;
  const validate = firstName && lastName;
  if (!validate) return res.status(405).send("bad request");
  try {
    const exist = await prisma.author.findFirst({ where: { id } });
    if (!exist) return res.status(405).send("bad request");
    const updatedAuthor = await prisma.author.update({
      data: { first_name: firstName, last_name: lastName },
      where: { id },
      select: {
        id: true,
        first_name: true,
        last_name: true,
      },
    });
    res.status(200).json(updatedAuthor);
  } catch (err: any) {
    res.status(405).send(err.message);
  }
});
//delete auhtor
AuthorRouter.delete("/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    const exist = await prisma.author.findFirst({ where: { id } });
    if (!exist) return res.status(405).send("bad request");
    await prisma.author.delete({ where: { id } });
    res.status(200).send("author deleted successfully");
  } catch (err: any) {
    res.status(405).send(err.message);
  }
});
