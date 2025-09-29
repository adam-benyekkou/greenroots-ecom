import { useState } from "react";
import "./quantitySelector.css";

type QuantitySelectorProps = {
	value: number;
	onChange: (value: number) => void;
};

export const QuantitySelector = ({
	value,
	onChange,
}: QuantitySelectorProps) => {
	const increment = () => {
		onChange(value + 1);
	};

	const decrement = () => {
		if (value > 1) {
			onChange(value - 1);
		}
	};

	return (
		<div className="quantity-selector">
			<button type="button" onClick={decrement} disabled={value === 1}>
				-
			</button>
			<span className="quantity-count">{value}</span>
			<button type="button" onClick={increment}>
				+
			</button>
		</div>
	);
};
