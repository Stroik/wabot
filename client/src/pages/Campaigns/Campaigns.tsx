import { useNavigate } from "@tanstack/react-router";
import PageTitle from "../../components/common/PageTitle";
import { GoMegaphone } from "react-icons/go";

export type StepProps = {
  setCampaigns: React.Dispatch<React.SetStateAction<any>>;
  campaign: any;
};

export default function Campaigns() {
  const navigate = useNavigate();
  return (
    <div>
      <PageTitle
        title="Campañas"
        subtitle="Lorem ipsum dolor sit amet consectetur, adipisicing elit. Eum, vel."
      >
        <div className="flex gap-2">
          <button
            className="flex items-center justify-center bg-rose-500 text-white px-4 py-2 rounded-md hover:bg-rose-600 gap-2"
            onClick={() =>
              navigate({ to: "/campaigns/express", from: "/campaigns" })
            }
          >
            <GoMegaphone /> <span>Campaña express</span>
          </button>
          <button
            className="flex items-center justify-center bg-cyan-500 text-white px-4 py-2 rounded-md hover:bg-cyan-600 gap-2"
            onClick={() =>
              navigate({ to: "/campaigns/new", from: "/campaigns" })
            }
          >
            <GoMegaphone /> <span>Nueva campaña</span>
          </button>
        </div>
      </PageTitle>
      <h1>Aca va una tabla</h1>
    </div>
  );
}
