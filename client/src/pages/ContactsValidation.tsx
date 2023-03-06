import React from "react";
import UploadCsv from "../components/UploadCsv";
import ContactsTable from "../components/ContactsTable";

interface ContactsValidationProps {
  contacts: any;
  setState: React.Dispatch<React.SetStateAction<any[]>>;
}

export default function ContactsValidation({
  contacts,
  setState,
}: ContactsValidationProps) {
  return (
    <>
      {contacts.length === 0 ? (
        <div className="grid w-full h-[calc(100%-80px)] place-content-center">
          <UploadCsv setState={setState} />
        </div>
      ) : (
        <div className="flex flex-col">
          <ContactsTable data={contacts} />
        </div>
      )}
    </>
  );
}
