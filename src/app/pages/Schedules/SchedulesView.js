import React from 'react';
import { Content, Panel } from 'ui/layout';
import { Observer } from 'mobx-react';
import { Button, Modal } from 'antd';
import withModal from 'utils/withModal';
import BaseTable from 'utils/BaseTable/BaseTable';

import ScheduleEditor from './ScheduleEditor';
import SchedulesStore from './SchedulesStore';
import SchedulesFilter from './SchedulesFilter';

@withModal
class SchedulesView extends React.Component {
  store = new SchedulesStore();

  get columns() {
    return [
      {
        label: '',
        dataKey: 'edit-btn',
        width: 35,
        flexShrink: 0,
        flexGrow: 0,
        disableSort: true,
        cellRenderer: this.editButtonRenderer,
      },
      {
        label: '',
        dataKey: 'delete-btn',
        width: 35,
        flexShrink: 0,
        flexGrow: 0,
        disableSort: true,
        cellRenderer: this.deleteButtonRenderer,
      },
      { dataKey: 'name', label: 'Название' },
      {
        dataKey: 'process',
        label: 'Процесс',
      },
      {
        dataKey: 'description',
        label: 'Описание',
      },
    ];
  }

  deleteButtonRenderer = ({ rowData }) => (
    <Observer>
      {() => (
        <Button
          type="danger"
          icon="delete"
          onDoubleClick={(e) => e.stopPropagation()}
          onClick={this.openDeleteConfirmationModal(rowData)}
          title="Удалить"
        />
      )}
    </Observer>
  );

  openDeleteConfirmationModal = (rowData) => () =>
    Modal.confirm({
      title: 'Удалить выбранное расписание?',
      okText: 'Да',
      cancelText: 'Нет',
      onOk: () => this.store.deleteSchedule(rowData.id),
    });

  editButtonRenderer = ({ rowData }) => (
    <Observer>
      {() => (
        <Button
          icon="edit"
          onDoubleClick={(e) => e.stopPropagation()}
          onClick={() => {
            this.openScheduleModal(rowData);
          }}
          title="Редактировать"
        />
      )}
    </Observer>
  );

  openScheduleModal = async (data) => {
    let title = 'Создание';
    let onOk = (p) => this.store.addSchedule(p);
    let scheduleDetailData = {};

    if (data) {
      title = 'Редактирование';
      onOk = (p) => this.store.updateSchedule(p);
      scheduleDetailData = await this.store.getSchedule(data.id);
    }
    this.props.openModal({
      title: `${title} расписания`,
      body: (
        <ScheduleEditor
          close={this.props.closeModal}
          data={scheduleDetailData}
          onOk={onOk}
          submitButtonText="Сохранить"
        />
      ),
      className: 'schedule__modal',
      width: 800,
      footer: null,
    });
  };

  openFilterModal = () => {
    this.props.openModal({
      title: 'Фильтр расписаний',
      body: (
        <SchedulesFilter
          data={this.store.filter.raw}
          onOk={(filter) => this.store.filter.fillFilter(filter)}
          close={this.props.closeModal}
        />
      ),
      footer: null,
    });
  };

  onRowDoubleClick = ({ rowData }) => this.openScheduleModal(rowData);

  rowGetter = ({ index }) => this.store.sortedList[index];

  sort = ({ sortBy, sortDirection }) => {
    this.store.listSorter.changeSort(sortBy, sortDirection);
  };

  componentWillUnmount() {
    // Сбросим глобальный фильтр
    this.store.filter.resetFilter();
  }

  render() {
    return (
      <React.Fragment>
        <Panel>
          <Button
            icon="plus"
            type="primary"
            onClick={() => this.openScheduleModal()}
          />
          <Button icon="filter" type="primary" onClick={this.openFilterModal}>
            Фильтр
          </Button>
        </Panel>
        <Content>
          <Observer>
            {() => (
              <BaseTable
                store={this.store}
                columns={this.columns}
                sort={this.sort}
                sortBy={this.store.listSorter.by}
                sortDirection={this.store.listSorter.direction}
                rowGetter={this.rowGetter}
                rowCount={this.store.sortedList.length}
                onRowDoubleClick={this.onRowDoubleClick}
                notFoundContent={
                  this.store.nameFilter !== '' ? 'Не найдено' : 'Список пуст'
                }
              />
            )}
          </Observer>
        </Content>
      </React.Fragment>
    );
  }
}

export default SchedulesView;
