import { ChangeEvent, FormEvent, useState } from "react";
import {
  RiContactsBookUploadFill,
  RiEyeFill,
  RiMailAddFill,
} from "react-icons/ri";
import { Link, useNavigate } from "@tanstack/react-router";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { trpc } from "../trpc";
import Modal from "../components/common/Modal";
import Card from "../components/common/Card";
import { useLocalStorage } from "../hooks/useLocalstorage";

export default function Books() {
  const { data } = trpc.book.getBooks.useQuery();
  const createBook = trpc.book.createBook.useMutation();
  const utils = trpc.useContext();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [form, setForm] = useState<{ name: string; description: string }>({
    name: "",
    description: "",
  });
  const [bookName, setBookName] = useLocalStorage("bookName", "");

  const navigate = useNavigate();

  const handleChange = (
    e: ChangeEvent<HTMLTextAreaElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.currentTarget;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleNewBook = async (e: FormEvent<HTMLFormElement | any>) => {
    e.preventDefault();
    if (typeof form.name === "string" && typeof form.description === "string") {
      await createBook.mutateAsync(
        {
          name: form.name,
          description: form.description,
        },
        {
          onSuccess: () => {
            utils.book.invalidate();
          },
        }
      );
      setIsOpen(false);
    }
  };

  const goTo = (id: string) => {
    data?.filter((book: any) => {
      if (book._id === id) {
        setBookName(book.name);
      }
      const url = `/books/${id}/contacts`;
      navigate({ to: url, search: {}, params: {} });
    });
  };

  const buttonsCards = [
    {
      icon: <RiEyeFill size={20} className="tool-tip" />,
      onClick: (id: string) => goTo(id),
      label: "",
      style:
        "bg-green-500 text-white hover:opacity-90 flex flex-col justify-center items-center",
      show: true,
      "data-tooltip-content": "Ver contactos",
    },
    {
      icon: <RiMailAddFill size={20} className="tool-tip" />,
      onClick: (id: string) => console.log(id),
      label: "",
      style:
        "bg-pink-700 text-white hover:opacity-90 flex flex-col justify-center items-center",
      show: true,
      "data-tooltip-content": "Nueva campaña",
    },
  ];

  return (
    <div className="flex flex-col w-full gap-4">
      <div className="flex justify-between mb-4 pb-2 border-b">
        <h1 className="text-3xl">Agendas</h1>
        <button
          className="rounded px-4 py-2 text-white bg-cyan-600 flex items-center gap-2 group hover:bg-cyan-700"
          onClick={() => setIsOpen(true)}
        >
          <RiContactsBookUploadFill
            size={24}
            className="text-zinc-100 group-hover:text-green-500"
          />
          <span>Nueva Agenda</span>
        </button>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {data?.map((book: any) => (
          <Card
            key={book._id}
            buttons={buttonsCards}
            title={book.name}
            id={book._id}
          >
            <div className="grid place-items-center p-4 gap-4">
              {book.description ? (
                <p className="text-center">{book.description}</p>
              ) : null}

              <span className="text-center">
                {book.count === 0 ? (
                  <span>
                    <strong className="text-cyan-700">
                      La agenda no tiene contactos asociados, hacé{" "}
                      <span
                        className="text-cyan-600 cursor-pointer"
                        onClick={() => goTo(book._id)}
                      >
                        click acá
                      </span>{" "}
                      para agregar una base de datos
                    </strong>
                  </span>
                ) : (
                  <span className="text-md">
                    Un total de{" "}
                    <strong className="text-cyan-800 text-lg">
                      {book.count}
                    </strong>{" "}
                    contactos cargados
                  </span>
                )}
              </span>
            </div>
          </Card>
        ))}
      </div>
      <Modal
        title="Agregar nueva agenda de contactos"
        onClose={() => setIsOpen(false)}
        actionsButtons={[
          {
            label: "Cancelar",
            onClick: () => setIsOpen(false),
            condition: true,
          },
          {
            label: "Guardar",
            onClick: (e: any) => handleNewBook(e),
            condition: true,
          },
        ]}
        isOpen={isOpen}
      >
        <form
          onSubmit={(e) => handleNewBook(e)}
          className="flex flex-col gap-4 w-full"
        >
          <label htmlFor="name" className="flex w-full justify-between">
            <span className="font-bold">Nombre</span>
            <input
              type="text"
              id="name"
              name="name"
              className="rounded border border-zinc-300 px-2 py-2"
              value={form.name}
              onChange={(e: any) => handleChange(e)}
            />
          </label>
          <label htmlFor="description" className="flex w-full justify-between">
            <span className="font-bold">Descripción</span>
            <textarea
              name="description"
              id="description"
              className="rounded border border-zinc-300 px-2 py-2 h-32"
              value={form.description}
              onChange={(e) => handleChange(e)}
            ></textarea>
          </label>
        </form>
      </Modal>
      <ReactTooltip anchorSelect=".tool-tip" place="top" />
    </div>
  );
}
