import { RiArrowDropLeftLine, RiArrowDropRightLine } from "react-icons/ri";
import PageTitle from "../../components/common/PageTitle";
import Step1 from "./steps/Step1";
import Step2 from "./steps/Step2";
import Step3 from "./steps/Step3";
import useStepsForm from "../../hooks/useStepsForm";

const initialValues = {
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
};

let steps = [
  {
    label: "General",
    component: null as JSX.Element | null,
  },
  {
    label: "Mensaje",
    component: null as JSX.Element | null,
  },
  {
    label: "Configuración",
    component: null as JSX.Element | null,
  },
];

export default function NewCampaign() {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };
  const {
    goToNextStep,
    goToPreviousStep,
    isFirstStep,
    isLastStep,
    getCurrentStep,
    handleInputChange,
    formValues,
  } = useStepsForm(steps, initialValues);

  steps = [
    {
      label: "General",
      component: <Step1 onChange={handleInputChange} campaign={formValues} />,
    },
    {
      label: "Mensaje",
      component: <Step2 onChange={handleInputChange} campaign={formValues} />,
    },
    {
      label: "Configuración",
      component: <Step3 onChange={handleInputChange} campaign={formValues} />,
    },
  ];

  return (
    <div>
      <PageTitle
        title="Nueva Campaña"
        subtitle="Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae, minus!"
      />
      <div className="wizard">
        <form
          onSubmit={handleSubmit}
          className="max-w-md mx-auto mt-4 p-4 shadow-lg rounded-lg"
        >
          <div>
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
          </div>
        </form>
      </div>
    </div>
  );
}
