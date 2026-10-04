import { useState } from "react";
import { ArrowUpRight, Download } from "lucide-react";
import { Modal } from "./Modal";
import { images } from "../lib/images";

export function ResumeButton({
  className = "button secondary",
}: {
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button className={className} onClick={() => setOpen(true)}>
        See my resume <ArrowUpRight size={18} />
      </button>
      {open && (
        <Modal title="Korrakot's resume" onClose={() => setOpen(false)}>
          <a
            className="button secondary resume-download"
            href={images["resume.pdf"]}
            download="Korrakot-Triwichian-Resume.pdf"
          >
            <Download size={18} /> Download PDF
          </a>
          <img
            className="resume-image"
            src={images["resume.png"]}
            alt="Resume of Korrakot Triwichian"
          />
        </Modal>
      )}
    </>
  );
}
