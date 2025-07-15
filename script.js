// --- Terminal Logic & State ---
const input = document.getElementById("cmd-input");
const history = document.getElementById("history");
const footerTime = document.getElementById("time");
let isTyping = false;

// --- LEVENSHTEIN DISTANCE ALGORITHM ---
const levenshtein = (s1, s2) => {
  let track = Array(s2.length + 1).fill(null).map(() => Array(s1.length + 1).fill(null));
  for (let i = 0; i <= s1.length; i += 1) track[0][i] = i;
  for (let j = 0; j <= s2.length; j += 1) track[j][0] = j;
  for (let j = 1; j <= s2.length; j += 1) {
    for (let i = 1; i <= s1.length; i += 1) {
      const indicator = s1[i - 1] === s2[j - 1] ? 0 : 1;
      track[j][i] = Math.min(
        track[j][i - 1] + 1,
        track[j - 1][i] + 1,
        track[j - 1][i - 1] + indicator,
      );
    }
  }
  return track[s2.length][s1.length];
};

// --- COMMANDS OBJECT ---
const commands = {
  help: `Available commands:\n help \n about \n projects \n skills \n contact \n education \n certifications \n leadership \n sudo \n clear \n neofetch`,
  about: `Hi, I'm Musthaq Ahmed Cybersecurity & AI/ML Enthusiast.\nWelcome to my interactive terminal portfolio!`,
  projects: `Projects:\n• <b>Phishing URL Detection </b> – Built a machine learning model to classify phishing websites using URL-based feature extraction and Random Forest classifier. <a href="https://github.com/musthaqahmead/Phishing-URL-Detection" target="_blank">[GitHub]</a>\n• <b>Handwritten Digit Recognition</b> – Developed a model to classify handwritten digits using image processing. <a href="https://github.com/musthaqahmead/Handwritten-Digit-Recognition-using-Neural-Networks" target="_blank">[GitHub]</a>\n• Portfolio Terminal Interface`,
  skills: `Skills:\n• <b>Programming languages:</b> Python, C programming, R Programming.\n• <b>Web Development:</b> HTML, CSS, JavaScript.\n• <b>Database management:</b> MySQL, Oracle.\n• <b>Operating System:</b> Windows, Linux, Kali Linux, Parrot OS.\n• <b>Digital Marketing:</b> SEO, Social Media Marketing, Google Ads, Content Strategy, Email Marketing.`,
  contact: `📬 <b>Get In Touch:</b>\n\n📧 musthaqahmead@gmail.com  \n📱 +91 96327 32730  \n🔗 LinkedIn: <a href="https://linkedin.com/in/musthaq-ahmed-6bb108319" target="_blank">linkedin.com/in/musthaq-ahmed-6bb108319</a>  \n💻 GitHub: <a href="https://github.com/musthaqahmead" target="_blank">github.com/musthaqahmead</a>  \nFeel free to reach out!`,
  education: `Education:\n• BCA (Mangalore University) – Bearys Institute of Emerging Science`,
  certifications: `Certifications:\n• <b>Foundation of Cyber Security:</b> Gained essential knowledge of cybersecurity principles, including threat detection, risk management, and basic defensive strategies to safeguard digital systems.\n• <b>Play it Safe: Manage Security Risks:</b> Acquired skills to identify, assess, and mitigate security risks, ensuring the protection of sensitive information and maintaining system integrity.\n• <b>EyeQ Dot Net Pvt. Ltd. – February 24, 2024:</b> Successfully attended a cybersecurity webinar conducted by India's leading cybersecurity company.\n• <b>Secured 2nd Place in Idea Pitching Competition:</b> Held as part of “SenseIT” organized by the IEEE Student Branch of P A College of Engineering on February 20, 2025.`,
  leadership: `🧠 Focused and Logical: You think clearly, solve problems step-by-step, and don’t rush — especially useful in coding and tech teamwork.<br><br>🔒 Reliable and Disciplined: You consistently take responsibility — whether it’s leading a hackathon team or managing tasks.<br><br>🤐 Lead Silently, Act Strongly: You don’t need to talk much — your actions, skills, and dedication naturally influence others.<br><br>🧑‍💻 Technical Role Model: With your interest in AI, cybersecurity, and terminal-style projects, you lead by skill and knowledge — inspiring peers without forcing it.<br><br>💬 Supportive in One-on-One: You prefer meaningful, direct support over big speeches — perfect for mentoring or guiding a teammate privately`,
  sudo: `Hi I am Musthaq Ahmed a Cybersecurity & AI/ML Enthusiast`,
  neofetch: {
    logo: `
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@#BGGB&@@@@@@@@&G555G#@@@@@@@&BBGB#&@@@@@@@@
@@@@#J^.    :!P@@@@G!.     .~5@@@GJ?7777??5#@@@@@@
@@@G:          7@@Y           !@G77???????7?G@@@@@
@@@^            5&.            P@??????????7?&@@@@
@@@^            5#             B@??????????7J@@@@@
@@@G:          ?@7           .5@P7?77??????J#@@@@@
@@@@&Y~:.  .^7GB~    .:^~^^!YBGJ77?5G#&&&&&@@@@@@@
@@@@@@#GPPPPPY~   :JPGGGGGP5Y?77?P&&G5YJJY5G#@@@@@
@@@&Y~...:..     ?&BY??777777?7Y&@5?77777777?5&@@@
@@#^            !@577????????7J&@57??????????7Y@@@
@@?             Y#7??????????7G@&????????????7?&@@
@@J             ?@J7????????77#@@5?7????????7JP@@@
@@&!            .P&Y?7777777JG@@@@#Y7???????P&@@@@
@@@@P!:.....      7B#G5YY5PB&@@@@@@@Y7????7P@@@@@@
@@@@@@#PYYYYY?^    .~?5PGB&@@@@@@@@@G7????7#@@@@@@
@@@@B7:.   .:!55:         .~Y&@@@@@@57????7P@@@@@@
@@@5.          7B:           ^#@@@&57???????5&@@@@
@@&:            P5            7@@P?7????????7?5&@@
@@&^            G5            ?@@J7??????????7J@@@
@@@B:          J@#~          ~&@@#J77??????77J#@@@
@@@@&5!:....^?B@@@@5!:.  .:!5@@@@@@@BYJ????JYG@@@@
@@@@@@@&#B#&@@@@@@@@@&#BB#&@@@@@@@@@@@&##&@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@`,
      info: `<pre>
<span class="neofetch-label">~ core.modules:</span>   HTML, CSS, JavaScript, Python, Flask, R, C
<span class="neofetch-label">~ sys.tools:</span>      VS Code, Git, GitHub, MySQL, Oracle, Metasploit, Linux Terminals
<span class="neofetch-label">~ exec.tasks:</span>     AI Assistant, Phishing Detection, Digit Recognition, UI Designs
<span class="neofetch-label">~ focus.targets:</span>  Web Dev • Cybersecurity • AI/ML • Problem Solving
<span class="neofetch-label">~ shell.env:</span>      bash + logic + penetration-testing
<span class="neofetch-label">~ cpu.mode:</span>       Analytical | Communicative | Adaptive
<span class="neofetch-label">~ gpu.driver:</span>     KM GraphiX Visual Processor™
<span class="neofetch-label">~ mem.status:</span>     Continuously Upgrading (📈BCA)
</pre>`
  },
};

// --- Event Listeners ---
document.addEventListener('click', () => input.focus());
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    if (isTyping) return;
    const cmd = input.textContent.trim();
    if (cmd) runCommand(cmd);
    input.textContent = "";
  }
});

// --- Command Execution ---
function runCommand(cmd) {
  const cleanCmd = cmd.trim().toLowerCase();
  
  // Clone the input as a history item
  const historyItem = document.createElement("div");
  historyItem.innerHTML = `<span class="prompt">musthaq@portfolio:~$</span><span class="command"> ${cmd}</span>`;
  history.appendChild(historyItem);

  if (cleanCmd === "clear") {
    history.innerHTML = "";
    input.focus();
    return;
  }

  const output = commands[cleanCmd];

  if (output) {
    if (cleanCmd === 'neofetch') {
      appendNeofetchOutput(output.logo, output.info);
    } else {
      isTyping = true;
      input.contentEditable = false; // Disable input while typing
      typewriter(output, () => {
        isTyping = false;
        input.contentEditable = true; // Re-enable input
        input.focus();
      });
    }
  } else {
    handleUnknownCommand(cleanCmd);
  }
  scrollEnd();
}

// --- AI Typo Correction Logic ---
function handleUnknownCommand(wrongCmd) {
  let bestMatch = null;
  let minDistance = Infinity;
  Object.keys(commands).forEach(key => {
    const distance = levenshtein(wrongCmd, key);
    if (distance < minDistance) {
      minDistance = distance;
      bestMatch = key;
    }
  });

  appendOutput(`bash: ${wrongCmd}: command not found`, 'output-error');
  
  if (bestMatch && minDistance <= 3) {
    isTyping = true;
    input.contentEditable = false;
    setTimeout(() => {
      const fetchingMsg = appendOutput('Fetching information from AI assistant...', 'output-fetching');
      scrollEnd();
      setTimeout(() => {
        history.removeChild(fetchingMsg);
        const correctedOutput = commands[bestMatch];
        if (bestMatch === 'neofetch') {
          appendNeofetchOutput(correctedOutput.logo, correctedOutput.info);
          isTyping = false;
          input.contentEditable = true;
          input.focus();
        } else {
          typewriter(correctedOutput, () => {
            isTyping = false;
            input.contentEditable = true;
            input.focus();
          });
        }
        scrollEnd();
      }, 1000);
    }, 500);
  }
}

// --- Output & Formatting ---
function appendOutput(text, className = 'output') {
  const div = document.createElement("div");
  div.className = className;
  div.innerHTML = text.replace(/\n/g, '<br>');
  history.appendChild(div);
  return div;
}

function appendNeofetchOutput(logo, info) {
  const containerDiv = document.createElement('div');
  containerDiv.className = 'output neofetch-output';
  containerDiv.innerHTML = `
    <pre class="neofetch-logo">${logo}</pre>
    <div class="neofetch-info">${info.replace(/\n/g, '<br>')}</div>
  `;
  history.appendChild(containerDiv);
}

function typewriter(text, onComplete) {
  const outputDiv = document.createElement("div");
  outputDiv.className = "output";
  history.appendChild(outputDiv);

  let charIndex = 0;
  const typingInterval = setInterval(() => {
    if (charIndex < text.length) {
      outputDiv.innerHTML = text.substring(0, charIndex + 1);
      charIndex++;
      scrollEnd();
    } else {
      clearInterval(typingInterval);
      onComplete();
    }
  }, 20);
}

// --- Utility Functions ---
function scrollEnd() {
  setTimeout(() => {
    history.scrollTop = history.scrollHeight;
  }, 0);
}

function updateTime() {
  if (footerTime) footerTime.textContent = new Date().toLocaleString();
}
setInterval(updateTime, 1000);

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
  const sidePanelContainer = document.getElementById('side-panel');
  new SidePanel(sidePanelContainer, {
    name: "Musthaq Ahmed",
    title: "Cybersecurity & ML Enthusiast",
    handle: "musthaqahmed",
    avatarUrl: "myimage.png",
    logoUrl: "111.png",
    watermarkUrls: [
      'GRAPHIX__8_-removebg-preview.png',
      'GRAPHIX__8_-removebg-preview.png',
      'GRAPHIX__8_-removebg-preview.png',
      'GRAPHIX__8_-removebg-preview.png'
    ]
  });
  updateTime();
  history.innerHTML = "";
  
  // THIS IS THE KEY FIX FOR THE WELCOME MESSAGE
  const welcomeMessage = `<span class="prompt">musthaq@portfolio:~$</span> Hi, I'm Musthaq Ahmed Cybersecurity & AI \\ ML Enthusiast .<br>
Welcome to my interactive 'AI powered' terminal portfolio!<br>
Type 'help' for available commands.`;
  appendOutput(welcomeMessage);
  input.focus();
});