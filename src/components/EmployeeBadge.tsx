import { useState } from "react";
import { Expand, Heart, PencilLine, Sparkles } from "lucide-react";
import { images } from "../lib/images";
import originalBadge from "../assets/images/address_image.svg?url";
import { Modal } from "./Modal";

export function EmployeeBadge() {
  const [open, setOpen] = useState(false);
  return (
    <figure className="badge-showcase">
      <div className="badge-stage">
        <div className="badge-doodles" aria-hidden="true">
          <Sparkles />
          <Heart />
        </div>
        <span className="badge-art-label">
          <PencilLine size={15} /> Drawn by me
        </span>
        <div className="badge-strap" aria-hidden="true">
          <span>KORRAKOT · CREATIVE SIDE</span>
        </div>
        <button
          className="badge-artwork"
          onClick={() => setOpen(true)}
          aria-label="View my illustrated employee badge"
        >
          <img
            src={images["address_image.svg"]}
            alt="My hand-drawn employee badge: Korrakot, Software Engineer, with a cartoon self-portrait"
            width="488"
            height="610"
          />
          <span className="badge-expand">
            <Expand size={15} /> Take a closer look
          </span>
        </button>
      </div>
      <figcaption>
        <strong>Me, illustrated.</strong>
        <span>A little personality, on an ID card.</span>
      </figcaption>
      {open && (
        <Modal
          title="My illustrated employee badge"
          onClose={() => setOpen(false)}
        >
          <img
            className="badge-full"
            src={originalBadge}
            alt="Full-size artwork of Korrakot's illustrated employee badge"
          />
        </Modal>
      )}
    </figure>
  );
}
