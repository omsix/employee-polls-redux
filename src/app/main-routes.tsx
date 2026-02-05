import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { DashboardComponent } from '../components/dashboard/dashboard.component';
import { PollDetailsPageComponent } from '../components/poll-details/poll-details-page.component';
import { NewPollComponent } from '../components/new-poll/new-poll.component';
import { LeaderBoardComponent } from '../components/leader-board/leader-board.component';
import { NotFoundComponent } from '../components/not-found/not-found.component';

const MainRoutes: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<DashboardComponent />} />
            <Route path="/questions/:id" element={<PollDetailsPageComponent />} />
            <Route path="/add" element={<NewPollComponent />} />
            <Route path="/leaderboard" element={<LeaderBoardComponent />} />
            <Route path="/404" element={<NotFoundComponent />} />
            <Route path='/login' element={<DashboardComponent/>}/>
            <Route path="*" element={<Navigate to="/404" />} />
        </Routes>
    );
};

export default MainRoutes;
