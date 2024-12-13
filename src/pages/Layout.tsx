
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import HintergrundBild from '../assets/images/Hintergrund.png'; 

function Background()
{
    return (
        <>
            <Navbar />
            <img className="background" src={HintergrundBild} alt="Hintergrundbild" />
            <main>
                <Outlet />
            </main>
            <Footer />
        </>
    );
}

export default Background;