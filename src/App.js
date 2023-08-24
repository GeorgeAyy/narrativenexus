import TextEditor from "./TextEditor";
import SumAndPar from "./sumandpar";
import SignUp from './signup';
import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Section from "./components/Section";
import { useHistory } from 'react-router-dom';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

const ReactApp = () => {
  const history = useHistory();
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
    const signup = document.querySelector(".item button secondary a[href='#signup']");
    if (signup) {
      signup.addEventListener("click", (event) => {
        event.preventDefault();
        history.push('/signup');
      }
      );
    }
  }, []);

  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <div>
            <Navbar
              isMenuOpen={isMenuOpen}
              handleToggleClick={handleToggleClick}
              scrollToSection={scrollToSection}
            />
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
        </Route>

        <Route exact path="/documents">
          <Redirect to={`/documents/ ${uuidv4()}`} />
        </Route>

        <Route path="/documents/:id">
          <TextEditor />
        </Route>
        
        <Route path="/sumandpar">
          <SumAndPar />
        </Route>
        <Route path="/signup">
          <SignUp />
        </Route>
        
        

        
      </Switch>
    </Router>
  );
};

export default ReactApp;
