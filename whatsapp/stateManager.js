const userStates = {};

function getUserState(userId) {
    // Check if user state already exists and return it
    if (!userStates[userId]) {
        // If not, initialize with a minimal default state that does not assume any specific conversation
        userStates[userId] = {
            step: null,
            active: false,
            responses: {},
            conversationType: null, // Initially, there is no conversation type
        };
    }
    return userStates[userId];
}


function updateUserState(userId, newState) {
    userStates[userId] = { ...userStates[userId], ...newState };
}

// Added 'active' to manage if a user is currently in a conversation.
function initializeUserState(userId, conversationType = null) {
    userStates[userId] = {
        step: conversationType ? Object.keys(conversationType.steps)[0] : null,
        active: false,
        responses: {},
        conversationType: conversationType, // Store the whole conversation object or null if not provided
    };
    console.log(`Initialized state for ${userId}: `, userStates[userId]);
}

function activateConversation(userId) {
    if (userStates[userId]) {
        userStates[userId].active = true;
    }
}

function saveUserResponse(userId, step, response) {
    if (userStates[userId]) {
        userStates[userId].responses[step] = response;
    }
}

function deactivateConversation(userId) {
    if (userStates[userId]) {
        userStates[userId].active = false;
    }
}

module.exports = {
    getUserState,
    updateUserState,
    initializeUserState,
    activateConversation,
    saveUserResponse, 
    deactivateConversation,
};

