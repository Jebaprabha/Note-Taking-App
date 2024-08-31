const addNoteBtn = document.getElementById('add-note-btn');
const notePopup = document.getElementById('note-popup');
const popupAddBtn = document.getElementById('popup-add-btn');
const noteList = document.getElementById('note-list');
const searchBar = document.getElementById('search-bar');
const themeToggle = document.getElementById('theme-toggle');
const popupQuitBtn = document.getElementById('popup-quit-btn');
const noNotesMessage = document.getElementById('no-notes-message');

let isEditing = false;
let currentNote = null;

// Load the saved theme and notes on page load
document.addEventListener('DOMContentLoaded', function() {
    const savedTheme = localStorage.getItem('theme') || 'light'; // Default to light theme if no preference is saved
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        themeToggle.textContent = '🌕';
    } else {
        document.body.classList.remove('dark-mode');
        themeToggle.textContent = '🌙';
    }

    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    notes.forEach(note => {
        createNoteElement(note.title, note.content);
    });
    toggleNoNotesMessage(); // Check if there are any notes on load
});

// Function to toggle "No notes found" message based on search results
function toggleNoNotesMessageDuringSearch(notesFound) {
    if (notesFound) {
        noNotesMessage.style.display = 'none';
    } else {
        noNotesMessage.style.display = 'block';
    }
}

// Function to toggle "No notes found" message based on the total number of notes
function toggleNoNotesMessage() {
    const notes = document.querySelectorAll('.note');
    if (notes.length === 0) {
        noNotesMessage.style.display = 'block';
    } else {
        noNotesMessage.style.display = 'none';
    }
}

// Search functionality
searchBar.addEventListener('input', function() {
    const searchTerm = searchBar.value.toLowerCase();
    const notes = document.querySelectorAll('.note');
    let notesFound = false;

    notes.forEach(note => {
        const title = note.querySelector('h2').textContent.toLowerCase();
        const content = note.querySelector('p').textContent.toLowerCase();

        if (title.includes(searchTerm) || content.includes(searchTerm)) {
            note.style.display = 'block';
            notesFound = true;
        } else {
            note.style.display = 'none';
        }
    });

    // Display "No notes found" message if no notes match the search
    toggleNoNotesMessageDuringSearch(notesFound);
});

// Add Note button event
addNoteBtn.addEventListener('click', function() {
    openPopup();
});

// Popup Add button event
popupAddBtn.addEventListener('click', function() {
    const title = document.getElementById('popup-note-title').value;
    const content = document.getElementById('popup-note-content').value;

    if (title && content) {
        if (isEditing && currentNote) {
            // Update the current note
            currentNote.querySelector('h2').textContent = title;
            currentNote.querySelector('p').textContent = content;
            updateNotesInLocalStorage();
            isEditing = false;
            currentNote = null;
            popupAddBtn.textContent = 'Add Note'; // Reset button text
            document.getElementById('form-heading').textContent = 'Add a New Note';
        } else {
            // Create a new note
            createNoteElement(title, content);
            saveNoteToLocalStorage(title, content);
        }

        closePopup();
        toggleNoNotesMessage(); // Check if there are any notes after adding a new one
    }
});

// Theme toggle button event
themeToggle.addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    themeToggle.textContent = isDarkMode ? '🌕' : '🌙';

    // Save the theme preference to localStorage
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
});

// Close popup on clicking outside
notePopup.addEventListener('click', function(e) {
    if (e.target === notePopup) {
        closePopup();
    }
});

// Close popup button event
popupQuitBtn.addEventListener('click', function() {
    closePopup();
});

function editNote(note) {
    const title = note.querySelector('h2').textContent;
    const content = note.querySelector('p').textContent;

    document.getElementById('popup-note-title').value = title;
    document.getElementById('popup-note-content').value = content;

    isEditing = true;
    currentNote = note;
    popupAddBtn.textContent = 'Edit and Save'; // Change button text to "Edit and Save"
    document.getElementById('form-heading').textContent = 'Edit Your Note'; // Change form heading

    openPopup();
}

function openPopup() {
    notePopup.style.display = 'flex';
}

function closePopup() {
    document.getElementById('popup-note-title').value = '';
    document.getElementById('popup-note-content').value = '';
    notePopup.style.display = 'none';
    isEditing = false;
    currentNote = null;
    popupAddBtn.textContent = 'Add Note'; // Reset button text
    document.getElementById('form-heading').textContent = 'Add a New Note'; // Reset form heading
}

function createNoteElement(title, content) {
    const note = document.createElement('div');
    note.classList.add('note');
    
    note.innerHTML = `
        <h2>${title}</h2>
        <p>${content}</p>
        <div class="note-actions">
            <button class="edit-note">Edit</button>
            <button class="delete-note">Delete</button>
        </div>
    `;

    note.querySelector('.edit-note').addEventListener('click', function() {
        editNote(note);
    });

    note.querySelector('.delete-note').addEventListener('click', function() {
        note.remove();
        updateNotesInLocalStorage();
        toggleNoNotesMessage(); // Check if there are any notes after deleting
    });

    noteList.appendChild(note);
}

function saveNoteToLocalStorage(title, content) {
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    notes.push({ title, content });
    localStorage.setItem('notes', JSON.stringify(notes));
}

function updateNotesInLocalStorage() {
    const notes = [];
    document.querySelectorAll('.note').forEach(note => {
        const title = note.querySelector('h2').textContent;
        const content = note.querySelector('p').textContent;
        notes.push({ title, content });
    });
    localStorage.setItem('notes', JSON.stringify(notes));
}
