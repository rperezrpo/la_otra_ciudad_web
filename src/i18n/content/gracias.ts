export const graciasContent = {
  es: {
    metaTitle: 'Gracias por tu donación',
    metaDescription: 'Gracias por apoyar a La Otra Ciudad.',
    procesandoEyebrow: 'Procesando',
    procesandoTitle: 'Confirmando tu donación…',
    procesandoText: 'Estamos verificando el estado de tu pago con Wompi. Esto toma solo unos segundos.',
    volverInicio: 'Volver al inicio',
    intentarDeNuevo: 'Intentar de nuevo',
    views: {
      APPROVED: {
        icon: '✓', eyebrow: 'Donación recibida',
        title: '¡Gracias por hacer ciudad!',
        text: 'Tu aporte ya está en camino a nuestros programas comunitarios. Te enviaremos el recibo deducible de impuestos a tu correo.',
      },
      PENDING: {
        icon: '⏳', eyebrow: 'Pago pendiente',
        title: 'Tu donación está en proceso',
        text: 'Algunos medios (como PSE) pueden tardar unos minutos en confirmarse. Te avisaremos por correo cuando se complete.',
      },
      DECLINED: {
        icon: '✕', eyebrow: 'Pago rechazado',
        title: 'No pudimos procesar tu pago',
        text: 'Tu banco rechazó la transacción. Puedes intentar de nuevo con otro medio de pago.',
        retry: true,
      },
      VOIDED: {
        icon: '✕', eyebrow: 'Pago anulado',
        title: 'La transacción fue anulada',
        text: 'El pago no se completó. Si quieres, puedes intentarlo de nuevo.',
        retry: true,
      },
      ERROR: {
        icon: '✕', eyebrow: 'Error en el pago',
        title: 'Ocurrió un error con el pago',
        text: 'No pudimos completar la transacción. Por favor intenta de nuevo en un momento.',
        retry: true,
      },
      NOTX: {
        icon: '🙌', eyebrow: 'Gracias',
        title: 'Gracias por tu interés',
        text: 'No encontramos una transacción para mostrar. Si hiciste una donación, te llegará la confirmación por correo.',
        retry: true,
      },
    },
  },
  en: {
    metaTitle: 'Thank you for your donation',
    metaDescription: 'Thank you for supporting La Otra Ciudad.',
    procesandoEyebrow: 'Processing',
    procesandoTitle: 'Confirming your donation…',
    procesandoText: 'We are verifying the status of your payment with Wompi. This only takes a few seconds.',
    volverInicio: 'Back to home',
    intentarDeNuevo: 'Try again',
    views: {
      APPROVED: {
        icon: '✓', eyebrow: 'Donation received',
        title: 'Thank you for helping build the city!',
        text: 'Your contribution is on its way to our community programmes. We will email you your tax-deductible receipt.',
      },
      PENDING: {
        icon: '⏳', eyebrow: 'Payment pending',
        title: 'Your donation is being processed',
        text: 'Some payment methods (such as PSE) can take a few minutes to confirm. We will let you know by email once it is complete.',
      },
      DECLINED: {
        icon: '✕', eyebrow: 'Payment declined',
        title: 'We could not process your payment',
        text: 'Your bank declined the transaction. You can try again with another payment method.',
        retry: true,
      },
      VOIDED: {
        icon: '✕', eyebrow: 'Payment voided',
        title: 'The transaction was voided',
        text: 'The payment was not completed. You can try again if you like.',
        retry: true,
      },
      ERROR: {
        icon: '✕', eyebrow: 'Payment error',
        title: 'Something went wrong with the payment',
        text: 'We could not complete the transaction. Please try again in a moment.',
        retry: true,
      },
      NOTX: {
        icon: '🙌', eyebrow: 'Thank you',
        title: 'Thank you for your interest',
        text: 'We could not find a transaction to show. If you made a donation, you will receive a confirmation by email.',
        retry: true,
      },
    },
  },
} as const;
