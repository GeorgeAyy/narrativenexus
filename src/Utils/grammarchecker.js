import "./grammerchecker.css";

export function openPopupGrammarChecker(
  grammarMistakes,
  editor,
  correctedText,
  count
) {
  // Create the popup element
  let popup = document.createElement("div");
  popup.id = "popup-grammar-checker-panel";
  popup.className = "popup-grammar-checker";

  // Create the header for count
  let countText = document.createElement("h3");
  countText.className = "popup-grammar-checker-header";
  if (count > 0) {
    countText.innerHTML = `${count} mistakes found`;
  } else {
    countText.innerHTML = `No mistakes found`;
  }
  // Append the paragraphs to the popup element
  popup.appendChild(countText);

  grammarMistakes.forEach((mistakes) => {
    let divGrid = document.createElement("div");
    divGrid.className = "div-grid";
    mistakes.forEach((mistake) => {
      // Create the paragraphs
      let paragraph = document.createElement("p");
      paragraph.innerHTML = mistake;
      // Append the paragraphs to the popup element
      divGrid.appendChild(paragraph);
    });

    popup.appendChild(divGrid);
  });

  if (count > 0) {
    // Create the correction grammar button element
    let correctionButton = document.createElement("button");
    correctionButton.className = "grammar-correction-button";
    correctionButton.innerHTML = "Apply Suggestions";
    correctionButton.onclick = function () {
      editor.selection.setContent(correctedText);
      popup.remove();
      return false;
    };

    // Append the re correct button element to the popup
    popup.appendChild(correctionButton);
  }

  // Create the close button element
  let closeButton = document.createElement("button");
  closeButton.className = "grammar-correction-close-button";
  closeButton.innerHTML = "Close";
  closeButton.onclick = function () {
    popup.remove();
    return false;
  };
  // Append the close button element to the popup
  popup.appendChild(closeButton);
  // Append the popup element to the body
  document.body.appendChild(popup);

  // Close the popup when clicked outside
  document.addEventListener("click", function (event) {
    if (!popup.contains(event.target) && popup.parentNode) {
      popup.parentNode.removeChild(popup);
    }
  });
}
