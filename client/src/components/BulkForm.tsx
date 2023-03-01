import { useEffect, useState } from "react";
import UploadCsv from "./UploadCsv";
import {
  generateMessages,
  getInterpolationVars,
} from "../utils/processDataToSend";
import { trpc } from "../trpc";
import Loading from "./common/Loading";
import { toast } from "react-toastify";
import { RiInformationFill } from "react-icons/ri";

export default function BulkForm() {
  const [results, setResults] = useState<any>([]);
  const [message, setMessage] = useState<string>("");
  const [timeout, setTimeout] = useState<number>(0);
  const [vars, setVars] = useState<string[]>([]);
  const [disabled, setDisabled] = useState<boolean>(false);
  const [url, setUrl] = useState<string>("");

  const sendBulk = trpc.bot.sendBulk.useMutation();

  const addVarToMessage = (varName: string) => {
    setMessage((prev) => `${prev}${varName}`);
    setVars((prev) => prev.filter((v) => v !== varName));
  };

  const sendBulkMessages = () => {
    let data = generateMessages({ data: results, message });
    let dataToSend = { data, timeout, url };
    setDisabled(true);
    sendBulk.mutate(dataToSend, {
      onSuccess: () => {
        toast.success("Todos los mensajes se han enviado correctamente");
        setResults([]);
        setMessage("");
        setTimeout(0);
        setVars([]);
        setDisabled(false);
      },
      onError: (err) => {
        toast.error(err.message);
        setDisabled(false);
      },
    });
  };

  useEffect(() => {
    if (results.length > 0) {
      setVars(getInterpolationVars(results));
    }
  }, [results]);
  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex gap-4 h-full w-full">
        <UploadCsv setState={setResults} disabled={disabled} />
        <div className="w-full flex flex-col justify-between">
          {vars.length > 0 && (
            <div className="flex flex-col">
              <h2 className="text-2xl -mt-2">Variables</h2>
              <p className="py-2">
                Las variables se reemplazaran por cada dato correspondiente del
                archivo CSV. <strong>Click para agregarlas al mensaje</strong>
              </p>
              <div className="flex flex-wrap gap-1 py-2">
                {vars.map((v, i) => (
                  <span
                    className="bg-sky-900 rounded-full px-3 py-1 text-sm text-gray-100 mr-2 cursor-pointer hover:opacity-80"
                    key={i}
                    onClick={() => addVarToMessage(v)}
                  >
                    {v}
                  </span>
                ))}
              </div>
            </div>
          )}
          <textarea
            id="message"
            name="message"
            placeholder="Hola ${nombre}, cómo estás?"
            className="border border-gray-300 rounded-lg p-2 mt-2 w-full"
            onChange={({ target }) => setMessage(target.value)}
            value={message}
            disabled={disabled}
            rows={6}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-3 items-start">
        <div className="flex-col">
          <UploadMedia url={url} setUrl={setUrl} />
        </div>
        <div className="flex-col">
          <label htmlFor="timeout" className="font-semibold text-zinc-600">
            Tiempo de espera entre mensaje{" "}
          </label>
          <input
            type="number"
            name="timeout"
            id="timeout"
            min={0}
            placeholder="Tiempo de espera entre mensajes"
            className="border border-gray-300 rounded-lg p-2 w-full"
            defaultValue={Number(timeout)}
            onChange={({ target }) => setTimeout(Number(target.value))}
            disabled={disabled}
          />
        </div>
        <div className="w-full">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded flex items-center justify-center gap-2 mt-4 w-full"
            disabled={disabled}
            onClick={sendBulkMessages}
          >
            Enviar {sendBulk.isLoading && <Loading />}
          </button>
        </div>
      </div>
      <div className="alert">
        {results.length > 0 && (
          <div className="total p-4 border rounded bg-teal-700 text-white grid gap-2 grid-flow-col-dense items-center">
            <RiInformationFill size={30} />
            <div>
              <span>Se enviarán un total de</span>{" "}
              <span className="font-bold">{results.length} mensajes</span>{" "}
              <span>
                {timeout == 0
                  ? "de forma inmediata (no recomendable)"
                  : `con ${timeout} segundos`}
                {timeout >= 15 && "(Excelente!)"}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function UploadMedia({
  url,
  setUrl,
}: {
  url: string;
  setUrl: (url: string) => void;
}) {
  return (
    <>
      <label htmlFor="url" className="font-semibold text-zinc-600">
        URL de la imagen o video
      </label>
      <input
        type="url"
        name="media"
        id="url"
        onChange={({ target }) => setUrl(target.value)}
        placeholder="https://example.com/image.png"
        className="border border-gray-300 rounded-lg p-2 mb-2 w-full"
      />
      {url && <Preview url={url} />}
    </>
  );
}

function Preview({ url }: { url: string }) {
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <div className="flex justify-center items-cente w-full">
      <div className="w-full">{children}</div>
    </div>
  );

  if (url.includes(".mp4") && url.search("https://") != -1) {
    return (
      <Wrapper>
        <video src={url} controls className="w-full rounded"></video>
      </Wrapper>
    );
  }
  if (
    url.includes(".jpg") ||
    (url.includes(".png") && url.search("https://") != -1)
  ) {
    return (
      <Wrapper>
        <img src={url} alt="preview" />
      </Wrapper>
    );
  }
  if (url.search("https://") === -1) {
    return (
      <p className="text-rose-700 text-sm">
        La URL debe empezar con <strong>https://</strong>
      </p>
    );
  }
  return <></>;
}
