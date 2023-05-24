import React from "react";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import ExperienceAccordion from '../../containers/experienceAccordion/ExperienceAccordion.js';
import "./Experience.css";
import { Fade } from "react-reveal";

const experience = {
  title: "Experience",
  subtitle: "Work, Internship and Volunteership",
  description: "",
  header_image_path: "experience.svg",
  sections: [
    {
      title: "Work",
      experiences: [
        {
          title: "Software Engineer",
          company: "Azure computers.",
          company_url: "https://azurecomputer.com/",
          logo_path: "azure_computer_logo.jpeg",
          duration: "Mar 2022 - Present",
          location: "Bangkok, Thailand",
          color: "#6495ED"
        },
        {
          title: "Software Engineer",
          company: "Accenture Solutions.",
          company_url: "https://www.accenture.com/th-en/",
          logo_path: "accenture_logo.png",
          duration: "Ang 2021 - Feb 2022(1 year 7 Month)",
          location: "Bangkok, Thailand",
          color: "#9400D3"
        },
        {
          title: "Backend Developer",
          company: "TSPACE Digital.",
          company_url: "https://www.tspacedigital.com/",
          logo_path: "tspace_logo.png",
          duration: "Jun 2021 - Ang 2021 (4 Month)",
          location: "Bangkok, Thailand",
          color: "#0000CD"
        },
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
          duration: "Dec 2020 - Apr 2021 (5 Month)",
          location: "Bangkok, Thailand",
          color: "#ee3c26"
        }
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
          duration: "Jul 2020 - Oct 2020 (4 Month)",
          location: "Bangkok, Thailand",
          color: "#55EE94"
        },
        {
          title: "Teacher Assistant (WebTech)",
          company: "Kasetsart University",
          company_url: "https://www.ku.ac.th/th",
          logo_path: "kasetsart_logo.png",
          duration: "Jul 2020 - Oct 2020 (4 Month)",
          location: "Bangkok, Thailand",
          color: "#55EE94"
        }
      ]
    }
  ]
};

const Experience = () => {
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

export default Experience;
