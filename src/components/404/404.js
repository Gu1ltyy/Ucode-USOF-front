import { useNavigate } from "react-router-dom";
import Header from "../UI/header/Header";
import Footer from "../UI/footer/Footer";
import '../about/about.css';

function NotFoundPage() {
    const navigate = useNavigate();

    return (
        <div>
            <Header/>
            <div className="container-about">
                <div className="content-about err">
                    <h1>Error 404</h1><br></br>
                    <h2>No such page</h2>
                    <button className="button-about" onClick={() => navigate('/')}>Go back</button>
                </div>
            </div>
            <Footer/>
        </div>
    );    
}

export default NotFoundPage;