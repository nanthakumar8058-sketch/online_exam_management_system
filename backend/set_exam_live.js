const mongoose=require('mongoose');
mongoose.connect('mongodb+srv://admin:admin123@cluster0.ttgf2u6.mongodb.net/?appName=Cluster0').then(async () => {
  await mongoose.connection.db.collection('exams').updateOne(
    { _id: new mongoose.Types.ObjectId('69c9190a87c0f0004e0bacc1') },
    { $set: { status: 'live' } }
  );
  console.log('Exam 69c9190a87c0f0004e0bacc1 set to live');
  process.exit(0);
});
