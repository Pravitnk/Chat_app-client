import { Box, Typography } from "@mui/material";
import moment from "moment";
import { React, memo } from "react";
import { fileFormate } from "../../libs/features";
import RenderAttachment from "./RenderAttachment";
import { motion } from "framer-motion";

const MessageComponent = ({ message, user, handleDeleteMessage }) => {
  const { sender, content, attachments = [], createdAt } = message;
  const sameSender = sender?._id === user?._id;

  const TimeAgo = moment(createdAt).fromNow();
  return (
    <>
      <motion.div
        onContextMenu={(e) => handleDeleteMessage(e)}
        initial={{ opacity: 0, x: "-100%" }}
        whileInView={{ opacity: 1, x: 0 }}
        style={{
          alignSelf: sameSender ? "flex-end" : "flex-start",
          backgroundColor: sameSender ? "white" : "#8c55f3",
          color: sameSender ? "black" : "white",
          padding: "0.5rem 0.6rem",
          width: "fit-content",
          borderRadius: "10%",
        }}
      >
        {!sameSender && (
          <Typography color={"black"} fontWeight={"600"} variant="caption">
            {sender?.name}
          </Typography>
        )}
        {content && <Typography>{content}</Typography>}

        {/* attachments */}
        {attachments.length > 0 &&
          attachments.map((attachment, index) => {
            const url = attachment.url;
            const file = fileFormate(url);
            return (
              <Box key={index}>
                <a
                  href={url}
                  target="_blank"
                  download
                  style={{
                    color: "black",
                  }}
                >
                  {RenderAttachment(file, url)}
                </a>
              </Box>
            );
          })}

        <Typography variant="caption" color={"text.secondary"}>
          {TimeAgo}
        </Typography>
      </motion.div>
    </>
  );
};

export default memo(MessageComponent);
