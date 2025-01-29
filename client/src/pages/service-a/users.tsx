import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";

const userSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type UserFormData = z.infer<typeof userSchema>;

interface Post {
  id: number;
  title: string;
  content: string;
  userId: number;
}

interface User {
  id: number;
  username: string;
  email: string;
  posts?: Post[];
}

export default function UsersPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const { data: users = [], isLoading: isLoadingUsers } = useQuery<User[]>({
    queryKey: ["/api/users"],
    queryFn: async () => {
      const response = await fetch("/api/users");
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      return response.json();
    },
  });

  // Fetch posts for a specific user
  const { data: userPosts = {}, isLoading: isLoadingPosts } = useQuery({
    queryKey: ["/api/posts"],
    queryFn: async () => {
      const postsData: Record<number, Post[]> = {};
      for (const user of users) {
        const response = await fetch(`/api/posts/user/${user.id}`);
        if (response.ok) {
          const posts = await response.json();
          postsData[user.id] = posts;
        }
      }
      return postsData;
    },
    enabled: users.length > 0,
  });

  const createUser = useMutation({
    mutationFn: async (data: UserFormData) => {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error("Failed to create user");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      toast({
        title: "Success",
        description: "User created successfully",
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

  const onSubmit = (data: UserFormData) => {
    createUser.mutate(data);
  };

  if (isLoadingUsers) {
    return <div className="container mx-auto p-4">Loading users...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Create New User</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <Input
                  placeholder="Username"
                  {...form.register("username")}
                />
                {form.formState.errors.username && (
                  <p className="text-red-500">{form.formState.errors.username.message}</p>
                )}

                <Input
                  type="email"
                  placeholder="Email"
                  {...form.register("email")}
                />
                {form.formState.errors.email && (
                  <p className="text-red-500">{form.formState.errors.email.message}</p>
                )}

                <Input
                  type="password"
                  placeholder="Password"
                  {...form.register("password")}
                />
                {form.formState.errors.password && (
                  <p className="text-red-500">{form.formState.errors.password.message}</p>
                )}

                <Button type="submit" disabled={createUser.isPending}>
                  Create User
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Users and Their Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {users.map((user) => (
                <Card key={user.id} className="p-4">
                  <div className="mb-4">
                    <h3 className="text-lg font-bold">{user.username}</h3>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                  <div className="pl-4">
                    <h4 className="text-sm font-semibold mb-2">Posts:</h4>
                    {isLoadingPosts ? (
                      <p className="text-sm text-muted-foreground">Loading posts...</p>
                    ) : userPosts[user.id]?.length > 0 ? (
                      <ul className="space-y-2">
                        {userPosts[user.id].map((post) => (
                          <li key={post.id} className="text-sm">
                            <strong>{post.title}</strong>
                            <p className="text-muted-foreground">{post.content}</p>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-muted-foreground">No posts found</p>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}