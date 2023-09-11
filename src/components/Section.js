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
          
          
        </div>
      </div>
      <div className="leftpart">
        <div className="image-container">
          
          <a href={href} style={{textDecoration:"none"}}>
          <li id="listItem" style={{width:"60%", margin:"auto"}}>
              <a>{button}</a>
            </li>
          </a>
          
        </div>
      </div>
    </div>
  );
};

export default Section;
