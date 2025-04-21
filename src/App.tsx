import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import BarChart from "./pages/Charts/BarChart";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import { AuthGuard } from "./components/common/AuthGuard";
import PostsManager from "./pages/Posts/Posts";
import AccountManagement from "./pages/User/User";
import Banner from "./pages/Page/Banner/Banner";
import VoucherManagement from "./pages/Voucher/Voucher";

export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Dashboard Layout */}
          <Route element={<AppLayout />}>
            <Route
              index
              path="/"
              element={
                <AuthGuard>
                  <Home />
                </AuthGuard>
              }
            />
            <Route
              index
              path="/users"
              element={
                <AuthGuard>
                  <AccountManagement />
                </AuthGuard>
              }
            />
            <Route
              index
              path="/voucher"
              element={
                <AuthGuard>
                  <VoucherManagement />
                </AuthGuard>
              }
            />
            {/* Others Page */}
            <Route path="/profile" element={<UserProfiles />} />
            <Route path="/blank" element={<Blank />} />

            {/* Forms */}
            <Route path="/form-elements" element={<FormElements />} />

            {/* Tables */}
            <Route path="/posts" element={<PostsManager />} />
            <Route path="/banner" element={<Banner />} />

            {/* Charts */}
            <Route path="/bar-chart" element={<BarChart />} />
          </Route>

          {/* Auth Layout */}
          <Route
            path="/signin"
            element={
              <AuthGuard>
                <SignIn />
              </AuthGuard>
            }
          />
          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
