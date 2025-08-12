import express from "express";
import { engine } from "express-handlebars";
import fs from "fs";
import path from "path";

const app = express();
const port = process.env.PORT || 3008;

const IS_PRODUCTION = process.env.NODE_ENV === "production";

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./views");

app.use(
  express.static("public", {
    maxAge: 3600000,
  })
);

app.get("/", (_req, res) => {
  res.set("Cache-Control", "public, max-age=3600");

  const imagesDir = path.join(
    IS_PRODUCTION ? "/opt/render/project/src" : __dirname,
    "public",
    "images"
  );
  let imagePaths: string[] = [];

  try {
    const files = fs.readdirSync(imagesDir);
    imagePaths = files
      .filter((file) => /\.(png|jpg|jpeg|gif|webp)$/i.test(file))
      .map((file) => `/images/${file}`);
  } catch (error) {
    console.error("Error reading images directory:", error);
  }

  res.render("index", {
    requestedAt: new Date().toISOString(),
    images: imagePaths,
  });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
