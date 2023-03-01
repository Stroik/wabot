import BulkForm from "../components/BulkForm";

export default function Bulk() {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-3xl">Envío Masivo</h1>
      <p className="py-2">
        Este formulario de envío masivo te permite cargar un{" "}
        <strong>archivo CSV</strong> con todos los datos. El mismo puede
        contener la cantidad de campos (variables) que necesites, pero siempre
        el primer campo debe ser el número de teléfono.
      </p>
      <div className="flex justify-center items-center">
      <BulkForm />

      </div>
    </div>
  );
}
