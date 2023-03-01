import BarChart from "../components/BarChart";

export default function Dashboard() {
  return (
    <>
      <div className="flex justify-between mb-4 pb-2 border-b">
        <h1 className="text-3xl">Escritorio</h1>
      </div>
      <div className="grid grid-cols-3 h-64 gap-4 w-full relative">
        <div className="rounded bg-cyan-500 text-white w-full">
          <h1 className="py-4 text-xl px-2">Estadísticas de Mensajes</h1>
          <BarChart className="bg-cyan-500 text-white rounded" />
        </div>
        <div className="rounded bg-rose-700 text-white w-full">
          <h1 className="py-4 text-xl px-2">Bots suspendidos</h1>
          <BarChart className="bg-rose-700 text-white rounded" />
        </div>
        <div className="rounded bg-green-500 text-white w-full">
          <h1 className="py-4 text-xl px-2">Otra gráfica</h1>
          <BarChart className="bg-green-500 text-white rounded" />
        </div>
      </div>
    </>
  );
}
