import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";

interface Author {
  id: number;
  username: string;
  email: string;
}

interface Post {
  id: number;
  title: string;
  content: string;
  authorId: number;
  author?: Author;
}

const postSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  authorId: z.number(),
});

type PostFormData = z.infer<typeof postSchema>;

export default function PostsPage() {
  const { toast } = useToast();
  const form = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      content: "",
      authorId: 1, // Using the same test user ID as verify page
    },
  });

  const { data: posts = [], isLoading } = useQuery<Post[]>({
    queryKey: ["/api/posts"],
    queryFn: async () => {
      const response = await fetch("/api/posts");
      if (!response.ok) {
        throw new Error("Failed to fetch posts");
      }
      return response.json();
    },
  });

  const createPost = useMutation({
    mutationFn: async (data: PostFormData) => {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create post");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      toast({
        title: "Success",
        description: "Post created successfully",
      });
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: PostFormData) => {
    createPost.mutate(data);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Create New Post</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <Input
                  placeholder="Title"
                  {...form.register("title")}
                />
                {form.formState.errors.title && (
                  <p className="text-red-500">{form.formState.errors.title.message}</p>
                )}

                <Textarea
                  placeholder="Content"
                  {...form.register("content")}
                />
                {form.formState.errors.content && (
                  <p className="text-red-500">{form.formState.errors.content.message}</p>
                )}

                <Button type="submit" disabled={createPost.isPending}>
                  Create Post
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Posts List</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              {posts.map((post) => (
                <div key={post.id} className="p-4 border rounded">
                  <h3 className="text-lg font-semibold">{post.title}</h3>
                  <p className="mt-2">{post.content}</p>
                  <div className="text-sm text-muted-foreground mt-2 flex justify-between">
                    <span>Author ID: {post.authorId}</span>
                    {post.author && (
                      <span>By: {post.author.username}</span>
                    )}
                  </div>
                </div>
              ))}
              {posts.length === 0 && (
                <p className="text-muted-foreground">No posts yet. Create one above!</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}