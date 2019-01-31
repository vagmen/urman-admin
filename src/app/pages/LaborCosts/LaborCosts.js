import React, { Component } from "react";
import { Button, Table } from "antd";

const columns = [
    {
        title: "Объект",
        dataIndex: "cardName",
        key: "cardName"
    },
    {
        title: "Статус",
        dataIndex: "list",
        key: "list"
    },
    {
        title: "Исполнитель",
        dataIndex: "member",
        key: "member"
    },
    {
        title: "Сумма",
        dataIndex: "total",
        key: "total"
    }
];

class LaborCosts extends Component {
    state = {
        json: null,
        dataSource: [
            {
                key: "1",
                cardName: "Mike",
                list: 32,
                member: "10 Downing Street"
            },
            {
                key: "2",
                cardName: "John",
                list: 42,
                member: "10 Downing Street"
            }
        ]
    };
    handleSubmit = e => {
        e.preventDefault();
        const { files } = document.getElementById("selectFiles");
        const fr = new FileReader();

        fr.onload = event => {
            const result = JSON.parse(event.target.result);
            console.log("cards", result.cards);
            const dataSource = result.cards.map(card => ({ cardName: card.name, key: card.id }));

            this.setState({ dataSource });
            // const formatted = JSON.stringify(result, null, 2);
        };

        fr.readAsText(files.item(0));
    };

    render() {
        const { json, dataSource } = this.state;
        return (
            <div>
                <input type="file" name="selectFiles" id="selectFiles" />
                <Button type="primary" onClick={this.handleSubmit}>
                    Рассчитать
                </Button>
                <Table dataSource={dataSource} columns={columns} />
            </div>
        );
    }
}

export default LaborCosts;
