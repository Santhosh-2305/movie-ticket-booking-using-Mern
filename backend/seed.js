require("dotenv").config();
const mongoose = require("mongoose");
const Movie = require("./models/Movie");

const movies = [
  // ── ACTION / THRILLER ──────────────────────────────────────────────
  {
    title: "Dune: Part Two",
    description:
      "Paul Atreides unites with the Fremen to wage war against the conspirators who destroyed his family. A breathtaking epic of power, prophecy, and sacrifice across the desert planet Arrakis.",
    genre: "Sci-Fi",
    duration: 166,
    releaseDate: new Date("2024-03-01"),
    poster: "https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
    price: 16,
    availableSeats: 90,
  },
  {
    title: "Deadpool & Wolverine",
    description:
      "The Merc with a Mouth teams up with the grumpiest mutant alive in a chaotic, hilarious, and surprisingly emotional multiverse adventure that changes the Marvel universe forever.",
    genre: "Action",
    duration: 128,
    releaseDate: new Date("2024-07-26"),
    poster: "https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg",
    price: 15,
    availableSeats: 75,
  },
  {
    title: "Alien: Romulus",
    description:
      "A group of young space colonizers face the most terrifying life form in the universe while scavenging an abandoned space station. Pure survival horror that revives the franchise.",
    genre: "Horror",
    duration: 119,
    releaseDate: new Date("2024-08-16"),
    poster: "https://image.tmdb.org/t/p/w500/b33nnKl1GSFbao4l3fZDDqsMx0F.jpg",
    price: 14,
    availableSeats: 60,
  },

  // ── DRAMA / EMOTIONAL ──────────────────────────────────────────────
  {
    title: "Inside Out 2",
    description:
      "Riley enters her teenage years and new emotions — Anxiety, Envy, Ennui — crash headquarters. A deeply moving, funny, and honest look at growing up and the complexity of feelings.",
    genre: "Drama",
    duration: 100,
    releaseDate: new Date("2024-06-14"),
    poster: "https://image.tmdb.org/t/p/w500/vpnVM9B6NMmQpWeZvzLvDESb2QY.jpg",
    price: 13,
    availableSeats: 85,
  },
  {
    title: "A Complete Unknown",
    description:
      "The electrifying story of Bob Dylan's rise from a young folk singer to a cultural icon in 1960s New York. A raw, emotional portrait of genius, rebellion, and artistic identity.",
    genre: "Drama",
    duration: 141,
    releaseDate: new Date("2024-12-25"),
    poster: "https://image.tmdb.org/t/p/w500/rMvPXy8PUjj1o8o1pzgQbdNCsvj.jpg",
    price: 14,
    availableSeats: 70,
  },
  {
    title: "The Substance",
    description:
      "A fading celebrity uses a black-market drug to create a younger, perfect version of herself — with horrifying consequences. A visceral, darkly funny body-horror masterpiece.",
    genre: "Thriller",
    duration: 141,
    releaseDate: new Date("2024-09-20"),
    poster: "https://image.tmdb.org/t/p/w500/lqoMzCcZYEFK729d6qzt349fB4o.jpg",
    price: 14,
    availableSeats: 55,
  },

  // ── ROMANCE / FEEL-GOOD ────────────────────────────────────────────
  {
    title: "Challengers",
    description:
      "A love triangle between two rival tennis players and the woman who loved them both. Tense, sexy, and emotionally charged — a film that pulses with desire and competition.",
    genre: "Romance",
    duration: 131,
    releaseDate: new Date("2024-04-26"),
    poster: "https://image.tmdb.org/t/p/w500/H6vke7zGiuLsz4v4RPeReb9rsv.jpg",
    price: 13,
    availableSeats: 80,
  },
  {
    title: "Anyone But You",
    description:
      "Two people who can't stand each other are forced to pretend to be a couple at a destination wedding in Australia. A charming, laugh-out-loud romantic comedy with real chemistry.",
    genre: "Comedy",
    duration: 103,
    releaseDate: new Date("2023-12-22"),
    poster: "https://image.tmdb.org/t/p/w500/lurEK87kukWNaHd0zYnsi3yzJrs.jpg",
    price: 12,
    availableSeats: 95,
  },

  // ── COMEDY / LIGHT ─────────────────────────────────────────────────
  {
    title: "Twisters",
    description:
      "Storm chasers converge on the Oklahoma plains as a new generation faces the most violent tornado season in history. Thrilling, funny, and packed with jaw-dropping spectacle.",
    genre: "Action",
    duration: 122,
    releaseDate: new Date("2024-07-19"),
    poster: "https://image.tmdb.org/t/p/w500/pjnD08FlMAIXsfOLKQbvmO0f0MD.jpg",
    price: 14,
    availableSeats: 65,
  },
  {
    title: "Wicked",
    description:
      "The untold story of the witches of Oz — Elphaba and Glinda's unlikely friendship before one becomes the Wicked Witch. A spectacular, emotionally rich musical event.",
    genre: "Drama",
    duration: 160,
    releaseDate: new Date("2024-11-22"),
    poster: "https://image.tmdb.org/t/p/w500/xDGbZ0JJ3mYaGKy4Nzd9Kph6M9L.jpg",
    price: 16,
    availableSeats: 50,
  },

  // ── SCI-FI / MIND-BENDING ──────────────────────────────────────────
  {
    title: "Furiosa: A Mad Max Saga",
    description:
      "The origin story of Furiosa — how she was taken from her homeland and her fierce journey to find her way back. A brutal, visually stunning prequel full of rage and heart.",
    genre: "Action",
    duration: 148,
    releaseDate: new Date("2024-05-24"),
    poster: "https://image.tmdb.org/t/p/w500/iADOJ8Zymht2JPMoy3R7xceZprc.jpg",
    price: 15,
    availableSeats: 72,
  },
  {
    title: "Longlegs",
    description:
      "An FBI agent is drawn into the hunt for a serial killer with a personal connection to her past. A deeply unsettling, atmospheric thriller that gets under your skin and stays there.",
    genre: "Thriller",
    duration: 101,
    releaseDate: new Date("2024-07-12"),
    poster: "https://image.tmdb.org/t/p/w500/qRpak9bqFBFOFJvicVOiOGFGFDF.jpg",
    price: 13,
    availableSeats: 68,
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    // Remove existing movies to avoid duplicates on re-run
    await Movie.deleteMany({});
    console.log("🗑  Cleared existing movies");

    const inserted = await Movie.insertMany(movies);
    console.log(`🎬 Seeded ${inserted.length} movies successfully!\n`);
    inserted.forEach((m) => console.log(`   • ${m.title} (${m.genre})`));

    process.exit(0);
  } catch (err) {
    console.error("❌ Seed failed:", err.message);
    process.exit(1);
  }
}

seed();
