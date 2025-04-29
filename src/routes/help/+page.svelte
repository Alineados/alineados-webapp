<script lang="ts">
    import DonationSelect from '$lib/components/DonationSelect.svelte';

    let selectedOption = $state('gt-bank');
    
    const donationOptions = [
        { value: 'gt-bank', label: 'Trasferencia Bancaria en Guatemala' },
        { value: 'int-bank', label: 'Trasferencia Bancaria Internacional' },
        { value: 'digital', label: 'Trasferencia con pagos digitales' },
        { value: 'gift', label: 'Dar un regalo' }
    ];

    const bankInfo = {
        banco: 'Banco Industrial',
        tipoCuenta: 'Monetaria',
        moneda: 'Quetzales',
        numeroCuenta: '1520097032',
        nombreCuenta: 'Alineados AF1, S.A.'
    };

    const intBankInfo = {
        intermediaryBank: 'The Bank of New York Mellon New York, N. Y. U.S.A.',
        swift: 'IRVTUS3N',
        fedwire: '021000018',
        address: 'One Wall Street, New York, NY 10286',
        phone: '+ (212) 635 8534',
        account: '8033141875',
        accountName: 'Banco Industrial, S.A. Guatemala C.A.',
        swiftBI: 'INDLGTGC',
        finalBeneficiary: {
            name: 'Alineados AF1, S.A.',
            accountNumber: '750-005674-7'
        }
    };

    function handleSelect(value: string) {
        selectedOption = value;
    }
</script>

<div class="container mx-auto px-4 py-8">
    <p class="mb-2 flex flex-row text-sm font-medium text-alineados-gray-600">
        <span>Relaciones</span>
    </p>

    <div class="mb-8 flex flex-col gap-5 border-b border-alineados-gray-200 pb-6">
        <h1 class="text-5xl font-bold text-alineados-gray-900">Ayuda A Alineados</h1>
    </div>

    <div class="flex gap-16">
        <div class="w-1/2">
            <div class="flex gap-2">
                <button class="rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-800">
                    Apoyando Economicamente
                </button>
                <button class="rounded-full px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100">
                    Dando de tu Tiempo
                </button>
            </div>

            <div class="mt-6 flex aspect-square items-center justify-center rounded-xl bg-alineados-blue-900">
                <img 
                    src="/images/logo/INSTITUCIONAL BLANCO TRANSPARENTE LOGO-SLOGAN.png" 
                    alt="Alineados Logo" 
                    class="w-3/4 object-contain"
                />
            </div>
        </div>

        <div class="w-1/2 pt-[52px]">
            <h2 class="mb-4 text-lg font-medium">Escoge una opción de donación</h2>
            
            <DonationSelect 
                value={selectedOption}
                options={donationOptions}
                on:change={(e) => selectedOption = e.detail}
            />
    
            {#if selectedOption === 'gt-bank'}
                <div class="mt-6">
                    <p class="text-sm font-medium text-green-600">Datos Bancarios:</p>
                    
                    <div class="mt-4 space-y-3">
                        <div class="flex justify-between">
                            <span class="text-sm text-gray-600">Banco:</span>
                            <span class="text-sm font-medium">{bankInfo.banco}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-sm text-gray-600">Tipo de cuenta:</span>
                            <span class="text-sm font-medium">{bankInfo.tipoCuenta}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-sm text-gray-600">Moneda:</span>
                            <span class="text-sm font-medium">{bankInfo.moneda}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-sm text-gray-600">Número de la Cuenta:</span>
                            <span class="text-sm font-medium">{bankInfo.numeroCuenta}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-sm text-gray-600">Nombre de la Cuenta:</span>
                            <span class="text-sm font-medium">{bankInfo.nombreCuenta}</span>
                        </div>
                    </div>

                    <a 
                        href="https://form.jotform.com/250948884184068"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="mt-12 block w-full rounded-lg bg-alineados-green-900 px-4 py-2 text-center text-sm font-medium text-white hover:bg-alineados-green-600"
                    >
                        Adjuntar comprobante aquí
                    </a>
                </div>
            {:else if selectedOption === 'int-bank'}
                <div class="mt-6">
                    <p class="text-sm font-medium text-green-600">Intermediary Bank Information:</p>
                    
                    <div class="mt-4 space-y-3">
                        <div class="flex justify-between">
                            <span class="text-sm text-gray-600">Bank:</span>
                            <span class="text-sm font-medium">{intBankInfo.intermediaryBank}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-sm text-gray-600">Swift:</span>
                            <span class="text-sm font-medium">{intBankInfo.swift}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-sm text-gray-600">Fedwire (ABA):</span>
                            <span class="text-sm font-medium">{intBankInfo.fedwire}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-sm text-gray-600">Address:</span>
                            <span class="text-sm font-medium">{intBankInfo.address}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-sm text-gray-600">Phone:</span>
                            <span class="text-sm font-medium">{intBankInfo.phone}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-sm text-gray-600">Account:</span>
                            <span class="text-sm font-medium">{intBankInfo.account}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-sm text-gray-600">Account name:</span>
                            <span class="text-sm font-medium">{intBankInfo.accountName}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-sm text-gray-600">Swift:</span>
                            <span class="text-sm font-medium">{intBankInfo.swiftBI}</span>
                        </div>
                    </div>
    
                    <p class="mt-6 text-sm font-medium text-green-600">Final Beneficiary:</p>
                    <div class="mt-4 space-y-3">
                        <div class="flex justify-between">
                            <span class="text-sm text-gray-600">Name:</span>
                            <span class="text-sm font-medium">{intBankInfo.finalBeneficiary.name}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-sm text-gray-600">Account Number at Banco Industrial, S.A.:</span>
                            <span class="text-sm font-medium">{intBankInfo.finalBeneficiary.accountNumber}</span>
                        </div>
                    </div>
    
                    <a 
                        href="https://form.jotform.com/250948884184068"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="mt-12 block w-full rounded-lg bg-alineados-green-900 px-4 py-2 text-center text-sm font-medium text-white hover:bg-alineados-green-600"
                    >
                        Adjuntar comprobante aquí
                    </a>
                </div>
            {/if}
        </div>
    </div>
</div>