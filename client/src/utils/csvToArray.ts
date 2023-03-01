export const csvToArray = (str: string, delimiter: string = ",") => {
  const headers = str.slice(0, str.indexOf("\n")).split(delimiter);
  const rows = str.slice(str.indexOf("\n") + 1).split("\n");

  const arr: object[] = rows.map((row: string) => {
    const values: string[] = row.replace(/\r/g, "").split(delimiter);
    const el: object = headers.reduce(
      (object: { [key: string]: string }, header: string, index: number) => {
        let value = values[index];
        let _header = header.replace(/\r/g, "");
        if (value !== "") {
          object[_header] = value;
        }
        return object;
      },
      {}
    );
    return el;
  });
  return arr;
};
