import { action, observable, computed, decorate } from 'mobx';
import api from 'utils/api';
import SortableStore from 'utils/SortableStore';
import BaseTableStore from 'utils/BaseTable/BaseTableStore';
import moment from 'moment';

import SchedulesFilterStore from './SchedulesFilterStore';
import './Schedules.less';

const prepareScheduleFromResponse = (schedule) => ({
  ...schedule,
  onceExecuteDatetime: moment(schedule.onceExecuteDatetime),
  periodicityOnceDateTime: moment(schedule.periodicityOnceDateTime),
  periodicityTimeFrom: moment(schedule.periodicityTimeFrom),
  periodicityTimeTo: moment(schedule.periodicityTimeTo),
  dateTimeStart: moment(schedule.dateTimeStart),
  dateTimeEnd: moment(schedule.dateTimeEnd),
});

class SchedulesStore extends BaseTableStore {
  listSorter = new SortableStore();
  nameFilter = '';
  list = [];
  filter = null;

  constructor(filter = null) {
    super();
    this.filter = filter || new SchedulesFilterStore();
  }

  fetchList = async () => {
    const { data } = await api.schedules.getList();
    return data.schedules;
  };

  get sortedList() {
    return this.filteredList.slice().sort(this.listSorter.sort);
  }

  get filteredList() {
    return this.nameFilter
      ? this.list.filter((item) =>
          item.name.toLowerCase().includes(this.nameFilter.toLowerCase())
        )
      : this.list;
  }

  setNameFilter(name) {
    this.nameFilter = name;
  }

  async getSchedule(id) {
    const { data } = await api.schedules.get(id);
    return prepareScheduleFromResponse(data.schedule);
  }

  async deleteSchedule(item) {
    const { data } = await api.schedules.delete({ id: item.id });
    if (data) {
      this.deleteFromList(item);
    } else {
      throw new Error(data.message);
    }
  }

  async addSchedule(schedule) {
    const onceExecuteDatetime = moment(schedule.date) + moment(schedule.time);
    const item = {
      ...schedule,
      id: null,
      description: 'Описание описание описание',
      onceExecuteDatetime: onceExecuteDatetime.format('DD.MM.YYYY HH:mm'),
    };
    await api.schedules.update(item);
    this.addToList(item);
  }

  async updateSchedule(schedule) {
    await api.schedules.update(schedule);
    this.updateItemInList(schedule);
  }

  deleteFromList(item) {
    const index = this.list.findIndex((i) => i === item);
    if (index !== -1) {
      this.list.splice(index, 1);
    }
  }

  updateItemInList(item) {
    const index = this.list.findIndex((i) => i.id === item.id);
    if (index !== -1) {
      this.list[index] = item;
    }
  }
  addToList(schedule) {
    this.list.unshift(schedule);
  }
}

export default decorate(SchedulesStore, {
  // list: observable,
  // setList: action,
  nameFilter: observable,
  setNameFilter: action,
  filteredList: computed,
  sortedList: computed,
  deleteSchedule: action,
  addSchedule: action,
  updateSchedule: action,
  getSchedule: action,
});
