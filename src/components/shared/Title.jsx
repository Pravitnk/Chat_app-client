import React from "react";
import { Helmet } from "react-helmet-async";

const Title = ({ title = "chat", description = "This is a Chat app" }) => {
  return (
    <Helmet>
      <title>Chat-App</title>
      <meta name="description" content={description} />
    </Helmet>
  );
};

export default Title;
