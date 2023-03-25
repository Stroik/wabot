import { useState } from "react";
import Input from "../../../components/common/Input";
import Select, { Option } from "../../../components/common/Select";
import { trpc } from "../../../trpc";
import { StepProps } from "../Campaigns";

export default function Step3({ setCampaigns, campaign }: StepProps) {
  const [options, setOptions] = useState<Option[]>([]);
  const { data, isLoading } = trpc.bot.getBots.useQuery();
  return (
    <div className="wizard-configuration">
      <Input
        label="Tiempo de escritura (segundos)"
        name="timeout_typing"
        type="number"
        rest={{
          min: 0,
        }}
        placeholder="Tiempo de escritura (segundos)"
        value={campaign.timeout_typing}
        onChange={(e) =>
          setCampaigns((prev: any) => {
            return {
              ...prev,
              timeout_typing: Number(e.target.value),
            };
          })
        }
      />
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Tiempo mínimo"
          name="timeout_min"
          type="number"
          rest={{
            min: 0,
          }}
          placeholder="Tiempo mínimo"
          value={campaign.timeout_min}
          onChange={(e) =>
            setCampaigns((prev: any) => {
              return {
                ...prev,
                timeout_min: Number(e.target.value),
              };
            })
          }
        />
        <Input
          label="Tiempo máximo"
          name="timeout_max"
          type="number"
          rest={{
            min: 0,
          }}
          placeholder="Tiempo máximo de respuesta (segundos)"
          value={campaign.timeout_max}
          onChange={(e) =>
            setCampaigns((prev: any) => {
              return {
                ...prev,
                timeout_max: Number(e.target.value),
              };
            })
          }
        />
      </div>
      <Select
        label="Selección de Whatsapp"
        name="botIds"
        options={() => {
          if (!data) return [];
          return data.map((bot: any) => {
            return {
              label: String(bot.me).replace("@c.us", ""),
              value: bot._id,
            };
          });
        }}
        multiple={true}
        value={campaign.botIds}
        placeholder="Seleccionar los whatsapps a utilizar en la campaña"
        onChange={(e) => {
          let selectedOptions = Array.from(e.target.selectedOptions);
          let values = selectedOptions.map((option) => option.value);
          setCampaigns((prev: any) => {
            return {
              ...prev,
              botIds: values,
            };
          });
        }}
      />
    </div>
  );
}
