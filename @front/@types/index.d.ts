export type TreeCardProps = {
	tree_id: number;
	name: string;
	price: number;
	image: string;
	localization: string;
	project_name: string;
};

export type Item = {
	map(arg0: (item: any) => { price: any; quantity: any }): unknown;
	tree_id: number;
	quantity: number;
	price: number;
	image: string;
	name: string;
};

export type ShoppingCart = { items: Item[]; total: number };
