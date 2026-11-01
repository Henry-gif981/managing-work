// Display switches that the group may flip without touching CSS (see reports/design-changelog.md).
export const DESIGN = {
  // Cover: draw the lecturer line as a dashed "to fill in" warning while it still holds a placeholder
  // ("[...]"). Once the group writes the real name in content/deck.yaml (meta.lecturer) the line turns into a
  // normal cover line by itself; set to false to hide the warning style even with the placeholder.
  showPlaceholderWarning: true,
};
export const isPlaceholder = (text) => /\[[^\]]*\]/.test(String(text || ''));
