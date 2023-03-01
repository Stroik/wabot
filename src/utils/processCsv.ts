interface CsvEntry {
  [key: string]: any;
}

interface ProcessedCsvEntry {
  phone: string;
  msg: string;
}

export const processCsv = (
  entries: CsvEntry[],
  template: string
): ProcessedCsvEntry[] => {
  return entries.map((entry) => {
    const phoneNumber = entry[Object.keys(entry)[0]];
    let processedTemplate = template;
    Object.keys(entry).forEach((key) => {
      if (key !== Object.keys(entry)[0]) {
        processedTemplate = processedTemplate.replace(`\${${key}}`, entry[key]);
      }
    });
    return {
      phone: phoneNumber,
      msg: processedTemplate,
    };
  });
};
