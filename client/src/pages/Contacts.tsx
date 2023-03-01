import { useCallback, useEffect, useState } from "react";
import { useParams } from "@tanstack/react-router";
import { trpc } from "../trpc";
import { Tooltip as ReactTooltip } from "react-tooltip";
import Loading from "../components/common/Loading";
import UploadCsv from "../components/UploadCsv";
import ContactsTable from "../components/ContactsTable";

interface ValidateNumberResponse {
  result?: { validNumbers: any[]; invalidNumbers: any[] };
  error?: string;
  status: string;
}

export default function Contacts() {
  const { bookId }: { bookId: string } = useParams();
  const [contacts, setContacts] = useState<object[]>([]);
  const [validNumbs, setValidNumbs] = useState<any[]>([]);
  const [invalidNumbs, setInvalidNumbs] = useState<any[]>([]);
  const [isValidated, setIsValidated] = useState<boolean>(false);

  const { data, isLoading } = trpc.contact.getContactByBookId.useQuery({
    bookId,
  });
  const validateNumber: any = trpc.bot.validateNumbers.useMutation();
  const utils = trpc.useContext();

  const handleValidateNumber = async (contactsArray: object[]) => {
    if (contacts.length === 0) return;
    let response: ValidateNumberResponse = await validateNumber.mutateAsync(
      contacts,
      {
        onSuccess: (data: any) => {
          console.log(data);
          setValidNumbs(data.result.validNumbers);
          setInvalidNumbs(data.result.invalidNumbers);
          setIsValidated(true);
        },
      }
    );
  };

  const formatContacts = useCallback(
    (contacts: object[]) => {
      let formattedContacts: any[] = [];
      contacts.forEach(({ phone, ...rest }: any) => {
        formattedContacts.push({
          phone,
          valid: false,
          info: { ...rest },
        });
      });
      setContacts(formattedContacts);
    },
    [contacts]
  );

  useEffect(() => {
    if (contacts.length) {
      formatContacts(contacts);
    }
  }, [contacts]);

  return (
    <div className="w-full h-full">
      <h1 className="text-3xl">Contactos</h1>
      <hr />
      {isLoading && (
        <div className="w-full h-full grid place-content-center">
          <Loading />
        </div>
      )}
      {!data || data.length === 0 ? (
        <div className="w-full h-full flex flex-col justify-center items-center">
          <h1 className="text-2xl py-4">No hay contactos</h1>
          <UploadCsv setState={setContacts} />
          {contacts.length ? (
            <div>
              <button
                className="rounded px-4 py-2 bg-cyan-700 text-white my-4"
                onClick={() => handleValidateNumber(contacts)}
              >
                Filtrar números válidos
              </button>
            </div>
          ) : null}
          {isValidated ? (
            <div className="flex flex-col gap-2 items-center justify-center">
              <div className="results flex gap-4">
                <h1 className="text-2xl py-4">
                  Números válidos:{" "}
                  <span className="text-green-800 font-bold">
                    {validNumbs.length}
                  </span>
                </h1>
                <h1 className="text-2xl py-4">
                  Números inválidos:{" "}
                  <span className="text-rose-800 font-bold">
                    {invalidNumbs.length}
                  </span>
                </h1>
              </div>
              <button className="rounded px-4 py-2 bg-green-500 text-white">
                Agendar números válidos
              </button>
            </div>
          ) : (
            <Loading />
          )}
        </div>
      ) : (
        <ContactsTable data={data} />
      )}
      <ReactTooltip anchorSelect=".tool-tip" place="top" />
    </div>
  );
}
