import {ListingOption} from "@nanahq/sticky";

export  const calculateTotalValue = (
    quantity: number,
    basePrice: number,
    selectedOptions: ListingOption[]
) => {
    let total = basePrice * quantity;
    for (const option of selectedOptions) {
        total += (parseFloat(option.price ) * quantity);
    }
    return total;
};
