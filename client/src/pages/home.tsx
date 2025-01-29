import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Welcome to Multi-Service Demo</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This demo showcases a multi-service architecture with:
          </p>
          <ul className="list-disc pl-6 mt-4 space-y-2">
            <li>Service A: Python Flask backend with user management</li>
            <li>Service B: TypeScript Node.js backend for posts</li>
            <li>GraphQL API Gateway connecting both services</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
