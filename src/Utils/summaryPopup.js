import "./summaryPopup.css"; // Import your CSS styles for the summary popup

export function openPopupSummary(summaryText) {
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

  // Create the close button element
  let closeButton = document.createElement("button");
  closeButton.className = "summary-close-button";
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
