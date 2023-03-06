import { useState } from "react";
import Modal from "../components/common/Modal";

export default function Campaigns() {
  const [open, setOpen] = useState<boolean>(true);
  return (
    <div>
      <h1>Campaigns</h1>
      <button onClick={() => setOpen(true)}>Open Modal</button>
      <Modal
        title="Some title"
        isOpen={open}
        onClose={() => setOpen(false)}
      >
        <div className="flex">
          <img src="https://via.placeholder.com/400x400/2e2e2e/fafafa" alt="placeholder" />
        </div>
      </Modal>
    </div>
  );
}
