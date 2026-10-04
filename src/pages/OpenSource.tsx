import { ArrowUpRight, GitPullRequest, CircleDot } from "lucide-react";
import pullRequests from "../data/opensource/pull_requests.json";
import issues from "../data/opensource/issues.json";
import organizations from "../data/opensource/organizations.json";
import { ExternalLink } from "../components/ExternalLink";
import { PageHeading } from "../components/PageHeading";

export default function OpenSource() {
  return (
    <>
      <PageHeading
        eyebrow="Open source"
        title="Built in the open."
        description="Organizations, pull requests and issues from the original portfolio's saved GitHub snapshot."
        illustration="community"
      />
      <p className="archive-note">
        Archived data · This is a saved snapshot, not live GitHub activity.
      </p>
      <div className="organization-list">
        {organizations.data.map((org) => (
          <ExternalLink
            key={org.login}
            href={`https://github.com/${org.login}`}
          >
            {org.login}
            <ArrowUpRight size={14} />
          </ExternalLink>
        ))}
      </div>
      <div className="activity-stats">
        <article>
          <GitPullRequest />
          <h2>{pullRequests.data.length}</h2>
          <p>Pull requests</p>
          <div className="tags">
            <span>{pullRequests.open} open</span>
            <span>{pullRequests.merged} merged</span>
            <span>{pullRequests.closed} closed</span>
          </div>
        </article>
        <article>
          <CircleDot />
          <h2>{issues.data.length}</h2>
          <p>Issues</p>
          <div className="tags">
            <span>{issues.open} open</span>
            <span>{issues.closed} closed</span>
          </div>
        </article>
      </div>
      <section className="section compact">
        <h2>Pull requests</h2>
        <div className="activity-list">
          {pullRequests.data.map((pr) => (
            <ExternalLink key={pr.url} href={pr.url}>
              <GitPullRequest size={20} />
              <div>
                <span className="meta">
                  {pr.baseRepository.owner.login}/{pr.baseRepository.name} · #
                  {pr.number}
                </span>
                <h3>{pr.title}</h3>
                <span className="meta">
                  {pr.createdAt.split("T")[0]} · +{pr.additions} / −
                  {pr.deletions} · {pr.changedFiles} files
                </span>
              </div>
              <span className="state-badge">{pr.state.toLowerCase()}</span>
              <ArrowUpRight size={17} />
            </ExternalLink>
          ))}
        </div>
      </section>
      <section className="section">
        <h2>Issues</h2>
        <div className="activity-list">
          {issues.data.map((issue) => (
            <ExternalLink key={issue.url} href={issue.url}>
              <CircleDot size={20} />
              <div>
                <span className="meta">
                  {issue.repository.owner.login}/{issue.repository.name} · #
                  {issue.number}
                </span>
                <h3>{issue.title}</h3>
                <span className="meta">{issue.createdAt.split("T")[0]}</span>
              </div>
              <span className="state-badge">
                {issue.closed ? "closed" : "open"}
              </span>
              <ArrowUpRight size={17} />
            </ExternalLink>
          ))}
        </div>
      </section>
    </>
  );
}
