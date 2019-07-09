const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const RedirectRoute = require("./models/RedirectRoute");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index", {
    context: "index.ejs"
  });
});
app.get("/route/:dynamicRoute", async (req, res) => {
  try {
    const redirect = await RedirectRoute.findOne({
      redirectFrom: req.params.dynamicRoute
    });
    let redirectLink = redirect.redirectTo;
    if (!redirectLink.startsWith("/")) {
      redirectLink = `/${redirectLink}`;
    }
    res.redirect(redirectLink);
  } catch (e) {
    console.log(e);
  }
});
app.post("/route", async (req, res) => {
  console.log(req);
  try {
    const redirect = await RedirectRoute.findOneAndUpdate(
      {
        redirectFrom: req.body.redirectFrom
      },
      { redirectTo: req.body.redirectTo },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
        useFindAndModify: false
      }
    );
    res.json(redirect);
  } catch (e) {
    console.log(e);
  }
});
app.get("/route", async (req, res) => {
  try {
    const redirect = await RedirectRoute.find();
    res.render("index", { redirect, context: "index.js" });
  } catch (e) {
    console.log(e);
  }
});

const db =
  "mongodb+srv://rabeast:1314520xxX@cluster0-uv58m.mongodb.net/test?retryWrites=true";
console.log(`currently using this ${db}`);
mongoose
  .connect(
    db,
    { useNewUrlParser: true }
  )
  .then(() => console.log("MongoDB successfully connected"))
  .catch(err => console.log(err));

app.listen(3001, () => {
  console.log("listening on port 3001");
});
