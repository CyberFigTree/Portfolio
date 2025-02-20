document.addEventListener("DOMContentLoaded", function () {
    const links = document.querySelectorAll(".nav_links a");
    const currentPath = window.location.pathname;

    links.forEach(link => {
        if (link.getAttribute("href") === currentPath) {
            link.classList.add("active");
        }
    });
});

document.addEventListener("DOMContentLoaded", function () {
    async function getIPAddress() {
        try {
            const response = await fetch("https://api64.ipify.org?format=json");
            if (!response.ok) throw new Error("Network response was not ok");
            const data = await response.json();
            return data.ip;
        } catch (error) {
            console.error("Failed to fetch IP address:", error);
            return "visitor";
        }
    }

    async function startTypingEffect() {
        if (sessionStorage.getItem("welcomeMessage")) {
            document.getElementById("typing-text").innerHTML = sessionStorage.getItem("welcomeMessage");
            return;
        }

        const ipAddress = await getIPAddress();
        const text = `Hi, ${ipAddress}! Welcome to my Cyberspace!\nI'm a final-year Cybersecurity student @ University of Queensland.\n\
Subject's I've done as a part of my Cybersecurity Degree:\n\n> Vulnerability Assessment & Penetration Testing\n\
> Computer Networks\n> Information Security\nCloud Computing\
\n> Computer Systems Principles and Programming`;

        const typingElement = document.getElementById("typing-text");
        let i = 0;

        function type() {
            if (i < text.length) {
                typingElement.innerHTML += text.charAt(i) === "\n" ? "<br>" : text.charAt(i);
                i++;
                setTimeout(type, 60);
            } else {
                sessionStorage.setItem("welcomeMessage", typingElement.innerHTML);
            }
        }

        type();
    }

    startTypingEffect();
});

let loadedWriteups = {};

async function toggleWriteup(writeupId, filename) {
    const writeupDiv = document.getElementById(writeupId);
    const header = writeupDiv.previousElementSibling;
    const button = header.querySelector('.close-button');

    // If content hasn't been loaded yet
    if (!loadedWriteups[writeupId]) {
        try {
            const response = await fetch(filename);
            const text = await response.text();
            writeupDiv.textContent = text;
            loadedWriteups[writeupId] = true;
        } catch (error) {
            console.error('Error loading writeup:', error);
            writeupDiv.textContent = 'Error loading writeup';
            return;
        }
    }

    // If already open, close it
    if (writeupDiv.classList.contains('active')) {
        writeupDiv.classList.remove('active');
        button.classList.remove('active'); // Change back to arrow
    } else {
        // Hide all other writeups and reset their buttons
        document.querySelectorAll('.writeup').forEach(div => div.classList.remove('active'));
        document.querySelectorAll('.close-button').forEach(btn => btn.classList.remove('active'));

        writeupDiv.classList.add('active');
        button.classList.add('active'); // Change arrow to X
    }
}

function closeWriteup(writeupId) {
    const writeupDiv = document.getElementById(writeupId);
    const button = writeupDiv.previousElementSibling.querySelector('.close-button');

    writeupDiv.classList.remove('active');
    button.classList.remove('active'); // Change back to arrow
}
