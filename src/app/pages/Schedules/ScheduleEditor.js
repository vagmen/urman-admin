import React from 'react';
import moment from 'moment';
import SelectFormField from 'ui/FormFields/SelectFormField';
import InputFormField from 'ui/FormFields/InputFormField';
import InputNumberFormField from 'ui/FormFields/InputNumberFormField';
import DatePickerFormField from 'ui/FormFields/DatePickerFormField';
import TimePickerFormField from 'ui/FormFields/TimePickerFormField';
import {
  ProcessConsumer,
  ScheduleTypesConsumer,
  PeriodicityConsumer,
} from 'app/classifiers';
import {
  Form,
  Button,
  Input,
  Row,
  Col,
  Checkbox,
  Divider,
  Radio,
  message,
} from 'antd';

import {
  FORM_ITEM_LAYOUT,
  FORM_ITEM_LAYOUT_WITH_EXTRA,
  VALIDATION_RULES,
  SCHEDULE_TYPES,
  PERIODICITY_TYPES,
  PERIODICITY,
} from './constants';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const { TextArea } = Input;

@Form.create()
class ScheduleEditor extends React.Component {
  constructor(props) {
    super(props);
    const { typeId, periodicityTypeId, periodicityTimeTypeId } = props.data;
    this.state = {
      typeId: typeId || '',
      periodicityTypeId: periodicityTypeId || PERIODICITY_TYPES.DAY,
      periodicityTimeTypeId: periodicityTimeTypeId || PERIODICITY_TYPES.HOUR,
      singleOrEvery: 'single',
      isEndDateAllow: true,
      dayOrWeek: PERIODICITY_TYPES.DAY,
      uploading: false,
    };
  }

  disabledDate = (current) => current < moment().startOf('day');

  changeFieldHandler = (fieldName, fieldValue) => {
    this.setState({
      [fieldName]: fieldValue,
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll(async (err, schdule) => {
      if (err) return;
      try {
        this.setState({ uploading: true });
        const { ...otherValue } = schdule;
        await this.props.onOk({
          ...otherValue,
          id: this.props.data ? this.props.data.id : undefined,
        });
        this.props.close();
      } catch (error) {
        this.setState({ uploading: false });
        message.error(error.message);
      }
    });
  };

  render() {
    const { close, form, data } = this.props;
    const {
      name,
      workflowTemplateId,
      isActive,
      onceExecuteDatetime,
      periodicityInterval,
      daysOfMonth,
      weeksOfMonth,
      days,
      periodicityOnceDateTime,
      periodicityTimeInterval,
      periodicityTimeFrom,
      periodicityTimeTo,
      dateTimeStart,
      dateTimeEnd,
      description,
    } = data;
    const {
      typeId,
      periodicityTypeId,
      periodicityTimeTypeId,
      dayOrWeek,
      singleOrEvery,
      isEndDateAllow,
      uploading,
    } = this.state;
    const { getFieldDecorator } = form;

    return (
      <Form onSubmit={this.handleSubmit}>
        <Row gutter={24}>
          <Col span={12}>
            <InputFormField
              form={form}
              label="Название"
              initialValue={name}
              dataKey="name"
              formItemLayout={FORM_ITEM_LAYOUT}
              validationRules={VALIDATION_RULES}
            />
            <ScheduleTypesConsumer>
              {({ items }) => (
                <SelectFormField
                  form={form}
                  label="Тип расписания"
                  dataKey="typeId"
                  options={items}
                  optionLabel="name"
                  initialValue={typeId}
                  formItemLayout={FORM_ITEM_LAYOUT}
                  validationRules={VALIDATION_RULES}
                  onChange={(value) => this.changeFieldHandler('typeId', value)}
                />
              )}
            </ScheduleTypesConsumer>
          </Col>
          <Col span={12}>
            <ProcessConsumer>
              {({ items }) => (
                <SelectFormField
                  form={form}
                  label="Процесс"
                  dataKey="workflowTemplateId"
                  options={items}
                  optionLabel="name"
                  initialValue={workflowTemplateId}
                  formItemLayout={FORM_ITEM_LAYOUT}
                  className="full-width"
                  placeholder="Выберите процесс"
                  validationRules={VALIDATION_RULES}
                />
              )}
            </ProcessConsumer>
            <Col offset={8}>
              <FormItem>
                {getFieldDecorator('isActive', { initialValue: isActive })(
                  <Checkbox>Включено</Checkbox>
                )}
              </FormItem>
            </Col>
          </Col>
        </Row>
        {typeId === SCHEDULE_TYPES.SIMPLE && (
          <React.Fragment>
            <Divider className="schedule__divider" orientation="left">
              Однократное выполнение
            </Divider>
            <Row gutter={24}>
              <Col span={12}>
                <DatePickerFormField
                  form={form}
                  label="Дата"
                  dataKey="date"
                  allowClear={false}
                  disabledDate={this.disabledDate}
                  className="full-width"
                  initialValue={onceExecuteDatetime}
                  validationRules={VALIDATION_RULES}
                  formItemLayout={FORM_ITEM_LAYOUT}
                />
              </Col>
              <Col span={12}>
                <TimePickerFormField
                  form={form}
                  label="Время"
                  dataKey="time"
                  className="full-width"
                  initialValue={onceExecuteDatetime}
                  validationRules={VALIDATION_RULES}
                  formItemLayout={FORM_ITEM_LAYOUT}
                />
              </Col>
            </Row>
          </React.Fragment>
        )}
        {typeId === SCHEDULE_TYPES.DUPLICATE && (
          <React.Fragment>
            <Divider className="schedule__divider" orientation="left">
              Частота
            </Divider>
            <Row gutter={24}>
              <Col span={12}>
                <PeriodicityConsumer>
                  {({ items }) => (
                    <SelectFormField
                      form={form}
                      label="Периодичность"
                      dataKey="periodicityTypeId"
                      options={items}
                      optionLabel="name"
                      formItemLayout={FORM_ITEM_LAYOUT}
                      validationRules={VALIDATION_RULES}
                      className="full-width"
                      initialValue={periodicityTypeId}
                      onChange={(value) =>
                        this.changeFieldHandler('periodicityTypeId', value)
                      }
                    />
                  )}
                </PeriodicityConsumer>
              </Col>
              <Col span={10}>
                <InputNumberFormField
                  min={1}
                  max={PERIODICITY[periodicityTypeId].MAX}
                  form={form}
                  className="full-width"
                  label="Повторение каждые"
                  initialValue={periodicityInterval}
                  dataKey="periodicityInterval"
                  validationRules={VALIDATION_RULES}
                  formItemLayout={FORM_ITEM_LAYOUT_WITH_EXTRA}
                />
              </Col>
              <Col span={2}>
                <label className="schedule__label-extra">
                  {(PERIODICITY[periodicityTypeId] &&
                    PERIODICITY[periodicityTypeId].EXTRA) ||
                    ''}
                </label>
              </Col>
            </Row>
            {periodicityTypeId === PERIODICITY_TYPES.MONTH && (
              <Row gutter={24}>
                <Col span={3}>
                  <FormItem>
                    <RadioGroup
                      defaultValue={dayOrWeek}
                      onChange={(e) =>
                        this.changeFieldHandler('dayOrWeek', e.target.value)
                      }
                    >
                      <Radio
                        className="schedule__radio-style"
                        value={PERIODICITY_TYPES.DAY}
                      >
                        День
                      </Radio>
                      <Radio
                        className="schedule__radio-style"
                        value={PERIODICITY_TYPES.WEEK}
                      >
                        В
                      </Radio>
                    </RadioGroup>
                  </FormItem>
                </Col>
                <Col span={9} className="schedule__col-offset">
                  <SelectFormField
                    form={form}
                    dataKey="daysOfMonth"
                    options={[
                      { name: '1', id: '1' },
                      { name: '2', id: '2' },
                      { name: '3', id: '3' },
                      { name: '4', id: '4' },
                      { name: '...', id: '5' },
                      { name: '31', id: '31' },
                      { name: 'Последний', id: 'last' },
                    ]}
                    mode="multiple"
                    className="full-width"
                    validationRules={VALIDATION_RULES}
                    initialValue={daysOfMonth || ['1']}
                    disabled={dayOrWeek !== PERIODICITY_TYPES.DAY}
                  />
                  <SelectFormField
                    form={form}
                    dataKey="weeksOfMonth"
                    options={[
                      { name: '1', id: '1' },
                      { name: '2', id: '2' },
                      { name: '3', id: '3' },
                      { name: '4', id: '4' },
                      { name: 'Последняя', id: 'last' },
                    ]}
                    mode="multiple"
                    className="full-width"
                    validationRules={VALIDATION_RULES}
                    initialValue={weeksOfMonth || ['1']}
                    disabled={dayOrWeek !== PERIODICITY_TYPES.WEEK}
                  />
                </Col>
              </Row>
            )}
            {periodicityTypeId !== PERIODICITY_TYPES.DAY && (
              <Row gutter={24}>
                <Col offset={3} className="schedule__col-offset">
                  <SelectFormField
                    form={form}
                    dataKey="days"
                    options={[
                      { name: 'Понедельник', id: '1' },
                      { name: 'Вторник', id: '2' },
                      { name: 'Среда', id: '3' },
                      { name: 'Четверг', id: '4' },
                      { name: 'Пятница', id: '5' },
                      { name: 'Суббота', id: '6' },
                      { name: 'Воскресенье', id: '7' },
                    ]}
                    mode="multiple"
                    className="full-width"
                    validationRules={VALIDATION_RULES}
                    initialValue={days || []}
                    disabled={
                      dayOrWeek === PERIODICITY_TYPES.DAY &&
                      periodicityTypeId === PERIODICITY_TYPES.MONTH
                    }
                  />
                </Col>
              </Row>
            )}
            <Divider className="schedule__divider" orientation="left">
              Сколько раз в день
            </Divider>
            <Row gutter={24}>
              <Col span={8}>
                <FormItem>
                  <RadioGroup
                    defaultValue={singleOrEvery}
                    onChange={(e) =>
                      this.changeFieldHandler('singleOrEvery', e.target.value)
                    }
                  >
                    <Radio value="single">Однократное выполнение</Radio>
                    <Radio value="every">Выполнение каждые:</Radio>
                  </RadioGroup>
                </FormItem>
                <div className="schedule__form-item-label">
                  Начало интервала
                </div>
                <div className="schedule__form-item-label">Конец интервала</div>
              </Col>
              <Col span={8}>
                <TimePickerFormField
                  form={form}
                  dataKey="time"
                  className="full-width"
                  validationRules={VALIDATION_RULES}
                  disabled={singleOrEvery === 'every'}
                  initialValue={periodicityOnceDateTime}
                />
                <Row gutter={24}>
                  <Col span={12}>
                    <InputNumberFormField
                      min={1}
                      max={
                        PERIODICITY[periodicityTimeTypeId] &&
                        PERIODICITY[periodicityTimeTypeId].MAX
                      }
                      form={form}
                      className="full-width"
                      initialValue={periodicityTimeInterval}
                      dataKey="periodicityTimeInterval"
                      validationRules={VALIDATION_RULES}
                      disabled={singleOrEvery === 'single'}
                    />
                  </Col>
                  <Col span={12}>
                    <SelectFormField
                      form={form}
                      dataKey="periodicityTimeTypeId"
                      options={[
                        {
                          name: 'Час(ов)',
                          id: '0da513c6-6c67-4137-9b9c-f47044cbc455',
                        },
                        { name: 'Минут', id: '2' },
                        { name: 'Секунд', id: '3' },
                      ]}
                      className="full-width"
                      disabled={singleOrEvery === 'single'}
                      validationRules={VALIDATION_RULES}
                      initialValue={periodicityTimeTypeId}
                    />
                  </Col>
                </Row>
                <TimePickerFormField
                  form={form}
                  dataKey="periodicityTimeFrom"
                  className="full-width"
                  validationRules={VALIDATION_RULES}
                  disabled={singleOrEvery === 'single'}
                  initialValue={periodicityTimeFrom}
                />
                <TimePickerFormField
                  form={form}
                  dataKey="periodicityTimeTo"
                  className="full-width"
                  validationRules={VALIDATION_RULES}
                  disabled={singleOrEvery === 'single'}
                  initialValue={periodicityTimeTo}
                />
              </Col>
            </Row>
            <Divider className="schedule__divider" orientation="left">
              Период действия
            </Divider>
            <Row gutter={24}>
              <Col span={8}>
                <div className="schedule__form-item-label">Дата начала</div>
              </Col>
              <Col span={8}>
                <DatePickerFormField
                  form={form}
                  dataKey="dateTimeStart"
                  allowClear={false}
                  disabledDate={this.disabledDate}
                  className="full-width"
                  validationRules={VALIDATION_RULES}
                  initialValue={dateTimeStart}
                />
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={8}>
                <FormItem>
                  {getFieldDecorator('isEndDateAllow')(
                    <Checkbox
                      checked={isEndDateAllow}
                      onChange={() =>
                        this.changeFieldHandler(
                          'isEndDateAllow',
                          !isEndDateAllow
                        )
                      }
                    >
                      Дата окончания
                    </Checkbox>
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <DatePickerFormField
                  form={form}
                  dataKey="dateTimeEnd"
                  allowClear={false}
                  disabledDate={this.disabledDate}
                  className="full-width"
                  validationRules={VALIDATION_RULES}
                  disabled={!isEndDateAllow}
                  initialValue={dateTimeEnd}
                />
              </Col>
            </Row>
          </React.Fragment>
        )}
        <Divider className="schedule__divider" orientation="left">
          Сводка
        </Divider>
        <Row gutter={24}>
          <Col span={3}>Описание:</Col>
          <Col span={21} className="schedule__col-offset">
            {/* Позже вынести в отдельный компонент */}
            <FormItem>
              {getFieldDecorator('description', { initialValue: description })(
                <TextArea
                  placeholder=""
                  autosize={{ minRows: 1, maxRows: 3 }}
                  disabled
                />
              )}
            </FormItem>
          </Col>
        </Row>
        <div className="ant-modal-footer">
          <Button type="primary" htmlType="submit">
            Сохранить
          </Button>
          <Button onClick={close} loading={uploading}>
            Отмена
          </Button>
        </div>
      </Form>
    );
  }
}

export default ScheduleEditor;
