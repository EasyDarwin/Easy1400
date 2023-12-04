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
       
        marginBottom: "10px",
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export default Box;
