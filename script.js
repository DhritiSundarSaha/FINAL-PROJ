const inputFile = document.querySelector("#picture__input");
const pictureImage = document.querySelector(".picture__image");
const pictureImageTxt = "Choose an image";
pictureImage.innerHTML = pictureImageTxt;

const form = document.querySelector("#patient-form");
const resultElement = document.querySelector("#result");
const errorElement = document.querySelector("#error");

inputFile.addEventListener("change", function (e) {
  const inputTarget = e.target;
  const file = inputTarget.files[0];

  if (file) {
    const reader = new FileReader();

    reader.addEventListener("load", function (e) {
      const readerTarget = e.target;

      const img = document.createElement("img");
      img.src = readerTarget.result;
      img.classList.add("picture__img");

      pictureImage.innerHTML = "";
      pictureImage.appendChild(img);
    });

    reader.readAsDataURL(file);
  } else {
    pictureImage.innerHTML = pictureImageTxt;
  }
});

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const name = document.querySelector("#name").value;
  const age = document.querySelector("#age").value;
  const sex = document.querySelector("#sex").value;
  const mriScanFile = inputFile.files[0];

  if (!name || !age || !sex || !mriScanFile) {
    errorElement.innerHTML = "Please fill in all fields and upload an MRI scan.";
    return;
  }

  try {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('age', age);
    formData.append('sex', sex);
    formData.append('mriScan', mriScanFile);

    const response = await fetch('https://your-backend-endpoint/api/process_mri/', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      const result = await response.json();
      displayResult(result);
    } else {
      throw new Error('Error submitting data: ' + response.statusText);
    }
  } catch (error) {
    handleError(error);
  }
});

const displayResult = (result) => {
  resultElement.innerHTML = `Tumor Type: ${result.tumorType}`;
};

const handleError = (error) => {
  errorElement.innerHTML = `An error occurred: ${error.message}`;
  console.error('Error details:', error);
};
