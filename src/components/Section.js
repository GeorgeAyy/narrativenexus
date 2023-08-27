// Section.js
import React from "react";

const Section = ({ id, title, content,href,button }) => {
  return (
    <div className={`section ${id}`} id={id}>
      <div className="rightpart">
        <div className="uppersection">
          <p>{content.upper}</p>
        </div>
        <div className="lowersection">
          <p>{content.lower}</p>
          <a href={href}>
          <button className="btn">{button}</button>
          </a>
          
        </div>
      </div>
      <div className="leftpart">
        <div class="image-container">
          <a href={href}>
            <img class="sectionimage" src={title} alt={id} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Section;
