// Home.js
import React from "react";
import Navbar from "../components/Navbar";
import Section from "../components/Section";
import { Carousel } from "react-responsive-carousel";
import narrativebanner from "../images/narrativebanner.png";
import sumandparbanner from "../images/sumandparbanner.png";
import writingpromptbanner from "../images/writingpromptbanner.png";
import writingassistantbanner from "../images/writingassistantbanner.png";
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
      <div style={{ maxWidth: "90%", margin: "0 auto",maxHeight:"10%" }}>
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
        title="NN"
        content={{
          upper:
            "logo Welcome to our Al-powered Creative Writing Assistant! Our web application is designed to help you overcome writer's block, boost your creativity, and improve your writing skills. With our cutting-edge technology, we offer a range of powerful features to assist you throughout your writing journey.",
          lower:
            " To experience the power of our Al-powered Creative Writing Assistant, sign up now and unlock a world of writing possibilities. Whether you're an aspiring writer, a professional seeking to enhance your skills, or part of a team working on collaborative projects, our application is here to empower you and take your writing to the next level. Sign up today and unleash your creativity!.",
        }}
      />
      <div className="btn">
        <a href="/documents">
          <button>Try it now</button>
        </a>
      </div>
      <Section
        id="section2"
        title="Summarizer and Paraphraser"
        content={{
          upper:
            "Our AI-powered Summarizer and Paraphraser offer an efficient and effortless way to tackle complex texts. With the Summarizer, you can quickly extract key points and generate concise summaries from lengthy documents, making it easier to grasp essential information",
          lower:
            "Meanwhile, our Paraphraser ensures the authenticity of your work by skillfully rephrasing sentences and paragraphs, maintaining the original context and meaning while avoiding plagiarism.",
        }}
      />
      <div className="btn">
        <a href="/sumandpar">
          <button>Summarizer and Paraphraser</button>
        </a>
      </div>
      <Section
        id="section3"
        title="Writing Assistant"
        content={{
          upper:
            "With the Al-powered writing assistant, you can write with confidence, knowing that you havea reliable proofreader and writing coach at your side. It helps you polish your work as you write, saving you time on revisions and ensuring your final piece is free from errors and reads smoothly.",
          lower:
            "When you're composing your text, the Al-powered assistant actively examines your writing and identifies areas that can be enhanced. It helps you avoid pesky spelling errors by highlighting and suggesting corrections for misspelled words. Additionally, it assists with grammar mistakes by flagging them and providing alternative suggestions to improve sentence construction and clarity.",
        }}
      />
      <div className="btn">
        <a href="/documents">
          <button>Writing Assistant</button>
        </a>
      </div>
    </div>
  );
};

export default Home;
