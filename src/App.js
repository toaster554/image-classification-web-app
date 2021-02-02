import React, { useState, useEffect } from 'react';
import './App.css';
import * as ml5 from "ml5";

function Image(props) {
    function handleChange(event) {
        if (event.target.files.length) {
            props.setImage({
                preview: URL.createObjectURL(event.target.files[0]),
                raw: event.target.files[0]
            });
        }
    }

    return(
        <div className="Image">
            <label htmlFor="upload-button">
                {props.image.preview ? (
                    <div>
                        <img src={props.image.preview} id="image" class="rounded" width="400"/><br />
                        <h3>Click on the image to upload a new one.</h3>
                    </div>
                )
                : (
                    <h3 type="button" class="btn btn-outline-secondary">
                        Upload an image to see magic happens!
                    </h3>
                )}
            </label>
            <input type="file" id="upload-button" style={{ display: 'none' }}
            onChange={handleChange} />
            <br />
        </div>
    )
}

function App() {
    const [predictions, setPredictions] = useState([]);
    const [image, setImage] = useState({ preview: "", raw: "" });
    const classifier = ml5.imageClassifier('MobileNet', modelLoaded);

    function modelLoaded() {
        console.log('Model Loaded!');
    }

    function classifyImg() {
        const temp_image = document.getElementById('image');

        classifier.predict(temp_image, 5, function(err, results) {
            console.log(results);
            return results;
        })
        .then((results) => {
            setPredictions(results);
        })
    }

    useEffect(() => {
        classifyImg();
    }, [image]);

    return (
        <div className="App">
            <h1>Image Classifcation with ml5.js</h1>
            <Image image={image} setImage={setImage}/>
            {predictions.length ? <h2>Top Predictions</h2>:<h2></h2>}
            <ol>
                {predictions.map(prediction => <li key={prediction.label}>
                    <span style={{textTransform: 'capitalize'}}><b>{prediction.label.split(",")[0]}</b></span>
                    {' '}with {((prediction.confidence * 10000) / 100).toPrecision(2)}% confidence.</li>)}
            </ol>
        </div>
    );
}
export default App;