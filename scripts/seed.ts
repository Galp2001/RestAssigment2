import { connectDB, disconnectDB } from '../src/db';
import { Post, Comment } from '../src/models';

async function seed() {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/restassigment';
  await connectDB(uri);

  try {
    console.log('Seeding database...');
    // clear existing
    await Post.deleteMany({});
    await Comment.deleteMany({});

    const posts = await Post.create([
      { title: 'Welcome', body: 'Welcome to the demo', senderId: 'admin' },
      { title: 'Second Post', body: 'Another post', senderId: 'user123' },
    ]);

    console.log('Created posts:');
    posts.forEach((p) => console.log(p._id.toString(), p.title));

    if (posts.length === 0) {
      console.log('No posts created; aborting comments creation');
    }

    const comments = await Comment.create([
      { postId: posts[0]?._id ?? null, authorId: 'alice', text: 'Nice intro!' },
      { postId: posts[0]?._id ?? null, authorId: 'bob', text: 'Thanks for sharing.' },
      { postId: posts[1]?._id ?? null, authorId: 'carol', text: 'Good read.' },
    ] as any[]);

    console.log('Created comments:');
    comments.forEach((c) => console.log(c._id.toString(), String(c.postId), c.authorId));

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
