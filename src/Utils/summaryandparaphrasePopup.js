import "./summaryandparaphrasePopup.css"; // Import your CSS styles for the summary popup

export function openPopupSummaryandParaphrase(summaryText, editor) {
  // Create the overlay element
  const overlay = document.createElement("div");
  overlay.className = "overlay";

  // Append the overlay to the body
  document.body.appendChild(overlay);

  // Create the popup element
  let popup = document.createElement("div");
  popup.id = "popup-summary-panel";
  popup.className = "popup-summary";

  // Create the summary content element
  let summaryContent = document.createElement("p");
  summaryContent.className = "popup-summary-content";
  summaryContent.innerHTML = summaryText;

  // Append the summary content to the popup element
  popup.appendChild(summaryContent);

  let correctionButton = document.createElement("button");
  correctionButton.className = "grammar-correction-button";
  correctionButton.innerHTML = "Apply Suggestions";
  correctionButton.onclick = function () {
    editor.selection.setContent(summaryText);
    popup.remove();
    overlay.remove(); // Remove the overlay when closing the popup
    return false;
  };

  // Append the re-correct button element to the popup
  popup.appendChild(correctionButton);

  // Create the close button element
  let closeButton = document.createElement("button");
  closeButton.className = "summary-close-button";
  closeButton.innerHTML = "Close";
  closeButton.onclick = function () {
    popup.remove();
    overlay.remove(); // Remove the overlay when closing the popup
    return false;
  };

  // Append the close button element to the popup
  popup.appendChild(closeButton);

  // Append the popup element to the body
  document.body.appendChild(popup);

  // Prevent clicks on the overlay from closing the popup
  overlay.addEventListener("click", function (event) {
    event.stopPropagation(); // Stop the event from propagating to document click
  });

  // Close the popup and remove the overlay when clicked outside
  document.addEventListener("click", function (event) {
    if (popup.contains(event.target) && event.target !== closeButton) {
      // Clicking inside the popup (except for the close button) does nothing
      return;
    }

    // Clicking outside the popup or on the close button closes the popup
    popup.remove();
    overlay.remove(); // Remove the overlay when closing the popup
  });
}
