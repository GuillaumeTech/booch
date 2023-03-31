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
				d="M147.278 10H162.278V22H147.278V10ZM137.278 0H147.278H162.278H172.278V10V22V32H162.278H147.278H137.278V22V10V0ZM0.277557 45H101.278V67H154.278V52H181.278V67H200.278L198.278 199.5L171.278 210L25.7776 207.5L7.27756 193.5L3.27756 67H0.277557V45Z"
			/>
		{/if}
		<path
			xmlns="http://www.w3.org/2000/svg"
			fill-rule="evenodd"
			clip-rule="evenodd"
			d="M29.2776 10H178.278V38H29.2776V10ZM19.2776 10C19.2776 4.47715 23.7547 0 29.2776 0H178.278C183.8 0 188.278 4.47715 188.278 10V38C188.278 43.5229 183.8 48 178.278 48H29.2776C23.7547 48 19.2776 43.5228 19.2776 38V10ZM40.2832 69.3236V53.4181H30.2832V69.3236C30.2832 76.7104 25.1535 81.5605 20.1416 81.5605C8.42852 81.5605 0 92.1449 0 103.797V283.582C0 302.514 13.6125 319 31.7204 319H176.011C194.119 319 207.731 302.514 207.731 283.582V103.29C207.731 91.9179 199.502 81.5605 188.035 81.5605C183.269 81.5605 178.339 76.9374 178.339 69.8306V53.4181H168.339V69.8306C168.339 81.2032 176.568 91.5605 188.035 91.5605C192.801 91.5605 197.731 96.1837 197.731 103.29V283.582C197.731 298.248 187.418 309 176.011 309H31.7204C20.3138 309 10 298.248 10 283.582V103.797C10 96.4106 15.1297 91.5605 20.1416 91.5605C31.8547 91.5605 40.2832 80.9762 40.2832 69.3236Z"
		/>
		{#if displayPlus}
			<text style="fill: {borderFill};" text-anchor="middle" font-size="10rem" x="100" y="200"
				>+</text
			>
		{/if}
	</g>
</svg>

<style lang="less">
	path.liquid {
		transform: translateY(6.5rem);
		transform-origin: 50% 50%;
		transition: fill 150ms ease;
		fill: black;
	}
	svg:hover {
		path.liquid {
			fill: var(--main-color);
		}
	}
</style>
