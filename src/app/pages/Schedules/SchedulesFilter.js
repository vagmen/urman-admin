import React from 'react';
import { Form, Button, message } from 'antd';
import {
  ProcessStatusesConsumer,
  ProcessConsumer,
  ScheduleTypesConsumer,
  PeriodicityConsumer,
} from 'app/classifiers';
import SelectFormField from 'ui/FormFields/SelectFormField';
import DateRangeFormField from 'ui/FormFields/DateRangeFormField';

const generateFormValues = (initialValues) =>
  Object.keys(initialValues).reduce((result, key) => {
    const value = initialValues[key];
    return Object.assign(result, {
      [key]: Form.createFormField({ value }),
    });
  }, {});

@Form.create({
  mapPropsToFields({ data }) {
    if (!data) return null;
    const { dateEnd, dateStart, ...otherValues } = data;
    return generateFormValues({
      dateRange: [dateStart, dateEnd],
      ...otherValues,
    });
  },
})
class SchedulesFilter extends React.Component {
  state = {
    loading: false,
  };
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        const { dateRange = [null, null], ...otherValues } = values;
        const [dateStart, dateEnd] = dateRange;
        this.setState({ loading: true });
        try {
          await this.props.onOk({ dateStart, dateEnd, ...otherValues });
          this.props.close();
        } catch (error) {
          message.error(error.message);
          this.setState({ loading: false });
        }
      }
    });
  };

  render() {
    const { close, form } = this.props;

    return (
      <Form onSubmit={this.handleSubmit} layout="vertical">
        <DateRangeFormField
          form={form}
          label="Период действия"
          dataKey="dateRange"
          showZeroTime
          className="full-width"
        />
        <ScheduleTypesConsumer>
          {({ items }) => (
            <SelectFormField
              form={form}
              label="Тип"
              dataKey="scheduleTypeId"
              options={items}
              optionLabel="name"
            />
          )}
        </ScheduleTypesConsumer>
        <PeriodicityConsumer>
          {({ items }) => (
            <SelectFormField
              form={form}
              label="Периодичность"
              dataKey="periodicityId"
              options={items}
              optionLabel="name"
            />
          )}
        </PeriodicityConsumer>
        <ProcessConsumer>
          {({ items }) => (
            <SelectFormField
              form={form}
              label="Процесс"
              dataKey="processId"
              options={items}
              optionLabel="name"
            />
          )}
        </ProcessConsumer>
        <ProcessStatusesConsumer>
          {({ items }) => (
            <SelectFormField
              form={form}
              label="Статус"
              dataKey="statusId"
              optionLabel="name"
              options={items}
            />
          )}
        </ProcessStatusesConsumer>
        <div className="ant-modal-footer">
          <Button type="primary" htmlType="submit" loading={this.state.loading}>
            Применить
          </Button>
          <Button onClick={close}>Отмена</Button>
        </div>
      </Form>
    );
  }
}

export default SchedulesFilter;
