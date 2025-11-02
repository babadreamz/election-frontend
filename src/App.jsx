import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Public
import LandingPage from './pages/LandingPage.jsx';
import AdminRegistrationPage from './pages/AdminRegistrationPage.jsx';
import AdminLoginPage from './pages/AdminLoginPage.jsx';
import GeneralLoginPage from './pages/GeneralLoginPage.jsx';
import VoterLoginPage from './pages/VoterLoginPage.jsx';

// Private
import PrivateRoute from './components/PrivateRoute.jsx';
import AdminDashboardPage from './pages/AdminDashboard';
import VoterPrivateRoute from './components/VoterPrivateRoute.jsx';
import VoterDashboard from './pages/VoterDashboard.jsx';
import VoterRegistrationPage from "./pages/VoterRegistrationPage.jsx";
import AdminRegSuccessPage from "./pages/AdminRegSuccessPage.jsx";
import CreateElectionSuccessPage from "./pages/CreateElectionSuccessPage.jsx";
import CreateElectionPage from "./pages/CreateElectionPage.jsx";
import ElectionOverview from "./pages/ElectionOverview.jsx";
import ElectionLayout from "./components/ElectionLayout.jsx";
import ElectionVoters from "./pages/ElectionVoters.jsx";
import ElectionCandidates from "./pages/ElectionCandidates.jsx";
import CreatePositionPage from "./pages/CreatePositionPage.jsx";
import ElectionPositions from "./pages/ElectionPositions.jsx";
import AdminBallotPreview from "./pages/AdminBallotPreview.jsx";
import ElectionResults from "./pages/ElectionResults.jsx";
import VoterElectionLayout from "./components/VoterElectionLayout.jsx";
import VoteReviewPage from "./pages/VoteReviewPage.jsx";
import ElectionBallot from "./pages/ElectionBallot.jsx";
import VoterElectionResults from "./pages/VoterElectionResults.jsx";
import ApplyCandidacy from "./pages/ApplyCandidacy.jsx";
import VoterViewCandidates from "./pages/VoterViewCandidates.jsx";
import VoterElectionOverview from "./pages/VoterElectionOverview.jsx";
import VoteSuccessPage from "./pages/VoteSuccessPage.jsx";
import CandidateResultPage from "./pages/CandidateResultPage.jsx";

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/create" element={<AdminRegistrationPage />} />
            <Route path="/admin-login" element={<AdminLoginPage />} />
            <Route path="/general-login" element={<GeneralLoginPage />} />
            <Route path="/voter-login" element={<VoterLoginPage />} />
            <Route path="/voter-register" element={<VoterRegistrationPage />} />
            <Route path='/adminReg-success' element={<AdminRegSuccessPage />} />
            <Route path="/election-success" element={<CreateElectionSuccessPage />}/>

            <Route element={<PrivateRoute />}>
                <Route path="/admin" element={<AdminDashboardPage />} />
                <Route path="/create-election" element={<CreateElectionPage />} />



                <Route element={<ElectionLayout />}>
                    <Route path="/election-overview" element={<ElectionOverview />} />
                    <Route path="/election-ballot-preview" element={<AdminBallotPreview />} />
                    <Route path="/election-voters" element={<ElectionVoters />} />
                    <Route path="/election-candidates" element={<ElectionCandidates />}/>
                    <Route path="/create-position" element={<CreatePositionPage />} />
                    <Route path="/election-positions" element={<ElectionPositions />} />
                     <Route path="/election-results" element={<ElectionResults />} />
                </Route>

            </Route>

            <Route element={<VoterPrivateRoute />}>
                <Route path="/voter-dashboard" element={<VoterDashboard />} />
                <Route path="/voter/results/:electionId" element={<ElectionResults />} />

                <Route path="/voter/election/:electionId" element={<VoterElectionLayout />}>
                    <Route index element={<VoterElectionOverview />} />
                    <Route path="ballot" element={<ElectionBallot />} />
                    <Route path="review" element={<VoteReviewPage />} />
                    <Route path="results" element={<VoterElectionResults />} />
                    <Route path="candidates" element={<VoterViewCandidates />} />
                    <Route path="apply" element={<ApplyCandidacy />} />
                    <Route path="my-result" element={<CandidateResultPage />} />
                </Route>
                <Route path="/vote-success" element={<VoteSuccessPage />} />
            </Route>
        </Routes>
    );
}