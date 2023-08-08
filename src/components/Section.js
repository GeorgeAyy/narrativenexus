// Section.js
import React from "react";

const Section = ({ id, title, content }) => {
  return (
    <div className={`section ${id}`} id={id}>
      <div className="rightpart">
        <div className="uppersection">
          <p>{content.upper}</p>
        </div>
        <div className="lowersection">
          <p>{content.lower}</p>
        </div>
      </div>
      <div className="leftpart">
        <h3>{title}</h3>
      </div>
    </div>
  );
};

export default Section;
