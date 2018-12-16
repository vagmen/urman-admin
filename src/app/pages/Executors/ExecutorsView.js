import React from 'react';
import { Button, Modal, Input } from 'antd';
import { Content, Panel } from 'ui/layout';
import { Observer } from 'mobx-react';
import withModal from 'utils/withModal';
import BaseTable from 'utils/BaseTable/BaseTable';

import Store from './ExecutorsStore';
import ExecutorEditor from './ExecutorEditor';

class ExecutorsView extends React.Component {
    store = new Store();

    get columns() {
        return [
            { dataKey: 'name', label: 'Название' },
            {
                dataKey: 'delete-btn',
                width: 150,
                label: 'Удалить',
                flexShrink: 0,
                flexGrow: 0,
                disableSort: true,
                cellRenderer: this.deleteButtonRenderer
            }
        ];
    }

    sort = ({ sortBy, sortDirection }) => {
        this.store.listSorter.changeSort(sortBy, sortDirection);
    };

    deleteButtonRenderer = ({ rowData }) => (
        <Button
            type="danger"
            icon="delete"
            onClick={() => this.showDeleteConfirm(rowData)}
            onDoubleClick={(e) => e.stopPropagation()}
        >
            Удалить
        </Button>
    );

    showDeleteConfirm = (item) => {
        Modal.confirm({
            title: 'Подтверждение удаления',
            content: (
                <p>
                    Вы действительно хотите удалить <strong>{item.name}</strong>?
                </p>
            ),
            onOk: () => this.store.delete(item)
        });
    };

    onRowDoubleClick = async ({ rowData }) => {
        const { data } = await this.store.getById(rowData.id);
        this.props.openModal({
            title: 'Редактирование исполнителя',
            body: (
                <ExecutorEditor
                    data={data.executor}
                    onOk={(executor) => this.store.edit(executor)}
                />
            ),
            footer: null
        });
    };

    openEditModal = () => {
        this.props.openModal({
            title: 'Создание исполнителя',
            body: <ExecutorEditor onOk={(executor) => this.store.add(executor)} />,
            footer: null
        });
    };

    rowGetter = ({ index }) => this.store.sortedList[index];

    render() {
        return (
            <React.Fragment>
                <Panel>
                    <Button type="primary" onClick={this.openEditModal}>
                        Добавить
                    </Button>
                    <span style={{ margin: '0 5px 0 20px' }}>Поиск по названию:</span>
                    <Observer>
                        {() => (
                            <Input
                                placeholder="Название"
                                value={this.store.nameFilter}
                                style={{ maxWidth: 200 }}
                                onChange={(e) => this.store.setNameFilter(e.target.value)}
                            />
                        )}
                    </Observer>
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

export default withModal(ExecutorsView);
