import cors from "cors";
import express from "express";
import { AuthorRouter } from "./route/author";
import { BookRouter } from "./route/book";

const app = express();
app.use(cors());
app.use(express.json());
const port = 5000;
app.use("/author", AuthorRouter);
app.use("/book", BookRouter);
app.listen(port, () => {
  console.log("server is running at", port);
});
