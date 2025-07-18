const URL = "https://teachablemachine.withgoogle.com/models/d1yr1n1NU/"; 

let model, maxPredictions;

const imageUpload = document.getElementById('imageUpload');
const imagePreview = document.getElementById('imagePreview');
const predictButton = document.getElementById('predictButton');
const labelContainer = document.getElementById('label-container');
const statusText = document.getElementById('statusText');
const resultsSection = document.getElementById('resultsSection');

async function init() {
    statusText.innerText = "Loading AI model...";
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    try {
        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();
        statusText.innerText = "Model loaded successfully. Upload an image to analyze.";
        predictButton.disabled = false;
    } catch (error) {
        statusText.innerText = "Error loading model. Please check the console for details.";
        console.error("Error loading Teachable Machine model:", error);
    }
}

imageUpload.addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            imagePreview.src = e.target.result;
            imagePreview.style.display = 'block';
            labelContainer.innerHTML = '';
            statusText.innerText = "Image uploaded. Click 'Analyze Image' to get prediction.";
            resultsSection.classList.add('hidden'); 
        };
        reader.readAsDataURL(file);
    } else {
        imagePreview.style.display = 'none';
        imagePreview.src = '#';
        labelContainer.innerHTML = '';
        statusText.innerText = "Please upload an image.";
        predictButton.disabled = true;
        resultsSection.classList.add('hidden');
    }
});

predictButton.addEventListener('click', async function() {
    if (!model) {
        statusText.innerText = "Model is not loaded yet. Please wait or refresh.";
        return;
    }
    if (!imagePreview.src || imagePreview.src === '#') {
        statusText.innerText = "Please upload an image first.";
        return;
    }

    statusText.innerText = "Analyzing image...";
    predictButton.disabled = true; 
    labelContainer.innerHTML = '';

    try {
        const prediction = await model.predict(imagePreview);
        resultsSection.classList.remove('hidden'); 
        prediction.sort((a, b) => b.probability - a.probability);
        const numResultsToDisplay = Math.min(3, maxPredictions); 

        for (let i = 0; i < numResultsToDisplay; i++) {
            const classPrediction = 
                prediction[i].className + ": " + (prediction[i].probability * 100).toFixed(2) + "%";
            const div = document.createElement("div");
            div.innerHTML = classPrediction;
            labelContainer.appendChild(div);
        }
        statusText.innerText = "Analysis complete. See top predictions below.";
        
    } catch (error) {
        statusText.innerText = "Error during prediction. Please try again.";
        console.error("Error during prediction:", error);
        resultsSection.classList.add('hidden');
    } finally {
        predictButton.disabled = false;
    }
});

window.onload = init;