// Home.js
import React from "react";
import Navbar from "../components/Navbar";
import Section from "../components/Section";
import { Carousel } from "react-responsive-carousel";
import narrativebanner from "../images/narrativebanner.png";
import sumandparbanner from "../images/sumandparbanner.png";
import writingpromptbanner from "../images/writingpromptbanner.png";
import writingassistantbanner from "../images/writingassistantbanner.png";
import sumandpar from "../images/sumandpar.png";
import writingassistant from "../images/writingassistant.png";
import writingprompt from "../images/writingprompt.png";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { useState, useEffect } from "react";

const Home = () => {
  const [isMenuOpen, setMenuOpen] = useState(false);

  const handleToggleClick = () => {
    setMenuOpen((prevIsMenuOpen) => !prevIsMenuOpen);
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setMenuOpen(true);
    }
  };

  useEffect(() => {
    const handleLinkClick = (event, sectionId) => {
      event.preventDefault();
      scrollToSection(sectionId);
    };

    const links = [
      { selector: ".item a[href='#section3']", id: "section3" },
      { selector: ".item a[href='#section2']", id: "section2" },
      { selector: ".logo a[href='#section1']", id: "section1" },
    ];

    links.forEach(({ selector, id }) => {
      const link = document.querySelector(selector);
      if (link) {
        link.addEventListener("click", (event) => handleLinkClick(event, id));

        return () => {
          link.removeEventListener("click", (event) =>
            handleLinkClick(event, id)
          );
        };
      }
    });
  }, []);
  return (
    <div>
      <Navbar
        isMenuOpen={isMenuOpen}
        handleToggleClick={handleToggleClick}
        scrollToSection={scrollToSection}
      />
      <div class= "carouseldiv"style={{ maxWidth: "90%", margin: "0 auto",maxHeight:"10%", marginTop:"30px"}}>
        <Carousel showThumbs={false}
          showStatus={false}
          autoPlay={true} // Enable auto-rotation
          interval={3000} // Set the rotation interval (in milliseconds)
          >
          <div>
            <img src={narrativebanner} alt="Slide 1" />
          </div>
          <div>
            <img src={sumandparbanner} alt="Slide 2" />
          </div>
          <div>
            <img src={writingpromptbanner} alt="Slide 3" />
          </div>
          <div>
            <img src={writingassistantbanner} alt="Slide 4" />
          </div>
          {/* Add more slides as needed */}
        </Carousel>
      </div>
      
      <Section
        id="section1"
        title={writingassistant}
        content={{
          upper:
            "AI Powered Writing Assistant",
          lower:
            "Our Writing Assistant puts the power of professional editing at your fingertips. With just a click, you can check selected texts for spelling and grammar mistakes, ensuring your work is error-free. Need to distill complex content? Click again to summarize selected texts or effortlessly rephrase them for a fresh perspective. It's like having a versatile writing toolset within your reach, making your writing process more efficient and effective. Say goodbye to time-consuming editing tasks and hello to a more polished and refined writing experience.",
        }}
        href="/documents"
        button="Try Writing Assistant"
      />
      <Section
        id="section2"
        title={sumandpar}
        content={{
          upper:
            "AI Powered Summarizer and Paraphraser",
          lower:
          "Elevate your writing with our Summarizer and Paraphraser Tool. The Summarizer distills complex content into concise summaries, while the Paraphraser skillfully rephrases sentences and paragraphs, preserving originality and clarity. Say goodbye to lengthy revisions and hello to efficient, polished writing.",
        }}
        href="/sumandpar"
        button="Try Summarizer and Paraphraser"
      />
      <Section
        id="section3"
        title={writingprompt}
        content={{
          upper:
            "AI Powered Writing Prompt",
          lower:
            "Break through creative barriers with our Writing Prompt Generator. When the blank page feels daunting, this tool offers a wellspring of inspiration, sparking your imagination and guiding your storytelling. Say farewell to writer's block and embark on a captivating writing journey filled with fresh, engaging ideas. Explore the endless possibilities and discover your muse with Narrative Nexus's Writing Prompt Generator.",
        }}
        href="/writingprompt"
        button="Try Writing Prompt"
      />
      
    </div>
  );
};

export default Home;
