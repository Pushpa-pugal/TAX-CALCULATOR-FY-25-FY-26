# 🇮🇳 Indian Tax Calculator (FY 2025-26)

Welcome to the only place on the internet where taxes don't feel like a root canal! 🦷 

Let's face it: calculating Indian income tax is usually as fun as watching paint dry while stuck in a Bangalore traffic jam. We built this smart, private, and actually-kind-of-pretty calculator to help you figure out if the Old or New regime is better for your wallet. It’s like a financial GPS, but instead of "Recalculating," it just saves you money.

We’ve got a dark theme (because your eyes shouldn't hurt while your wallet is crying), plain English questions, and a built-in AI assistant that’s smarter than your neighbor's "tax expert" uncle.

---

## 🌟 Why This Doesn't Suck (Key Features)

*   **The "No Jargon" Wizard**: A 5-step journey that asks you questions in English, not "Tax-ese." We handle the math; you just bring the numbers.
*   **Salary Splitting (For the Perfectionists)**: Whether you want to just dump your Gross Salary or meticulously list every single component (Basic, HRA, DA, etc.), we've got you covered.
*   **The "Mood Swing" Toggles**: Got a monthly rent but an annual bonus? Our per-field toggles let you mix and match Monthly and Annual figures without needing a calculator for your calculator.
*   **The Battle of the Regimes**: A live, side-by-side cage match between the **Old and New Regimes**. See exactly where every Rupee is going in real-time.
*   **The "Don't Leave Money on the Table" Suggestions**: Our app scans your profile like a financial detective and points out exactly where you can save more tax (80C, NPS, etc.).
*   **🤖 AI Tax Assistant**: Have a question that even Google can't answer? Chat with our AI buddy. It can look at your numbers and give you actual advice, not just generic Wikipedia links.
*   **Aesthetic AF**: Built with a sleek navy and gold design. If you're going to lose sleep over taxes, you might as well do it looking at a premium interface.

---

## 💻 How to Download and Run the Code (For Beginners)

If you want to download the actual code to see how it works, make changes, or run it offline on your own machine, follow these simple steps. Don't worry if you aren't a tech expert!

### Step 1: Install the Prerequisites
You only need two standard tools installed on your computer to run this:
1. **Node.js**: This is the engine that runs the code. Go to [nodejs.org](https://nodejs.org/) and download the "LTS" (Long Term Support) version, then install it like a normal program.
2. **GitHub**: This helps you download code from GitHub.Go to Github.com and install it.

### Step 2: Download the Code
1. Open the **GitHub**.
2. Click on **File > Clone repository...** in the top menu.
3. Click on the **URL** tab.
4. Paste the web link of this GitHub page into the top box.
5. Choose where you want to save the folder on your computer in the bottom box.
6. Click **Clone**. You now have the code on your computer!

### Step 3: Run the App
1. Open a program on your computer called **Terminal** (on Mac) or **Command Prompt / PowerShell** (on Windows).
2. You need to navigate to the folder you just downloaded. You can do this by typing `cd ` followed by a space, and then dragging the folder from your file explorer into the terminal window and pressing **Enter**.
3. Type this command and press **Enter** to download the necessary building blocks:
   ```bash
   npm install
   ```
4. Once that finishes, type this command and press **Enter** to start the app:
   ```bash
   npm run dev
   ```
5. It will give you a local web link (usually `http://localhost:5173`). Copy that link, paste it into your browser, and the app will open!

---

## 📱 How to Install This as an App (The "Instant" Way)

1. Open the website in **Google Chrome** or **Microsoft Edge**.
2. Look at the right side of the address bar at the top of your browser.
3. You will see a small icon that looks like a monitor with a down arrow, or an option that says **"App available. Install"**.
4. Click it and select **Install**. 
5. That's it! The app will now have its own icon on your desktop and taskbar. It will open in its own clean window, just like a real software application!

---

## 🤖 Want to Enable the AI Chat? (Optional)

The app works perfectly without this, but if you want the "Ask Your Tax Assistant" chat to work at the bottom of the results page:
1. Go into the downloaded folder and find the file named `.env.example`.
2. Rename that file to just `.env`.
3. Open it in any text editor (like Notepad).
4. You will see a place to put an "Anthropic API Key". You can get a free one by signing up at [console.anthropic.com](https://console.anthropic.com/).
5. Paste your key in, save the file, and restart the terminal command (`npm run dev`).

---

## 📜 Disclaimer
*This calculator is designed for informational and educational purposes based on the tax proposals for FY 2025-26. While extreme care has been taken to ensure mathematical accuracy, users should consult a certified chartered accountant (CA) before making official financial declarations.*
