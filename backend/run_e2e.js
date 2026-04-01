const puppeteer = require('puppeteer');
const mongoose = require('mongoose');
require('dotenv').config();

const delay = ms => new Promise(res => setTimeout(res, ms));

async function runTest() {
    console.log("Connecting to Database to handle passwords...");
    await mongoose.connect(process.env.MONGODB_URI);
    const User = require('./models/User');

    console.log("Starting Browser...");
    const browser = await puppeteer.launch({ 
        headless: "new", 
        args: [
            '--use-fake-ui-for-media-stream', 
            '--use-fake-device-for-media-stream',
            '--window-size=1280,800'
        ],
        defaultViewport: { width: 1280, height: 800 }
    });

    const studentEmail = `student${Date.now()}@test.com`;
    const staffEmail = `staff${Date.now()}@test.com`;
    const emailSelector = 'input[placeholder="Enter your ID or Email"]';

    try {
        console.log("=== STEP 1: Admin creates members ===");
        const adminPage = await browser.newPage();
        await adminPage.goto('http://localhost:5173/login?role=org_admin');
        await adminPage.waitForSelector(emailSelector);
        await adminPage.type(emailSelector, 'nanthakumar8721@gmail.com');
        await adminPage.type('input[type="password"]', '654321');
        await adminPage.click('button[type="submit"]');
        
        // Wait for dashboard to load
        await adminPage.waitForSelector('h1', {timeout: 10000});
        console.log("Admin logged in!");

        await adminPage.goto('http://localhost:5173/org/members');
        await delay(2000);
        
        // Add Student
        await adminPage.evaluate(() => [...document.querySelectorAll('button')].find(b => b.textContent.includes('Register Member'))?.click());
        await delay(1000);
        await adminPage.type('input[placeholder="John Doe"]', 'Auto Student');
        await adminPage.type('input[type="email"]', studentEmail);
        await adminPage.type('input[placeholder="REG-2301"]', 'REG-TEST');
        await adminPage.evaluate(() => [...document.querySelectorAll('button')].find(b => b.textContent.includes('Dispatch Credentials'))?.click());
        
        // Add Staff
        await delay(2000); // UI slide/fade animation
        await adminPage.evaluate(() => [...document.querySelectorAll('button')].find(b => b.textContent.includes('Register Member'))?.click());
        await delay(1000);
        await adminPage.evaluate(() => [...document.querySelectorAll('button')].find(b => b.textContent.includes('staff'))?.click());
        await adminPage.type('input[placeholder="John Doe"]', 'Auto Staff');
        await adminPage.type('input[type="email"]', staffEmail);
        await adminPage.type('input[placeholder="EMP-001"]', 'EMP-TEST');
        await adminPage.evaluate(() => [...document.querySelectorAll('button')].find(b => b.textContent.includes('Dispatch Credentials'))?.click());
        
        await delay(2000);
        await adminPage.close();

        // Hack DB: reset their passwords to 654321
        const bcrypt = require('bcryptjs');
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('654321', salt);
        await User.updateMany({ email: { $in: [studentEmail, staffEmail] } }, { password: hashedPassword });
        console.log("Members Created & Passwords overridden to 654321");

        console.log("=== STEP 2: Staff logs in and creates exam ===");
        const staffPage = await browser.newPage();
        await staffPage.goto('http://localhost:5173/login?role=staff');
        await staffPage.waitForSelector(emailSelector);
        await staffPage.type(emailSelector, staffEmail);
        await staffPage.type('input[type="password"]', '654321');
        await staffPage.click('button[type="submit"]');
        await staffPage.waitForSelector('h1', {timeout: 10000});

        await staffPage.goto('http://localhost:5173/staff/schedules');
        await delay(2000);
        await staffPage.evaluate(() => [...document.querySelectorAll('button')].find(b => b.textContent.includes('New Schedule'))?.click());
        await delay(1000);
        await staffPage.type('input[placeholder="Midterm Evaluation"]', 'Automated Science Exam');
        await staffPage.type('input[placeholder="e.g. Computer Science 101"]', 'Science');
        await staffPage.type('input[placeholder="60"]', '60');
        
        const d = new Date(); d.setMinutes(d.getMinutes() - 1);
        const dateStr = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
        await staffPage.$eval('input[type="datetime-local"]', (el, val) => el.value = val, dateStr);
        await staffPage.evaluate(() => [...document.querySelectorAll('button')].find(b => b.textContent.includes('Create Schedule'))?.click());
        await delay(2000);

        console.log("=== STEP 3: Staff adds questions ===");
        await staffPage.evaluate(() => [...document.querySelectorAll('button')].find(b => b.textContent.includes('Questions'))?.click());
        await delay(2000);
        await staffPage.evaluate(() => [...document.querySelectorAll('button')].find(b => b.textContent.includes('Add Question'))?.click());
        await delay(1000);
        await staffPage.type('textarea[placeholder="Enter your question here..."]', 'What is the powerhouse of the cell?');
        const options = await staffPage.$$('input[placeholder^="Option"]');
        await options[0].type('Mitochondria');
        await options[1].type('Nucleus');
        await options[2].type('Ribosome');
        await staffPage.evaluate(() => [...document.querySelectorAll('button')].find(b => b.textContent.includes('Add Question'))?.click());
        await delay(2000);

        console.log("=== STEP 4: Student takes the Exam ===");
        const studentCtx = await browser.createBrowserContext(); // Isolation
        const studentPage = await studentCtx.newPage();
        await studentPage.setViewport({ width: 1280, height: 800 });
        
        await studentPage.goto('http://localhost:5173/login?role=student');
        await studentPage.waitForSelector(emailSelector);
        await studentPage.type(emailSelector, studentEmail);
        await studentPage.type('input[type="password"]', '654321');
        await studentPage.click('button[type="submit"]');
        await studentPage.waitForSelector('h1', {timeout: 10000});
        
        await studentPage.goto('http://localhost:5173/student/exams');
        await delay(2000);
        
        // Capture a clean shot of the student exam dashboard
        await studentPage.screenshot({ path: '../artifacts/E2E_01_Student_Dashboard.png' });
        
        await studentPage.evaluate(() => [...document.querySelectorAll('button')].find(b => b.textContent.includes('Launch Environment'))?.click());
        await delay(1500);
        await studentPage.screenshot({ path: '../artifacts/E2E_02_Camera_Check.png' });
        
        await studentPage.evaluate(() => [...document.querySelectorAll('button')].find(b => b.textContent.includes('Consent'))?.click());
        await delay(3000);
        
        await studentPage.evaluate(() => [...document.querySelectorAll('button')].find(b => b.textContent.includes('Initialize Grid'))?.click());
        await delay(4000); 
        await studentPage.screenshot({ path: '../artifacts/E2E_03_Active_Exam.png' });

        console.log("=== STEP 5: Staff Views Live Monitor ===");
        await staffPage.goto('http://localhost:5173/staff/monitor');
        await delay(4000);
        
        await staffPage.evaluate(() => {
            const btn = [...document.querySelectorAll('button')].find(b => b.textContent.includes('Automated Science Exam'));
            if(btn) btn.click();
        });
        await delay(4000);
        await staffPage.screenshot({ path: '../artifacts/E2E_04_Live_Monitor.png' });
        
        await staffPage.evaluate(() => [...document.querySelectorAll('button[title="Expand Feed"]')][0]?.click());
        await delay(1500);
        await staffPage.screenshot({ path: '../artifacts/E2E_05_Focus_Mode.png' });

        console.log("=== ALL STEPS COMPLETE ===");
        await browser.close();
        await mongoose.disconnect();
        
    } catch(err) {
        console.error("Test failed:", err);
        await browser.close();
        await mongoose.disconnect();
    }
}

runTest();
