<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import isotipo from '$lib/assets/isotipo.svg';

	let { 
		show = $bindable(false),
		duration = 6000,
		amount = 30,
		redirectAfter = false
	} = $props();

	let container: HTMLDivElement;
	let isMounted = $state(false);
	let particles: Array<{
		id: number;
		element: HTMLDivElement;
		x: number;
		y: number;
		vx: number;
		vy: number;
		rotation: number;
		rotationSpeed: number;
		scale: number;
		opacity: number;
	}> = [];

	let animationId: number;

	function clearAllParticles() {
		// Stop animation
		if (animationId) {
			cancelAnimationFrame(animationId);
			animationId = 0;
		}
		
		// Remove all particles from DOM
		particles.forEach(particle => {
			if (particle.element) {
				try {
					if (particle.element.parentNode) {
						particle.element.parentNode.removeChild(particle.element);
					}
				} catch (error) {
					// Element might already be removed
					console.log('Particle already removed');
				}
			}
		});
		particles = [];
	}

	function createParticle() {
		// Don't create particles if show is false
		if (!show) return null;
		
		// Don't create particles if container doesn't exist
		if (!container) return null;
		
		// Don't create particles if component is not mounted
		if (!isMounted) return null;
		
		const particle = document.createElement('div');
		particle.innerHTML = `<img src="${isotipo}" alt="Alineados" style="width: 100%; height: 100%;" />`;
		particle.style.position = 'absolute';
		particle.style.width = '30px';
		particle.style.height = '30px';
		particle.style.pointerEvents = 'none';
		particle.style.zIndex = '9999';
		
		container.appendChild(particle);
		
		return {
			id: Math.random(),
			element: particle,
			x: Math.random() * window.innerWidth,
			y: -50,
			vx: (Math.random() - 0.5) * 6,
			vy: Math.random() * 3 + 2,
			rotation: Math.random() * 360,
			rotationSpeed: (Math.random() - 0.5) * 15,
			scale: Math.random() * 0.8 + 0.6,
			opacity: 1
		};
	}

	function animate() {
		// Use a copy of the array to avoid index issues when removing elements
		const particlesToProcess = [...particles];
		
		particlesToProcess.forEach((particle) => {
			particle.x += particle.vx;
			particle.y += particle.vy;
			particle.rotation += particle.rotationSpeed;
			particle.opacity -= 0.003;
			
			// Add gravity effect
			particle.vy += 0.1;
			
			// Add air resistance
			particle.vx *= 0.99;
			particle.vy *= 0.99;

			particle.element.style.transform = `translate(${particle.x}px, ${particle.y}px) rotate(${particle.rotation}deg) scale(${particle.scale})`;
			particle.element.style.opacity = particle.opacity.toString();

			// Remove particles that are off screen or too transparent
			if (particle.y > window.innerHeight + 200 || particle.opacity <= 0) {
				particle.element.remove();
				const index = particles.indexOf(particle);
				if (index > -1) {
					particles.splice(index, 1);
				}
			}
		});

		// Add new particles if we have less than the desired amount
		if (particles.length < amount && show && Math.random() < 0.2) {
			const newParticle = createParticle();
			if (newParticle) {
				particles.push(newParticle);
			}
		}

		// Only continue animation if show is true
		if (show) {
			animationId = requestAnimationFrame(animate);
		}
	}

	$effect(() => {
		if (show) {
			// Clear existing particles
			clearAllParticles();
			
			// Start animation
			animate();
			
			// Stop after duration
			setTimeout(() => {
				show = false;
				// Redirect after confetti if specified
				if (redirectAfter) {
					setTimeout(() => {
						goto('/personal/problems');
					}, 500); // Small delay to ensure cleanup is complete
				}
			}, duration);
		} else {
			clearAllParticles();
		}
	});

	onMount(() => {
		isMounted = true;
		return () => {
			clearAllParticles();
		};
	});
</script>

<div 
	bind:this={container}
	style="
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		pointer-events: none;
		z-index: 9999;
	"
>
</div> 