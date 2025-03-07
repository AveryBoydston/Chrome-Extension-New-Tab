import { getWidgetPositions, getTasks, setWidgetPositions, setTasks, saveTasksToLocalStorage } from '../script.js'; // Import the functions

const signInCreateAccountHeader = document.querySelector('#sign-in');
const authModal = document.querySelector('#authModal');
const signInButton = document.querySelector('#signInButton');
const createAccountButton = document.querySelector('#createAccountButton');
const cancelAuthButton = document.querySelector('#cancelAuthButton');
const authEmailInput = document.querySelector('#authEmail');
const authPasswordInput = document.querySelector('#authPassword');
const authMessageArea = document.querySelector('#authMessage');

// Event listener for "Sign in / Create account" h3 to show modal
signInCreateAccountHeader.addEventListener('click', () => {
    authModal.style.display = "block"; // Show the modal
    authMessageArea.textContent = ""; // Clear any previous messages
    authMessageArea.classList.remove("success-message"); // Remove success class
});

// Event listener for "Cancel" button to hide modal
cancelAuthButton.addEventListener('click', () => {
    authModal.style.display = "none"; // Hide the modal
    authMessageArea.textContent = ""; // Clear messages when closing
    authMessageArea.classList.remove("success-message"); // Remove success class
});

// Event listener for clicks outside the modal to close it (optional, but good UX)
window.addEventListener('click', (event) => {
    if (event.target == authModal) {
        authModal.style.display = "none"; // Hide modal if clicked outside
        authMessageArea.textContent = ""; // Clear messages when closing
        authMessageArea.classList.remove("success-message"); // Remove success class
    }
});


signInButton.addEventListener('click', handleSignIn);
createAccountButton.addEventListener('click', handleCreateAccount);

const saltRounds = 10; // bcrypt salt rounds for encryption

async function handleCreateAccount() {
    const email = authEmailInput.value.trim();
    const password = authPasswordInput.value;

    if (!email || !password) {
        displayMessage("Email and password are required.", false);
        return;
    }

    try {
        const response = await fetch('http://localhost:3306/signup', { // Backend signup endpoint URL
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }), // Send email and password as JSON
        });

        const data = await response.json();

        if (response.ok) { // Check if response status is in the 200-299 range (success)
            displayMessage(data.message, true);
            console.log("Signup successful! Backend returned userId:", data.userId);
            authEmailInput.value = "";
            authPasswordInput.value = "";
        } else {
            displayMessage(data.message, false);
        }

    } catch (error) {
        console.error('Signup error:', error);
        displayMessage("Signup failed. Could not connect to server.", false); // Network or other client-side error
    }
}


async function handleSignIn() {
    const email = authEmailInput.value.trim();
    const password = authPasswordInput.value;

    if (!email || !password) {
        displayMessage("Email and password are required.", false);
        return;
    }

    try {
        const response = await fetch('http://localhost:3306/signin', { // Backend signin endpoint URL
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }), // Send email and password as JSON
        });

        const data = await response.json(); // Parse JSON response from backend

        if (response.ok) { // response status in range 200-299
            displayMessage(data.message, true);
            chrome.storage.session.set({ 'userId': data.userId }, () => {
                console.log("User ID stored in session:", data.userId);
            });
        } 
        else {
            displayMessage(data.message, false); // Display error message from backend
        }

    } 
    catch (error) {
        console.error('Signin error:', error);
        displayMessage("Signin failed. Could not connect to server.", false); // Network or other client-side error
    }
}

function displayMessage(message, isSuccess) {
    authMessageArea.textContent = message;
    if (isSuccess) {
        authMessageArea.classList.add("success-message"); // Add class for success styling (green color in CSS)
        authMessageArea.classList.remove("error-message"); // Ensure error class is removed
    } else {
        authMessageArea.classList.remove("success-message"); // Ensure success class is removed
        authMessageArea.classList.add("error-message"); // Add class for error styling (red color in CSS)
    }
}


const saveNowButton = document.querySelector('#save-now'); // Get "Save Now" button
saveNowButton.addEventListener('click', handleSaveSettings); // Add event listener

async function handleSaveSettings() {
    chrome.storage.session.get(['userId'], async (result) => {
        const userId = result.userId;

        if (!userId) {
            displayMessage("Not signed in. Sign in to save preferences.", false);
            return;
        }

        const widgetPositions = getWidgetPositions(); // Call function from script.js to get widget positions
        const tasks = getTasks(); // Call function from script.js to get tasks

        try {
            const response = await fetch('http://localhost:3306/settings/save', { // Backend save settings endpoint
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId: userId, widgetPositions: widgetPositions, tasks: tasks }), // Send userId, widgetPositions, and tasks
            });

            const data = await response.json();

            if (response.ok) {
                displayMessage(data.message, true);
            } else {
                displayMessage(data.message, false);
            }

        } 
        catch (error) {
            console.error('Error saving settings:', error);
            displayMessage("Error saving settings. Could not connect to server.", false); // Network error
        }
    });
}



const retrievePreferencesButton = document.querySelector('#retrieve-preferences'); // Get "Retrieve Preferences" button
retrievePreferencesButton.addEventListener('click', handleRetrievePreferences); // Add event listener

async function handleRetrievePreferences() {
    chrome.storage.session.get(['userId'], async (result) => {
        const userId = result.userId;

        if (!userId) {
            displayMessage("Not signed in. Sign in to retrieve preferences.", false);
            return;
        }

        try {
            const response = await fetch(`http://localhost:3306/settings/retrieve/${userId}`);
            const data = await response.json();

            if (response.ok) {
                displayMessage("Preferences retrieved successfully!", true);
                saveTasksToLocalStorage();

                // Save retrieved settings to chrome.storage.session *before* applying them
                chrome.storage.session.set({ 
                    widgetPositions: data.widgetPositions, // Save widget positions to session storage
                    tasks: data.tasks // Save tasks to session storage
                }, () => {
                    // Callback function (optional, can be used for error handling if needed)
                    if (chrome.runtime.lastError) {
                        console.error("Error saving to session storage:", chrome.runtime.lastError);
                    } else {
                        console.log("Settings saved to session storage.");
                    }
                    
                    // *Now* apply the retrieved settings to the UI
                    setWidgetPositions(data.widgetPositions); 
                    setTasks(data.tasks); 

                });


            } else if (response.status === 404) {
                displayMessage("No saved preferences found for this account.", false);
                // If no settings found in database, you might want to clear session storage too, or load defaults
                chrome.storage.session.remove(['widgetPositions', 'tasks']); // Clear session storage if no settings found? (optional)
            }
            else {
                displayMessage(data.message, false);
            }

        } catch (error) {
            console.error('Error retrieving settings:', error);
            displayMessage("Error retrieving preferences. Could not connect to server.", false);
        }
    });
}