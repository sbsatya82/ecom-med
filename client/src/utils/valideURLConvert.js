export const valideURLConvert = (name) => {
    return name
      ?.toString()
      .replace(/[ /,&]+/g, "-") // replaces space, slash (/), comma, and & with "-"
      .replace(/-+/g, "-")      // replaces multiple dashes with a single one
      .toLowerCase()
      .trim();
  }
  