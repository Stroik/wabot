import { Route, ReactRouter, RootRoute } from "@tanstack/react-router";
import Layout from "./components/common/Layout";
import Dashboard from "./pages/Dashboard";
import Bots from "./pages/Bots";
import Messages from "./pages/Messages";
import Bulk from "./pages/Bulk";
import Campaigns from "./pages/Campaigns";
import Contacts from "./pages/Contacts";
import ContactsValidation from "./pages/ContactsValidation";
import Books from "./pages/Books";

const rootRoute = new RootRoute({
  component: () => <Layout />,
});

const dashboardRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/",
  component: () => <Dashboard />,
});

const botsRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "bots",
  component: () => <Bots />,
});

const messagesRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "messages",
  component: () => <Messages />,
});

const bulkRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "envios",
  component: () => <Bulk />,
});

const campaignsRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "campaigns",
  component: () => <Campaigns />,
});

const booksRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "books",
});

const booksIndexRoute = new Route({
  getParentRoute: () => booksRoute,
  path: "/",
  component: () => <Books />,
});

const booksContactsRoute = new Route({
  getParentRoute: () => booksRoute,
  path: "$bookId/contacts",
  component: () => <Contacts />,
});

const routeTree = rootRoute.addChildren([
  dashboardRoute,
  botsRoute,
  messagesRoute,
  bulkRoute,
  campaignsRoute,
  booksRoute.addChildren([booksIndexRoute, booksContactsRoute]),
]);

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export const router = new ReactRouter({ routeTree });
