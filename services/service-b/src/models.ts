import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export interface Post {
  id: number;
  title: string;
  content: string;
  authorId: number;
}

export class PostRepository {
  private db: Database.Database;

  constructor() {
    const dbPath = join(__dirname, '..', 'posts.sqlite');
    this.db = new Database(dbPath);
    this.initializeDatabase();
  }

  private initializeDatabase(): void {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        authorId INTEGER NOT NULL
      )
    `);
  }

  createPost(title: string, content: string, authorId: number): Post {
    const stmt = this.db.prepare(
      'INSERT INTO posts (title, content, authorId) VALUES (?, ?, ?)'
    );
    const result = stmt.run(title, content, authorId);
    return {
      id: result.lastInsertRowid as number,
      title,
      content,
      authorId
    };
  }

  getPost(id: number): Post | undefined {
    const stmt = this.db.prepare('SELECT * FROM posts WHERE id = ?');
    return stmt.get(id) as Post | undefined;
  }

  getPosts(): Post[] {
    const stmt = this.db.prepare('SELECT * FROM posts');
    return stmt.all() as Post[];
  }

  getPostsByAuthor(authorId: number): Post[] {
    const stmt = this.db.prepare('SELECT * FROM posts WHERE authorId = ?');
    return stmt.all(authorId) as Post[];
  }
}