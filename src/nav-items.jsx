import { HomeIcon, UtensilsCrossed, Search, User } from "lucide-react";
import Index from "./pages/Index.jsx";
import RestaurantDetail from "./pages/RestaurantDetail.jsx";
import SearchPage from "./pages/SearchPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";

export const navItems = [
  {
    title: "首页",
    to: "/",
    icon: <HomeIcon className="h-4 w-4" />,
    page: <Index />,
  },
  {
    title: "商家详情",
    to: "/restaurant/:id",
    icon: <UtensilsCrossed className="h-4 w-4" />,
    page: <RestaurantDetail />,
  },
  {
    title: "搜索",
    to: "/search",
    icon: <Search className="h-4 w-4" />,
    page: <SearchPage />,
  },
  {
    title: "个人页",
    to: "/profile",
    icon: <User className="h-4 w-4" />,
    page: <ProfilePage />,
  },
];
