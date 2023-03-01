interface Person {
  [key: string]: string;
}

interface Message {
  phone: string;
  message: string;
}

function rightNow() {
  const padL = (nr: number, len = 2, chr = `0`) => `${nr}`.padStart(2, chr);
  const now = new Date();
  const year = now.getFullYear();
  const month = padL(now.getMonth() + 1);
  const day = padL(now.getDate());
  const hour = padL(now.getHours());
  const minute = padL(now.getMinutes());
  const second = padL(now.getSeconds());
  const milisecond = String(Math.floor(Math.random() * 1500000000)).substring(
    0,
    3
  );
  return `${day}/${month}/${year} ${hour}:${minute}:${second}:${milisecond}`;
}

export function generateMessages(data: {
  data: Person[];
  message: string;
}): Message[] {
  return data.data.map((person: Person) => {
    const phone = Object.values(person)[0];
    let message = data.message;
    Object.entries(person).forEach(([key, value]) => {
      message = message.replace("${" + key + "}", value);
      if (message.includes("fecha")) {
        message = message.replace("${fecha}", rightNow());
      }
    });
    return {
      phone,
      message,
    };
  });
}

export function getInterpolationVars(
  data: Array<Record<string, string>>
): Array<string> {
  const interpolationVars = new Set<string>();
  const phoneKey = Object.keys(data[0])[0];
  data.forEach((entry) => {
    Object.keys(entry).forEach((key) => {
      if (key !== phoneKey) {
        interpolationVars.add(`\${${key}}`);
      }
    });
  });
  return Array.from(interpolationVars);
}
