import { useNavigate } from "react-router-dom";
import Header from "../UI/header/Header";
import Footer from "../UI/footer/Footer";
import './about.css';

function About() {
    const navigate = useNavigate();

    return (
        <div>
            <Header/>
            <div className="container-about">
                <div className="content-about">
                    <h1>Created by <a className="a-about" href="https://t.me/gu1Ityy" target="_blank" rel="noopener noreferrer">akamyshenk</a></h1><br></br>
                    <h2>All icons provided by <a className="a-icons" href="https://icons8.com" target="_blank" rel="noopener noreferrer">Icons8</a></h2>
                    <button className="button-about" onClick={() => navigate(-1)}>Go back</button>
                </div>
            </div>
            <Footer/>
        </div>
    );    
}

export default About;