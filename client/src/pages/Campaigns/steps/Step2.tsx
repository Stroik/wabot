import { useEffect, useState } from "react";
import Input from "../../../components/common/Input";
import { StepProps } from "../Campaigns";
import MessageWithVars from "../../../components/MessageWithVars";

export default function Step2({ setCampaigns, campaign }: StepProps) {
  const [mediaType, setMediaType] = useState<string>("");
  const [mediaUrl, setMediaUrl] = useState<string>("");
  const [vars, setVars] = useState<string[]>(["{{name}}", "{{phone}}"]);

  // Create a function to determine the media type based on the media url. If it ends with png or jpg, it's an image, if it ends with mp4, it's a video, if it ends with mp4, it's a video file.

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
  }, [mediaUrl, mediaType]);

  return (
    <div className="wizard-message">
      <MessageWithVars
        message={campaign.message}
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
  );
}
