import React, { Component } from "react";
import { Button, Table, message } from "antd";

const columns = [
    {
        title: "Объект",
        dataIndex: "cardName",
        key: "cardName"
    },
    {
        title: "Статус",
        dataIndex: "listName",
        key: "listName"
    },
    {
        title: "Вид работы",
        dataIndex: "workType",
        key: "workType"
    },
    {
        title: "Сумма",
        dataIndex: "total",
        key: "total"
    },
    {
        title: "Исполнитель",
        dataIndex: "member",
        key: "member"
    }
];

class LaborCosts extends Component {
    state = {
        json: null,
        dataSource: [
            // {
            //     key: "1",
            //     cardName: "Mike",
            //     status: 32,
            //     member: "10 Downing Street"
            // },
            // {
            //     key: "2",
            //     cardName: "John",
            //     status: 42,
            //     member: "10 Downing Street"
            // }
        ]
    };
    handleSubmit = e => {
        e.preventDefault();
        const { files } = document.getElementById("selectFiles");
        const fr = new FileReader();

        fr.onload = event => {
            const result = JSON.parse(event.target.result);
            console.log("cards", result.cards);
            const { lists } = result;
            const dataSource = result.cards.map(card => {
                const listName = lists.filter(list => list.id === card.idList)[0].name;
                const parsedDesc = this.parseDesc(card.desc);

                const children =
                    parsedDesc &&
                    parsedDesc.length !== 0 &&
                    parsedDesc.map((child, index) => ({
                        key: card.id + index,
                        workType: child
                    }));
                console.log("children", children);

                return { cardName: card.name, key: card.id, listName, workType: this.parseDesc(card.desc), children };
            });

            this.setState({ dataSource, lists });
        };

        if (files.item(0)) {
            fr.readAsText(files.item(0));
        } else {
            message.info("Выберите JSON файл");
        }
    };

    parseDesc = desc => {
        const costs = desc.toLowerCase().split("стоимость")[1] || "";
        const costsArray = costs.split("\n");
        const filteredCostsArray = costsArray.filter(item => item !== "");
        return filteredCostsArray;
    };

    render() {
        const { dataSource } = this.state;
        return (
            <div>
                <input type="file" name="selectFiles" id="selectFiles" multiple />
                <br />
                <br />
                <Button type="primary" onClick={this.handleSubmit}>
                    Сгенерить таблицу
                </Button>
                <br />
                <br />
                {dataSource.length !== 0 && <Table dataSource={dataSource} columns={columns} />}
            </div>
        );
    }
}

export default LaborCosts;
