"use client";
import { PropertyDataWithId } from "@/models/Property";
import {
  FacebookShareButton,
  XShareButton,
  WhatsappShareButton,
  EmailShareButton,
  FacebookIcon,
  XIcon,
  WhatsappIcon,
  EmailIcon,
} from "react-share";

const ShareButtons = ({ property }: { property: PropertyDataWithId }) => {
  const shareUrl = `${process.env.NEXT_PUBLIC_DOMAIN}/properties/${property._id}`;

  return (
    <>
      <h3 className="text-xl font-bold text-center pt-2">
        Share This Property:
      </h3>
      <div className="flex gap-3 justify-center pb-5">
        <FacebookShareButton
          url={shareUrl}
          title={property.name}
          hashtag={`#${property.type.replace(/\s/g, "")}ForRent`}
        >
          <FacebookIcon size={40} radius={20} />
        </FacebookShareButton>

        <XShareButton
          url={shareUrl}
          hashtags={[`${property.type.replace(/\s/g, "")}ForRent`]}
          content={property.name}
        >
          <XIcon size={40} radius={20} />
        </XShareButton>

        <WhatsappShareButton
          url={shareUrl}
          separator=":: "
          content={property.name}
        >
          <WhatsappIcon size={40} radius={20} />
        </WhatsappShareButton>

        <EmailShareButton
          url={shareUrl}
          subject={property.name}
          body={`Check out this property listing: ${shareUrl}`}
        >
          <EmailIcon size={40} radius={20} />
        </EmailShareButton>
      </div>
    </>
  );
};
export default ShareButtons;
