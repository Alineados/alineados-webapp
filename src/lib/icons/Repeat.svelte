<script lang="ts">
	export let width: number = 14;
	export let height: number = 15;
	export let fill: string = 'none';
	export let stroke: string = '#9E9E9E';
	export let strokeWidth: number = 1.5;
</script>

<svg {width} {height} viewBox="0 0 14 15" {fill} xmlns="http://www.w3.org/2000/svg">
	<path
		d="M9.34681 5.85421H12.2588L10.4032 3.99746C9.80582 3.40005 9.06168 2.97044 8.2456 2.75181C7.42952 2.53319 6.57026 2.53325 5.75421 2.752C4.93816 2.97075 4.19408 3.40047 3.59677 3.99797C2.99946 4.59546 2.56997 5.33968 2.35147 6.15579M1.74131 11.8602V8.94821M1.74131 8.94821H4.65331M1.74131 8.94821L3.59631 10.805C4.19371 11.4024 4.93785 11.832 5.75393 12.0506C6.57001 12.2692 7.42927 12.2692 8.24532 12.0504C9.06136 11.8317 9.80544 11.402 10.4028 10.8045C11.0001 10.207 11.4296 9.46274 11.6481 8.64663M12.2588 2.94221V5.85304"
		{stroke}
		stroke-width={strokeWidth}
		stroke-linecap="round"
		stroke-linejoin="round"
	/>
</svg>
