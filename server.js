const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const path = require("path");
const {
  dataUser,
  saveMessage,
  getMessages,
  updateMessage,
  deleteMessage,
} = require("./database");
const { title } = require("process");

const app = express();
const expressLayout = require("express-ejs-layouts");
const server = http.createServer(app);
const io = socketIo(server);

//app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.use(express.json()); // Middleware untuk JSON
app.use(express.urlencoded({ extended: true }));
app.use(expressLayout);

app.get("/", (req, res) => {
  res.render("index", {
    layout: "layouts/main_layout",
  });
});

app.get("/home", (req, res) => {
  res.render("home", {
    layout: "layouts/main_layout",
  });
});

// Menangani koneksi Socket.IO
io.on("connection", (socket) => {
  console.log("A user connected");

  // Mengambil data user
  dataUser((err, user) => {
    if (err) {
      console.error("Data user error", err);
      return;
    }
    socket.emit("loadUser", user);
  });

  // Mendapatkan semua pesan saat klien terhubung
  getMessages((err, messages) => {
    if (err) {
      console.error("Failed to retrieve messages:", err);
      return;
    }
    socket.emit("loadMessages", messages);
  });

  // Mendengarkan pesan dari klien
  socket.on("createMessage", (message) => {
    saveMessage(message, (err, result) => {
      if (err) {
        console.error("Failed to save message:", err);
        return;
      }
      io.emit("newMessage", { content: message, id: result.insertId });
    });
  });

  // Mendengarkan pembaruan pesan
  socket.on("updateMessage", ({ id, newContent }) => {
    updateMessage(id, newContent, (err) => {
      if (err) {
        console.error("Failed to update message:", err);
        return;
      }
      io.emit("messageUpdated", { id, newContent });
    });
  });

  // Mendengarkan penghapusan pesan
  socket.on("deleteMessage", (id) => {
    deleteMessage(id, (err) => {
      if (err) {
        console.error("Failed to delete message:", err);
        return;
      }
      io.emit("messageDeleted", id);
    });
  });

  // Menangani pemutusan koneksi
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// Jalankan server pada port 3000
server.listen(8080, () => {
  console.log("Server is listening on http://localhost:8080");
});
