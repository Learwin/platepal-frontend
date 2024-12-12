import { Startseite } from "components/Startseite";
import Test from "pages/test";
import { Route, Routes } from "react-router-dom";


export default function App() {
    return 
        (<Routes>
            <Route path="/" element={Startseite}/>
            <Route path="/test" element={Test}/>

        </Routes>)
    
}