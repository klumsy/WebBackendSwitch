import { Switch, Route, Link } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import UsersPage from "@/pages/service-a/users";
import PostsPage from "@/pages/service-b/posts";
import VerifyPage from "@/pages/service-a/verify";
import Calculator from "@/pages/service-c/calculator";
import Home from "@/pages/home";

function Navigation() {
  return (
    <nav className="bg-background border-b">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center space-x-4">
          <Link href="/" className="text-foreground hover:text-primary">
            Home
          </Link>
          <Link href="/users" className="text-foreground hover:text-primary">
            Users
          </Link>
          <Link href="/posts" className="text-foreground hover:text-primary">
            Posts
          </Link>
          <Link href="/verify" className="text-foreground hover:text-primary">
            Verify Services
          </Link>
          <Link href="/calculator" className="text-foreground hover:text-primary">
            Calculator
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
        <Route path="/" component={Home} />
        <Route path="/users" component={UsersPage} />
        <Route path="/posts" component={PostsPage} />
        <Route path="/verify" component={VerifyPage} />
        <Route path="/calculator" component={Calculator} />
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