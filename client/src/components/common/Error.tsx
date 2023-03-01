export default function Error(res: { info: any; error: any }) {
  const { info, error } = res;

  return (
    <div>
      <h1 className="3xl">Errors</h1>
      <p>{error}</p>
      <p>{info}</p>
    </div>
  );
}
