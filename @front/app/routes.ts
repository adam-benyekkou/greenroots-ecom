import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
	index("pages/home/home.tsx"),
	route("add-to-shopping-cart", "pages/addToShoppingCart.tsx"),
	route("catalog/:continent?", "pages/catalog/catalog.tsx"),
	route("tree/:id", "pages/tree/tree.tsx"),
] satisfies RouteConfig;
