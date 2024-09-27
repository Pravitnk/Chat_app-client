import React from "react";
import { tranformImage } from "../../libs/features";
import { FileOpen as FileOpenIcon } from "@mui/icons-material";

const RenderAttachment = (file, url) => {
  switch (file) {
    case "video":
      return <video src={url} preload="none" width={"200px"} controls />;

    case "audio":
      return <audio src={url} preload="none" controls />;

    case "image":
      return (
        <img
          src={tranformImage(url, 200)}
          alt="attachment"
          width={"200px"}
          height={"150px"}
          style={{
            borderRadius: "2rem",
          }}
        />
      );

    default:
      return <FileOpenIcon />;
  }
};

export default RenderAttachment;
