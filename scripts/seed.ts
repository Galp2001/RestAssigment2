import { connectDB, disconnectDB } from '../src/db';
import { Post, Comment, User } from '../src/models';

async function seed() {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/restassigment';
  await connectDB(uri);

  try {
    console.log('Seeding database...');
    // clear existing
    await Comment.deleteMany({});
    await Post.deleteMany({});
    await User.deleteMany({});

    // Create some users
    const [admin, alice, bob, carol] = await User.create([
      { username: 'admin', email: 'admin@example.com', passwordHash: 'changeme' },
      { username: 'alice', email: 'alice@example.com', passwordHash: 'changeme' },
      { username: 'bob', email: 'bob@example.com', passwordHash: 'changeme' },
      { username: 'carol', email: 'carol@example.com', passwordHash: 'changeme' },
    ] as any[]);

    const posts = await Post.create([
      { title: 'Welcome', body: 'Welcome to the demo', senderId: admin._id },
      { title: 'Second Post', body: 'Another post', senderId: alice._id },
    ]);

    console.log('Created posts:');
    posts.forEach((p) => console.log(p._id.toString(), p.title));

    const comments = await Comment.create([
      { postId: posts[0]._id, authorId: alice._id, text: 'Nice intro!' },
      { postId: posts[0]._id, authorId: bob._id, text: 'Thanks for sharing.' },
      { postId: posts[1]._id, authorId: carol._id, text: 'Good read.' },
    ] as any[]);

    console.log('Created comments:');
    comments.forEach((c) => console.log(c._id.toString(), String(c.postId), String(c.authorId)));

    console.log('\nSample IDs:');
    if (posts[0]) console.log('postId (first):', posts[0]._id.toString());
    if (comments[0]) console.log('commentId (first):', comments[0]._id.toString());
  } catch (err) {
    console.error('Seeding failed:', err);
  } finally {
    await disconnectDB();
    process.exit(0);
  }
}

seed();
