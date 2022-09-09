import moment from 'moment';

export function intervalInMinutes(
  service,
  availableTime,
  considerExtraTime = true,
) {
  let serviceDuration = service.duration;
  let extraTime = service?.ReservedServiceMeta?.extraTime || service?.extraTime;
  let extraTimeDuration =
    service?.ReservedServiceMeta?.extraTimeDuration ||
    service?.extraTimeDuration;

  if (considerExtraTime && (extraTime === 1 || extraTime === '1')) {
    if (extraTimeDuration != null || extraTimeDuration !== '') {
      let extraTimeSplit = extraTimeDuration?.split(':');
      if (extraTimeSplit) {
        serviceDuration =
          parseInt(extraTimeSplit[1]) + parseInt(serviceDuration);
      }
    }
  }
  return serviceDuration;
}

export function getBookingSlot(
  slots,
  latestService,
  professionalProfileDetailsData,
  selectedService,
) {
  const latestServiceStartTime = latestService.timeSlot;
  const dateString = latestServiceStartTime.format('D MMM YYYY');
  const latestServiceEndTime = latestServiceStartTime
    .clone()
    .add(Math.ceil(latestService.duration / 30) * 30, 'minutes');
  const proDay = professionalProfileDetailsData.ProAvailableDays.find(
    (day) => day.dayValue - 1 === latestServiceStartTime.day(),
  );
  const newSlot = proDay?.ProAvailableTimes?.reduce((acc, time) => {
    const intervalInMins = intervalInMinutes(selectedService, time);
    const latestServiceEndTimeOnDate = moment(
      dateString + latestServiceEndTime.format('H:mm:ss'),
      'DD MMM YYYYH:mm:ss',
    );
    const toTime = moment(dateString + time.toTime, 'DD MMM YYYYHH:mm:ss');
    const fromTime = moment(dateString + time.fromTime, 'DD MMM YYYYHH:mm:ss');
    let finalSlotTime = latestServiceEndTimeOnDate.isSameOrAfter(fromTime)
      ? latestServiceEndTimeOnDate
      : fromTime;
    // console.log(
    //   'professional fromTime toTime',
    //   finalSlotTime
    //     .clone()
    //     .add(intervalInMins, 'minutes')
    //     .isBetween(fromTime, toTime, 'minutes', []),
    //   finalSlotTime.clone().add(intervalInMins, 'minutes'),
    //   intervalInMins,
    //   finalSlotTime,
    //   selectedService,
    //   toTime,
    // );

    while (
      finalSlotTime
        .clone()
        .add(intervalInMins, 'minutes')
        .isBetween(fromTime, toTime, 'minutes', [])
    ) {
      const bookedSlot = slots.find((slot) => {
        const startFromTime = moment(slot.dateTimeFrom);
        const startToTime = moment(slot.dateTimeTo);
        const slotToTime = finalSlotTime.clone().add(intervalInMins, 'minutes');

        if (
          startFromTime.isBetween(finalSlotTime, slotToTime) ||
          startToTime.isBetween(finalSlotTime, slotToTime)
        ) {
          return true;
        }
      });

      if (!bookedSlot && !acc) {
        acc = {timeSlot: finalSlotTime, totalDuration: intervalInMins};
        break;
      }
      finalSlotTime = finalSlotTime.add(intervalInMins, 'minutes');
    }
    return acc;
  }, null);

  return newSlot;
}

export const totalAmount = (selectedServices) => {
  return selectedServices.reduce(
    (sum, service) => sum + parseFloat(service.amount, 10),
    0,
  );
};

export const totalAmountWithTax = (selectedServices, taxRate) => {
  const totalAmount = selectedServices.reduce(
    (sum, service) => sum + parseFloat(service.amount, 10),
    0,
  );

  if (!!taxRate && !isNaN(taxRate)) {
    const taxAmount = (totalAmount * +taxRate) / 100;
    const withTax = totalAmount + taxAmount;
    return [withTax, taxAmount];
  } else {
    return [totalAmount, 0];
  }
};

export const preDepositAmount = (proMetaInfo, totalPrice) => {
  switch (proMetaInfo?.depositType) {
    case 1:
      return proMetaInfo?.depositeAmount && totalPrice
        ? `$${(totalPrice * parseFloat(proMetaInfo?.depositeAmount)) / 100}`
        : '';
    case 2:
      return `$${proMetaInfo?.depositeAmount ?? ''}`;
    case 3:
      return `$${totalPrice}`;
    default:
      console.log('default case');
      return '';
  }
};

export function getCardType(str) {
  const number = str.split(' ').join('');
  // visa
  var re = new RegExp('^4[0-9]{12}(?:[0-9]{3})?$');
  if (number.match(re) != null) return 7;

  // Mastercard
  // Updated for Mastercard 2017 BINs expansion
  if (
    /^(5[1-5][0-9]{14}|2(22[1-9][0-9]{12}|2[3-9][0-9]{13}|[3-6][0-9]{14}|7[0-1][0-9]{13}|720[0-9]{12}))$/.test(
      number,
    )
  )
    return 6;

  // AMEX
  re = new RegExp('^3[47]');
  if (number.match(re) != null) return 1;

  // Discover
  re = new RegExp(
    '^(6011|622(12[6-9]|1[3-9][0-9]|[2-8][0-9]{2}|9[0-1][0-9]|92[0-5]|64[4-9])|65)',
  );
  if (number.match(re) != null) return 4;

  // Diners
  re = new RegExp('^36');
  if (number.match(re) != null) return 3;

  // Diners - Carte Blanche
  re = new RegExp('^30[0-5]');
  if (number.match(re) != null) return 2;

  // JCB
  re = new RegExp('^35(2[89]|[3-8][0-9])');
  if (number.match(re) != null) return 5;

  // Visa Electron
  re = new RegExp('^(4026|417500|4508|4844|491(3|7))');
  if (number.match(re) != null) return 7;

  const cup1 = new RegExp('^62[0-9]{14}[0-9]*$');
  const cup2 = new RegExp('^81[0-9]{14}[0-9]*$');
  if (number.match(cup1) || number.match(cup2)) return 8;

  return '';
}

export const selectCardType = (cardType) => {
  switch (cardType) {
    case 1:
      return require('../assets/images/amex.png');
    case 2:
      return require('../assets/images/cartes_bancaires.png');
    case 3:
      return require('../assets/images/diners_club.png');
    case 4:
      return require('../assets/images/discover.png');
    case 5:
      return require('../assets/images/jcb.png');
    case 6:
      return require('../assets/images/mastercard.png');
    case 7:
      return require('../assets/images/visa.png');
    case 8:
      return require('../assets/images/unionpay.png');
    default:
      return require('../assets/images/unionpay.png');
  }
};

export const fromtoToService = (
  date,
  time,
  duration,
  extraTime,
  extraTimeDuration,
) => {
  let toTime;
  let fromTime = moment.utc(`${date} ${time}`).local().format('hh:mm a');

  if (extraTime === 1 || extraTime === '1') {
    if (extraTimeDuration != null || extraTimeDuration !== '') {
      let extraTimeSplit = extraTimeDuration?.split(':');
      if (extraTimeSplit) {
        let hours = extraTimeSplit[0].toString();
        let minutes = parseInt(extraTimeSplit[1]) + parseInt(duration);
        let totalTime = minutes.toString();
        toTime = moment
          .utc(`${date} ${time}`)
          .add(hours, 'hours')
          .add(totalTime, 'minutes')
          .local()
          .format('hh:mm a');
      }
    }
  } else {
    //Start Change: Snehasish Das Issues #1617
    /* Old:
    toTime = moment
      .utc(`${date} ${time}`)
      .add(duration, 'minutes')
      .format('hh:mm a');
    */
    toTime = moment(`${date} ${time}.000Z`)
      .add(duration, 'minutes')
      .format('hh:mm a');
    //End Change: Snehasish Das Issues #1617
  }
  let format = `${fromTime} - ${toTime}`;
  return format;
};

export const cardNumberFormat = (cardNumber) => {
  if (!!cardNumber && cardNumber.length > 4) {
    let format = '****' + cardNumber.split(' ').join('').slice(-4);
    return format;
  } else {
    return '****';
  }
};

export const formattedServiceDuration = (item) => {
  console.log('time', item.duration % 60);
  return item.duration % 60 === 0
    ? `${Math.ceil(item.duration / 60)}h`
    : item.duration / 60 < 1 && item.duration % 60 <= 30
    ? '30min'
    : `${Math.ceil(item.duration / 60)}h 30min`;
};
