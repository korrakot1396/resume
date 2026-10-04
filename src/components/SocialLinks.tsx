import { socialLinks } from "../data/portfolio";
import { ExternalLink } from "./ExternalLink";

export function SocialLinks() {
  return (
    <div className="social-links" aria-label="Social profiles">
      {socialLinks.map((link) => (
        <ExternalLink
          key={link.name}
          href={link.url}
          aria-label={link.name}
          title={link.name}
        >
          {link.label}
        </ExternalLink>
      ))}
    </div>
  );
}
