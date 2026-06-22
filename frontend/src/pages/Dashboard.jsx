import { Routes, Route, useLocation } from "react-router-dom";
import Sidebar from "../components/dashboard/Sidebar";
import Topbar from "../components/dashboard/Topbar";
import Overview from "../components/dashboard/Overview";
import Flashcards from "../components/dashboard/Flashcards";
import Quiz from "../components/dashboard/Quiz";
import Tutor from "../components/dashboard/Tutor";
import Documents from "../components/dashboard/Documents";
import Progress from "../components/dashboard/Progress";
import StudyPlan from "../components/dashboard/StudyPlan";
import Settings from "../components/dashboard/Settings";

const titles = {
  "/dashboard": "Overview",
  "/dashboard/documents": "Documents",
  "/dashboard/flashcards": "Flashcards",
  "/dashboard/quiz": "Quizzes",
  "/dashboard/tutor": "AI Tutor",
  "/dashboard/plan": "Study Plan",
  "/dashboard/progress": "Progress",
  "/dashboard/settings": "Settings",
};

const activeId = {
  "/dashboard": "overview",
  "/dashboard/documents": "documents",
  "/dashboard/flashcards": "flashcards",
  "/dashboard/quiz": "quiz",
  "/dashboard/tutor": "tutor",
  "/dashboard/plan": "plan",
  "/dashboard/progress": "progress",
  "/dashboard/settings": "settings",
};

export default function Dashboard() {
  const loc = useLocation();
  const title = titles[loc.pathname] || "Dashboard";
  const active = activeId[loc.pathname] || "overview";

  return (
    <div className="dash">
      <Sidebar active={active} />
      <Topbar title={title} />
      <main className="main-dash">
        <div className="mi">
          <Routes>
            <Route index element={<Overview />} />
            <Route path="documents" element={<Documents />} />
            <Route path="flashcards" element={<Flashcards />} />
            <Route path="quiz" element={<Quiz />} />
            <Route path="tutor" element={<Tutor />} />
            <Route path="plan" element={<StudyPlan />} />
            <Route path="progress" element={<Progress />} />
            <Route path="settings" element={<Settings />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}
