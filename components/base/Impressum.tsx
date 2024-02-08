// ImpressumLink.tsx
import React from "react";
import Link from "./Link";
// import { Link } from "react-router-dom";

interface ImpressumLinkProps {
}

const Impressum: React.FC<ImpressumLinkProps> = ({  }) => {
  return (
    <div style={{ position: "fixed", bottom: "10px", right: "10px", fontSize: "14px" }}>
      <Link href="/collectives#Singularity" name="Singularity">
        Impressum
      </Link>
    </div>
  );
};

export default Impressum;
