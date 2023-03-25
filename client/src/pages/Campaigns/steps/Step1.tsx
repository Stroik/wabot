import { useEffect, useState } from "react";
import Input from "../../../components/common/Input";
import Select, { Option } from "../../../components/common/Select";
import { trpc } from "../../../trpc";
import { StepProps } from "../Campaigns";

export default function Step1({ setCampaigns, campaign }: StepProps) {
  const { data, isLoading } = trpc.book.getBooks.useQuery();
  const [options, setOptions] = useState<Option[]>([]);

  useEffect(() => {
    if (data) {
      const options: any[] = data.map((book: any) => {
        return {
          label: book.name,
          value: book._id,
        };
      });
      setOptions(options);
    }
  }, [data]);

  return (
    <div className="wizard-general">
      <Input
        label="Título"
        name="title"
        placeholder="Título de la campaña"
        required
        type="text"
        onChange={(e) => {
          setCampaigns((prev: any) => {
            return {
              ...prev,
              title: e.target.value,
            };
          });
        }}
        value={campaign.title}
      />
      <Input
        label="Descripción"
        name="description"
        placeholder="Descripción de la campaña"
        required
        type="text"
        onChange={(e) => {
          setCampaigns((prev: any) => {
            return {
              ...prev,
              description: e.target.value,
            };
          });
        }}
        value={campaign.description}
      />
      <Select
        label="Agenda"
        name="bookId"
        onChange={(e) => {
          setCampaigns((prev: any) => {
            return {
              ...prev,
              bookId: e.target.value,
            };
          });
        }}
        value={campaign.bookId}
        options={options}
        placeholder="Seleccione una agenda"
      />
    </div>
  );
}
