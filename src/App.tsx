import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { BaseLayout } from "./components/layout/BaseLayout";
import { Menu } from "./pages/Menu";
import { Orders } from "./pages/Orders";

function App() {
  return (
    <Router>
      <BaseLayout>
        <Routes>
          <Route path="/" element={<Menu />} />
          <Route path="/orders" element={<Orders />} />
        </Routes>
      </BaseLayout>
    </Router>
  );
}

export default App;
