import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import axios from "axios";

interface User {
  id: number;
  username: string;
  email: string;
  verified: boolean;
}

interface Post {
  id: number;
  title: string;
  content: string;
  userId: number;
}

export default function VerifyPage() {
  const userId = 1; // For demonstration, we'll use user ID 1

  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ["verifyUser", userId],
    queryFn: async () => {
      const response = await axios.get<User>(
        `/internal/api/users/verify/${userId}`
      );
      return response.data;
    },
  });

  const { data: posts, isLoading: postsLoading } = useQuery({
    queryKey: ["userPosts", userId],
    queryFn: async () => {
      const response = await axios.get<Post[]>(
        `/internal/api/posts/user/${userId}`
      );
      return response.data;
    },
    enabled: !!user?.verified,
  });

  if (userLoading) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-48" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Service Communication Verification</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {user && (
            <Alert>
              <AlertTitle>User Verification (Service A)</AlertTitle>
              <AlertDescription>
                <div className="mt-2 space-y-1">
                  <p>Username: {user.username}</p>
                  <p>Email: {user.email}</p>
                  <p>Verification Status: {user.verified ? "Verified" : "Not Verified"}</p>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {user?.verified && (
            <Alert>
              <AlertTitle>User Posts (Service B)</AlertTitle>
              <AlertDescription>
                {postsLoading ? (
                  <Skeleton className="h-20 w-full mt-2" />
                ) : (
                  <div className="mt-2 space-y-2">
                    {posts?.map((post) => (
                      <div key={post.id} className="p-2 border rounded">
                        <h3 className="font-medium">{post.title}</h3>
                        <p className="text-sm text-muted-foreground">{post.content}</p>
                      </div>
                    ))}
                    {(!posts || posts.length === 0) && (
                      <p className="text-sm text-muted-foreground">No posts found for this user</p>
                    )}
                  </div>
                )}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
