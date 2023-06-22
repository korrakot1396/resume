import React, { useState } from "react";
import ProjectLanguages from '../../components/projectLanguages/ProjectLanguages';
import "./GithubRepoCard.css";
import "./PopupVideo.css"
import Button from "../../components/button/Button";
import ButtonGitHub from "../../components/button/ButtonGitHub"
import ButtonVideo from "../../components/button/ButtonVideo"


export default function GithubRepoCard({ repo }) {

	const [showPopup, setShowPopup] = useState(false);

	function Popup({ onClose, videoUrl }) {
	  return (
		<div className="popup-overlay">
		  <div className="popup-content">
			<button className="popup-close-button" onClick={onClose}>
			  Close
			</button>
			<iframe class="responsive-iframe"  title="Video Player" src={videoUrl} frameborder="0" allowfullscreen></iframe>
		  </div>
		</div>
	  );
	}

  
	const openPopup = () => {
			setShowPopup(true);
		};
		
		const closePopup = () => {
			setShowPopup(false);
	};
  

  return (
		<div>
			<div
				className="repo-card-div"
				key={repo.id}
			>
				<div className="repo-name-div">
					<svg
						aria-hidden="true"
						className="octicon repo-svg"
						height="16"
						role="img"
						viewBox="0 0 12 16"
						width="12"
					>
						<path
							fill-rule="evenodd"
							d="M4 9H3V8h1v1zm0-3H3v1h1V6zm0-2H3v1h1V4zm0-2H3v1h1V2zm8-1v12c0 .55-.45 1-1 1H6v2l-1.5-1.5L3 16v-2H1c-.55 0-1-.45-1-1V1c0-.55.45-1 1-1h10c.55 0 1 .45 1 1zm-1 10H1v2h2v-1h3v1h5v-2zm0-10H2v9h9V1z"
						></path>
					</svg>
					<p className="repo-name">{repo.name}</p>
				</div>
				<p className="repo-description">{repo.description}</p>
				<div className="repo-details">
					<p className="repo-creation-date subTitle">Created on {repo.createdAt.split('T')[0]}</p>
          <ProjectLanguages className="repo-languages" logos={repo.languages} />
				</div>
				<div class="button-container">		
					{repo.video && repo.video !== "" && (
						<ButtonVideo
						text={"Video"}
						className="project-button"
						// href={repo.video}
						onClick={openPopup}
					/>
					)}
					{repo.demo && repo.demo !== "" && (
						<Button
						text={"Demo"}
						className="project-button"
						href={repo.demo}
						/>
					)}
					{repo.url && repo.url !== "" && (
						<ButtonGitHub
						text={"Github"}
						className="project-button"
						href={repo.url}
						/>
					)}
					</div>
			</div>
			{showPopup && (
        <Popup onClose={closePopup} videoUrl={repo.video} />
      )}
		</div>
	);
}
