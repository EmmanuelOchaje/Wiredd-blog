import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import * as dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

async function fetchCover(title) {
  const keywords = title.split(" ").slice(0, 3).join(" ");
  const res = await fetch(
    `https://api.unsplash.com/photos/random?query=${encodeURIComponent(keywords + " technology")}&orientation=landscape`,
    {
      headers: {
        Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
      },
    },
  );
  if (!res.ok) return null;
  const data = await res.json();
  return data?.urls?.regular || null;
}

async function main() {
  const authors = await Promise.all([
    prisma.user.upsert({
      where: { email: "kelechi@wiredd.com" },
      update: {},
      create: {
        name: "Kelechi Okafor",
        email: "kelechi@wiredd.com",
        password: await bcrypt.hash("password123", 10),
        role: "AUTHOR",
      },
    }),
    prisma.user.upsert({
      where: { email: "tunde@wiredd.com" },
      update: {},
      create: {
        name: "Tunde Bakare",
        email: "tunde@wiredd.com",
        password: await bcrypt.hash("password123", 10),
        role: "AUTHOR",
      },
    }),
    prisma.user.upsert({
      where: { email: "amaka@wiredd.com" },
      update: {},
      create: {
        name: "Amaka Eze",
        email: "amaka@wiredd.com",
        password: await bcrypt.hash("password123", 10),
        role: "AUTHOR",
      },
    }),
  ]);

  const posts = [
    {
      title: "Why Every Developer Should Learn the Terminal",
      slug: "why-every-developer-should-learn-the-terminal",
      content: `<p>Most developers start their journey with a GUI. It feels safe, familiar. But at some point, the terminal becomes unavoidable — and when you finally embrace it, everything changes.</p>
      <p>The terminal gives you raw, unfiltered access to your system. No abstractions. No waiting for a UI to catch up. Just you and the machine.</p>
      <h2>Speed</h2>
      <p>Once you learn the basics, you'll do things in seconds that used to take minutes. Renaming 100 files? One command. Searching through thousands of lines of code? Done.</p>
      <h2>Understanding</h2>
      <p>Using the terminal forces you to understand what's actually happening. You stop being a user and start being an operator.</p>
      <p>Start small. Learn cd, ls, mkdir, grep. Then build from there. You'll never look back.</p>`,
      published: true,
      views: 1240,
      readTime: 4,
    },
    {
      title:
        "I Burned Out at 24. Here's What Nobody Tells You About Tech Hustle Culture",
      slug: "burnout-at-24-tech-hustle-culture",
      content: `<p>It starts small. You stay an extra hour. Then two. You start skipping lunch because you're in the zone. You tell yourself this is what it takes.</p>
      <p>Nobody in tech talks about burnout honestly. The culture glorifies the grind. Shipping fast. Sleeping less. Being always on.</p>
      <h2>What burnout actually looks like</h2>
      <p>It's not dramatic. You don't collapse. You just slowly stop caring. Code that used to excite you feels like a chore. You open your laptop and feel nothing.</p>
      <h2>What I did</h2>
      <p>I took three weeks off. No code. No Twitter. No tech podcasts. I was terrified I'd fall behind. I didn't. I came back sharper than I'd been in months.</p>
      <p>Rest is not the opposite of productivity. It's part of it.</p>`,
      published: true,
      views: 3400,
      readTime: 6,
    },
    {
      title: "The Honest Truth About Being a Self-Taught Developer in Africa",
      slug: "self-taught-developer-in-africa",
      content: `<p>When I told people I was teaching myself to code, most of them laughed. What job would that get me? Who would hire someone without a degree?</p>
      <p>The self-taught path in Africa is brutal. Slow internet. No local community. Imposter syndrome on steroids. You're not just learning to code — you're doing it in isolation.</p>
      <h2>What worked for me</h2>
      <p>Projects. Real ones. Not tutorials. I built things that broke and forced me to fix them. That's where the real learning happened.</p>
      <h2>What I'd tell my younger self</h2>
      <p>Stop collecting courses. Build something ugly. Ship it. Learn from the failure. Repeat.</p>
      <p>The degree doesn't matter as much as they say. Your GitHub does.</p>`,
      published: true,
      views: 2800,
      readTime: 5,
    },
    {
      title: "AI Is Not Going to Take Your Job. Bad Developers Will.",
      slug: "ai-not-taking-your-job",
      content: `<p>Every few months, a new wave of panic hits tech Twitter. AI is coming for our jobs. We're all going to be replaced by ChatGPT.</p>
      <p>Here's the truth: AI is a tool. A powerful one. But it doesn't replace developers who think, communicate, and solve real problems.</p>
      <h2>What AI is actually replacing</h2>
      <p>Boilerplate. Repetition. The stuff you hated doing anyway. Copy-pasting Stack Overflow answers. Writing the same CRUD endpoints for the hundredth time.</p>
      <h2>What it can't replace</h2>
      <p>Understanding a business problem. Making architectural decisions. Debugging something that's never been seen before. Communicating with non-technical stakeholders.</p>
      <p>Use AI as a multiplier. Not a crutch.</p>`,
      published: true,
      views: 5600,
      readTime: 4,
    },
    {
      title:
        "My First Freelance Client Was a Nightmare. Here's What I Learned.",
      slug: "first-freelance-client-nightmare",
      content: `<p>I landed my first freelance client through a referral. Small business, simple website, fixed price. Should have been straightforward.</p>
      <p>Three months later, the project had tripled in scope, I hadn't been paid in full, and I was getting WhatsApp messages at midnight.</p>
      <h2>What I did wrong</h2>
      <p>No contract. No defined scope. No payment milestones. I was so excited to have a client that I skipped every basic protection.</p>
      <h2>What I do now</h2>
      <p>Contract first. Always. Scope in writing. 50% upfront. Clear revision limits. Communication only during business hours.</p>
      <p>Freelancing is a business. Run it like one.</p>`,
      published: true,
      views: 1900,
      readTime: 5,
    },
    {
      title: "Stop Using Tutorials as a Crutch: A Harsh but Necessary Truth",
      slug: "stop-using-tutorials-as-a-crutch",
      content: `<p>You've completed the course. Watched the tutorial. Followed along perfectly. Then you close the video and open a blank file — and freeze.</p>
      <p>This is tutorial hell. And most self-taught developers live here longer than they should.</p>
      <h2>Why tutorials feel productive but aren't</h2>
      <p>Tutorials give you the illusion of progress. You're typing code. Things are working. But you're not learning — you're following. The moment the tutorial ends, so does your understanding.</p>
      <h2>The way out</h2>
      <p>Pick a project you actually want to build. Something you'd use. Start without a tutorial. Break it. Google the specific thing you're stuck on. Fix it. Repeat.</p>
      <p>Struggle is the curriculum.</p>`,
      published: true,
      views: 4200,
      readTime: 4,
    },
    {
      title: "What 6 Months of Open Source Contributions Taught Me",
      slug: "six-months-open-source-contributions",
      content: `<p>I started contributing to open source because I wanted to pad my resume. I stayed because it made me a significantly better developer.</p>
      <p>Reading other people's code is humbling. Your first PR will get torn apart in review. You'll think you knew how to write good code. You didn't.</p>
      <h2>What I learned</h2>
      <p>Code is communication. It's not just for machines — it's for the next developer who reads it. Open source taught me to write code that's clear, not clever.</p>
      <h2>How to start</h2>
      <p>Find a project you use. Look at open issues tagged "good first issue". Read the contributing guide. Start small — fix a typo, improve docs. Then work your way up.</p>
      <p>The community is more welcoming than you think.</p>`,
      published: true,
      views: 2100,
      readTime: 6,
    },
  ];

  for (let i = 0; i < posts.length; i++) {
    const cover = await fetchCover(posts[i].title);
    await prisma.post.upsert({
      where: { slug: posts[i].slug },
      update: { cover },
      create: {
        ...posts[i],
        cover,
        authorId: authors[i % authors.length].id,
      },
    });
  }
  console.log("✅ Seeded successfully");
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
