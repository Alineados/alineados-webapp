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
            {:else if selectedOption === 'digital'}
                <div class="mt-6">
                    <p class="text-sm font-medium text-gray-600">Seleccione un método de pago</p>
                    
                    <div class="mt-4 grid grid-cols-2 gap-4">
                        <a href="https://www.paypal.com/us/home" target="_blank" class="group flex flex-col rounded-2xl border p-4 hover:border-green-500">
                            <div class="aspect-[2/1] w-full rounded-xl bg-[#F0F7FF] flex items-center justify-center"> 
                                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="86" viewBox="0 0 64 86" fill="none">
                                    <g clip-path="url(#clip0_5626_4270)">
                                        <path d="M18.5685 49.3181C17.9852 52.5181 15.6685 67.4348 14.9852 71.6515C14.9352 71.9515 14.8185 72.0681 14.4852 72.0681H2.05187C0.785203 72.0681 -0.131463 70.9681 0.0352033 69.7515L9.80187 7.76814C10.0519 6.16814 11.4852 4.95147 13.1352 4.95147C38.5185 4.95147 40.6519 4.3348 47.1352 6.85147C57.1519 10.7348 58.0685 20.1015 54.4685 30.2348C50.8852 40.6681 42.3852 45.1515 31.1185 45.2848C23.8852 45.4015 19.5352 44.1181 18.5685 49.3181ZM59.5185 25.3348C59.2185 25.1181 59.1019 25.0348 59.0185 25.5515C58.6852 27.4515 58.1685 29.3015 57.5519 31.1515C50.9019 50.1181 32.4685 48.4681 23.4685 48.4681C22.4519 48.4681 21.7852 49.0181 21.6519 50.0348C17.8852 73.4348 17.1352 78.3181 17.1352 78.3181C16.9685 79.5015 17.7185 80.4681 18.9019 80.4681H29.4852C30.9185 80.4681 32.1019 79.4181 32.3852 77.9848C32.5019 77.0848 32.2019 79.0015 34.7852 62.7681C35.5519 59.1015 37.1685 59.4848 39.6685 59.4848C51.5019 59.4848 60.7352 54.6848 63.4852 40.7681C64.5685 34.9681 64.2519 28.8681 59.5185 25.3348Z" fill="#4682B4"/>
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_5626_4270">
                                        <rect width="64" height="85.3333" fill="white"/>
                                        </clipPath>
                                    </defs>
                                </svg>
                            </div>
                            <div class="mt-4 px-2">
                                <h3 class="text-lg font-medium">Cuenta Bancaria</h3>
                                <p class="text-sm text-gray-500">Por Paypal</p>
                            </div>
                        </a>
    
                        <a href="https://phantom.com/" target="_blank" class="group flex flex-col rounded-2xl border p-4 hover:border-green-500">
                            <div class="aspect-[2/1] w-full rounded-xl bg-[#F0F7F0] flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64" fill="none">
                                    <path d="M63 32C63 49.125 49.125 63 32 63C14.875 63 1 49.125 1 32C1 14.875 14.875 1 32 1C49.125 1 63 14.875 63 32ZM45.2875 27.5875C45.9 23.4625 42.7625 21.25 38.4625 19.7625L39.85 14.175L36.45 13.325L35.0875 18.7625C34.1875 18.5375 33.275 18.325 32.3625 18.125L33.725 12.65L30.325 11.8L28.925 17.3875C28.1875 17.225 27.4625 17.05 26.75 16.875V16.8625L22.0625 15.6875L21.1625 19.325C21.1625 19.325 23.6875 19.9 23.6375 19.9375C25.0125 20.2875 25.2625 21.1875 25.225 21.9125L23.6375 28.275C23.7375 28.3 23.85 28.3375 23.9875 28.3875C23.875 28.3625 23.75 28.325 23.625 28.3L21.4 37.2125C21.2375 37.625 20.8 38.2625 19.8375 38.025C19.875 38.075 17.3625 37.4125 17.3625 37.4125L15.675 41.3L20.1 42.4C20.925 42.6125 21.725 42.825 22.525 43.025L21.1125 48.675L24.5125 49.525L25.9125 43.9375C26.8141 44.1806 27.7183 44.4139 28.625 44.6375L27.2375 50.2L30.6375 51.05L32.05 45.4125C37.85 46.5125 42.2125 46.0625 44.05 40.825C45.525 36.6 43.975 34.1625 40.925 32.575C43.15 32.0625 44.825 30.6 45.2625 27.5875H45.2875ZM37.5125 38.4875C36.4625 42.7125 29.35 40.425 27.0375 39.85L28.9 32.3625C31.2 32.9375 38.6 34.075 37.5 38.4875H37.5125ZM38.5625 27.525C37.6 31.3625 31.6875 29.4125 29.7625 28.9375L31.45 22.15C33.375 22.625 39.55 23.525 38.55 27.525H38.5625Z" fill="#2C5732"/>
                                </svg>
                            </div>
                            <div class="mt-4 px-2">
                                <h3 class="text-lg font-medium">Criptomoneda</h3>
                                <p class="text-sm text-gray-500">Por Phantom</p>
                            </div>
                        </a>
    
                        <a href="https://buymeacoffee.com/" target="_blank" class="group flex flex-col rounded-2xl border p-4 hover:border-green-500">
                            <div class="aspect-[2/1] w-full rounded-xl bg-[#F8F0FF] flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="42" height="51" viewBox="0 0 42 51" fill="none">
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M6.73433 26.7216L6.23433 21.7216C6.23433 21.555 6.53433 21.1216 7.73433 20.7216C8.93433 20.3216 9.23433 21.555 9.23433 22.2216L9.73433 26.2216L11.2343 37.7216L12.2343 45.2216C12.7343 46.055 14.5343 47.7216 17.7343 47.7216H24.2343C24.901 47.7216 26.5343 47.6216 27.7343 47.2216C29.2343 46.7216 30.2343 45.2216 30.7343 41.2216C31.1343 38.0216 32.2343 28.555 32.7343 24.2216L33.2343 20.7216C33.0677 20.3883 32.3343 19.7216 30.7343 19.7216C28.7343 19.7216 23.7343 20.2216 19.7343 20.2216C16.5343 20.2216 9.06767 19.555 5.73433 19.2216C3.73433 18.8883 0.0343323 17.4216 1.23433 14.2216C2.43433 11.0216 4.73436 9.8883 5.73438 9.72163C8.90104 10.055 16.0344 10.7216 19.2344 10.7216C22.4344 10.7216 28.2344 10.3883 30.7344 10.2216C31.7343 10.2216 33.6343 9.82163 33.2343 8.22163C32.8344 6.62163 32.0677 5.55496 31.7344 5.22163C28.901 4.3883 22.3344 2.92163 18.7344 3.72163C15.1344 4.52163 12.2344 4.72112 11.2344 4.72086C10.7344 5.05419 11.3344 5.72086 17.7344 5.72086H26.2344C27.5677 5.72086 30.2344 5.92086 30.2344 6.72086C30.2344 7.52086 27.5677 8.05419 26.2344 8.22086H14.7344C11.7344 8.05419 5.73438 7.12086 5.73438 4.72086C5.73438 2.32086 12.401 1.38753 15.7344 1.22086C19.0677 1.05419 26.2344 0.820861 28.2344 1.22086C30.7344 1.72086 33.7344 2.22266 35.2344 4.22266C36.4344 5.82266 36.7344 8.55599 36.7344 9.72266C37.7344 9.88932 39.8344 10.5227 40.2344 11.7227C40.7344 13.2227 41.7344 16.7227 40.2344 17.7227C39.0344 18.5227 37.401 19.056 36.7344 19.2227C36.5677 20.056 36.2344 22.1227 36.2344 23.7227C36.2344 25.3227 35.2344 32.056 34.7344 35.2227L33.7344 44.7227C33.401 46.556 31.1344 50.2227 24.7344 50.2227H15.2344C13.2344 50.056 9.13438 48.6227 8.73438 44.2227C8.33437 39.8227 7.23435 30.722 6.73433 26.7216ZM34.2344 12.7227C27.0344 13.5227 13.2344 13.056 7.23438 12.7227C6.23438 12.556 4.23438 12.6225 4.23438 14.2216C4.23438 15.8208 5.90104 16.5553 6.73438 16.7227C9.40104 16.8893 15.6344 17.2227 19.2344 17.2227C22.8344 17.2227 31.401 16.556 35.2344 16.2227C36.0677 16.2227 37.7344 15.8227 37.7344 14.2227C37.7344 12.6227 35.401 12.556 34.2344 12.7227Z" fill="#9B41FA"/>
                                    <path d="M17.7343 47.7216C14.5343 47.7216 12.7343 46.055 12.2343 45.2216L11.2343 37.7216L9.73433 26.2216L9.23433 22.2216C9.23433 21.555 8.93433 20.3216 7.73433 20.7216C6.53433 21.1216 6.23433 21.555 6.23433 21.7216L6.73433 26.7216C7.23435 30.722 8.33437 39.8227 8.73438 44.2227C9.13438 48.6227 13.2344 50.056 15.2344 50.2227M17.7343 47.7216C20.9343 47.7216 23.401 47.7216 24.2343 47.7216M17.7343 47.7216H24.2343M24.2343 47.7216C24.901 47.7216 26.5343 47.6216 27.7343 47.2216C29.2343 46.7216 30.2343 45.2216 30.7343 41.2216C31.1343 38.0216 32.2343 28.555 32.7343 24.2216L33.2343 20.7216C33.0677 20.3883 32.3343 19.7216 30.7343 19.7216C28.7343 19.7216 23.7343 20.2216 19.7343 20.2216C16.5343 20.2216 9.06767 19.555 5.73433 19.2216C3.73433 18.8883 0.0343323 17.4216 1.23433 14.2216C2.43433 11.0216 4.73436 9.8883 5.73438 9.72163C8.90104 10.055 16.0344 10.7216 19.2344 10.7216C22.4344 10.7216 28.2344 10.3883 30.7344 10.2216C31.7343 10.2216 33.6343 9.82163 33.2343 8.22163C32.8344 6.62163 32.0677 5.55496 31.7344 5.22163C28.901 4.3883 22.3344 2.92163 18.7344 3.72163C15.1344 4.52163 12.2344 4.72112 11.2344 4.72086C10.7344 5.05419 11.3344 5.72086 17.7344 5.72086M17.7344 5.72086C24.1344 5.72086 26.0677 5.72086 26.2344 5.72086M17.7344 5.72086H26.2344M26.2344 5.72086C27.5677 5.72086 30.2344 5.92086 30.2344 6.72086C30.2344 7.52086 27.5677 8.05419 26.2344 8.22086H14.7344C11.7344 8.05419 5.73438 7.12086 5.73438 4.72086C5.73438 2.32086 12.401 1.38753 15.7344 1.22086C19.0677 1.05419 26.2344 0.820861 28.2344 1.22086C30.7344 1.72086 33.7344 2.22266 35.2344 4.22266C36.4344 5.82266 36.7344 8.55599 36.7344 9.72266C37.7344 9.88932 39.8344 10.5227 40.2344 11.7227C40.7344 13.2227 41.7344 16.7227 40.2344 17.7227C39.0344 18.5227 37.401 19.056 36.7344 19.2227C36.5677 20.056 36.2344 22.1227 36.2344 23.7227C36.2344 25.3227 35.2344 32.056 34.7344 35.2227L33.7344 44.7227C33.401 46.556 31.1344 50.2227 24.7344 50.2227M24.7344 50.2227C18.3344 50.2227 15.7344 50.2227 15.2344 50.2227M24.7344 50.2227H15.2344M7.23438 12.7227C13.2344 13.056 27.0344 13.5227 34.2344 12.7227C35.401 12.556 37.7344 12.6227 37.7344 14.2227C37.7344 15.8227 36.0677 16.2227 35.2344 16.2227C31.401 16.556 22.8344 17.2227 19.2344 17.2227C15.6344 17.2227 9.40104 16.8893 6.73438 16.7227C5.90104 16.5553 4.23438 15.8208 4.23438 14.2216C4.23438 12.6225 6.23438 12.556 7.23438 12.7227Z" stroke="#9B41FA"/>
                                </svg>
                            </div>
                            <div class="mt-4 px-2">
                                <h3 class="text-lg font-medium">Tarjeta</h3>
                                <p class="text-sm text-gray-500">Por Buy me a Coffee</p>
                            </div>
                        </a>
    
                        <a href="https://www.globalgiving.org/" target="_blank" class="group flex flex-col rounded-2xl border p-4 hover:border-green-500">
                            <div class="aspect-[2/1] w-full rounded-xl bg-[#FFF8E0] flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="66" height="66" viewBox="0 0 66 66" fill="none">
                                    <path d="M7.82878 51.9773L1 45.4661L13.2283 32.7614L1 20.3747L7.98759 13.5455C1.50819 11.5125 2.95864 6.4522 4.4938 4.17618C10.338 1.50848 13.0695 5.71145 13.7047 8.1464L20.5335 1L32.7618 13.3871L45.3077 1L52.2953 7.5108C53.7246 4.65224 57.5677 0.0467802 61.5062 4.49343C65.4447 8.94008 60.9239 12.3809 58.1712 13.5455L65 20.3743L52.2953 32.7614L65 45.3073L58.1712 52.2949C61.5591 53.7242 66.9692 57.5038 61.5062 61.1882C56.0432 64.8726 53.0893 60.3942 52.2953 57.6944L45.3077 64.682L32.7618 52.2949L20.3747 64.682L13.9617 57.7998C13.6661 58.9753 9.03361 66.5585 4.65261 61.1882C0.714144 56.3604 5.12903 53.036 7.82878 51.9773Z" fill="#EFC800"/>
                                    <path d="M32.7618 52.2949L20.3747 64.682L13.8635 57.6944C14.8164 56.9004 9.57568 67.223 4.65261 61.1882C0.714144 56.3604 5.12903 53.036 7.82878 51.9773L1 45.4661L13.2283 32.7614M32.7618 52.2949L45.3077 64.682L52.2953 57.6944C53.0893 60.3942 56.0432 64.8726 61.5062 61.1882C66.9692 57.5038 61.5591 53.7242 58.1712 52.2949L65 45.3073L52.2953 32.7614M32.7618 52.2949L20.5335 40.067L28.029 32.7614M52.2953 32.7614L65 20.3743L58.1712 13.5455C60.9239 12.3809 65.4447 8.94008 61.5062 4.49343C57.5677 0.0467802 53.7246 4.65224 52.2953 7.5108L45.3077 1L32.7618 13.3871M52.2953 32.7614L40.067 44.6725L33.0796 37.6849M32.7618 13.3871L20.5335 1L13.7047 8.1464C13.0695 5.71145 10.338 1.50848 4.4938 4.17618C2.95864 6.4522 1.50819 11.5125 7.98759 13.5455L1 20.3747L13.2283 32.7614M32.7618 13.3871L45.1489 25.4566L38.0025 32.7614M13.2283 32.7614L25.6154 20.3747L33.0796 27.8387M38.0025 32.7614L33.0796 27.8387M38.0025 32.7614L33.0796 37.6849M33.0796 27.8387L28.029 32.7614M28.029 32.7614L33.0796 37.6849" stroke="#FAE4D7"/>
                                </svg>
                            </div>
                            <div class="mt-4 px-2">
                                <h3 class="text-lg font-medium">Tarjeta</h3>
                                <p class="text-sm text-gray-500">Por Global Giving</p>
                            </div>
                        </a>
                    </div>
                </div>
                <!-- {/if} -->
                {:else if selectedOption === 'gift'}
                    <div class="mt-6">
                        <p class="text-sm font-medium text-gray-600">Tipo</p>
                        
                        <div class="mt-4 space-y-4">
                            <a href="https://form.jotform.com/250948776885076" target="_blank" class="group flex flex-col rounded-2xl border p-4 hover:border-green-500">
                                <div class="aspect-[4/1] w-full rounded-xl bg-[#2C5732] flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60" fill="none">
                                        <path d="M52.5 28.125V48.75C52.5 49.7446 52.1049 50.6984 51.4016 51.4017C50.6984 52.1049 49.7446 52.5 48.75 52.5H13.125C12.1304 52.5 11.1766 52.1049 10.4733 51.4017C9.77009 50.6984 9.375 49.7446 9.375 48.75V28.125M30 12.1875C30 10.8896 29.6151 9.62077 28.894 8.54157C28.1729 7.46238 27.148 6.62124 25.9489 6.12454C24.7497 5.62784 23.4302 5.49788 22.1572 5.7511C20.8842 6.00432 19.7149 6.62933 18.7971 7.54711C17.8793 8.4649 17.2543 9.63422 17.0011 10.9072C16.7479 12.1802 16.8778 13.4997 17.3745 14.6989C17.8712 15.898 18.7124 16.9229 19.7916 17.644C20.8708 18.3651 22.1396 18.75 23.4375 18.75H30M30 12.1875V18.75M30 12.1875C30 10.8896 30.3849 9.62077 31.106 8.54157C31.8271 7.46238 32.852 6.62124 34.0511 6.12454C35.2503 5.62784 36.5698 5.49788 37.8428 5.7511C39.1158 6.00432 40.2851 6.62933 41.2029 7.54711C42.1207 8.4649 42.7457 9.63422 42.9989 10.9072C43.2521 12.1802 43.1222 13.4997 42.6255 14.6989C42.1288 15.898 41.2876 16.9229 40.2084 17.644C39.1292 18.3651 37.8604 18.75 36.5625 18.75H30M30 18.75V52.5M8.4375 28.125H53.4375C54.99 28.125 56.25 26.865 56.25 25.3125V21.5625C56.25 20.01 54.99 18.75 53.4375 18.75H8.4375C6.885 18.75 5.625 20.01 5.625 21.5625V25.3125C5.625 26.865 6.885 28.125 8.4375 28.125Z" stroke="#F7F7F7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                </div>
                                <div class="mt-4 px-2">
                                    <h3 class="text-lg font-medium">Material</h3>
                                    <p class="text-sm text-gray-500">Haz un regalo sencillo para dar a los usuarios de alineados</p>
                                </div>
                            </a>
                
                            <a href="https://form.jotform.com/250948776885076" target="_blank" class="group flex flex-col rounded-2xl border p-4 hover:border-green-500">
                                <div class="aspect-[4/1] w-full rounded-xl bg-[#49515C] flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60" fill="none">
                                        <path d="M48.75 29.9998C48.75 26.9198 48.635 23.8674 48.405 20.8449C48.2281 18.4502 47.1968 16.1988 45.4989 14.501C43.801 12.8031 41.5496 11.7717 39.155 11.5948C33.0603 11.1351 26.9397 11.1351 20.845 11.5948C18.4504 11.7717 16.199 12.8031 14.5011 14.501C12.8032 16.1988 11.7719 18.4502 11.595 20.8449C11.5525 21.3949 11.515 21.9473 11.48 22.4998M48.75 29.9998L56.25 22.4998M48.75 29.9998L41.25 22.4998M11.25 29.9998C11.25 33.0798 11.365 36.1323 11.595 39.1548C11.7719 41.5495 12.8032 43.8009 14.5011 45.4987C16.199 47.1966 18.4504 48.228 20.845 48.4048C26.9397 48.8649 33.0603 48.8649 39.155 48.4048C41.5496 48.228 43.801 47.1966 45.4989 45.4987C47.1968 43.8009 48.2281 41.5495 48.405 39.1548C48.4475 38.6048 48.485 38.0523 48.52 37.4998M11.25 29.9998L18.75 37.4998M11.25 29.9998L3.75 37.4998" stroke="#F7F7F7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                </div>
                                <div class="mt-4 px-2">
                                    <h3 class="text-lg font-medium">Servicio</h3>
                                    <p class="text-sm text-gray-500">Participa de manera activa con nosotros para nuestros usuarios</p>
                                </div>
                            </a>
                        </div>
                    </div>
                {/if}
            </div>
    </div>
</div>