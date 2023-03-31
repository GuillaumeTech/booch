<script lang="ts">
	export let width = '2rem';
	export let height = '4rem';
	export let displayLiquid = true;
	export let displayPlus = false;
	export let borderFill = 'black';
</script>

<svg preserveAspectRatio="xMidYMid meet" viewBox="-45 -50 300 400" style="height: {height};">
	<g>
		{#if displayLiquid}
			<path
				class="liquid"
				xmlns="http://www.w3.org/2000/svg"
				fill-rule="evenodd"
				clip-rule="evenodd"
				d="M142 18.5C142 28.7173 133.717 37 123.5 37C113.283 37 105 28.7173 105 18.5C105 8.28273 113.283 0 123.5 0C133.717 0 142 8.28273 142 18.5Z"
			/>
			<path
				class="liquid"
				xmlns="http://www.w3.org/2000/svg"
				fill-rule="evenodd"
				clip-rule="evenodd"
				d="M9.27752 200.5L27.7775 214.5H161L173 203L182 74H170.315C166.447 63.4936 156.349 56 144.5 56C132.651 56 122.553 63.4936 118.685 74H86.4933C86.2284 64.0139 78.05 56 68 56C64.6975 56 61.5972 56.8653 58.9134 58.3815C52.4125 47.3876 40.3306 40 26.5 40C16.5437 40 7.4937 43.8283 0.77951 50.0744C4.52797 100.315 7.68185 150.037 9.27752 200.5Z"
			/>
		{/if}
		<path
			xmlns="http://www.w3.org/2000/svg"
			fill-rule="evenodd"
			clip-rule="evenodd"
			d="M42.3513 309H157.649C168.784 309 179 298.304 179 283.533V283.388L189.432 103.324C189.395 98.3619 187.361 95.6253 184.793 93.9192C181.922 92.0125 178.009 91.1956 174.5 91.1956C169.035 91.1956 162.901 88.7372 158.176 85.1016C153.477 81.4861 149.135 75.8695 149.135 68.931V53H159.135V68.931C159.135 71.5275 160.852 74.5432 164.274 77.1762C167.67 79.7892 171.718 81.1956 174.5 81.1956C179.238 81.1956 185.291 82.2459 190.325 85.589C195.637 89.1171 199.432 94.9784 199.432 103.46V103.605L189 283.683C188.929 302.503 175.573 319 157.649 319H42.3513C24.4274 319 11.0707 302.503 11.0003 283.683L0.567566 103.605V103.46C0.567566 94.9784 4.36276 89.1171 9.67494 85.589C14.7086 82.2459 20.762 81.1956 25.5 81.1956C28.2824 81.1956 32.3301 79.7892 35.7259 77.1762C39.1479 74.5432 40.8649 71.5275 40.8649 68.931V53H50.8649V68.931C50.8649 75.8695 46.5229 81.4861 41.8242 85.1016C37.0993 88.7372 30.9646 91.1956 25.5 91.1956C21.991 91.1956 18.0782 92.0125 15.2074 93.9192C12.6385 95.6253 10.6046 98.3619 10.5681 103.324L21 283.388V283.533C21 298.304 31.2158 309 42.3513 309Z"
		/>
		<path
			xmlns="http://www.w3.org/2000/svg"
			fill-rule="evenodd"
			clip-rule="evenodd"
			d="M33.5641 0H166.436C172.533 0 177.211 5.40966 176.331 11.4431L172.248 39.4431C171.531 44.3565 167.318 48 162.353 48H37.6474C32.682 48 28.4686 44.3565 27.7521 39.4431L23.6688 11.4431C22.7889 5.40966 27.4669 0 33.5641 0ZM162.353 38L166.436 10H33.5641L37.6474 38H162.353Z"
		/>
		{#if displayPlus}
			<text style="fill: {borderFill};" text-anchor="middle" font-size="10rem" x="102" y="200"
				>+</text
			>
		{/if}
	</g>
</svg>

<style lang="less">
	path.liquid {
		transform: translate(0.5rem, 6rem);

		transform-origin: 50% 50%;
		transition: fill 150ms ease;
		fill: black;
	}
	path.no-hover {
		transform: translate(0.5rem, 6rem);
		transform-origin: 50% 50%;
		fill: var(--main-color);
	}
	svg:hover {
		path.liquid {
			fill: var(--main-color);
		}
	}
</style>
