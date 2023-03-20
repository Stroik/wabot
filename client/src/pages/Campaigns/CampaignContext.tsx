import { createContext, useState } from "react";

const initialState = {
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

export const CampaignContext = createContext(initialState as any);
export const CampaignProvider = ({ children }: { children: JSX.Element }) => {
  const [campaigns, setCampaigns] = useState(initialState);

  return (
    <CampaignContext.Provider value={{ ...campaigns, setCampaigns }}>
      {children}
    </CampaignContext.Provider>
  );
};
