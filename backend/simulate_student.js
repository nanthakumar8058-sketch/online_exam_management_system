const io = require('socket.io-client');
const socket = io('http://localhost:5000');

socket.on('connect', () => {
  console.log('Connected to server as student emulator');
  
  // Emulate an alert
  setInterval(() => {
    socket.emit('exam-alert', {
      studentId: '12345',
      studentName: 'Test Student',
      examId: '69c9190a87c0f0004e0bacc1',
      examName: 'Math Final',
      type: 'tab_switch',
      message: 'Student switched tabs',
      timestamp: new Date().toISOString()
    });
  }, 4000);
  
  // Emit high framerate video frame
  setInterval(() => {
     socket.emit('video-frame', {
       studentId: '12345',
       studentEmail: 'student@test.com',
       examName: 'Math Final',
       examId: '69c9190a87c0f0004e0bacc1',
       frame: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
       timestamp: Date.now()
     });
  }, 200);
});
