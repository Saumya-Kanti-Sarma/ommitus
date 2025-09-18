// utils/handleOnChange.ts
export const handleOnChange = (
  e: React.ChangeEvent<HTMLInputElement>
) => {
  e.preventDefault();
  const { name, value, files } = e.target;

  // 1. Handle file input
  if (files && files[0]) {
    const file = files[0];
    return {
      [name]: {
        file,
        preview: URL.createObjectURL(file),
      },
    };
  }

  // 2. Handle special boolean fields
  if (name === "veg") {
    return { veg: value === "Yes" };
  }

  if (name === "available") {
    return { available: value === "Available" };
  }

  // 3. Handle comma-separated categories
  if (name === "categories") {
    const categoryList = value
      .split(",")
      .map((cat) => cat.trim())
      .filter(Boolean);

    return { categories: categoryList };
  }

  // 4. Default case: just return key-value
  return { [name]: value };
};
