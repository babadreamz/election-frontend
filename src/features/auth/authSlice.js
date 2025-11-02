import { createSlice } from '@reduxjs/toolkit';

function getStoredJSON(key) {
    const item = localStorage.getItem(key);
    if (item && item !== 'undefined' && item !== 'null') {
        try {
            return JSON.parse(item);
        } catch (e) {
            console.error('Failed to parse localStorage item', e);
            return null;
        }
    }
    return null;
}

const adminToken = localStorage.getItem('token');
const voterToken = localStorage.getItem('voterToken');
const admin = getStoredJSON('admin');
const voter = getStoredJSON('voter');
const voterRoles = getStoredJSON('voterRoles') || [];
const activeElectionIdentifier = localStorage.getItem('activeElectionIdentifier') || null;

const initialState = {
    adminToken: adminToken,
    voterToken: voterToken,
    voterRoles: voterRoles,
    admin: admin,
    voter: voter,
    activeElectionIdentifier: activeElectionIdentifier,
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginAdmin: (state, action) => {
            state.adminToken = action.payload.token;
            state.admin = action.payload.admin;
            localStorage.setItem('token', action.payload.token);
            localStorage.setItem('admin', JSON.stringify(action.payload.admin));

            state.voterToken = null;
            state.voter = null;
            state.voterRoles = [];
            localStorage.removeItem('voterToken');
            localStorage.removeItem('voter');
            localStorage.removeItem('voterRoles');
        },
        logoutAdmin: (state) => {
            state.adminToken = null;
            state.admin = null;
            state.activeElectionIdentifier = null;
            localStorage.removeItem('token');
            localStorage.removeItem('admin');
            localStorage.removeItem('activeElectionIdentifier');
        },
        loginVoter: (state, action) => {
            const { token, roles, ...voterData } = action.payload;
            const voter = {
                id: voterData.id,
                voterId: voterData.voterId,
                firstName: voterData.firstName,
                lastName: voterData.lastName,
                roles: roles,
            };
            state.voterToken = token;
            state.voter = voter;
            state.voterRoles = roles || [];
            localStorage.setItem('voterToken', token);
            localStorage.setItem('voter', JSON.stringify(voter));
            localStorage.setItem('voterRoles', JSON.stringify(roles || []));

            state.adminToken = null;
            state.admin = null;
            localStorage.removeItem('token');
            localStorage.removeItem('admin');
            // --- END NULLIFICATION ---
        },
        logoutVoter: (state) => {
            state.voterToken = null;
            state.voter = null;
            state.voterRoles = [];
            state.activeElectionIdentifier = null;
            localStorage.removeItem('voterToken');
            localStorage.removeItem('voter');
            localStorage.removeItem('voterRoles');
            localStorage.removeItem('activeElectionIdentifier');
        },
        setActiveElection: (state, action) => {
            state.activeElectionIdentifier = action.payload;
            localStorage.setItem('activeElectionIdentifier', action.payload);
        },
        clearActiveElection: (state) => {
            state.activeElectionIdentifier = null;
            localStorage.removeItem('activeElectionIdentifier');
        },
    },
});

export const {
    loginAdmin, logoutAdmin, loginVoter, logoutVoter,
    setActiveElection, clearActiveElection
} = authSlice.actions;

export const selectIsAdminAuth = (state) => state.auth.adminToken !== null;
export const selectIsVoterAuth = (state) => state.auth.voterToken !== null;
export const selectIsCandidate = (state) => state.auth.voterRoles.includes('candidate');
export const selectCurrentAdmin = (state) => state.auth.admin;
export const selectCurrentVoter = (state) => state.auth.voter;
export const selectActiveElectionIdentifier = (state) => state.auth.activeElectionIdentifier;

export default authSlice.reducer;
