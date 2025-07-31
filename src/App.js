import { Route, Routes } from "react-router-dom";
import DownloadHistory from "./Componnent/Download History";
import Billing from "./Componnent/Billing";
import Header from "./Componnent/Header";
import Footer from "./Componnent/Footer";


function App() {
  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/" element={<Billing />} />
        <Route path="/quotation" element={<DownloadHistory />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
