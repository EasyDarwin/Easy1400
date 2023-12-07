import React from "react";

const Box: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ children, style }) => {
  return (
    <div
      style={{
        backgroundColor: "white",
        padding: "10px",
        borderRadius: "8px",
        boxShadow: "0px 8px 16px 0px rgba(50,50,50,0.1)",
        marginBottom: "10px",
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export default Box;
