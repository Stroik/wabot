import { Link } from "@tanstack/react-router";
import { trpc } from "../trpc";
import Modal from "../components/common/Modal";
import Card from "../components/common/Card";
import { FormEvent, useState } from "react";

export default function Books() {
  const { data } = trpc.book.getBooks.useQuery();
  const createBook = trpc.book.createBook.useMutation();
  const utils = trpc.useContext();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [form, setForm] = useState<{ name: string; description: string }>({
    name: "",
    description: "",
  });

  const handleChange = (e: FormEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleNewBook = async (e: FormEvent<HTMLFormElement>) => {
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
  return (
    <div className="flex flex-col w-full">
      <div className="header flex flex-col">
        <div className="action flex justify-between">
          <h1 className="text-3xl mb-4 pb-2 border-b">Agendas</h1>
          <button
            className="rounded px-4 py-2 bg-cyan-700 text-white"
            onClick={() => setIsOpen(true)}
          >
            + Agenda
          </button>
        </div>
      </div>
      <ul>
        {data?.map((book: any) => (
          <li key={book._id} className="text-xl">
            <Link to={`/books/${book._id}/contacts`}>{book.name}</Link>
          </li>
        ))}
      </ul>
      <Modal
        title="Agregar nueva agenda de contactos"
        onClose={() => setIsOpen(false)}
        onConfirm={(e) => handleNewBook(e)}
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
              onChange={(e) => handleChange(e)}
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
    </div>
  );
}
