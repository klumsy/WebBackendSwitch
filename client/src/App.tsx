import { Switch, Route, Link } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import UsersPage from "@/pages/service-a/users";

function Navigation() {
  return (
    <nav className="bg-background border-b">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center space-x-4">
          <Link href="/">
            <a className="text-foreground hover:text-primary">Home</a>
          </Link>
          <Link href="/users">
            <a className="text-foreground hover:text-primary">Users</a>
          </Link>
        </div>
      </div>
    </nav>
  );
}

function Router() {
  return (
    <div>
      <Navigation />
      <Switch>
        <Route path="/users" component={UsersPage} />
        <Route component={NotFound} />
      </Switch>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;