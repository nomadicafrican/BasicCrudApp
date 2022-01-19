const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const fileSystem = require("fs");
const fastcsv = require("fast-csv");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");

const app = express();
const morgan = require("morgan");
const bodyparser = require("body-parser");

const { Pool } = require("pg");

const pool = new Pool({
  user: "ammarali",
  password: "",
  host: "localhost",
  database: "crudapp",
});

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(morgan("tiny"));
app.use(bodyparser.urlencoded({ extended: true }));

app.set("view engine", "ejs");
// app.set("views", path.resolve(__dirname, "views/ejs"));

app.use("/css", express.static(path.resolve(__dirname, "assets/css")));
app.use("/img", express.static(path.resolve(__dirname, "assets/img")));
app.use("/js", express.static(path.resolve(__dirname, "assets/js")));

// const dotenv = require(`dotenv`);
// dotenv.config({ path: "config.env" });

const PORT = 8080;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
app.get("/exportData", (req, res) => {
  const queryString = `Select * from cards;`;
  pool.query(queryString).then((result) => {
    data = result.rows;

    const ws = fileSystem.createWriteStream("public/javascripts/cards.csv");
    fastcsv
      .write(data, { headers: true })
      .pipe(ws)
      .on("finish", () => {
        const file = "${__dirname}/../public/javascripts/cards.csv";
        res.download(file);
      });
  });
});
// app.use("/", require("./server/routes/router"));
// app.use("/", indexRouter);
app.use("/users", usersRouter);

app.get("/", (req, res) => {
  pool
    .query(`SELECT * FROM cards;`)
    .then((data) => {
      // console.log(data.rows);
      const templateVars = { cards: data.rows };
      res.render("index", templateVars);
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

app.get("/add-card", (req, res) => {
  res.render("add_item");
});
app.post("/add-card", (req, res) => {
  const { graphics_card, quantity, description, price } = req.body;
  const queryString = `INSERT INTO cards (graphics_card, quantity, description, price)
  VALUES ($1, $2, $3, $4)
  RETURNING *;`;
  const values = [graphics_card, quantity, description, price];
  pool
    .query(queryString, values)
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => {
      return console.log("query error:", err);
    });
});

app.post("/update-card", (req, res) => {
  const { graphics_card, quantity, description, price } = req.body;
  const id = req.query.id;

  const queryString = `UPDATE cards SET graphics_card = $1, quantity = $2, description = $3, price = $4 WHERE id = $5;`;
  const values = [graphics_card, quantity, description, price, id];
  pool
    .query(queryString, values)
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => {
      return console.log("query error:", err);
    });
});

app.get("/update-card", (req, res) => {
  const id = req.query.id;
  const queryString = `SELECT * FROM cards WHERE id = $1`;
  pool.query(queryString, [id]).then((result) => {
    const data = result.rows[0];

    console.log("this is data", result.rows);

    res.render("update_card", { data });
  });
});
// app.get("/:id/delete", (req, res) => {
//   res.redirect("/");
// });

app.post("/delete/:id", (req, res) => {
  const id = req.params.id;

  const queryString = `DELETE FROM cards WHERE id = $1;`;

  pool.query(queryString, [id]).then((result) => {
    console.log(result);
    res.redirect("/");
  });
});
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
