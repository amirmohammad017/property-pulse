export function convertToSerializableObject(
  leanDocument: Record<string, unknown>
) {
  for (const key of Object.keys(leanDocument)) {
    const value = leanDocument[key];
    if (
      value !== null &&
      typeof value === "object" &&
      "toJSON" in value &&
      "toString" in value
    ) {
      leanDocument[key] = value.toString();
    }
  }
  return leanDocument;
}
