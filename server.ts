import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

const DB_FILE = path.join(process.cwd(), "db.json");

const defaultMovies = [
  { id: 1, title: "Beetlejuice", year: "1988", director: "Tim Burton", lat: 34.0522, lng: -118.2437, date: "2026-06-25", trend: [45, 52, 49, 63, 58, 67, 72, 85, 78, 92], rating: 4.2 },
  { id: 2, title: "Ghostbusters", year: "1984", director: "Ivan Reitman", lat: 40.7128, lng: -74.0060, date: "2026-06-26", trend: [68, 72, 70, 78, 85, 82, 89, 94, 91, 98], rating: 4.5 },
  { id: 3, title: "The Matrix", year: "1999", director: "Lana Wachowski, Lilly Wachowski", lat: -33.8688, lng: 151.2093, date: "2026-06-24", trend: [95, 92, 90, 88, 85, 82, 80, 83, 85, 89], rating: 4.9 },
  { id: 4, title: "Inception", year: "2010", director: "Christopher Nolan", lat: 51.5074, lng: -0.1278, date: "2026-06-25", trend: [75, 78, 82, 80, 85, 89, 93, 91, 95, 99], rating: 4.8 },
  { id: 5, title: "Interstellar", year: "2014", director: "Christopher Nolan", lat: 64.1466, lng: -21.9426, date: "2026-06-26", trend: [80, 83, 85, 84, 88, 90, 92, 95, 98, 102], rating: 4.7 },
  { id: 6, title: "Pulp Fiction", year: "1994", director: "Quentin Tarantino", lat: 34.0522, lng: -118.2437, date: "2026-06-24", trend: [90, 88, 85, 87, 82, 80, 78, 75, 79, 82], rating: 4.9 },
  { id: 7, title: "The Shawshank Redemption", year: "1994", director: "Frank Darabont", lat: 40.7587, lng: -82.5221, date: "2026-06-25", trend: [98, 99, 100, 97, 98, 99, 100, 99, 100, 102], rating: 5.0 },
  { id: 8, title: "The Godfather", year: "1972", director: "Francis Ford Coppola", lat: 40.7128, lng: -74.0060, date: "2026-06-26", trend: [92, 94, 93, 95, 91, 90, 92, 94, 93, 96], rating: 5.0 },
  { id: 9, title: "The Dark Knight", year: "2008", director: "Christopher Nolan", lat: 41.8781, lng: -87.6298, date: "2026-06-24", trend: [88, 90, 92, 95, 93, 96, 98, 100, 99, 104], rating: 4.9 },
  { id: 10, title: "Schindler's List", year: "1993", director: "Steven Spielberg", lat: 50.0647, lng: 19.9450, date: "2026-06-25", trend: [70, 72, 75, 73, 78, 80, 82, 85, 84, 88], rating: 4.9 },
  { id: 11, title: "Forrest Gump", year: "1994", director: "Robert Zemeckis", lat: 32.0809, lng: -81.0912, date: "2026-06-26", trend: [85, 84, 86, 88, 89, 91, 93, 92, 95, 97], rating: 4.6 },
  { id: 12, title: "Star Wars: Episode V", year: "1980", director: "Irvin Kershner", lat: 60.5518, lng: -6.4080, date: "2026-06-24", trend: [78, 82, 80, 85, 89, 87, 91, 95, 93, 98], rating: 4.8 },
  { id: 13, title: "Goodfellas", year: "1990", director: "Martin Scorsese", lat: 40.7128, lng: -74.0060, date: "2026-06-25", trend: [82, 80, 83, 85, 82, 81, 84, 88, 86, 90], rating: 4.7 },
  { id: 14, title: "The Lord of the Rings: The Return of the King", year: "2003", director: "Peter Jackson", lat: -41.2865, lng: 174.7762, date: "2026-06-26", trend: [94, 96, 95, 98, 97, 99, 100, 102, 101, 105], rating: 4.9 },
  { id: 15, title: "Spirited Away", year: "2001", director: "Hayao Miyazaki", lat: 35.6762, lng: 139.6503, date: "2026-06-24", trend: [72, 75, 78, 76, 80, 83, 85, 89, 87, 92], rating: 4.5 }
];

function getDb() {
  if (!fs.existsSync(DB_FILE)) {
    const initialDb = {
      movies: defaultMovies,
      savedViews: [],
      comments: [],
      bookmarks: [],
      auditLogs: [
        {
          id: "seed-log",
          timestamp: new Date().toISOString(),
          action: "Database Initialized",
          details: "Standard movie dataset loaded with 15 initial entries."
        }
      ],
      themes: []
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialDb, null, 2), "utf8");
    return initialDb;
  }
  try {
    const data = fs.readFileSync(DB_FILE, "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.error("DB read error, returning default data:", err);
    return {
      movies: defaultMovies,
      savedViews: [],
      comments: [],
      auditLogs: [],
      themes: []
    };
  }
}

function saveDb(data: any) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf8");
  } catch (err) {
    console.error("DB write error:", err);
  }
}

function addAuditLog(action: string, details: string) {
  const db = getDb();
  const log = {
    id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    timestamp: new Date().toISOString(),
    action,
    details
  };
  db.auditLogs.unshift(log);
  if (db.auditLogs.length > 100) {
    db.auditLogs = db.auditLogs.slice(0, 100);
  }
  saveDb(db);
}

// REST API Endpoints

// 1. Movies Grid Data (Supports search, filtering, server-side sorting, pagination)
app.get("/api/movies", async (req, res) => {
  try {
    const db = getDb();
    let moviesList = [...db.movies];

    const { page, limit, search, sortBy, sortOrder, ratingFilter, aiQuery } = req.query;

    // AI Natural Language Query Processing if requested
    if (aiQuery && process.env.GEMINI_API_KEY) {
      try {
        const ai = new GoogleGenAI({ 
          apiKey: process.env.GEMINI_API_KEY,
          httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
        });
        
        const prompt = `Based on the user natural language query "${aiQuery}", parse it into a set of structured filtering conditions.
The fields are:
- title (string)
- director (string)
- year (string representation of number)
- rating (number)

Return ONLY a JSON object representing the criteria:
{
  "search": string (or empty),
  "minYear": number (or null),
  "maxYear": number (or null),
  "minRating": number (or null),
  "maxRating": number (or null),
  "director": string (or empty)
}
Return only raw JSON, no markdown codeblocks, no extra explanations.`;

        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            systemInstruction: "You are an intelligent SQL/NoSQL filter translator. Translate user statements to exact JSON filter specs."
          }
        });

        const filterSpec = JSON.parse(response.text || "{}");
        
        if (filterSpec.search) {
          const s = String(filterSpec.search).toLowerCase();
          moviesList = moviesList.filter(m => m.title.toLowerCase().includes(s));
        }
        if (filterSpec.minYear) {
          moviesList = moviesList.filter(m => Number(m.year) >= Number(filterSpec.minYear));
        }
        if (filterSpec.maxYear) {
          moviesList = moviesList.filter(m => Number(m.year) <= Number(filterSpec.maxYear));
        }
        if (filterSpec.minRating) {
          moviesList = moviesList.filter(m => m.rating >= Number(filterSpec.minRating));
        }
        if (filterSpec.maxRating) {
          moviesList = moviesList.filter(m => m.rating <= Number(filterSpec.maxRating));
        }
        if (filterSpec.director) {
          const d = String(filterSpec.director).toLowerCase();
          moviesList = moviesList.filter(m => m.director.toLowerCase().includes(d));
        }
        addAuditLog("AI Query Applied", `AI query "${aiQuery}" parsed successfully as ${JSON.stringify(filterSpec)}`);
      } catch (aiErr) {
        console.error("AI filter error, falling back to manual filters:", aiErr);
      }
    }

    // Manual Local Searching
    if (search) {
      const s = String(search).toLowerCase();
      moviesList = moviesList.filter(
        m => m.title.toLowerCase().includes(s) || 
             m.director.toLowerCase().includes(s) || 
             m.year.includes(s)
      );
    }

    // Rating filter
    if (ratingFilter) {
      const minRating = Number(ratingFilter);
      moviesList = moviesList.filter(m => m.rating >= minRating);
    }

    // Sorting
    if (sortBy) {
      const key = String(sortBy);
      const isAsc = String(sortOrder).toLowerCase() !== "desc";
      moviesList.sort((a: any, b: any) => {
        let valA = a[key];
        let valB = b[key];
        
        if (typeof valA === 'string') {
          return isAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
        } else {
          return isAsc ? (valA - valB) : (valB - valA);
        }
      });
    }

    const totalCount = moviesList.length;

    // Pagination
    const p = Number(page) || 1;
    const l = Number(limit) || 10;
    const startIdx = (p - 1) * l;
    const paginatedList = moviesList.slice(startIdx, startIdx + l);

    res.json({
      data: paginatedList,
      totalCount,
      page: p,
      limit: l
    });
  } catch (error: any) {
    console.error("Fetch movies error:", error);
    res.status(500).json({ error: error.message || "Failed to fetch movies" });
  }
});

// Create Movie
app.post("/api/movies", (req, res) => {
  try {
    const db = getDb();
    const movie = req.body;
    
    // Generate a unique ID
    const newId = db.movies.length > 0 ? Math.max(...db.movies.map((m: any) => m.id)) + 1 : 1;
    const newMovie = {
      id: newId,
      title: movie.title || "Untitled Film",
      director: movie.director || "Unknown Director",
      year: movie.year || new Date().getFullYear().toString(),
      rating: Number(movie.rating) || 4.0,
      lat: Number(movie.lat) || 34.0522,
      lng: Number(movie.lng) || -118.2437,
      date: movie.date || new Date().toISOString().split('T')[0],
      trend: movie.trend || [50, 50, 50, 50, 50]
    };

    db.movies.push(newMovie);
    saveDb(db);

    addAuditLog("Row Created", `Movie "${newMovie.title}" (ID: ${newId}) created via server-side API.`);
    res.status(201).json(newMovie);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update Movie
app.put("/api/movies/:id", (req, res) => {
  try {
    const db = getDb();
    const id = Number(req.params.id);
    const updates = req.body;

    const movieIdx = db.movies.findIndex((m: any) => m.id === id);
    if (movieIdx === -1) {
      return res.status(404).json({ error: "Movie not found" });
    }

    const originalMovie = db.movies[movieIdx];
    const updatedMovie = {
      ...originalMovie,
      ...updates,
      id // Prevent ID modification
    };

    db.movies[movieIdx] = updatedMovie;
    saveDb(db);

    addAuditLog("Row Updated", `Movie "${updatedMovie.title}" (ID: ${id}) fields changed: ${JSON.stringify(updates)}`);
    res.json(updatedMovie);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Delete Movie
app.delete("/api/movies/:id", (req, res) => {
  try {
    const db = getDb();
    const id = Number(req.params.id);

    const movie = db.movies.find((m: any) => m.id === id);
    if (!movie) {
      return res.status(404).json({ error: "Movie not found" });
    }

    db.movies = db.movies.filter((m: any) => m.id !== id);
    saveDb(db);

    addAuditLog("Row Deleted", `Movie "${movie.title}" (ID: ${id}) removed from database.`);
    res.json({ success: true, message: "Movie deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 2. Saved Views & Shareable Views
app.get("/api/saved-views", (req, res) => {
  const db = getDb();
  res.json(db.savedViews || []);
});

app.get("/api/saved-views/:id", (req, res) => {
  const db = getDb();
  const view = db.savedViews.find((v: any) => v.id === req.params.id);
  if (!view) {
    return res.status(404).json({ error: "Saved view not found" });
  }
  res.json(view);
});

app.post("/api/saved-views", (req, res) => {
  try {
    const db = getDb();
    const { name, state } = req.body;
    
    if (!name) return res.status(400).json({ error: "View name required" });

    const viewId = `view-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newView = { id: viewId, name, state };

    db.savedViews.push(newView);
    saveDb(db);

    addAuditLog("View Saved", `Saved View layout "${name}" was created on the server.`);
    res.status(201).json(newView);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 3. Comments & Mentions
app.get("/api/comments/:rowId", (req, res) => {
  const db = getDb();
  const rowId = String(req.params.rowId);
  const comments = db.comments.filter((c: any) => String(c.rowId) === rowId);
  res.json(comments);
});

app.post("/api/comments/:rowId", (req, res) => {
  try {
    const db = getDb();
    const rowId = String(req.params.rowId);
    const { author, text } = req.body;

    if (!text) return res.status(400).json({ error: "Comment text is required" });

    const newComment = {
      id: `comment-${Date.now()}`,
      rowId,
      author: author || "Anonymous User",
      text,
      timestamp: new Date().toISOString()
    };

    db.comments.push(newComment);
    saveDb(db);

    addAuditLog("Comment Posted", `New comment added on row ID ${rowId} by ${newComment.author}.`);
    res.status(201).json(newComment);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 3.5 Bookmarks
app.get("/api/bookmarks", (req, res) => {
  const db = getDb();
  res.json(db.bookmarks || []);
});

app.post("/api/bookmarks", (req, res) => {
  try {
    const db = getDb();
    const { key } = req.body;
    if (key === undefined) return res.status(400).json({ error: "Key required" });

    const keys = new Set(db.bookmarks || []);
    const sKey = String(key);
    
    if (keys.has(sKey)) {
      keys.delete(sKey);
    } else {
      keys.add(sKey);
    }
    
    db.bookmarks = Array.from(keys);
    saveDb(db);
    res.json({ bookmarks: db.bookmarks });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 4. Audit Trail Log fetching
app.get("/api/audit-trail", (req, res) => {
  const db = getDb();
  res.json(db.auditLogs || []);
});

// Write to Audit Trail
app.post("/api/audit-trail", (req, res) => {
  try {
    const { action, details } = req.body;
    if (!action || !details) return res.status(400).json({ error: "Action & details required" });
    addAuditLog(action, details);
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 5. Offline Queue Synchronizer
app.post("/api/sync", (req, res) => {
  try {
    const db = getDb();
    const { actions } = req.body; // Array of change operations: { rowId, columnId, columnName, oldValue, newValue }

    if (!actions || !Array.isArray(actions)) {
      return res.status(400).json({ error: "Invalid actions array" });
    }

    let syncCount = 0;
    for (const change of actions) {
      const rowId = Number(change.rowId);
      const movieIdx = db.movies.findIndex((m: any) => m.id === rowId);
      if (movieIdx !== -1) {
        db.movies[movieIdx][change.columnId] = change.newValue;
        syncCount++;
      }
    }

    saveDb(db);
    addAuditLog("Offline Sync Completed", `Reconciled ${syncCount} offline edits from sync client queue.`);

    res.json({ success: true, count: syncCount, movies: db.movies });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 6. Theme Configurations
app.get("/api/themes", (req, res) => {
  const db = getDb();
  res.json(db.themes || []);
});

app.post("/api/themes", (req, res) => {
  try {
    const db = getDb();
    const { name, themeData } = req.body;

    const newTheme = { id: `theme-${Date.now()}`, name, themeData };
    db.themes.push(newTheme);
    saveDb(db);

    addAuditLog("Theme Created", `Custom design theme "${name}" was created and saved.`);
    res.status(201).json(newTheme);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Original legacy AI Proxy endpoints for backward compatibility
app.post("/api/insights", async (req, res) => {
  try {
    const { data, title } = req.body;
    const ai = new GoogleGenAI({ 
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
    });
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Analyze the following grid data for "${title || 'the dataset'}" and provide brief insights, data trends, and a short summary (max 3 sentences). Format as plain text or markdown.\n\nData: ${JSON.stringify(data).substring(0, 5000)}`,
      config: {
        systemInstruction: "You are a professional data analyst. Provide clear, concise insights for the provided data."
      }
    });
    
    res.json({ insights: response.text });
  } catch (error) {
    console.error("AI Insight Error:", error);
    res.status(500).json({ error: "Failed to generate insights" });
  }
});

app.post("/api/ai-query", async (req, res) => {
  try {
    const { query } = req.body;
    const ai = new GoogleGenAI({ 
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
    });
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Given the user query "${query}", parse it into a JSON object representing filter parameters for a dataset of movies.
The dataset has the following columns: 'title' (string), 'director' (string), 'year' (string), 'rating' (number).
Return a JSON object containing any of these keys:
- 'title' (string)
- 'director' (string)
- 'minYear' (number)
- 'maxYear' (number)
- 'minRating' (number)
- 'maxRating' (number)

Return ONLY valid JSON, without any markdown formatting or extra text.`,
      config: {
        responseMimeType: "application/json",
        systemInstruction: "You are a data filtering assistant. Convert natural language queries into structured JSON filter parameters."
      }
    });
    
    const filterParams = JSON.parse(response.text || '{}');
    res.json(filterParams);
  } catch (error: any) {
    console.error("AI Query Error:", error);
    res.status(500).json({ error: error.message || "Failed to parse query" });
  }
});

app.post("/api/ai-summary", async (req, res) => {
  try {
    const { data } = req.body;
    const ai = new GoogleGenAI({ 
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
    });
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Please provide a brief, 2-3 sentence executive summary of the following data:\n\n${JSON.stringify(data)}`,
      config: {
        systemInstruction: "You are an expert data analyst. Provide a concise, professional summary of the provided data."
      }
    });
    
    res.json({ summary: response.text });
  } catch (error: any) {
    console.error("AI Summary Error:", error);
    res.status(500).json({ error: error.message || "Failed to generate summary" });
  }
});

app.post("/api/ai-insights", async (req, res) => {
  try {
    const { data } = req.body;
    const ai = new GoogleGenAI({ 
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
    });
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Analyze this data and provide 3-4 key business insights. Return ONLY a JSON array of objects with keys: "title" (short), "value" (the metric/number), "trend" ('up', 'down', or 'neutral'), "description" (1 short sentence).\n\nData: ${JSON.stringify(data)}`,
      config: {
        responseMimeType: "application/json",
        systemInstruction: "You are an expert data analyst. Extract key metrics and trends from data."
      }
    });
    
    const insights = JSON.parse(response.text || '[]');
    res.json(insights);
  } catch (error: any) {
    console.error("AI Insights Error:", error);
    res.status(500).json({ error: error.message || "Failed to generate insights" });
  }
});

// Serve static files from the public directory
app.use(express.static(path.join(process.cwd(), "public")));

// Explicit route for .tgz package downloads to guarantee correct Content-Type and force browser download
app.get("/*.tgz", (req, res, next) => {
  const fileName = path.basename(req.path);
  const filePath = path.join(process.cwd(), "public", fileName);
  if (fs.existsSync(filePath)) {
    res.setHeader("Content-Type", "application/gzip");
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    return res.sendFile(filePath);
  }
  next();
});

// Explicit route for .zip package downloads to guarantee correct Content-Type and force browser download
app.get("/*.zip", (req, res, next) => {
  const fileName = path.basename(req.path);
  const filePath = path.join(process.cwd(), "public", fileName);
  if (fs.existsSync(filePath)) {
    res.setHeader("Content-Type", "application/zip");
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    return res.sendFile(filePath);
  }
  next();
});

// Vite middleware and server startup wrapped in async run to allow CommonJS builds
async function run() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath, {
      maxAge: '1d',
      etag: true,
      setHeaders: (res, filePath) => {
        if (filePath.endsWith('.html')) {
          res.setHeader('Cache-Control', 'no-cache');
        } else if (filePath.match(/\.(js|css|woff2?|png|jpg|jpeg|gif|svg|ico)$/)) {
          res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        }
      }
    }));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

run().catch((err) => {
  console.error("Failed to start server:", err);
});
