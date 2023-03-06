import { useCallback, useState } from "react";
import { useNavigate, useParams } from "@tanstack/react-router";
import { trpc } from "../trpc";
import {
  RiArrowLeftCircleFill,
  RiBook2Fill,
  RiFilter2Fill,
  RiSave3Fill,
} from "react-icons/ri";
import Loading from "../components/common/Loading";
import ContactsValidation from "./ContactsValidation";
import ContactsTable from "../components/ContactsTable";
import { useLocalStorage } from "../hooks/useLocalstorage";

interface ValidateNumberResponse {
  result?: { validNumbers: any[]; invalidNumbers: any[] };
  error?: string;
  status: string;
}

export default function Contacts() {
  const { bookId }: { bookId: any } = useParams();
  const [contacts, setContacts] = useState<object[]>([]);
  const [validNumbs, setValidNumbs] = useState<any[]>([]);
  const [invalidNumbs, setInvalidNumbs] = useState<any[]>([]);
  const [isValidated, setIsValidated] = useState<boolean>(false);
  const [processing, setProcessing] = useState<boolean>(false);
  const [bookName, setBookName] = useLocalStorage("bookName", "");

  const { data, isLoading, isError } = trpc.contact.getContactByBookId.useQuery(
    {
      bookId,
    }
  );
  const validateNumber: any = trpc.bot.validateNumbers.useMutation();
  const createContacts: any = trpc.contact.createContacts.useMutation();
  const utils = trpc.useContext();

  const navigate = useNavigate();

  const formatValidContacts = (contacts: object[]) => {
    let formattedContacts: any[] = [];
    contacts.forEach(({ phone, ...rest }: any) => {
      formattedContacts.push({
        bookId,
        phone,
        valid: true,
        info: { ...rest },
      });
    });
    return formattedContacts;
  };

  const handleValidateNumber = async (contactsArray: object[]) => {
    if (contacts.length === 0) return;
    let response: ValidateNumberResponse = await validateNumber.mutateAsync(
      contacts,
      {
        onSuccess: (data: any) => {
          let validNumbers = formatValidContacts(data.result.validNumbers);
          setValidNumbs(validNumbers);
          setInvalidNumbs(data.result.invalidNumbers);
          setIsValidated(true);
          setContacts(data.result.validNumbers);
          setProcessing(false);
        },
      }
    );
  };

  const formatContacts = useCallback(
    (contacts: object[]) => {
      let formattedContacts: any[] = [];
      contacts.forEach(({ phone, ...rest }: any) => {
        formattedContacts.push({
          bookId,
          phone,
          valid: false,
          info: { ...rest },
        });
      });
      setContacts(formattedContacts);
      return formattedContacts;
    },
    [contacts]
  );

  const saveValidContacts = async () => {
    if (validNumbs.length === 0) return;
    await createContacts.mutateAsync(
      {
        bookId,
        contacts: validNumbs,
      },
      {
        onSuccess: (data: any) => {
          utils.contact.getContactByBookId.invalidate({ bookId });
        },
      }
    );
  };

  const validate = async () => {
    if (contacts.length === 0) return;
    setProcessing(true);
    let contactsToSend = formatContacts(contacts);
    await handleValidateNumber(contactsToSend);
  };

  return (
    <div className="w-full h-full relative">
      <div className="flex flex-row justify-between mb-4 pb-2 border-b">
        <div className="flex flex-row gap-2 items-center">
          <RiArrowLeftCircleFill
            size={32}
            onClick={() => navigate({ to: "/books" })}
          />
          <h1 className="text-3xl">Contactos</h1>
        </div>
        <div className="flex items-center justify-center gap-2">
          <RiBook2Fill size={24} />
          <h1 className="text-2xl">{bookName}</h1>
        </div>
      </div>

      {isLoading || processing ? (
        <div className="absolute grid w-full h-full place-content-center bg-zinc-500 opacity-25">
          <Loading />
        </div>
      ) : null}

      {!isError && !isLoading && data && data.length > 0 ? (
        <ContactsTable data={data} />
      ) : null}

      {!isLoading && contacts.length === 0 && data.length === 0 ? (
        <>
          <ContactsValidation setState={setContacts} contacts={contacts} />
        </>
      ) : null}

      {contacts.length > 0 && data.length === 0 ? (
        <>
          <h1>contacts.length gt 0</h1>
          <ContactsValidation setState={setContacts} contacts={contacts} />
          {invalidNumbs.length === 0 && (
            <button
              className="px-4 py-4 bg-green-500 mb-4 text-white rounded-lg shadow-md w-full flex items-center gap-2 justify-center hover:bg-green-600"
              onClick={() => validate()}
            >
              <RiFilter2Fill size={24} />
              <span>Filtrar números válidos</span>
            </button>
          )}
        </>
      ) : null}

      {validNumbs.length > 0 && (
        <>
          <h1>validNumbs.length gt 0</h1>
          <button
            className="px-4 py-4 bg-cyan-500 text-white rounded-lg shadow-md w-full flex items-center gap-2 justify-center hover:bg-cyan-600"
            onClick={saveValidContacts}
          >
            <RiSave3Fill size={24} />
            <span>Guardar números válidos</span>
          </button>
        </>
      )}
    </div>
  );
}
