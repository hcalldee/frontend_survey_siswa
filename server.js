const path = require("path");


require("dotenv").config({ path: path.join(__dirname, ".env") });

const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");

const webRoutes = require("./routes/web");

const app = express();
app.disable("x-powered-by");

app.use(
  helmet({
    // halaman EJS ini banyak CDN; CSP strict bisa ganggu kalau belum di-setup.
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: false
  })
);

app.use(morgan("dev"));
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use("/public", express.static(path.join(__dirname, "public")));

app.use(webRoutes);

const port = Number(process.env.PORT || 4173);
app.listen(port, () => {
  console.log(`app_user running on http://localhost:${port}`);
});
