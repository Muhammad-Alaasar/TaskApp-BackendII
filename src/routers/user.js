const e = require("express");
const express = require("express");
const multer = require("multer");
const auth = require("../middlewares/auth");
const routes = express.Router();
const User = require("../models/User");

routes.post("/signup", (req, res) => {
  const user = new User(req.body);
  user
    .save()
    .then(() => {
      const token = user.generateToken();
      res.send({ user, token });
    })
    .catch((e) => res.status(400).send(e));
});

routes.post("/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = user.generateToken();
    res.send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

routes.get("/users", auth, (req, res) => {
  User.find({})
    .then((data) => {
      res.send(data);
    })
    .catch((e) => res.status(400).send(e));
});

routes.get("/users/:id", auth, (req, res) => {
  const _id = req.params.id;
  User.findById(_id)
    .then((data) => {
      if (!data) {
        return res.status(400).send("No user is found");
      }
      res.send(data);
    })
    .catch((e) => res.status(400).send(e));
});

routes.patch("/users/:id", auth, async (req, res) => {
  try {
    const _id = req.params.id;
    const updates = Object.keys(req.body);
    const user = await User.findById(_id);
    if (!user) {
      return res.status(400).send("invalid");
    }
    updates.forEach((i) => (user[i] = req.body[i]));
    await user.save();
    res.send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});

// routes.patch('/users/:id', async (req, res) => {
//     try {
//         const _id = req.params.id
//         const user = await User.findByIdAndUpdate(_id, req.body, {
//             new: true,
//             runValidators: true
//         })
//         if (!user) {
//             return res.send("invalid")
//         }
//         res.send(user)
//     } catch (e) {
//         res.send(e)
//     }
// })

routes.delete("/users/:id", auth, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(400).send("No user has this ID");
    res.send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});

routes.get("/profile", auth, (req, res) => {
  res.send(req.user);
});

routes.patch("/editProfile", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  try {
    updates.forEach((i) => (req.user[i] = req.body[i]));
    await req.user.save();
    res.send(req.user);
  } catch (e) {
    res.status(400).send(e);
  }
});

const upload = multer({
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|png|jpeg|jfif)$/)) {
      return cb(
        new Error("Please upload (jpg, jpeg, png, jfif) file extention"),
        null
      );
    }
    cb(null, true);
  },
});

routes.post("/uploadimage", auth, upload.single("images"), async (req, res) => {
  try {
    req.user.image = req.file.buffer;
    await req.user.save();
    res.status(200).send();
  } catch (e) {
    res.status(500).send(e);
  }
});

// routes.post('/uploadimage', auth, upload.single('images'), (req, res) => {
//     req.user.image = req.file.buffer
//     req.user.save()
//     .then(data => res.send("Uploaded Successfully"))
//     .catch( e => res.status(400).send(e))
// })

module.exports = routes;
