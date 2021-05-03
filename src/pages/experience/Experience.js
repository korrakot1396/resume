import React, { Component } from "react";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import ExperienceAccordion from '../../containers/experienceAccordion/ExperienceAccordion.js';
// import experience from '../../shared/experience_data.json';
import "./Experience.css";
import { Fade } from "react-reveal";

const experience = {
	title: "Experience",
	subtitle: "Work, Internship and Volunteership",
	description:
		"",
	header_image_path: "experience.svg",
	sections: [
		{
			title: "Work",
			experiences: [
			
				// {
				// 	title: "Android and ML Developer",
				// 	company: "Muffito Incorporation",
				// 	company_url: "https://www.linkedin.com/company/muffito-inc/about/",
				// 	logo_path: "muffito_logo.png",
				// 	duration: "May 2018 - Oct 2018",
				// 	location: "Pune, Maharashtra",
				// 	description:
				// 		"I have created complete Android Application for locating Pub, Bar and beverage shops around you. I have also worked on implementation of algorithms for Face Detection, Text extraction from Image. I was involved in a team for creating complete software architecure of mobile and web application as well as admin panel for company.",
				// 	color: "#9b1578"
				// },
				// {
				// 	title: "Android Developer",
				// 	company: "FreeCopy Pvt. Ltd.",
				// 	company_url: "https://www.linkedin.com/company/freecopy/about/",
				// 	logo_path: "freecopy_logo.png",
				// 	duration: "Nov 2017 - Dec 2017",
				// 	location: "Ahmedabad, Gujarat",
				// 	description:
				// 		"FreeCopy is the Start up from Indian Institute of Management, Ahmedabad. I have changed the integration of the whole app from Google to Firebase. I learnt the efﬁcient ways of Data communications like Retroﬁt, Eventbus etc. I experienced the real time start up. I learnt the Design thinking of UI on perspective of People.",
				// 	color: "#fc1f20"
				// }
			]
		},
		{
			title: "Internships",
			experiences: [
				{
					title: "Full Stack Web Development Intern",
					company: "Garena Thailand.",
					company_url: "https://www.garena.co.th/",
					logo_path: "delhivery_logo.png",
					duration: "Dec 2020 - Apr 2021",
					location: "Bangkok, Thailand",
					// description:
					// 	"I have worked on project of tournament esports freefire for manage tournaments and organize a competition. There were two objectives: (1) To build a organizing tournament esports freefire. (2) To build manage website from administator. Tournament Esports Freefire System using many technologies stack such as ReactJS, PHP(Laravel framework), Docker, Nginx, Cloud CDN, Mysql, Redis.",
					color: "#ee3c26"
				},
				// {
				// 	title: "Data Science Intern",
				// 	company: "Intel Indexer LLC",
				// 	company_url:
				// 		"https://opencorporates.com/companies/us_dc/EXTUID_4170286",
				// 	logo_path: "intel_logo.jpg",
				// 	duration: "Nov 2018 - Dec 2018",
				// 	location: "Work From Home",
				// 	description:
				// 		"This is financial Solution Company. I have made Supervised Learning model for the company which can perform time series analysis on Stock price data for 32 companies. I have built LSTM Neural Networks Model and trained the data of 32 companies for last 2 years. This model is also used for forecasting.",
				// 	color: "#0071C5"
				// }
			]
		},
		{
			title: "Volunteerships",
			experiences: [
				{
					title: "Teacher Assistant (Python Programming)",
					company: "Kasetsart University",
					company_url: "https://www.ku.ac.th/th",
					logo_path: "kasetsart_logo.png",
					duration: "Jul 2020 - Oct 2020",
					location: "Bangkok, Thailand",
					// description:
					// 	"I'm teaching in python programming, in charge of teaching python language, and also in check student names in classroom and test students. I gained more knowledge as a teaching assistant, it gave me practice python language and trained me to be a good speaker and explain. ",
					color: "#55EE94"
				},
				{
					title: "Teacher Assistant (WebTech)",
					company: "Kasetsart University",
					company_url: "https://www.ku.ac.th/th",
					logo_path: "kasetsart_logo.png",
					duration: "Jul 2020 - Oct 2020",
					location: "Bangkok, Thailand",
					// description:
					// 	"Microsoft Student Partner is a program for university students to lead the awareness and use of Cloud especially Azure tools in the development of their projects and startups. Under this program, I have organised hands on workshops and seminars to teach Cloud Computing concepts to students.",
					color: "#55EE94"
				},
				// {
				// 	title: "Mozilla Campus Captain",
				// 	company: "Mozilla",
				// 	company_url: "https://www.mozilla.org/",
				// 	logo_path: "mozilla_logo.png",
				// 	duration: "Oct 2019 - PRESENT",
				// 	location: "Kurnool, Andhra Pradesh",
				// 	description:
				// 		"My responsibility for this program was to create opensource environment in college and in the city. We have organised multiple hackathons on the problems collected by ordinary people from Kurnool city. We have build opensource community of our own college. The community is available at dsc_iiitdmk on github.",
				// 	color: "#000000"
				// },
				// {
				// 	title: "Developer Students Club Member",
				// 	company: "DSC IIITDM Kurnool",
				// 	company_url:
				// 		"https://www.linkedin.com/company/developer-students-club-iiitdm-kurnool",
				// 	logo_path: "dsc_logo.png",
				// 	duration: "Jan 2018 - PRESENT",
				// 	location: "Kurnool, Andhra Pradesh",
				// 	description:
				// 		"We have well established developer club in college which is directly associated with Google Developers. We have developed many interdisciplinary projects under the membership of this club. We have organised workshops and activities on Android Application Development, Flutter and React JS.",
				// 	color: "#0C9D58"
				// },
				// {
				// 	title: "Developer Program Member",
				// 	company: "Github",
				// 	company_url: "https://github.com/",
				// 	logo_path: "github_logo.png",
				// 	duration: "July 2019 - PRESENT",
				// 	location: "Work From Home",
				// 	description:
				// 		"I am actively contributing to many opensource projects. I have contributed to projects of organisations like Tensorflow, Uber, Facebook, Google, Scikit-learn, Kiwix, Sympy, Python, NVLabs, Fossasia, Netrack, Keras etc. These contributions include bug fixes, feature requests and formulating peoper documentation for project.",
				// 	color: "#181717"
				// }
			]
		}
	]
};

class Experience extends Component {
	render() {
		return (
			<div className="experience-main">
				<Header />
				<div className="basic-experience">
					<Fade bottom duration={1000} distance="40px">
						<div className="experience-heading-div">
							<div className="experience-heading-img-div">
								<img
									src={require(`../../assests/images/${experience["header_image_path"]}`)}
								    alt=""
								/>
							</div>
							<div className="experience-heading-text-div">
								<h1 className="experience-heading-text">{experience.title}</h1>
								<h3 className="experience-heading-sub-text">
									{experience["subtitle"]}
								</h3>
								<p className="experience-header-detail-text subTitle">
									{experience["description"]}
								</p>
							</div>
						</div>
					</Fade>
				</div>
				<ExperienceAccordion sections={experience["sections"]} />
				<Footer />
			</div>
		);
	}
}

export default Experience;
