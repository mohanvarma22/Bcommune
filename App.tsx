import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './views/Home';
import Profile from './views/Profile';
import Connections from './views/Connections';
import Messages from './views/Messages';
import Login from './views/Login';
import JobDetail from './views/JobDetail';
import StoryDetail from './views/StoryDetail';
import EventsList from './views/EventsList';
import EventDetail from './views/EventDetail';
import CreateJob from './views/CreateJob';
import CreateStory from './views/CreateStory';
import CreateEvent from './views/CreateEvent';
import Analytics from './views/Analytics';
import MyActivity from './views/MyPostings';
import JobApplicants from './views/JobApplicants';
import Settings from './views/Settings';
import Onboarding from './views/Onboarding';
import Ventures from './views/Ventures';
import VentureProfile from './views/VentureProfile';
import CreateVenture from './views/CreateVenture';
import TalentRadarView from './views/TalentRadarView';
import SharedDashboard from './views/SharedDashboard';
import Opportunities from './views/Core';
import CreateCompany from './views/CreateCompany';
import CompanyProfile from './views/CompanyProfile';

// New Company Workspace Views
import CompanyDashboard from './views/company/CompanyDashboard';
import CompanyJobs from './views/company/CompanyJobs';
import CompanyContent from './views/company/CompanyContent';
import CompanyTeam from './views/company/CompanyTeam';
import CompanyAnalytics from './views/company/CompanyAnalytics';


function App(): React.ReactNode {
  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/share/:dashboardId" element={<SharedDashboard />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/feed" replace />} />
          <Route path="feed" element={<Home />} />
          <Route path="opportunities" element={<Opportunities />} />
          <Route path="ventures" element={<Ventures />} />
          <Route path="ventures/:ventureId" element={<VentureProfile />} />
          <Route path="ventures/:ventureId/radar" element={<TalentRadarView />} />
          <Route path="profile/:userId" element={<Profile />} />
          <Route path="company/:companyId" element={<CompanyProfile />} />
          <Route path="connections" element={<Connections />} />
          <Route path="messages" element={<Messages />} />
          <Route path="messages/:conversationId" element={<Messages />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="my-activity" element={<MyActivity />} />
          <Route path="my-activity/job/:jobId/applicants" element={<JobApplicants />} />
          <Route path="jobs/:jobId" element={<JobDetail />} />
          <Route path="stories/:storyId" element={<StoryDetail />} />
          <Route path="events" element={<EventsList />} />
          <Route path="events/:eventId" element={<EventDetail />} />
          <Route path="create/job" element={<CreateJob />} />
          <Route path="create/story" element={<CreateStory />} />
          <Route path="create/event" element={<CreateEvent />} />
          <Route path="create/venture" element={<CreateVenture />} />
          <Route path="create/company" element={<CreateCompany />} />
          <Route path="settings" element={<Settings />} />

          {/* Company Workspace Routes */}
          <Route path="company/:companyId/dashboard" element={<CompanyDashboard />} />
          <Route path="company/:companyId/jobs" element={<CompanyJobs />} />
          <Route path="company/:companyId/analytics" element={<CompanyAnalytics />} />
          <Route path="company/:companyId/content" element={<CompanyContent />} />
          <Route path="company/:companyId/team" element={<CompanyTeam />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;