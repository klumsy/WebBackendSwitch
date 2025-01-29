export interface Post {
  id: number;
  title: string;
  content: string;
  authorId: number;
}

export class PostRepository {
  private posts: Post[] = [];
  private nextId = 1;

  createPost(title: string, content: string, authorId: number): Post {
    const post: Post = {
      id: this.nextId++,
      title,
      content,
      authorId
    };
    this.posts.push(post);
    return post;
  }

  getPost(id: number): Post | undefined {
    return this.posts.find(post => post.id === id);
  }

  getPosts(): Post[] {
    return this.posts;
  }

  getPostsByAuthor(authorId: number): Post[] {
    return this.posts.filter(post => post.authorId === authorId);
  }
}
