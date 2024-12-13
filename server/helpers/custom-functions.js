const flattenObject = (obj, prefix = "") => {
  let flattened = {};

  for (const [key, value] of Object.entries(obj)) {
    const newKey = prefix ? `${prefix}_${key}` : key;

    if (Array.isArray(value)) {
      value.forEach((item, index) => {
        if (typeof item === "object" && item !== null) {
          Object.assign(flattened, flattenObject(item, `${newKey}[${index}]`));
        } else {
          flattened[`${newKey}[${index}]`] = item;
        }
      });
    } else if (value && typeof value === "object" && value !== null) {
      Object.assign(flattened, flattenObject(value, newKey));
    } else {
      flattened[newKey] = value;
    }
  }

  return flattened;
};

const transformKey = (key) => {
  return key
    .replace(/_/g, " ").split(".")
    .map((word) =>
      word.split(" ").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ") 
    ).join(" ");
};

const generateColumnDefinitions = (schema) => {
  const columns = [];

  schema.eachPath((path, schemaType) => {
    if (path === "__v" || path === "_id") return;
    path = path.split(".").join("_");
    let columnDef = {
      headerName: transformKey(path),
      field: path,
      sortable: true,
      filter: true,
      resizable: true,
    };

    if (schemaType.instance === "Array") {
      columnDef.cellRenderer = (params) => JSON.stringify(params.value);
    } else if (schemaType.instance === "Date") {
      columnDef.valueFormatter = (params) =>
        params.value ? new Date(params.value).toLocaleDateString() : "";
    } else if (schemaType.instance === "Number") {
      columnDef.filter = "agNumberColumnFilter";
    } else if (schemaType.instance === "String") {
      columnDef.filter = "agTextColumnFilter"; 
    }

    columns.push(columnDef);
  });

  return columns;
};

module.exports = {
    flattenObject,
    generateColumnDefinitions
}