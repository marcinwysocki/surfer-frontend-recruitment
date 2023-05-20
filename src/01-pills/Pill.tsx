import React, { forwardRef } from "react";


export const PILL_HEADER_WIDTH = 22; // 8px for the margin + 13.(3)px for the letter H, rounded up

interface PillProps {
  header: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}

export const Pill = forwardRef<HTMLDivElement, PillProps>((props, ref) => {
  return (
    <div
      ref={ref}
      style={{
        display: "inline-block"
      }}
    >
      <button
        type="button"
        onClick={props.onClick}
        style={{
          margin: "4px",
          border: "2px solid grey",
          borderRadius: "4px",
          padding: "8px 16px"
        }}
      >
        {props.children}
        {props.header === true ? (
          <span
            style={{
              marginLeft: "8px",
              marginRight: "-4px",
              background: "orange",
              padding: "2px 4px",
              borderRadius: "2px"
            }}
          >
            H
          </span>
        ) : null}
      </button>
    </div>
  );
});
