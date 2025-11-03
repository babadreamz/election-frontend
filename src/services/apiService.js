import axios from 'axios';
import { store } from '../app/store';

export const apiClient = axios.create({
    baseURL: '/election/',
});
apiClient.interceptors.request.use(
    (config) => {
        const authState = store.getState().auth;
        let tokenToUse = null;
        let tokenType = 'None';

        if (config.url?.startsWith('admin/')) {
            if (authState.adminToken && typeof authState.adminToken === 'string') {
                tokenToUse = authState.adminToken;
                tokenType = 'Admin';
            } else {
                console.warn(`Interceptor: Admin token needed for ${config.url}, but not found.`);
            }
        }
        else if (
            config.url?.startsWith('voter/') ||
            config.url?.startsWith('election/') ||
            config.url?.startsWith('view/') ||
            config.url?.startsWith('allvoters') ||
            config.url?.startsWith('allcandidates') ||
            config.url?.startsWith('allpositions') ||
            config.url?.startsWith('view/approved') ||
            config.url?.startsWith('logout')
        ) {

            if (authState.adminToken && typeof authState.adminToken === 'string') {
                tokenToUse = authState.adminToken;
                tokenType = 'Admin (Fallback for Shared)';
            }
            else if (authState.voterToken && typeof authState.voterToken === 'string') {
                tokenToUse = authState.voterToken;
                tokenType = 'Voter/Shared';
            }
            else {
                console.warn(`Interceptor: Token needed for ${config.url}, but none found.`);
            }
        }

        console.log(`Interceptor: Using ${tokenType} token for URL ${config.url}`);

        if (tokenToUse) {
            config.headers['Authorization'] = `Bearer ${tokenToUse}`;
        } else {
            delete config.headers['Authorization'];
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


export const registerAdmin = (adminData) => {
    return apiClient.post('public/admin/register', adminData);
};
export const loginAdmin = (loginData) => {
    return apiClient.post('public/admin/login', loginData);
};
export const loginVoter = (loginData) => {
    return apiClient.post('public/voter/login', loginData);
};
export const registerVoter = (voterData) => {
    return apiClient.post('public/voter/register', voterData);
};

export const getElectionResults = (electionPublicId) => {
    return apiClient.get('view/all/results', {
        params: { electionPublicId },
    });
};
export const getElectionDetails = (electionPublicId) => {
    return apiClient.get(`admin/election/${electionPublicId}`);
};
export const getVoterElectionDetails = (electionPublicId) => {
    return apiClient.get(`voter/election/${electionPublicId}`);
};
export const viewApprovedCandidates = (electionPublicId) => {
    return apiClient.get('view/approved', {
        params: { electionPublicId }
    });
};
export const getAllVotersForElection = (electionPublicId) => {
    return apiClient.get('allvoters', {
        params: { electionPublicId },
    });
};
export const logoutUserAPI = () => {
    return apiClient.patch('logout');
};

export const createPosition = (positionData) => {
    return apiClient.post('admin/create/position', positionData);
};
export const viewPendingCandidates = (electionPublicId) => {
    return apiClient.get('admin/view/pending', {
        params: { electionPublicId },
    });
};
export const approveCandidate = (pendingCandidateId) => {
    return apiClient.post('admin/approve/candidate', null, {
        params: { pendingCandidateId },
        headers: { 'Content-Type': 'application/json' }
    });
};
export const declineCandidate = (pendingCandidateId, electionPublicId) => {
    return apiClient.delete('admin/decline/candidate', {
        params: { pendingCandidateId: pendingCandidateId, electionPublicId },
    });
};
export const generateVoterIds = (numberOfVoters, electionPublicId) => {
    return apiClient.put(
        'admin/generate/export',
        null,
        {
            params: { numberOfVoters, electionPublicId },
            responseType: 'blob',
        }
    );
};
export const createElection = (electionData) => {
    return apiClient.post('admin/create', electionData);
};
export const getMyElections = () => {
    return apiClient.get('admin/myelections');
};
export const activateElection = (electionPublicId) => {
    return apiClient.put('admin/activate', null, {
        params: { electionPublicId },
    });
};
export const startElection = (electionPublicId) => {
    return apiClient.patch('admin/start', null, {
        params: { electionPublicId }
    });
};
export const endElection = (electionPublicId) => {
    return apiClient.patch('admin/end', null, {
        params: { electionPublicId }
    });
};
export const deletePosition = (positionCode, electionPublicId) => {
    return apiClient.delete('admin/delete/position', {
        params: { positionCode, electionPublicId }
    });
};
export const computeElectionResults = (electionPublicId) => {
    return apiClient.post('admin/generate/Result', null, {
        params: { electionPublicId }
    });
};

export const getVoterElections = () => {
    return apiClient.get('voter/myelections');
};
export const participateInElection = (electionPublicId, membershipId) => {
    return apiClient.post('voter/participate', null, {
        params: { electionPublicId, membershipId },
    });
};
export const castVote = (votePayload) => {
    return apiClient.post('voter/vote', votePayload);
};
export const applyForCandidacy = (electionPublicId, electionVoterId, positionCode) => {
    return apiClient.post('voter/apply/candidacy', null, {
        params: {
            electionPublicId,
            electionVoterId,
            positionCode
        },
    });
};
export const withdrawCandidacy = (electionPublicId, electionVoterId) => {
    return apiClient.patch('voter/candidate/withdraw', null, {
        params: { electionPublicId, electionVoterId }
    });
};
export const getMyCandidateResult = (electionPublicId, electionVoterId) => {
    return apiClient.get('voter/candidate/result', {
        params: { electionPublicId, electionVoterId }
    });
};
