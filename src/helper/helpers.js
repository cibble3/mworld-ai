import he from "he";
import DOMPurify from "dompurify";
export const stripTags = (str) => {
  return str.replace(/<[^>]+>/g, "");
};

export const truncateString = (str, maxLength) => {
  if (str.length <= maxLength) {
    return str;
  }
  return str.substring(0, maxLength) + "...";
};

export const removeHtmlEntities = (str) => {
  return str.replace(/&[^\s;]+;/g, "");
};

export const renderProcessedContent = (text, limit = 160) => {
  return truncateString(
    removeHtmlEntities(stripTags(he.decode(text))),
    limit
  ).toLowerCase();
};
export const decodeAndSanitizeHTML = (htmlContent) => {
  if (!htmlContent) return "";

  // Decode HTML entities
  const decodedContent = he.decode(htmlContent);

  // Sanitize the decoded HTML content
  const sanitizedContent = DOMPurify.sanitize(decodedContent);

  return sanitizedContent;
};
export const slugify = (str) => {
  return str
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
};

export const capitalizeString = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};
