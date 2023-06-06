const fileInput = document.getElementById("file");
const btnSubmit = document.getElementById("btn-submit");
const btnFile = document.getElementById("btn-file");
const imgElement = document.getElementById("img");
const textElement = document.getElementById("text");

btnFile.addEventListener("click", () => {
  fileInput.click();
});

fileInput.addEventListener("change", (evt) => {
  const file = evt.target.files[0];
  const fileReader = new FileReader();

  fileReader.onload = (evt) => {
    imgElement.src = evt.target.result;
    imgElement.title = file.name;
    imgElement.hidden = false;
    clearText();
  };

  fileReader.readAsDataURL(file);
});

btnSubmit.addEventListener("click", async () => {
  if (!fileInput.files.length) {
    return displayError("Missing image");
  }
  const file = fileInput.files[0];
  const formData = new FormData();
  formData.append("file", file);
  const timer = displayProcessing()
  const resposne = await fetch("http://127.0.0.1:8000", {
    method: 'POST',
    body: formData,
  });
  let data = null;
  const responseContentType = resposne.headers.get('Content-Type');
  if (responseContentType === 'application/json') {
    data = await resposne.json();
  } else if (responseContentType === 'text/html') {
    data = await resposne.text();
  }
  if (!resposne.ok) {
    clearInterval(timer);
    displayError("Error occurs when predicting image");
    console.log("[RESPONSE][ERROR]:", data);
  } else {
    clearInterval(timer);
    displayText(data.result);
  }
});

function displayError(msg, color = "red") {
  textElement.innerText = msg;
  textElement.style.color = color;
}

function displayText(msg, color = "#002bff") {
  textElement.innerText = msg;
  textElement.style.color = color;
}

function clearText() {
  textElement.innerText = ""
}

function displayProcessing() {
  let counter = 0;
  return setInterval(() => {
    const func = () => {
      const nDot = ++counter % 4;
      const msg = "Processing" + Array.from({ length: nDot }, () => ".").join("");
      displayText(msg, "#858585");
    }
    func()
  }, 500);
}
