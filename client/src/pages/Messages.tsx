import MessageTable from "../components/MessageTable";

export default function Messages() {
  return (
    <div>
      <h1 className="text-3xl mb-4 pb-2 border-b">Mensajes Enviados</h1>
      <p className="pb-4">
        Aqui se muestran los mensajes enviados por los bots, puedes filtrar por{" "}
        <br />
        fecha y por el estado del mensaje.
      </p>
      <MessageTable />
    </div>
  );
}
