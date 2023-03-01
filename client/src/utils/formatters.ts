export function formatPhone(phone: string) {
  var cleaned = ("" + phone).replace(/\D/g, "");
  var match = cleaned.match(/^(549|)?(\d{2})(\d{4})(\d{4})$/);
  if (match) {
    var intlCode = match[1] ? "+54 9 " : "";
    return [intlCode, "(", match[2], ") ", match[3], "-", match[4]].join("");
  }
  return null;
}
