<div>
	<a href="/"> Go back to the app</a>
	<h2>Welcome to <span>my fermentation notes </span> !</h2>
	<p>
		I created this app because I love fermenting things like kombucha, and I wanted an easy way to
		keep track of all my experiments with different flavors and fermentation times. At first, I
		tried keeping notes on paper, but it was tough to get a overview of which ones I liked or didn't
		like at once. Plus, I would often forget my notes at home when going grocery shopping and end up
		buying a random juice or fruits, that I might already have tried.
	</p>
	<br />
	<p>
		That's why I built this app - now I can keep all my fermentation notes in one place, right on my
		phone, so it's always with me. I can easily check what worked well in the past, what flavors to
		avoid, and I have a structured way to keep track of what I'm fermenting and add details later,
		without having to squezze it in betweens lines.
	</p>
	<br />

	<p>
		And well, maybe I'm not the only one who struggled with this kind of thing - that's why I
		decided to make the app public and more general-purpose.
	</p>

	<h2>How I use it</h2>
	Well, here's the process I had in mind when building the app, but feel free to do your own thing. If
	you're planning on using it seriouly i recommend you to create an account as it allows you to access
	your notes on multiple devices and access some feature like sharing a recipe.

	<h3>1. Creating a "recipe"</h3>
	<p>
		I like to create one recipe per type of fermented good, like one for kombucha, one for tepache,
		and so on.
	</p>
	<br />

	<p>
		When a recipe is selected you can access its settings by clicking on the gear icon. From here
		you can add a description, update the name, change the axis names, and make the recipe public
	</p>
	<h3>2. Currently fermenting</h3>
	<p>
		This is where you would add what you are Currently fermenting, by clicking on jar with a "+" .
		Most of the fields are self explaining, but one thing to note is that you don't have to worry
		about the order of dates in the Chronology part - they'll be sorted later from oldest to most
		recent. You can always go back and edit your ferment later by clicking on the jar.
	</p>
	<br />

	<p>
		You can also create new ferment by duplicating one. This is really helpfull when spliting
		batches or when you always have the same base for the ferment.
	</p>

	<h3>3. Grading it</h3>
	<p>
		Once you've tasted your ferment, you can drag and drop it onto the chart to grade it. If you
		want to be really precise, you can grade it with numbers by clicking on the jar and then
		clicking the "Grade it!" button. Also It's always possible to edit it afterwards. by clicking on
		the litte pen when you have a point from the chart selected
	</p>
	<br />
	<p>
		The default axis are "Dryness" and "Funk" but these can be changed to what ever you want by
		clicking on the gear icon next to the recipe name
	</p>

	<h3>4. Sharing it</h3>
	<p>
		If you want to share your notes with friends, you can click "make public" in the recipe settings
		to get a public link. That way, if someone wants to try fermenting something you've already
		experimented with, they can see all your notes on what worked well and what didn't. The page is
		read-only, so they can't make any changes. The page is read only so they can't change anything.
	</p>
	<br />

	<p>
		For example this is the page for the kombucha I fermented:&nbsp;<a
			href="/recipe/513db3b2-c93b-443d-837d-45f0de362be2"
		>
			here</a
		>
	</p>
	<br />
</div>

<style lang="less">
	div {
		padding: 0 10rem;
		margin: auto;
		@media screen and (max-width: 800px) {
			padding: 0 1rem;
		}
	}

	h2 {
		margin-top: 2rem;
		span {
			font-family: Oi;
			font-size: 1.2rem;
			color: var(--main-color);
		}
	}
	h3 {
		margin-top: 1rem;
	}
</style>
