export function botStatus(status: string): string {
  switch (status) {
    case "INITIALIZING":
      return "El Whatsapp se está iniciando";
    case "AUTHENTICATED":
      return "El Whatsapp está autenticado";
    case "READY":
      return "Listo para usar";
    default:
      return "Estado desconocido";
  }
}

export function messageStatus(status: string): string {
  switch (status) {
    case "SENT":
      return "Enviado";
    case "SENDING":
      return "Enviando";
    case "FAILED":
      return "FALLÓ";
    default:
      return "UNKNOWN";
  }
}
