import React from 'react';
import { Form, Button, message } from 'antd';
import InputFormField from 'ui/FormFields/InputFormField';
import checkDirty from 'utils/checkDirtyForm';

@Form.create()
// Чтобы работало надо:
// 1. проставленные initialValues для сравнения
// 2. Использовать именно в таком порядке с form
// 3. на кнопку закрытия без сохранения вызывать cancel
@checkDirty
class ExecutorEditor extends React.Component {
    static defaultProps = {
        data: {
            name: ''
        }
    };

    state = {
        uploading: false
    };
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll(async (err, { name }) => {
            if (!err) {
                try {
                    this.setState({ uploading: true });
                    await this.props.onOk({
                        name,
                        id: this.props.data ? this.props.data.id : undefined
                    });
                    this.props.close();
                } catch (error) {
                    this.setState({ uploading: false });
                    message.error(error.message);
                }
            }
        });
    };

    render() {
        const { cancel, form, data } = this.props;

        return (
            <Form onSubmit={this.handleSubmit} layout="vertical">
                <InputFormField
                    form={form}
                    label="Название"
                    initialValue={data.name}
                    dataKey="name"
                    validationRules={[
                        {
                            required: true,
                            message: 'Поле обязательно'
                        }
                    ]}
                />
                <div className="ant-modal-footer">
                    <Button onClick={cancel}>Отмена</Button>
                    <Button type="primary" htmlType="submit" loading={this.state.uploading}>
                        Сохранить
                    </Button>
                </div>
            </Form>
        );
    }
}

export default ExecutorEditor;
