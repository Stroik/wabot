import Input from "../../../components/common/Input";
import Select from "../../../components/common/Select";
import { StepProps } from "../Campaigns";

export default function Step1({ onChange, campaign }: StepProps) {
  return (
    <div className="wizard-general">
      <Input
        label="Título"
        name="title"
        placeholder="Título de la campaña"
        required
        type="text"
        onChange={(e) => onChange(e)}
        value={campaign.title}
      />
      <Input
        label="Descripción"
        name="description"
        placeholder="Descripción de la campaña"
        required
        type="text"
        onChange={(e) => onChange(e)}
        value={campaign.description}
      />
      <Select
        label="Agenda"
        name="bookId"
        onChange={(e) => onChange(e)}
        value={campaign.bookId}
        options={[
          { label: "Agenda 1", value: "1" },
          { label: "Agenda 2", value: "2" },
        ]}
      />
    </div>
  );
}
