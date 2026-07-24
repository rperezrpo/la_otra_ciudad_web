export const donarContent = {
  es: {
    metaTitle: 'Donar',
    metaDescription: 'Tu aporte transforma territorios. El 100% de las donaciones va directamente a nuestros programas.',
    heroEyebrow: 'Donar',
    heroTitle: 'Tu aporte transforma territorios',
    heroSub: 'El 100% de las donaciones va directamente a nuestros programas. Somos transparentes: cada peso tiene destino.',

    qrAlt: 'QR para donar',
    qrCaption: 'Escanea para donar desde tu celular',
    transferencia: 'Transfiere a nuestra cuenta Bancolombia desde 10.000 pesos. Si quieres un certificado de donación, envíanos tu nombre completo y documento de identificación a',
    infoRows: [
      { stat: '100%',      desc: 'de las donaciones van al funcionamiento de nuestra organización y la ejecución de proyectos.' },
      { stat: 'Trazable',  desc: 'Nuestros informes de gestión anuales permiten saber a dónde se fue cada centavo invertido en LOC.' },
      { stat: 'Deducible', desc: 'Como parte del Régimen Tributario Especial, podemos certificar donaciones que son deducibles al impuesto de renta.' },
    ],

    moneda: 'Moneda',
    eligeMonto: 'Elige un monto',
    otroMonto: 'Otro monto',
    tuImpacto: 'Tu impacto',
    continuar: 'Continuar con el pago →',
    pagoSeguro: 'PAGO SEGURO · RECIBO DEDUCIBLE DE IMPUESTOS',

    impacts: [
      'Cubre los materiales de un taller con la comunidad',
      'Financia una jornada de diagnóstico participativo',
      'Costea la siembra de plantas nativas en espacio público',
      'Apoya la readecuación de un espacio comunitario',
    ],
    impactFallback: 'Apoya nuestros programas comunitarios',
    fxNote: '* Se cobrará el equivalente en pesos colombianos (COP). El monto exacto en COP se muestra en el checkout antes de confirmar.',
    errorConfig: 'Las donaciones no están disponibles en este momento. Por favor escríbenos a info@laotraciudad.org.',
    errorMinimo: 'El monto mínimo de donación es {min} {cur}.',
  },
  en: {
    metaTitle: 'Donate',
    metaDescription: 'Your contribution transforms territories. 100% of donations go directly to our programmes.',
    heroEyebrow: 'Donate',
    heroTitle: 'Your contribution transforms territories',
    heroSub: '100% of donations go directly to our programmes. We are transparent: every peso has a destination.',

    qrAlt: 'QR code to donate',
    qrCaption: 'Scan to donate from your phone',
    transferencia: 'Transfer to our Bancolombia account from 10,000 COP. If you would like a donation certificate, send us your full name and ID number to',
    infoRows: [
      { stat: '100%',       desc: 'of donations go to running our organisation and delivering our projects.' },
      { stat: 'Traceable',  desc: 'Our annual management reports show where every peso invested in LOC has gone.' },
      { stat: 'Deductible', desc: 'As part of Colombia’s Special Tax Regime, we can certify donations that are deductible from income tax.' },
    ],

    moneda: 'Currency',
    eligeMonto: 'Choose an amount',
    otroMonto: 'Other amount',
    tuImpacto: 'Your impact',
    continuar: 'Continue to payment →',
    pagoSeguro: 'SECURE PAYMENT · TAX-DEDUCTIBLE RECEIPT',

    impacts: [
      'Covers the materials for a community workshop',
      'Funds a participatory diagnosis session',
      'Pays for planting native species in public space',
      'Supports the refurbishment of a community space',
    ],
    impactFallback: 'Supports our community programmes',
    fxNote: '* You will be charged the equivalent in Colombian pesos (COP). The exact COP amount is shown at checkout before confirming.',
    errorConfig: 'Donations are not available right now. Please write to us at info@laotraciudad.org.',
    errorMinimo: 'The minimum donation amount is {min} {cur}.',
  },
} as const;
