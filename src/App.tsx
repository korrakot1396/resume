import { lazy, Suspense } from "react";
import { Link, Route, Routes } from "react-router";
import { Layout } from "./components/Layout";
import Home from "./pages/Home";
import Splash from "./pages/Splash";

const Education = lazy(() => import("./pages/Education"));
const Experience = lazy(() => import("./pages/Experience"));
const Projects = lazy(() => import("./pages/Projects"));
const Contact = lazy(() => import("./pages/Contact"));
const OpenSource = lazy(() => import("./pages/OpenSource"));

export default function App() {
  return (
    <Suspense
      fallback={<output className="page-loading">Loading portfolio…</output>}
    >
      <Routes>
        <Route index element={<Splash />} />
        <Route path="/splash" element={<Splash />} />
        <Route element={<Layout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/education" element={<Education />} />
          <Route path="/experience" element={<Experience />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/opensource" element={<OpenSource />} />
          <Route
            path="*"
            element={
              <div className="empty-state">
                <p className="eyebrow">404</p>
                <h1>Page not found.</h1>
                <Link className="button primary" to="/home">
                  Back to home
                </Link>
              </div>
            }
          />
        </Route>
      </Routes>
    </Suspense>
  );
}
