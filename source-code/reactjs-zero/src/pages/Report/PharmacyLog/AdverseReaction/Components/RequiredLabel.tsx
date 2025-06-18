import React from "react";

const RequiredLabel = ({ title }: { title: string }) => (
  <span>
    {title} <span style={{ color: "red" }}>*</span>
  </span>
);

export default RequiredLabel;