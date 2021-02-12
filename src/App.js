import React, { useState, useEffect, useRef } from 'react';
import p5 from "p5";
import './App.css';


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
                : (props.modelReady ?
                    <h3 type="button" class="btn btn-outline-secondary">
                        Upload an image to see magic happens!
                    </h3>
                    :
                    <h3>Loading model...</h3>
                )}
            </label>
            <input type="file" id="upload-button" style={{ display: 'none' }}
            onChange={handleChange} />
            <br />
        </div>
    )
}


function Predictions(props) {
    if (props.predicting) {
        return (
            <div>
                <h2>Making predictions...</h2>
            </div>
        );
    }

    return (
        <div className="Predictions">
            <h2>Top Predictions</h2>
            {props.predictions.map(prediction => <li key={prediction.label}>
                <span style={{textTransform: 'capitalize'}}><b>{prediction.label.split(",")[0]}</b></span>
                {' '}with {((prediction.confidence * 10000) / 100).toPrecision(2)}% confidence.
            </li>)}
        </div>
    );
}

function ModelDropdown(props) {
    function handleChange(event) {
        props.setModelName(event.target.value);
        props.setPredictions([]);
    }
    return (
        <div className="modelDropdown">
            <label for="model">Select Model: </label>
            <select id="model" onChange={handleChange}>
                <option value="MobileNet">MobileNet</option>
                <option value="DoodleNet">DoodleNet</option>
            </select>
        </div>
    );
}

class Canvas extends React.Component {
    constructor(props) {
        super(props);
        this.myRef = React.createRef();
        this.state = {
            canvas: '',
            clearButton: ''
        };
        this.Sketch = this.Sketch.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(event) {
        if (this.state.canvas !== '') {
            this.props.classifyImg(this.state.canvas);
        }
    }

    Sketch(p) {
        p.setup = () => {
            this.state.canvas = p.createCanvas(400, 400);
            this.state.clearButton = p.createButton('Clear Drawing');
            this.state.clearButton.position(19, 19);
            this.state.clearButton.mousePressed(p.clearCanvas);
            console.log(this.state.clearButton);
            p.background(255);
        }

        p.clearCanvas = () => {
            p.background(255);
        }

        p.draw = () => {
            if (p.mouseIsPressed) {
                p.strokeWeight(16);
                p.line(p.mouseX, p.mouseY, p.pmouseX, p.pmouseY);
            }
        }
    }
    
    componentDidMount() {
        this.myP5 = new p5(this.Sketch, this.myRef.current);
    }

    render() {
        return(
            <div className="Canvas">
                <div ref={this.myRef} id='canvas'></div>
                <button class="btn btn-outline-secondary" onClick={this.handleClick} style={{margin: '5px'}}>Classify Drawing</button>
            </div>
        );
    }
}


function App() {
    const [predictions, setPredictions] = useState([]);
    const [modelName, setModelName] = useState('MobileNet');
    const [image, setImage] = useState({ preview: "", raw: "" });
    const [modelReady, setModelReady] = useState(false);
    const [predicting, setPredicting] = useState(false);
    const classifier = ml5.imageClassifier(modelName, modelLoaded);

    function modelLoaded() {
        // console.log('Model Loaded!');
        setModelReady(true);
    }

    function classifyImg(input) {
        setPredicting(true);

        classifier.predict(input, 5, function(err, results) {
            // console.log(results);
            return results;
        })
        .then((results) => {
            setPredicting(false);
            setPredictions(results);
        })
    }

    useEffect(() => {
        classifyImg(document.getElementById('image'));
    }, [image]);

    let field;
    if (modelName === 'MobileNet') {
        field = <Image image={image} setImage={setImage} modelReady={modelReady}/>
    } else {
        field = <Canvas classifyImg={classifyImg}/>
    }

    return (
        <div className="App">
            <h1>Image Classifcation with ml5.js</h1>
            <ModelDropdown setModelName={setModelName} setPredictions={setPredictions}/><br />
            { field }
            {predictions.length ? <Predictions predictions={predictions} predicting={predicting}/>:''}
        </div>
    );
}


export default App;