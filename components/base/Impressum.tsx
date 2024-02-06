// ImpressumLink.tsx
import React from "react";
import HoverLink from "../view/HoverLink";
// import { Link } from "react-router-dom";

interface ImpressumLinkProps {
}

const Impressum: React.FC<ImpressumLinkProps> = ({  }) => {
  return (
    <div style={{ position: "fixed", bottom: "10px", left: "10px", fontSize: "14px" }}>
      <HoverLink href="/collectives#Singularity" name="Singularity">
        Impressum
      </HoverLink>
    </div>
  );
};

export default Impressum;
