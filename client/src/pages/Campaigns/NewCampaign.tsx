import { RiArrowDropLeftLine, RiArrowDropRightLine } from "react-icons/ri";
import PageTitle from "../../components/common/PageTitle";
import Step1 from "./steps/Step1";
import Step2 from "./steps/Step2";
import Step3 from "./steps/Step3";
import useStepsForm from "../../hooks/useStepsForm";
import { useEffect, useState } from "react";
import MessageWithVars from "../../components/MessageWithVars";
import { trpc } from "../../trpc";
import Select, { Option } from "../../components/common/Select";
import Input from "../../components/common/Input";

interface Campaign {
  title: string;
  description: string;
  bookId: string;
  vars: string[];
  media_url: string;
  media_type: string;
  timeout_max: number;
  timeout_min: number;
  timeout_typing: number;
  botIds: string[];
  message: string;
}

const initialValues: Campaign = {
  title: "",
  description: "",
  bookId: "",
  vars: [],
  media_url: "",
  media_type: "",
  timeout_max: 0,
  timeout_min: 0,
  timeout_typing: 0,
  botIds: [],
  message: "",
};

export default function NewCampaign() {
  const [campaigns, setCampaigns] = useState<Campaign>(initialValues);
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  // let steps = [
  //   {
  //     label: "General",
  //     component: <Step1 setCampaigns={setCampaigns} campaign={campaigns} />,
  //   },
  //   {
  //     label: "Configuración del mensaje",
  //     component: <Step2 setCampaigns={setCampaigns} campaign={campaigns} />,
  //   },
  //   {
  //     label: "Configuración de envío",
  //     component: <Step3 setCampaigns={setCampaigns} campaign={campaigns} />,
  //   },
  // ];

  // const {
  //   goToNextStep,
  //   goToPreviousStep,
  //   isFirstStep,
  //   isLastStep,
  //   getCurrentStep,
  // } = useStepsForm(steps, []);

  const [mediaType, setMediaType] = useState<string>("");
  const [mediaUrl, setMediaUrl] = useState<string>("");
  const [vars, setVars] = useState<string[]>(["{{name}}", "{{phone}}"]);
  const [optionsBooks, setOptionsBooks] = useState<Option[]>([]);
  const { data: bots } = trpc.bot.getBots.useQuery();
  const { data: books } = trpc.book.getBooks.useQuery();
  const [optionsBots, setOptionsBots] = useState<Option[]>([]);

  const determineMediaType = (url: string) => {
    if (url.includes(".mp4")) {
      return "video";
    }
    if (url.includes(".jpg") || url.includes(".png")) {
      return "image";
    }
    return "";
  };

  useEffect(() => {
    let media_type = determineMediaType(mediaUrl);
    setMediaType(media_type);
    setCampaigns((prev: any) => {
      return {
        ...prev,
        media_url: mediaUrl,
        media_type: mediaType,
      };
    });

    if (books) {
      const options: any[] = books.map((book: any) => {
        return {
          label: book.name,
          value: book._id,
        };
      });
      setOptionsBooks(options);
    }
  }, [mediaUrl, mediaType, books]);

  return (
    <div>
      <PageTitle
        title="Nueva Campaña"
        subtitle="Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae, minus!"
      />
      <div className="wizard">
        <form
          onSubmit={handleSubmit}
          className="max-w-lg mx-auto mt-4 p-4 shadow-lg rounded-lg"
        >
          <div>
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
                value={campaigns.title}
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
                value={campaigns.description}
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
                value={campaigns.bookId}
                options={optionsBooks}
                placeholder="Seleccione una agenda"
              />
            </div>
            <div className="wizard-message">
              <MessageWithVars
                message={campaigns.message}
                setMessage={setCampaigns}
                vars={vars}
                label="Mensaje"
                name="message"
                className="h-32"
              />
              <Input
                label="Enlace multimedia"
                name="media_url"
                placeholder="https://example.com/image.png"
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
                type="text"
              />
            </div>
            <div className="wizard-configuration">
              <Input
                label="Tiempo de escritura (segundos)"
                name="timeout_typing"
                type="number"
                rest={{
                  min: 0,
                }}
                placeholder="Tiempo de escritura (segundos)"
                value={campaigns.timeout_typing}
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
                  value={campaigns.timeout_min}
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
                  value={campaigns.timeout_max}
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
                  if (!bots) return [];
                  return bots.map((bot: any) => {
                    return {
                      label: String(bot.me).replace("@c.us", ""),
                      value: bot._id,
                    };
                  });
                }}
                multiple={true}
                value={campaigns.botIds}
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
            {/* <Step1 setCampaigns={setCampaigns} campaign={campaigns} />
            <Step2 setCampaigns={setCampaigns} campaign={campaigns} />
            <Step3 setCampaigns={setCampaigns} campaign={campaigns} /> */}
            <button className="rounded bg-sky-500 text-white px-4 py-2 ml-auto flex items-center disabled:bg-zinc-500 hover:bg-sky-600">
              Crear campaña
            </button>
          </div>

          {/* <div>
            <h2 className="pb-4 text-2xl">{getCurrentStep().label}</h2>
            {getCurrentStep().component}
          </div>
          <div className="actions flex justify-between">
            {!isFirstStep() && (
              <button
                type="button"
                onClick={goToPreviousStep}
                disabled={isFirstStep()}
                className="rounded bg-sky-500 text-white px-4 py-2 flex items-center disabled:bg-zinc-500"
              >
                <RiArrowDropLeftLine size={28} />
                <span>Volver</span>
              </button>
            )}

            {!isLastStep() && (
              <button
                type="button"
                onClick={goToNextStep}
                disabled={isLastStep()}
                className="rounded bg-sky-500 text-white px-4 py-2 ml-auto flex items-center disabled:bg-zinc-500"
              >
                <span>Siguiente</span>
                <RiArrowDropRightLine size={28} />
              </button>
            )}
            {isLastStep() && (
              <button
                type="submit"
                disabled={!isLastStep()}
                className="rounded bg-zinc-400 text-white px-4 py-2 "
              >
                Crear
              </button>
            )}
          </div> */}
        </form>
      </div>
    </div>
  );
}
