import type { Route } from "./+types/addToShoppingCart";

export async function action(params: Route.ActionArgs) {
	// Add the request formData to the shopping cart cookie
	const formData = await params.request.formData();

	const treeIdData = formData.get("treeId");
	const quantityData = formData.get("quantity");

	const treeId = Number.parseInt(treeIdData);
	const quantity = Number.parseInt(quantityData);

	// See https://reactrouter.com/explanation/sessions-and-cookies#sessions
	// TODO: Get the current shopping cart from the session (in cookie)
	// TODO: Add the item to the shopping cart
	// TODO: Write the new shopping cart in the session (in cookie)
}
