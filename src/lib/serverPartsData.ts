const url =
  "https://services.mybcapps.com/bc-sf-filter/filter?shop=usatechrepair.myshopify.com&product_available=true";

async function fetchServerPartsData() {
  const response = fetch(url);
  if (!(await response).ok)
    throw new Error("Failed to fetch serverpartdeals data");

  return (await response).json();
}

export { fetchServerPartsData };
