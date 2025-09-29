import "./quantitySelector.css";

type QuantitySelectorProps = {
	value: number;
	onChange: (value: number) => void;
	disabled?: boolean;
	max?: number;
};

export const QuantitySelector = ({
									 value,
									 onChange,
									 disabled = false,
									 max = 99,
								 }: QuantitySelectorProps) => {
	const increment = () => {
		if (value < max) {
			onChange(value + 1);
		}
	};

	const decrement = () => {
		if (value > 1) {
			onChange(value - 1);
		}
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newValue = parseInt(e.target.value, 10);
		if (!isNaN(newValue) && newValue >= 1 && newValue <= max) {
			onChange(newValue);
		}
	};

	return (
		<div className={`quantity-selector ${disabled ? 'disabled' : ''}`}>
			<button
				type="button"
				onClick={decrement}
				disabled={value === 1 || disabled}
				aria-label="Diminuer la quantité"
				className="quantity-btn decrement"
			>
				−
			</button>
			<input
				type="number"
				className="quantity-input"
				value={value}
				onChange={handleInputChange}
				min="1"
				max={max}
				disabled={disabled}
				aria-label="Quantité"
			/>
			<button
				type="button"
				onClick={increment}
				disabled={value >= max || disabled}
				aria-label="Augmenter la quantité"
				className="quantity-btn increment"
			>
				+
			</button>
		</div>
	);
};