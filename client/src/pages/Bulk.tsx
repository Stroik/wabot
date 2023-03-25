import BulkForm from "../components/BulkForm";
import PageTitle from "../components/common/PageTitle";

export default function Bulk() {
  return (
    <div className="flex flex-col gap-2">
      <PageTitle
        title="Campaña Express"
        subtitle="Realizar un envío masivo de mensajes utilizando un archivo CSV con contactos y variables. La dferencia con la campaña estandar es que no se puede programar el envío y los contactos no se guardan en la agenda."
      />
      <div className="flex justify-center items-center">
        <BulkForm />
      </div>
    </div>
  );
}
