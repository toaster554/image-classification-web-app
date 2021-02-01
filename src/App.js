import React, { useState, useEffect } from 'react';
import './App.css';
import * as ml5 from "ml5";

function App() {
    const [predictions, setPredictions] = useState([]);
    const image_url = "https://images.unsplash.com/photo-1508817628294-5a453fa0b8fb?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1350&q=80";
    const classifier = ml5.imageClassifier('MobileNet', modelLoaded);

    function modelLoaded() {
        console.log('Model Loaded!');
    }

    function classifyImg() {
        const image = document.getElementById('image');

        classifier.predict(image, 5, function(err, results) {
            console.log(results);
            return results;
        })
        .then((results) => {
            setPredictions(results);
        })
    }

    useEffect(() => {
        classifyImg();
    }, []);

    return (
        <div className="App">
            <h1>Image classifcation with ML5.js</h1>
            <img src={ image_url } crossOrigin="anonymous" id="image" width="400" alt="" />
            <ol>
                {predictions.map(prediction => <li key={prediction.label}>{prediction.label}: {prediction.confidence}</li>)}
            </ol>
        </div>
    );
}
export default App;