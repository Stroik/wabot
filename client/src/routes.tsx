import { Route, ReactRouter, RootRoute } from "@tanstack/react-router";
import Layout from "./components/common/Layout";
import Dashboard from "./pages/Dashboard";
import Bots from "./pages/Bots";
import Messages from "./pages/Messages";
import Bulk from "./pages/Bulk";
import Campaigns from "./pages/Campaigns/Campaigns";
import Contacts from "./pages/Contacts";
import Books from "./pages/Books";
import Interact from "./pages/Interact";
import NewCampaign from "./pages/Campaigns/NewCampaign";
import { CampaignProvider } from "./pages/Campaigns/CampaignContext";

const rootRoute = new RootRoute({
  component: () => <Layout />,
});

const dashboardRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/",
  component: () => <Dashboard />,
});

const messagesRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "messages",
  component: () => <Messages />,
});

const campaignsRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "campaigns",
});

const campaignIndexRoute = new Route({
  getParentRoute: () => campaignsRoute,
  path: "/",
  component: () => <Campaigns />,
});

const campaignNewRoute = new Route({
  getParentRoute: () => campaignsRoute,
  path: "new",
  component: () => <NewCampaign />,
});

const campaignExpressRoute = new Route({
  getParentRoute: () => campaignsRoute,
  path: "express",
  component: () => <Bulk />,
});

const botsRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "bots",
});

const booksRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "books",
});

const botsIndexRoute = new Route({
  getParentRoute: () => botsRoute,
  path: "/",
  component: () => <Bots />,
});

const botsInteractRoute = new Route({
  getParentRoute: () => botsRoute,
  path: "$botId/interact",
  component: () => <Interact />,
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
  messagesRoute,
  campaignsRoute.addChildren([campaignIndexRoute, campaignNewRoute, campaignExpressRoute]),
  booksRoute.addChildren([booksIndexRoute, booksContactsRoute]),
  botsRoute.addChildren([botsIndexRoute, botsInteractRoute]),
]);

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export const router = new ReactRouter({ routeTree });
