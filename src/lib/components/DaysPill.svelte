<script lang="ts">
	let { completedAt = $bindable(), createdAt = $bindable(), classTw = "px-4 py-[6px] " } = $props();

	const totalDays = $derived((() => {
		console.log('DaysPill Debug:', { completedAt, createdAt });
		
		// Verificar que ambas fechas existan
		if (!completedAt || !createdAt) {
			console.log('DaysPill: Fechas faltantes');
			return 0;
		}
		
		try {
			// Parsear las fechas
			const completedDate = new Date(completedAt);
			
			// Manejar el formato específico de createdAt que viene del backend
			let createdDate;
			if (createdAt.includes('+0000 UTC')) {
				// Formato: "2025-01-28 01:56:33.939477562 +0000 UTC"
				// Convertir a formato ISO estándar
				const cleanDate = createdAt.replace(' +0000 UTC', 'Z');
				createdDate = new Date(cleanDate);
			} else {
				createdDate = new Date(createdAt);
			}
			
			console.log('DaysPill Dates:', { 
				completedDate: completedDate.toISOString(), 
				createdDate: createdDate.toISOString() 
			});
			
			// Verificar que las fechas sean válidas
			if (isNaN(completedDate.getTime()) || isNaN(createdDate.getTime())) {
				console.warn('DaysPill: Fechas inválidas');
				return 0;
			}
			
			// Calcular diferencia en milisegundos (completado - creado)
			const timeDiff = completedDate.getTime() - createdDate.getTime();
			
			// Convertir a días (86400000 ms = 1 día)
			const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
			
			console.log('DaysPill Calculation:', { 
				timeDiff, 
				daysDiff,
				completedDate: completedDate.toISOString(),
				createdDate: createdDate.toISOString(),
				completedTimestamp: completedDate.getTime(),
				createdTimestamp: createdDate.getTime(),
				areEqual: completedDate.getTime() === createdDate.getTime(),
				completedLocal: completedDate.toLocaleString(),
				createdLocal: createdDate.toLocaleString()
			});
			
			// Si las fechas son iguales, retornar 0 (Hoy)
			if (completedDate.getTime() === createdDate.getTime()) {
				console.log('DaysPill: Fechas iguales, retornando 0');
				return 0;
			}
			
			// Retornar días positivos o 0
			return Math.max(0, daysDiff);
			
		} catch (error) {
			console.error('DaysPill: Error en cálculo', error);
			return 0;
		}
	})());

	function setBg() {
		return 'bg-alineados-green-100 text-alineados-green-900';
	}

	function setText() {
		if (totalDays === 0) return 'Hoy';
		if (totalDays === 1) return '1 día';
		
		// Para más de 30 días, mostrar en formato meses/semanas/días
		if (totalDays > 30) {
			const months = Math.floor(totalDays / 30);
			const remainingDays = totalDays % 30;
			const weeks = Math.floor(remainingDays / 7);
			const days = remainingDays % 7;
			
			let result = '';
			if (months > 0) {
				result += `${months} ${months === 1 ? 'mes' : 'meses'}`;
			}
			if (weeks > 0) {
				if (result) result += ' ';
				result += `${weeks} ${weeks === 1 ? 'semana' : 'semanas'}`;
			}
			if (days > 0) {
				if (result) result += ' ';
				result += `${days} ${days === 1 ? 'día' : 'días'}`;
			}
			
			return result;
		}
		
		return `${totalDays} días`;
	}
</script>

{#if completedAt && createdAt && totalDays >= 0}
	<div class={`inline-flex items-center rounded-full ${classTw} ${setBg()}`}>
		<span class="text-xs font-semibold">
			{setText()}
		</span>
	</div>
{/if} 