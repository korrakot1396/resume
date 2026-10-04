import { IllustrationScene } from "./IllustrationScene";
import type { IllustrationKind } from "./IllustrationScene";

interface PageHeadingProps {
  eyebrow: string;
  title: string;
  description: string;
  illustration: IllustrationKind;
}

export function PageHeading({
  eyebrow,
  title,
  description,
  illustration,
}: PageHeadingProps) {
  return (
    <header className="page-heading">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="lead">{description}</p>
      </div>
      <IllustrationScene kind={illustration} />
    </header>
  );
}
