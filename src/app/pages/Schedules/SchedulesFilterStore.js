import moment from 'moment';

class SchedulesFilterStore {
  dateStart;
  dateEnd;
  scheduleTypeId;
  periodicityId;
  processId;
  statusId;

  constructor() {
    // Выставим значения по умолчанию
    this.resetFilter();
  }

  fillFilter({
    dateStart,
    dateEnd,
    scheduleTypeId,
    periodicityId,
    processId,
    statusId,
  }) {
    this.dateEnd = dateEnd;
    this.dateStart = dateStart;
    this.scheduleTypeId = scheduleTypeId;
    this.periodicityId = periodicityId;
    this.processId = processId;
    this.statusId = statusId;
  }

  get raw() {
    return {
      dateEnd: this.dateEnd,
      dateStart: this.dateStart,
      scheduleTypeId: this.scheduleTypeId,
      periodicityId: this.periodicityId,
      processId: this.processId,
      statusId: this.statusId,
    };
  }
  // Если в контрактах будут отличные названия полей - менять здесь
  get forRequest() {
    return {
      dateEnd: this.dateEnd ? this.dateEnd.toISOString() : undefined,
      dateStart: this.dateStart ? this.dateStart.toISOString() : undefined,
      scheduleTypeId: this.scheduleTypeId || undefined,
      periodicityId: this.periodicityId || undefined,
      processId: this.processId || undefined,
      statusId: this.statusId || undefined,
    };
  }

  resetFilter() {
    const now = moment();
    now.hours(0);
    now.minutes(0);
    now.seconds(0);
    now.milliseconds(0);

    this.dateStart = now;
    this.dateEnd = moment(now).add(1, 'days');
    this.scheduleTypeId = null;
    this.periodicityId = null;
    this.processId = null;
    this.statusId = null;
  }
}

export default SchedulesFilterStore;
