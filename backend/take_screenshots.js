const puppeteer = require('puppeteer');

const delay = ms => new Promise(res => setTimeout(res, ms));

async function captureScreenshots() {
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

    try {
        console.log("1. Admin Screenshots");
        const adminPage = await browser.newPage();
        await adminPage.goto('http://localhost:5173/login?role=org_admin');
        await adminPage.waitForSelector('input[placeholder="Enter your ID or Email"]');
        await adminPage.type('input[placeholder="Enter your ID or Email"]', 'nanthakumar8721@gmail.com');
        await adminPage.type('input[type="password"]', '654321');
        await adminPage.click('button[type="submit"]');
        await adminPage.waitForSelector('h1', {timeout: 10000});

        await adminPage.goto('http://localhost:5173/org/members');
        await delay(2000);
        await adminPage.screenshot({ path: '../artifacts/01_Members_Page.png' });
        
        await adminPage.evaluate(() => [...document.querySelectorAll('button')].find(b => b.textContent.includes('Register Member'))?.click());
        await delay(1000);
        await adminPage.screenshot({ path: '../artifacts/02_Add_User_Modal.png' });
        await adminPage.evaluate(() => [...document.querySelectorAll('button')].find(b => b.querySelector('svg'))?.click()); // close modal

        await adminPage.goto('http://localhost:5173/org/schedules');
        await delay(2000);
        await adminPage.screenshot({ path: '../artifacts/03_Exam_Schedules.png' });
        
        await adminPage.evaluate(() => [...document.querySelectorAll('button')].find(b => b.textContent.includes('New Schedule'))?.click());
        await delay(1000);
        await adminPage.screenshot({ path: '../artifacts/04_Create_Exam_Modal.png' });
        await adminPage.keyboard.press('Escape'); // close modal

        // Go to first exam questions
        await adminPage.evaluate(() => [...document.querySelectorAll('button')].find(b => b.textContent.includes('Questions'))?.click());
        await delay(2000);
        await adminPage.screenshot({ path: '../artifacts/05_Exam_Questions.png' });
        
        await adminPage.evaluate(() => [...document.querySelectorAll('button')].find(b => b.textContent.includes('Add Question'))?.click());
        await delay(1000);
        await adminPage.screenshot({ path: '../artifacts/06_Add_Question_Modal.png' });
        await adminPage.close();

        console.log("2. Staff Live Monitor");
        const staffPage = await browser.newPage();
        await staffPage.goto('http://localhost:5173/login?role=staff');
        await staffPage.waitForSelector('input[placeholder="Enter your ID or Email"]');
        await staffPage.type('input[placeholder="Enter your ID or Email"]', 'nanthakumar8058@gmail.com');
        await staffPage.type('input[type="password"]', '654321');
        await staffPage.click('button[type="submit"]');
        await staffPage.waitForSelector('h1', {timeout: 10000});

        await staffPage.goto('http://localhost:5173/staff/monitor');
        await delay(2000);
        await staffPage.screenshot({ path: '../artifacts/07_Staff_Monitor_Awaiting.png' });

        console.log("3. Student Exam");
        const studentCtx = await browser.createBrowserContext(); 
        const studentPage = await studentCtx.newPage();
        await studentPage.setViewport({ width: 1280, height: 800 });
        
        await studentPage.goto('http://localhost:5173/login?role=student');
        await studentPage.waitForSelector('input[placeholder="Enter your ID or Email"]');
        // Registering test_student dynamically since db resets might happen
        await studentPage.type('input[placeholder="Enter your ID or Email"]', 'test_student@gmail.com'); // We will assume test_student is active or we login via bypass
        await studentPage.type('input[type="password"]', '654321');
        await studentPage.click('button[type="submit"]');
        await delay(2000); // Wait for potential failure toast
        
        await studentPage.goto('http://localhost:5173/student/exams');
        await delay(2000);
        await studentPage.screenshot({ path: '../artifacts/08_Student_Dashboard.png' });
        
        await studentPage.evaluate(() => [...document.querySelectorAll('button')].find(b => b.textContent.includes('Launch Environment'))?.click());
        await delay(2000);
        
        // Consent to camera
        await studentPage.evaluate(() => [...document.querySelectorAll('button')].find(b => b.textContent.includes('Consent'))?.click());
        await delay(3000);
        
        await studentPage.evaluate(() => [...document.querySelectorAll('button')].find(b => b.textContent.includes('Initialize Grid'))?.click());
        await delay(4000); 
        await studentPage.screenshot({ path: '../artifacts/09_Student_Active_Exam.png' });

        // Wait for frames to reach monitor
        await delay(2000);
        
        // Back to staff to select exam (the one student is in)
        await staffPage.evaluate(() => [...document.querySelectorAll('button')][2]?.click()); // Click the first exam card
        await delay(4000);
        await staffPage.screenshot({ path: '../artifacts/10_Staff_Monitor_Active.png' });

        console.log("Done");
        await browser.close();
    } catch(e) {
        console.error("Error generating screenshots", e);
        await browser.close();
    }
}

captureScreenshots();
