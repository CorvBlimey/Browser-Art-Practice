# Browser Art Practice Tool
If you'd like to get started right away, access the tool [here](https://corvblimey.github.io/Browser-Art-Practice/). My hope's that it's fairly intuitive!


## Basic FAQ
### What is this?
BAPraT is a free in-browser tool for supplying an endless stream of "graded" art drills plus some gamification to make them more fun/accessible. The tool can only be at its best if it incorporates good drills, tips, and ideas, so I hope you'll join me in making it shine!

### Who should use it and why?
In short, anyone who tries it out and likes the feel of it. It should be handy for warm-ups, drills, gathering tips together in one convenient place, stuff
like that. I did test it to be friendly to mobile/tablets, but I don't have many real devices, so let me know if it's wonky and I'll work on it!

Personally, I also enjoy using it as a sort of relaxation app/brain break, but I can't call that the intended use.

### Who shouldn't and why?
In short, anyone looking for a miracle. This doesn't (and can't) replace the human element, and mindlessly doing the drills might not accomplish much. You need to be engaged, watch your hand, look at how you might improve, etc. To put it another way: practice doesn't make perfect, practice makes *permanent*. This tool can't replace an experienced human looking at what you're doing and helping you correct, so if you can get one of those, I'd recommend it!

(Speaking of, if someone wants to recommend a community that supports newbie artists, please do!)

Also, and this is echoed in the license if you want a fun read, but there's no warranty or guarantee attached to this tool. It's just a for-funsies project that I *hope* improves the world in some small way.

### What does the tool still need?
Mostly feedback, ideas, and exercises. At this stage in the game, if you're reading the README, it's likely because I handed you the URL directly. Thank you so much for testing this out! The tool's evolving rapidly right now, so my main concern is adding features and making it as easy to use as possible. Longer-term, we'll need more exercises to keep things fresh; until the exercise designer's live, just tell me what you have in mind and I'll try to get it working.


## How to use BAPraT
### The very basics
As of writing, BAPraT has one mode of operation, that being "random exercise mode". Basically, go to the tool, select "Do Exercises", and you'll be presented with an endless stream of drills. Each exercise consists of one or more strokes for you to replicate, and each stroke you do is "graded" in a few categories.

### How grading works
First off, I'm calling it grading only for clarity's sake; there's no "failing out" in BAPraT. As the saying goes, no matter how slow you run, you're lapping the folks on the couch! What's important is that you're doing the exercises. There's no leaderboards, please don't worry about the "grades".

Anyways, the process is inherently imperfect and I'm always seeking to improve it. Early iterations of the tool were wildly unfair in their grading, and I'm still working out the oddities. Again, don't feel bad if you're getting subpar grades. Your human eye and mind should get the final say. That all said, here's the grades!:

- Accuracy: What percent of your stroke lies on the target stroke. You do get partial credit for being near the stroke.
- Length: How close the length of your stroke is to the target stroke.
- Speed: How quickly you made your stroke. The timer starts when you start the stroke, take as much time between strokes as you need!
- Endpoint: How close was the end of your stroke to the end of the target stroke? Sort of a hybrid of accuracy and length, the idea being that you deserve more points if you end up where you're supposed to. Endpoint is relatively clever, you can start at either end of a line, etc.
- Overall: Essentially, it's what you get when you average all the above together. Your overall score also determines the color of the next target stroke! Overall is relative to the importance of each category within the exercise, which sounds a bit complicated, but it really just means that someone making an exercise can say "I want people to take their time; I want them to focus on accuracy". How accurate you were will then be more important than how fast you were in determining "Overall".

These grades are displayed on the left side of the screen and are updated each time you make a new stroke. Per-session running tallies are also kept and can be seen on the right side.

### How exercises work
You can find them in js/exercises.js. Each exercise is a collection of one or more strokes, each of which is made of two or more points. You probably don't have to worry about these much if you just want to use the tool for practice. If you want to make your own, TODO THIS WHOLE SECTION AS I STILL NEED TO MAKE THAT PART OF THE TOOL



## Other Very Important Questions
### Can I use this offline?
Yes, actually! You'll need to download it of course, but then just double-click index.html.

### Is that really the name?
Until someone comes up with a better one, yes. I'd really like to emphasize the gentleness of the theoretical bap, much more a boop than a bop.

### Will the graphics be upgraded?
Only if someone's volunteering to do so, or if I get much, much better at HTML.
