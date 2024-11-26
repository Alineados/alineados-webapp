<script>
	import TableItem from './TableItem.svelte';

	// Puedes definir los datos de la tabla aquí si es necesario
	let tableData = [
		[
			'Estoy procrastinando mucho',
			[
				'Lorem ipsum dolor sit amet consectetur. Pharetra tincidunt lacus magna egestas etiam et sagittis non.',
				'Lorem ipsum dolor sit amet consectetur. Pharetra tincidunt lacus magna egestas etiam et sagittis non. ',
				'Lorem ipsum dolor sit amet consectetur. Pharetra tincidunt lacus magna egestas etiam et sagittis non. '
			],
			[
				'Lorem ipsum dolor sit amet consectetur. Pharetra tincidunt lacus magna egestas etiam et sagittis non. ',
				'Lorem ipsum dolor sit amet consectetur. Pharetra tincidunt lacus magna egestas etiam et sagittis non. ',
				'Lorem ipsum dolor sit amet consectetur. Pharetra tincidunt lacus magna egestas etiam et sagittis non. '
			]
		],
		[
			'Estoy procrastinando mucho',
			[
				'Lorem ipsum dolor sit amet consectetur. Pharetra tincidunt lacus magna egestas etiam et sagittis non.',
				'Lorem ipsum dolor sit amet consectetur. Pharetra tincidunt lacus magna egestas etiam et sagittis non. ',
				'Lorem ipsum dolor sit amet consectetur. Pharetra tincidunt lacus magna egestas etiam et sagittis non. '
			],
			[
				'Lorem ipsum dolor sit amet consectetur. Pharetra tincidunt lacus magna egestas etiam et sagittis non. ',
				'Lorem ipsum dolor sit amet consectetur. Pharetra tincidunt lacus magna egestas etiam et sagittis non. ',
				'Lorem ipsum dolor sit amet consectetur. Pharetra tincidunt lacus magna egestas etiam et sagittis non. '
			]
		],
		[
			'Estoy procrastinando mucho',
			[
				'Lorem ipsum dolor sit amet consectetur. Pharetra tincidunt lacus magna egestas etiam et sagittis non.',
				'Lorem ipsum dolor sit amet consectetur. Pharetra tincidunt lacus magna egestas etiam et sagittis non. ',
				'Lorem ipsum dolor sit amet consectetur. Pharetra tincidunt lacus magna egestas etiam et sagittis non. '
			],
			[
				'Lorem ipsum dolor sit amet consectetur. Pharetra tincidunt lacus magna egestas etiam et sagittis non. ',
				'Lorem ipsum dolor sit amet consectetur. Pharetra tincidunt lacus magna egestas etiam et sagittis non. ',
				'Lorem ipsum dolor sit amet consectetur. Pharetra tincidunt lacus magna egestas etiam et sagittis non. '
			]
		],
		[
			'Estoy procrastinando mucho',
			[
				'Lorem ipsum dolor sit amet consectetur. Pharetra tincidunt lacus magna egestas etiam et sagittis non.',
				'Lorem ipsum dolor sit amet consectetur. Pharetra tincidunt lacus magna egestas etiam et sagittis non. ',
				'Lorem ipsum dolor sit amet consectetur. Pharetra tincidunt lacus magna egestas etiam et sagittis non. '
			],
			[
				'Lorem ipsum dolor sit amet consectetur. Pharetra tincidunt lacus magna egestas etiam et sagittis non. ',
				'Lorem ipsum dolor sit amet consectetur. Pharetra tincidunt lacus magna egestas etiam et sagittis non. ',
				'Lorem ipsum dolor sit amet consectetur. Pharetra tincidunt lacus magna egestas etiam et sagittis non. '
			]
		],
		[
			'Estoy procrastinando mucho',
			[
				'Lorem ipsum dolor sit amet consectetur. Pharetra tincidunt lacus magna egestas etiam et sagittis non.',
				'Lorem ipsum dolor sit amet consectetur. Pharetra tincidunt lacus magna egestas etiam et sagittis non. ',
				'Lorem ipsum dolor sit amet consectetur. Pharetra tincidunt lacus magna egestas etiam et sagittis non. '
			],
			[
				'Lorem ipsum dolor sit amet consectetur. Pharetra tincidunt lacus magna egestas etiam et sagittis non. ',
				'Lorem ipsum dolor sit amet consectetur. Pharetra tincidunt lacus magna egestas etiam et sagittis non. ',
				'Lorem ipsum dolor sit amet consectetur. Pharetra tincidunt lacus magna egestas etiam et sagittis non. '
			]
		],
		[
			'Estoy procrastinando mucho',
			[
				'Lorem ipsum dolor sit amet consectetur. Pharetra tincidunt lacus magna egestas etiam et sagittis non.',
				'Lorem ipsum dolor sit amet consectetur. Pharetra tincidunt lacus magna egestas etiam et sagittis non. ',
				'Lorem ipsum dolor sit amet consectetur. Pharetra tincidunt lacus magna egestas etiam et sagittis non. '
			],
			[
				'Lorem ipsum dolor sit amet consectetur. Pharetra tincidunt lacus magna egestas etiam et sagittis non. ',
				'Lorem ipsum dolor sit amet consectetur. Pharetra tincidunt lacus magna egestas etiam et sagittis non. ',
				'Lorem ipsum dolor sit amet consectetur. Pharetra tincidunt lacus magna egestas etiam et sagittis non. '
			]
		]
	];
</script>

{#each tableData as row, i}
	<div class:bg-white={i % 2 === 0} class:bg-gray-50={i % 2 !== 0} class="grid grid-cols-3">
		<div class="whitespace-nowrap px-6 py-8 text-left align-top text-base font-medium text-black">
			{row[0]}
		</div>
		<div>
			<div class="flex flex-col gap-y-4 px-6 py-8">
				{#each row[1] as item}
					<TableItem value={item} />
				{/each}
			</div>
		</div>
		<div>
			<div class="flex flex-col gap-y-4 px-6 py-8">
				{#each row[2] as item}
					<TableItem value={item} />
				{/each}
			</div>
		</div>
	</div>
{/each}

<style>
	.odd-row {
		background-color: #ffffff; /* Color para las filas impares */
	}

	.even-row {
		background-color: #f7f7f7; /* Color para las filas pares */
	}
</style>
