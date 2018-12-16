import { action, observable, decorate, computed } from 'mobx';
import api from 'utils/api';
import SortableStore from 'utils/SortableStore';
import BaseTableStore from 'utils/BaseTable/BaseTableStore';
import wait from 'utils/wait';

class ExecutorsStore extends BaseTableStore {
    tempLastId = 0;
    listSorter = new SortableStore();

    // Вынесено для простоты сюда, чтобы не создавать отдельный файл под фильтр
    nameFilter = '';
    // Переопределим fetch
    fetchList = async () => {
        const { data } = await api.executors.getList();
        // TODO: убрать когда будет работать создание
        this.tempLastId = data.executors.lenth;
        return data.executors;
    };

    getById = (id) => api.executors.byId(id);

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

    // TODO: разделить на 2
    async edit(editedItem) {
        await wait(400);
        const itemIndex = this.list.findIndex((item) => item.id === editedItem.id);
        if (itemIndex !== -1) {
            this.list[itemIndex] = editedItem;
        }
    }

    // TODO: разделить на 2
    async delete(item) {
        await wait(200);
        this.list.remove(item);
    }
    // TODO: разделить на 2
    async add({ name }) {
        this.tempLastId += 1;
        await wait(300);
        this.list.push({
            id: this.tempLastId,
            name
        });
    }
}

export default decorate(ExecutorsStore, {
    nameFilter: observable,
    add: action,
    edit: action,
    delete: action,
    setNameFilter: action,
    filteredList: computed,
    sortedList: computed
});
