- Bonus trait revealed on pre-exercise screen: "This time, focus on your [ACCURACY/whatever/whatever]!" Grant bonus points I guess, but really it's to incentivize mindfulness.
	- Rarely get challenged to focus on two at once?

- Emphasis on drills that incorporate tips, a la Erebus' stuff.

- Still use the score internally and populate a starfield on two flanking canvases or something
	- or what if I used globalAlpha to make the canvas background partially transparent each time the canvas is cleared and used the entire background for a subtle silhouette garden or something? IDK, big plans

- Speaking of, Lesson Mode: currently the next exercise is chosen at random, but Lesson Mode would load a list.

- "Freedraw" exercise mode, you have X strokes to complete something

- Opacity as a grading measure (this is VERY iffy due to the number of folks who wouldn't be able to use it; maybe a separate mode)

- Add site link to README

- Allow exercises to be hidden so they don't show in random mode
	- If this use is widespread, could make a "valid" pool in random mode on page load

- On the left side, gradually grey out categories worth relatively less for a given exercise

- Maybe make a dedicated Exercise object and do stuff like precomputing/caching teacher path length to clean up the code
	- Basically, have an obj that starts empty and, each time the next exercise is chosen, adds "exercise_name": Exercise() if it's not already in
	- This would clean things up a bit as we could have the "defaults" live there, compute teacher stroke lengths on creation and assume they're known, etc.
