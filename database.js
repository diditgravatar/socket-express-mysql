const mysql = require("mysql2");

// Buat koneksi ke database MySQL
const connection = mysql.createConnection({
  host: "localhost",
  user: "root", // Ganti dengan username MySQL Anda
  password: "", // Ganti dengan password MySQL Anda
  database: "chat_db", // Ganti dengan nama database Anda
});

// Koneksikan ke database
connection.connect((err) => {
  if (err) {
    console.error("Database connection error:", err);
    return;
  }
  console.log("Connected to MySQL database");
});

// Mengambil data user dari database
function dataUser(callback) {
  const query = "SELECT * FROM user";
  connection.query(query, (err, results) => {
    if (err) {
      return callback(err);
    }
    callback(null, results);
  });
}

// Fungsi untuk menyimpan pesan ke database
function saveMessage(message, callback) {
  const query = "INSERT INTO messages (content) VALUES (?)";
  connection.query(query, [message], (err, results) => {
    if (err) {
      return callback(err);
    }
    callback(null, results);
  });
}

// Fungsi untuk mendapatkan semua pesan
function getMessages(callback) {
  const query = "SELECT * FROM messages ORDER BY created_at DESC";
  connection.query(query, (err, results) => {
    if (err) {
      return callback(err);
    }
    callback(null, results);
  });
}

// Fungsi untuk memperbarui pesan
function updateMessage(id, newContent, callback) {
  const query = "UPDATE messages SET content = ? WHERE id = ?";
  connection.query(query, [newContent, id], (err, results) => {
    if (err) {
      return callback(err);
    }
    callback(null, results);
  });
}

// Fungsi untuk menghapus pesan
function deleteMessage(id, callback) {
  const query = "DELETE FROM messages WHERE id = ?";
  connection.query(query, [id], (err, results) => {
    if (err) {
      return callback(err);
    }
    callback(null, results);
  });
}

module.exports = {
  dataUser,
  saveMessage,
  getMessages,
  updateMessage,
  deleteMessage,
};
