import Database from 'better-sqlite3';
import { join, dirname } from 'path';

// Use Node's __dirname for test compatibility
const dbPath = join(process.cwd(), 'services', 'service-b', 'posts.sqlite');

export interface Post {
  id: number;
  title: string;
  content: string;
  authorId: number;
}

export class PostRepository {
  private db: Database.Database;

  constructor(testDbPath?: string) {
    this.db = new Database(testDbPath || dbPath);
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