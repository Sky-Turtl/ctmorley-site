// Product ids look like `slug__group__model` and the model portion can contain
// characters that are unsafe in a URL (spaces, "/", "&"), so always encode when
// building a link and decode when reading it back.
export const productPath = (id) => `/product/${encodeURIComponent(id)}`;

export const decodeProductId = (encoded) => {
  if (!encoded) return null;
  try {
    return decodeURIComponent(encoded);
  } catch {
    return encoded;
  }
};
