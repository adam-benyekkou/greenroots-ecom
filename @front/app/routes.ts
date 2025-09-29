import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
	index("pages/home/home.tsx"),
	route("add-to-shopping-cart", "pages/addToShoppingCart.tsx"),
	route("catalog/:continent?", "pages/catalog/catalog.tsx"),
	route("tree/:id", "pages/tree/tree.tsx"),
	route("login", "pages/login/Login.tsx"),
	route("logout", "pages/logout.tsx"),
	route("register", "pages/register/register.tsx"),
	route("about", "pages/about/about.tsx"),
] satisfies RouteConfig;
