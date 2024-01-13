export const removeDollarSign = (amount: string) => {
  return amount.includes("$") ? amount.replace("$", "") : amount;
};

export const removeSpacesInFileNames = (imageFiles: FileList) => {
  return [...imageFiles].map((image) => {
    return image.name.replace(/ /g, "_");
  });
};
